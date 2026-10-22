const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { readFileSync, mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join, resolve, extname } = require('node:path');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');

const root = resolve(__dirname, '..');
const chrome = process.env.CHROME_BIN || (process.platform === 'win32'
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : 'google-chrome');
const payload = '<img src=x onerror="window.__marker=1">';
const board = Array.from({ length: 25 }, (_, id) => ({ id: id + 1, text: '散歩', icon: '🌸' }));
board[0] = { type: 'landmark', text: `桜${payload}`, icon: payload,
  iconFile: 'x.png" onerror="window.__marker=1' };
board[1] = { id: 153, text: '桜', icon: '🌸' };
board[2] = { type: 'landmark', text: '道', icon: payload, iconFile: '../evil.png' };
board[12] = { isFree: true, text: '', icon: '🌸', centerImage: 'x.png" onerror="window.__marker=1' };

const injection = `<script>
localStorage.setItem('osanpoBingo', ${JSON.stringify(JSON.stringify({ board, gameType: 'normal', roomCode: 'solo', playMode: 'markOnly' }))});
window.addEventListener('load', () => setTimeout(() => {
  const cells = [...document.querySelectorAll('#bingoBoard .bingo-cell')];
  const first = cells[0];
  window.game.showCellModal(0);
  const badModal = document.getElementById('cellModalIcon');
  const badModalMarkup = badModal.innerHTML;
  window.game.showCellModal(1);
  const goodModal = badModal.querySelector('img');
  const result = {
    count: cells.length,
    text: first.querySelector('.cell-text')?.textContent,
    activeMarkup: !!first.querySelector('.cell-icon img, .cell-icon script') ||
      !!badModal.querySelector('script') || /<img/i.test(badModalMarkup),
    unsafePath: [...document.querySelectorAll('#bingoBoard img, #cellModalIcon img')]
      .some(img => img.hasAttribute('onerror') || img.getAttribute('src').includes('evil')),
    validIcon: cells[1].querySelector('.cell-icon img')?.getAttribute('src'),
    validModal: goodModal?.getAttribute('src'),
    freeImage: !!cells[12].querySelector('.cell-center-img'),
    marker: window.__marker || 0
  };
  const pre = document.createElement('pre');
  pre.id = 'securityResult';
  pre.textContent = btoa(unescape(encodeURIComponent(JSON.stringify(result))));
  document.body.appendChild(pre);
}, 300));
</script>`;

test('restored board and photo modal render hostile icon data as inert text', async () => {
  const server = createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === '/game.html') {
      const html = readFileSync(join(root, 'game.html'), 'utf8')
        .replace('<script src="app.js"></script>', `${injection}\n<script src="app.js"></script>`)
        .replace(/<script async src="https:\/\/www\.googletagmanager\.com[^>]*><\/script>/, '');
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.end(html);
      return;
    }
    const file = resolve(root, '.' + pathname);
    if (!file.startsWith(root + require('node:path').sep)) { response.writeHead(404).end(); return; }
    try {
      const type = { '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' }[extname(file)] || 'application/octet-stream';
      response.setHeader('Content-Type', type);
      response.end(readFileSync(file));
    } catch { response.writeHead(404).end(); }
  });
  const profile = mkdtempSync(join(tmpdir(), 'osanpo-chrome-'));
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const url = `http://127.0.0.1:${server.address().port}/game.html`;
    const { stdout } = await promisify(execFile)(chrome, [
      '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
      `--user-data-dir=${profile}`, '--virtual-time-budget=3000', '--dump-dom', url
    ], { timeout: 25000, maxBuffer: 3 * 1024 * 1024 });
    const match = stdout.match(/<pre id="securityResult">([^<]+)<\/pre>/);
    assert.ok(match, 'browser did not complete restored-board probe');
    const result = JSON.parse(Buffer.from(match[1], 'base64').toString('utf8'));
    assert.equal(result.count, 25);
    assert.equal(result.text, `桜${payload}`);
    assert.equal(result.activeMarkup, false);
    assert.equal(result.unsafePath, false);
    assert.match(result.validIcon, /^assets\/icons\/icon153_/);
    assert.match(result.validModal, /^assets\/icons\/icon153_/);
    assert.equal(result.freeImage, false);
    assert.equal(result.marker, 0);
  } finally {
    server.close();
    rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
  }
});
