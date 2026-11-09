// Observe close before testing starts: exit alone does not mean Chrome's pipes
// and subprocesses have finished using the temporary profile.
function createBrowserCloser(browser, send, { timeoutMs = 5000 } = {}) {
  let didClose = false;
  let closing;
  const closed = new Promise(resolve => {
    browser.once('close', () => { didClose = true; resolve(); });
  });
  return function closeBrowser() {
    if (didClose) return Promise.resolve();
    if (closing) return closing;
    closing = (async () => {
      const forceStop = setTimeout(() => browser.kill('SIGKILL'), timeoutMs);
      try {
        // CDP may disconnect before replying to Browser.close. The child close
        // event, not the protocol reply, is the completion signal.
        Promise.resolve().then(() => send('Browser.close')).catch(() => {});
        await closed;
      } finally {
        clearTimeout(forceStop);
      }
    })();
    return closing;
  };
}

module.exports = { createBrowserCloser };
