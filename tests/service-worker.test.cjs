const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');
const source = readFileSync(join(__dirname, '../service-worker.js'), 'utf8');

function worker(caches) {
  const handlers = {};
  vm.runInNewContext(source, { caches, URL, self: {
    location: { origin: 'https://example.test' },
    addEventListener: (name, fn) => { handlers[name] = fn; },
    clients: { claim: async () => {} }
  } });
  return handlers;
}

test('precache network failure rejects install rather than activating incomplete assets', async () => {
  const failure = new Error('offline');
  const handlers = worker({ open: async () => ({ addAll: async () => { throw failure; } }) });
  let pending;
  handlers.install({ waitUntil: promise => { pending = promise; } });
  await assert.rejects(pending, failure);
});

test('activate only deletes this app obsolete version caches', async () => {
  const deleted = [];
  const handlers = worker({
    keys: async () => ['osanpo-bingo-v161', 'osanpo-bingo-v162', 'other-app-v1'],
    delete: async name => { deleted.push(name); }
  });
  let pending;
  handlers.activate({ waitUntil: promise => { pending = promise; } });
  await pending;
  assert.deepEqual(deleted, ['osanpo-bingo-v161']);
});

test('all local game script dependencies are precached and exist', async () => {
  let urls;
  const handlers = worker({ open: async () => ({ addAll: async list => { urls = list; } }) });
  let pending;
  handlers.install({ waitUntil: promise => { pending = promise; } });
  await pending;
  const html = readFileSync(join(__dirname, '../game.html'), 'utf8');
  for (const match of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)) {
    if (/^https?:/.test(match[1])) continue;
    assert.ok(urls.includes(match[1]), match[1]);
  }
  for (const url of urls) assert.ok(readFileSync(join(__dirname, '..', url)).length, url);
});
