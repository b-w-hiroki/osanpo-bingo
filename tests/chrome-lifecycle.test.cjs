const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { createBrowserCloser } = require('./helpers/chrome-lifecycle.cjs');

function fakeBrowser() {
  const browser = new EventEmitter();
  browser.signals = [];
  browser.kill = signal => {
    browser.signals.push(signal);
    setImmediate(() => browser.emit('close'));
  };
  return browser;
}

test('graceful shutdown waits for close rather than exit or a CDP reply', async () => {
  const browser = fakeBrowser();
  const calls = [];
  const close = createBrowserCloser(browser, method => {
    calls.push(method);
    browser.emit('exit', 0);
    return Promise.resolve();
  });
  let finished = false;
  const closing = close().then(() => { finished = true; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(finished, false);
  browser.emit('close', 0);
  await closing;
  assert.deepEqual(calls, ['Browser.close']);
  assert.deepEqual(browser.signals, []);
});

test('already closed browser does not create a missed-event wait', async () => {
  const browser = fakeBrowser();
  const close = createBrowserCloser(browser, () => assert.fail('must not send'));
  browser.emit('close', 1);
  await close();
  assert.deepEqual(browser.signals, []);
});

test('unresponsive browser has one bounded kill fallback', async () => {
  const browser = fakeBrowser();
  let sends = 0;
  const close = createBrowserCloser(browser, () => {
    sends += 1;
    return Promise.reject(new Error('pipe disconnected'));
  }, { timeoutMs: 10 });
  const first = close();
  assert.equal(close(), first);
  await first;
  await close();
  assert.equal(sends, 1);
  assert.deepEqual(browser.signals, ['SIGKILL']);
});
