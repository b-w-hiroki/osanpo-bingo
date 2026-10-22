const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const XLSX = require('xlsx');

const root = path.resolve(__dirname, '..');

test('Excel generator serializes every workbook field as JavaScript data', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'osanpo-excel-'));
  try {
    const workbookPath = path.join(temp, 'fixture.xlsx');
    const output = path.join(temp, 'topics.js');
    const source = 'const topicIconMap = {};\nconst topicDatabase = {};\nconst CATEGORY_QUOTAS = {};\n';
    fs.writeFileSync(output, source);
    const attack = "'; globalThis.__marker = true; //";
    const row = ['icon1', 'osanpo', "icon'\\桜.png", "子どもの'道\\橋\n二行目", '自然', 1, attack, 'その他', attack];
    const headers = ['icon_id', 'asset_type', 'icon_file_name', 'display_name', 'category', 'difficulty_level', 'season', 'field', 'region_limit'];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([headers, row]), 'fixture');
    XLSX.writeFile(workbook, workbookPath);
    execFileSync(process.env.PYTHON || 'python', [path.join(root, 'tools/update-topics-from-excel.py'), workbookPath, output]);
    const context = vm.createContext({});
    vm.runInContext(fs.readFileSync(output, 'utf8'), context);
    const topic = vm.runInContext('topicDatabase[1][0]', context);
    assert.equal(topic.text, row[3]);
    assert.equal(topic.season, attack);
    assert.equal(topic.region_limit, attack);
    assert.equal(vm.runInContext('topicIconMap[1]', context), row[2]);
    assert.equal(context.__marker, undefined);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('alternate Excel generator keeps hostile cells inert', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'osanpo-excel-alternate-'));
  try {
    const workbookPath = path.join(temp, 'fixture.xlsx');
    const output = path.join(temp, 'topics-data.js');
    const attack = "'; globalThis.__marker = true; //";
    const headers = ['icon_id', 'icon_file_name', 'display_name', 'category', 'difficulty_level', 'season'];
    const row = ['icon1', "icon'\\桜.png", '桜\\道\n二行目', "子どもの'道", 1, attack];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([headers, row]), 'fixture');
    XLSX.writeFile(workbook, workbookPath);
    execFileSync(process.env.PYTHON || 'python', [path.join(root, 'tools/gen-topics-from-excel.py'), workbookPath, output]);
    const context = vm.createContext({});
    vm.runInContext(fs.readFileSync(output, 'utf8'), context);
    assert.equal(vm.runInContext('topicIconMap[1]', context), row[1]);
    assert.equal(vm.runInContext('topicDatabase.easy[0].text', context), row[2]);
    assert.equal(vm.runInContext('topicDatabase.easy[0].season', context), attack);
    assert.equal(context.__marker, undefined);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('CSV generator output produces nonempty Japanese topic page sections', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'osanpo-pipeline-'));
  try {
    const csv = path.join(temp, 'topics.csv');
    const js = path.join(temp, 'topics.js');
    const htmlPath = path.join(temp, 'topics.html');
    fs.writeFileSync(csv, 'ID,icon_file_name,display_name,category,difficulty,season\n1,icon001_桜.png,桜の道,自然,easy,spring\n');
    execFileSync(process.execPath, [path.join(root, 'tools/csv-to-topics.js'), csv, js]);
    execFileSync(process.execPath, [path.join(root, 'tools/build-topics-page.js'), js, htmlPath]);
    const html = fs.readFileSync(htmlPath, 'utf8');
    assert.match(html, /<li class="topic-item">桜の道<\/li>/);
    assert.match(html, /"numberOfItems": 1/);
    const jsonLd = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.equal(jsonLd.itemListElement[0].name, '桜の道');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('topic page JSON-LD keeps closing-script text inside JSON data', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'osanpo-jsonld-'));
  try {
    const input = path.join(temp, 'topics.js');
    const output = path.join(temp, 'topics.html');
    const attack = '</script><script>globalThis.__marker = true</script>';
    fs.writeFileSync(input, `const topicDatabase = {1:[{text:${JSON.stringify(attack)},category:'自然'}],2:[],3:[],4:[]};\nconst topicIconMap = {};`);
    execFileSync(process.execPath, [path.join(root, 'tools/build-topics-page.js'), input, output]);
    const html = fs.readFileSync(output, 'utf8');
    const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(match);
    const data = JSON.parse(match[1]);
    assert.equal(data.itemListElement[0].name, attack);
    assert.doesNotMatch(match[1], /<\/script>/i);
    assert.equal((html.match(/<script>globalThis\.__marker/g) || []).length, 0);
    assert.match(html, /&lt;\/script&gt;/);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
