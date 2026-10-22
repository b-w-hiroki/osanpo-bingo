const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const csvCell = value => /[,"\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

test('CSV content round trips through generated JavaScript without executing source text', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'osanpo-topics-'));
  try {
    const csv = path.join(temp, 'fixture.csv');
    const output = path.join(temp, 'topics.js');
    const values = ["子どもの'花", 'バックスラッシュ\\道', '一行目\n二行目', "'; globalThis.__marker = true; //"];
    const lines = ['ID,icon_file_name,display_name,category,difficulty,season'];
    values.forEach((value, index) => lines.push([String(index + 1), 'icon001_桜.png', value, value, 'easy', value].map(csvCell).join(',')));
    fs.writeFileSync(csv, lines.join('\r\n'));
    execFileSync(process.execPath, [path.join(root, 'tools/csv-to-topics.js'), csv, output]);
    const context = vm.createContext({});
    vm.runInContext(fs.readFileSync(output, 'utf8'), context);
    const actual = vm.runInContext('topicDatabase.easy.map(t => [t.text, t.category, t.season])', context);
    assert.deepEqual(JSON.parse(JSON.stringify(actual)), values.map(value => [value, value, value]));
    assert.equal(context.__marker, undefined);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('restored icon data remains text or a local PNG asset', () => {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(root, 'topics.js'), 'utf8'), context);
  const render = topic => vm.runInContext(`getTopicIcon(${JSON.stringify(topic)})`, context);
  assert.match(render({ id: 153, icon: '🌸' }), /assets\/icons\/icon153_/);
  assert.match(render({ type: 'landmark', iconFile: '桜.png', icon: '🌸' }), /assets\/icons\/landmark\/%E6%A1%9C.png/);
  for (const iconFile of ['../evil.png', 'x.png" onerror="globalThis.__marker=1', 'https://evil.test/a.png']) {
    const html = render({ type: 'landmark', iconFile, icon: '<img src=x onerror=alert(1)>' });
    assert.doesNotMatch(html, /<img|evil\.test/);
    assert.match(html, /&lt;img/);
  }
  assert.equal(context.__marker, undefined);
});
