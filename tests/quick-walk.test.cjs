const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../app.js'), 'utf8');
const handler = source.slice(source.indexOf('    // Short walk'), source.indexOf('    // ふつうに遊ぶ：ゲーム開始'));
function setup(fail = false) {
  let click;
  const els = { difficultySelectSolo: { value: 'hard' }, topicSetSelectSolo: { value: '観光地' }, quickWalkBtn: { addEventListener: (_, cb) => { click = cb; } } };
  const ctx = { _quickWalkStart: false, renderCustomTopicInputs: (n, container) => { assert.equal(n, 0); container.items = []; } };
  const count = { value: '3' }, inputs = { items: ['old'] };
  let starts = 0;
  vm.runInNewContext(`(function(){${handler}}).call(ctx)`, {ctx, document: { getElementById: id => els[id] }, customTopicCountSolo: count, customTopicInputsSolo: inputs, startSoloGameBtn: { click() { starts++; assert.equal(ctx._quickWalkStart, true); if (fail) throw Error('start failed'); } } });
  return { click, els, ctx, count, inputs, starts: () => starts };
}
test('quick walk resets stale options and uses existing start path', () => {
  const s = setup(); s.click();
  assert.equal(s.els.difficultySelectSolo.value, 'easy');
  assert.equal(s.els.topicSetSelectSolo.value, 'default');
  assert.equal(s.count.value, '0'); assert.equal(s.inputs.items.length, 0);
  assert.equal(s.starts(), 1); assert.equal(s.ctx._quickWalkStart, false);
});
test('failed quick start does not affect later regular starts', () => {
  const s = setup(true); assert.throws(s.click, /start failed/); assert.equal(s.ctx._quickWalkStart, false);
});
