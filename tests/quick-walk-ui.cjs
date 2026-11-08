// Run: PW_EXECUTABLE=/path/to/chromium node tests/quick-walk-ui.cjs
const { chromium } = require('playwright');
const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
(async () => {
  const root = path.resolve(__dirname, '..');
  const types = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.png': 'image/png', '.json': 'application/json' };
  const server = createServer(async (req, res) => {
    try { const f = path.join(root, new URL(req.url, 'http://localhost').pathname); res.setHeader('Content-Type', types[path.extname(f)] || 'application/octet-stream'); res.end(await readFile(f)); }
    catch { res.writeHead(404); res.end(); }
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  let browser;
  try {
    browser = await chromium.launch(process.env.PW_EXECUTABLE ? { executablePath: process.env.PW_EXECUTABLE } : {});
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    const base = `http://127.0.0.1:${server.address().port}`;
    await page.route('**/*', r => r.request().url().startsWith(base) ? r.continue() : r.abort());
    await page.goto(`${base}/game.html`);
    // Both text spans must stack instead of competing for half the button width.
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.locator('#quickWalkBtn').waitFor({ state: 'visible' });
      await page.waitForTimeout(400);
      const choices = await page.locator('#modeSelectStep .mode-btn').evaluateAll(buttons => buttons.map(button => {
        const title = button.querySelector('.mode-btn-label').getBoundingClientRect();
        const detail = button.querySelector('.mode-btn-desc').getBoundingClientRect();
        return { stacked: detail.top >= title.bottom, singleLine: title.height < 30, width: button.getBoundingClientRect().width };
      }));
      assert.equal(choices.length, 3);
      assert.ok(choices.every(c => c.stacked && c.singleLine && c.width >= 44));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.screenshot({ path: `/tmp/osanpo-mode-choices-${width}.png` });
    }
    await page.locator('#quickWalkBtn').click();
    const state = await page.evaluate(() => ({ difficulty: game.difficulty, playMode: game.playMode, count: game.board.length, custom: game.board.filter(c => c.isCustom).length, pending: game._quickWalkStart, overflow: document.documentElement.scrollWidth > innerWidth }));
    assert.deepEqual(state, { difficulty: 'easy', playMode: 'markOnly', count: 25, custom: 0, pending: false, overflow: false });
    await page.screenshot({ path: '/tmp/osanpo-quick-walk.png' });
    await page.reload();
    assert.equal(await page.evaluate(() => game.playMode), 'markOnly', 'preset survives reload');
    // Returning to the existing settings path must not retain the one-shot override.
    await page.evaluate(() => document.getElementById('startSoloGameBtn').click());
    assert.equal(await page.evaluate(() => game.playMode), 'photo');
    console.log('PASS quick walk at 390x844, saved reload, regular-start isolation');
  } finally { if (browser) await browser.close(); await new Promise(r => server.close(r)); }
})().catch(e => { console.error(e); process.exitCode = 1; });
