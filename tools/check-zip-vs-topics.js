const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const csvPath = path.join(ROOT, 'topics_list.csv');
const zipDir = path.join(ROOT, process.argv[2] || '_osanpo-icon-check', 'osanpo-icon');

const icons = fs.readdirSync(zipDir).filter((f) => f.endsWith('.png'));
const zipById = {};
for (const f of icons) {
  const m = f.match(/^icon(\d+)_/);
  if (m) zipById[+m[1]] = f;
}

let csv = fs.readFileSync(csvPath, 'utf8');
if (csv.charCodeAt(0) === 0xfeff) csv = csv.slice(1);
const lines = csv.split(/\r?\n/).filter((l) => l.trim());

const mismatches = [];
const missingZip = [];

for (let i = 1; i < lines.length; i++) {
  const a = lines[i].split(',');
  const id = +a[0];
  const csvIcon = a[1];
  const z = zipById[id];
  if (!z) missingZip.push({ id, csvIcon });
  else if (csvIcon !== z) mismatches.push({ id, csv: csvIcon, zip: z });
}

const csvIds = new Set();
for (let i = 1; i < lines.length; i++) csvIds.add(+lines[i].split(',')[0]);

const extraZip = [];
for (const id of Object.keys(zipById).map(Number).sort((a, b) => a - b)) {
  if (!csvIds.has(id)) extraZip.push({ id, zip: zipById[id] });
}

console.log(JSON.stringify({
  zipDir,
  zipPngCount: icons.length,
  csvRows: lines.length - 1,
  mismatchCount: mismatches.length,
  missingInZipCount: missingZip.length,
  extraInZipNoCsvIdCount: extraZip.length,
  mismatches: mismatches.slice(0, 50),
  missingInZip: missingZip.slice(0, 10),
}, null, 2));

if (mismatches.length > 50) {
  console.error('... mismatches truncated, total:', mismatches.length);
}
