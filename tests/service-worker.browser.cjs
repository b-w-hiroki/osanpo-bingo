const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { readFileSync, mkdtempSync, rmSync } = require('node:fs');
const { resolve, join, extname, sep } = require('node:path');
const { tmpdir } = require('node:os');
const { spawn } = require('node:child_process');

const root = resolve(__dirname, '..');
const source = readFileSync(join(root, 'service-worker.js'), 'utf8');
// Actual worker shipped before this fix, including its original cache list.
const oldSource = readFileSync(join(__dirname, 'fixtures/service-worker-v161.js'), 'utf8');
const probe = String.raw`
const check = (ok, message) => { if (!ok) throw new Error(message); };
const waitFor = async (fn, message) => {
  for (let i = 0; i < 200; i++) {
    if (await fn()) return;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error(message);
};
const control = values => fetch('/__control', { method: 'POST', body: JSON.stringify(values) });
async function run() {
  const registration = await navigator.serviceWorker.register('/service-worker.js');
  await navigator.serviceWorker.ready;
  await waitFor(() => navigator.serviceWorker.controller, 'initial controller');
  check((await caches.keys()).includes('osanpo-bingo-v161'), 'old cache installed');
  const foreign = await caches.open('other-app-v1');
  await foreign.put('/foreign-marker', new Response('keep'));
  for (const path of ['index.html', 'news.html', 'game.html']) {
    const response = await fetch('/' + path);
    check(response.ok && (await response.text()).length > 100, 'online ' + path);
  }
  await control({ version: 'new', fail: 'battle-auth.js' });
  let candidate;
  registration.addEventListener('updatefound', () => { candidate = registration.installing; });
  await registration.update();
  await waitFor(() => candidate && candidate.state === 'redundant', 'failed install must be rejected');
  check(!registration.waiting, 'failed worker must not wait for activation');
  check(registration.active.state === 'activated', 'old worker remains active');
  const old = await caches.open('osanpo-bingo-v161');
  check(await old.match('/app-helpers.js'), 'old healthy cache preserved');
  await control({ offline: true });
  for (const path of ['index.html', 'news.html']) {
    const frame = document.createElement('iframe');
    frame.src = '/' + path + '?failed-update';
    document.body.appendChild(frame);
    await waitFor(() => frame.contentDocument && frame.contentDocument.documentElement?.outerHTML.length > 500,
  'old offline navigation ' + path);
    frame.remove();
  }
  await control({ version: 'new', fail: null, offline: false });
  candidate = null;
  await registration.update();
  await waitFor(() => registration.waiting, 'successful update waits for user');
  check((await caches.keys()).includes('osanpo-bingo-v161'), 'old cache retained before acceptance');
  registration.waiting.postMessage('skipWaiting');
  await waitFor(async () => !(await caches.keys()).includes('osanpo-bingo-v161'), 'old cache retired');
  check(await caches.match('/foreign-marker', { cacheName: 'other-app-v1' }), 'foreign cache preserved');
  const current = await caches.open('osanpo-bingo-v163');
  const html = await (await current.match('/game.html')).text();
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)]
    .map(match => match[1]).filter(path => !/^https?:/.test(path));
  for (const path of scripts) check(await current.match('/' + path), 'precache game dependency ' + path);
  await control({ offline: true });
  for (const path of scripts) {
    const response = await fetch('/' + path);
    check(response.ok && (await response.text()).length > 0, 'offline script ' + path);
  }
  for (const path of ['index.html', 'news.html', 'game.html']) {
    const frame = document.createElement('iframe');
    frame.src = '/' + path + '?updated';
    document.body.appendChild(frame);
    if (path !== 'game.html') {
      await waitFor(() => frame.contentDocument && frame.contentDocument.documentElement?.outerHTML.length > 500,
        'updated offline navigation ' + path);
    } else {
      await new Promise(resolve => { frame.onload = resolve; setTimeout(resolve, 500); });
      check(!frame.contentDocument || !frame.contentDocument.documentElement?.outerHTML.includes('bingoBoard'),
        'game navigation must not use precache');
    }
    frame.remove();
  }
  await control({ offline: false });
  check((await fetch('/game.html')).ok, 'online recovery');
  return 'PASS';
}
run().then(result => { document.getElementById('result').textContent = result; })
  .catch(error => { document.getElementById('result').textContent = 'FAIL: ' + error.stack; });
`;

test('SW rejects failed updates, preserves other caches and navigation policy', { timeout: 60000 }, async () => {
  let state = { version: 'old', fail: null, offline: false };
  const server = createServer((request, response) => {
    const path = new URL(request.url, 'http://localhost').pathname;
    if (path === '/__control') {
      let body = '';
      request.on('data', chunk => { body += chunk; });
      request.on('end', () => { Object.assign(state, JSON.parse(body)); response.end('ok'); });
      return;
    }
    if (path === '/__probe') {
      response.setHeader('Content-Type', 'text/html');
      response.end('<!doctype html><pre id="result">RUNNING</pre><script>' + probe + '</script>');
      return;
    }
    if (path === '/service-worker.js') {
      response.setHeader('Content-Type', 'text/javascript');
      response.setHeader('Cache-Control', 'no-store');
      response.end(state.version === 'old' ? oldSource : source);
      return;
    }
    if (state.offline) { request.socket.destroy(); return; }
    if (path === '/' + state.fail) { response.writeHead(503).end('injected failure'); return; }
    const file = resolve(root, '.' + decodeURIComponent(path));
    if (!file.startsWith(root + sep)) { response.writeHead(404).end(); return; }
    try {
      response.setHeader('Content-Type', { '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css' }[extname(file)] || 'application/octet-stream');
      // Frames test navigation responses without starting analytics or the game.
      if (extname(file) === '.html') response.setHeader('Content-Security-Policy', "script-src 'none'");
      response.end(readFileSync(file));
    } catch { response.writeHead(404).end(); }
  });
  const profile = mkdtempSync(join(tmpdir(), 'osanpo-sw-'));
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const chrome = process.env.CHROME_BIN || 'google-chrome';
    const browser = spawn(chrome, ['--headless=new', '--disable-gpu', '--no-first-run',
      '--no-default-browser-check', '--disable-background-networking', '--remote-debugging-pipe',
      '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1', '--user-data-dir=' + profile],
      { stdio: ['ignore', 'ignore', 'pipe', 'pipe', 'pipe'] });
    let stderr = '';
    browser.stderr.on('data', chunk => { stderr += chunk; });
    const pending = new Map();
    let nextId = 0;
    let buffer = '';
    browser.stdio[4].on('data', chunk => {
      buffer += chunk.toString();
      let end;
      while ((end = buffer.indexOf('\0')) >= 0) {
        const message = JSON.parse(buffer.slice(0, end));
        buffer = buffer.slice(end + 1);
        if (pending.has(message.id)) {
          const { resolve, reject, timer } = pending.get(message.id);
          clearTimeout(timer);
          pending.delete(message.id);
          if (message.error) reject(new Error(JSON.stringify(message.error)));
          else resolve(message.result);
        }
      }
    });
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
      const id = ++nextId;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(method + ' timeout: ' + stderr)); }, 10000);
      pending.set(id, { resolve, reject, timer });
      browser.stdio[3].write(JSON.stringify({ id, method, params, sessionId }) + '\0');
    });
    browser.on('error', error => {
      for (const { reject, timer } of pending.values()) { clearTimeout(timer); reject(error); }
      pending.clear();
    });
    try {
      const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
      const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
      await send('Page.navigate', { url: 'http://127.0.0.1:' + server.address().port + '/__probe' }, sessionId);
      let result;
      const deadline = Date.now() + 40000;
      while (Date.now() < deadline) {
        try {
          const evaluation = await send('Runtime.evaluate', {
            expression: "document.getElementById('result')?.textContent", returnByValue: true
          }, sessionId);
          result = evaluation.result?.value;
          if (result && result !== 'RUNNING') break;
        } catch (error) {
          if (!/context|navigation/i.test(error.message)) throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      assert.equal(result, 'PASS', String(result) + '\n' + stderr.slice(-2000));
    } finally {
      browser.kill();
      for (const { timer } of pending.values()) clearTimeout(timer);
      await new Promise(resolve => browser.once('exit', resolve));
    }
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
  }
});
