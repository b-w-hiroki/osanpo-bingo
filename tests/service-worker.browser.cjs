const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { readFileSync, mkdtempSync, rmSync } = require('node:fs');
const { resolve, join, extname, sep } = require('node:path');
const { tmpdir } = require('node:os');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');

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
    await waitFor(() => frame.contentDocument && frame.contentDocument.documentElement.outerHTML.length > 500,
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
  const current = await caches.open('osanpo-bingo-v162');
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
      await waitFor(() => frame.contentDocument && frame.contentDocument.documentElement.outerHTML.length > 500,
        'updated offline navigation ' + path);
    } else {
      await new Promise(resolve => { frame.onload = resolve; setTimeout(resolve, 500); });
      check(!frame.contentDocument || !frame.contentDocument.documentElement.outerHTML.includes('bingoBoard'),
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
    const args = ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
      '--disable-background-networking', '--virtual-time-budget=30000', '--dump-dom',
      '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1',
      '--user-data-dir=' + profile, 'http://127.0.0.1:' + server.address().port + '/__probe'];
    const { stdout } = await promisify(execFile)(chrome, args, { timeout: 50000, maxBuffer: 2 * 1024 * 1024 });
    assert.match(stdout, /<pre id="result">PASS<\/pre>/, stdout.slice(0, 4000));
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
  }
});
