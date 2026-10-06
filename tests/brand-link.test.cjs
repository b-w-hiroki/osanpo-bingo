const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

test('landing page links to the studio without replacing sister app navigation', () => {
  const html = readFileSync(resolve(__dirname, '..', 'index.html'), 'utf8');
  const studioLinks = html.match(/href="https:\/\/birdman-studio\.com\/"/g) || [];
  assert.equal(studioLinks.length, 2);
  assert.match(html, /class="bs-bar-brand"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/);
  assert.match(html, /class="bs-studio-link"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/);
  assert.match(html, /class="bs-sw-btn"/);
  assert.match(html, /data-bs-foot/);
  assert.match(html, /min-height:\s*44px/);
});
