#!/usr/bin/env node
/**
 * 統合マスタ xlsx と osanpo-icon ZIP の突合のみ（書き換えなし）。
 *
 *   node tools/check-xlsx-vs-zip.js [xlsx] [zip|展開ディレクトリ]
 *
 * インポート処理（import-integrated-master.js）と同じ基準:
 * - シート: 統合シート / 統合マスタ
 * - asset_type === osanpo の行のみ
 * - icon_file_name は ZIP 内 PNG 名との Unicode NFC 完全一致
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const XLSX = require('xlsx');

const ROOT = path.join(__dirname, '..');
const TMP = path.join(ROOT, '_xlsx-zip-check-extract');
const SHEET_CANDIDATES = ['統合シート', '統合マスタ'];
const DEFAULT_XLSX = path.join(process.env.USERPROFILE || '', 'Downloads', 'walking_bingo_master.xlsx');

function pickSheet(workbook) {
  for (const name of SHEET_CANDIDATES) {
    if (workbook.Sheets[name]) return { name, sheet: workbook.Sheets[name] };
  }
  const first = workbook.SheetNames[0];
  return { name: first, sheet: workbook.Sheets[first] };
}

function iconNumericId(iconIdCell) {
  const m = String(iconIdCell || '').match(/^icon(\d+)$/i);
  return m ? parseInt(m[1], 10) : NaN;
}

function buildNzMap(dir) {
  const mapNorm = {};
  if (!fs.existsSync(dir)) return { mapNorm };
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.png')) continue;
    mapNorm[f.normalize('NFC')] = f;
  }
  return { mapNorm };
}

function resolveZipOnly(wantName, zipMap) {
  const wantNorm = String(wantName).normalize('NFC');
  if (!wantNorm.endsWith('.png')) return null;
  return zipMap.mapNorm[wantNorm] || null;
}

function unzipTo(zipPath, destDir) {
  fs.rmSync(destDir, { recursive: true, force: true });
  fs.mkdirSync(destDir, { recursive: true });
  execFileSync('powershell.exe', [
    '-NoProfile',
    '-Command',
    `Expand-Archive -LiteralPath ${JSON.stringify(zipPath)} -DestinationPath ${JSON.stringify(destDir)} -Force`,
  ], { stdio: 'inherit' });
}

function findOsanpoSubdir(dir) {
  const direct = path.join(dir, 'osanpo-icon');
  if (fs.existsSync(direct)) return direct;
  const children = fs.readdirSync(dir, { withFileTypes: true });
  for (const c of children) {
    if (c.isDirectory()) {
      const p = path.join(dir, c.name, 'osanpo-icon');
      if (fs.existsSync(p)) return p;
    }
  }
  return dir;
}

function main() {
  const xlsxPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_XLSX;
  const zipArg = process.argv[3];

  if (!fs.existsSync(xlsxPath)) {
    console.error('Excel が見つかりません:', xlsxPath);
    process.exit(1);
  }
  let zipDir;
  if (!zipArg) {
    console.error('使い方: node tools/check-xlsx-vs-zip.js [xlsx] <zipまたは展開パス>');
    process.exit(1);
  }
  const zp = path.resolve(zipArg);
  if (zp.endsWith('.zip')) {
    if (!fs.existsSync(zp)) {
      console.error('ZIP が見つかりません:', zp);
      process.exit(1);
    }
    unzipTo(zp, TMP);
    zipDir = findOsanpoSubdir(TMP);
  } else {
    zipDir = zp;
    if (!fs.existsSync(zipDir)) {
      console.error('ディレクトリが見つかりません:', zipDir);
      process.exit(1);
    }
  }

  const wb = XLSX.readFile(xlsxPath);
  const { name: sheetName, sheet } = pickSheet(wb);
  const aoa = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  const h0 = aoa[0] || [];
  const headNorm = (c) =>
    String(c)
      .trim()
      .replace(/\ufeff/g, '')
      .toLowerCase();
  const col = {
    icon_id: -1,
    asset_type: -1,
    icon_file_name: -1,
  };
  for (let j = 0; j < h0.length; j++) {
    const hn = headNorm(h0[j]);
    if (hn.includes('icon_id')) col.icon_id = j;
    else if (hn.includes('asset')) col.asset_type = j;
    else if (hn.includes('icon_file')) col.icon_file_name = j;
  }
  if (col.icon_id < 0 || col.asset_type < 0 || col.icon_file_name < 0) {
    col.icon_id = 1;
    col.asset_type = 2;
    col.icon_file_name = 3;
  }

  const dataRows = [];
  for (let i = 1; i < aoa.length; i++) {
    const r = aoa[i];
    if (!r || String(r[col.asset_type] || '').trim() !== 'osanpo') continue;
    dataRows.push(r);
  }

  const zipMap = buildNzMap(zipDir);
  const zipEntries = Object.values(zipMap.mapNorm);
  const zipNfcKeys = new Set(Object.keys(zipMap.mapNorm));

  let badIconId = 0;
  let emptyName = 0;
  const missingInZip = [];
  const matchedPairs = []; // { iconId, excelName, diskName }

  /** Excel が参照しているファイル名の集合（すべての osanpo 行、空でないもの） */
  const excelReferencedNfc = new Set();

  for (const r of dataRows) {
    const id = iconNumericId(r[col.icon_id]);
    if (!Number.isFinite(id)) {
      badIconId++;
      continue;
    }
    const want = String(r[col.icon_file_name] || '').trim();
    if (!want) {
      emptyName++;
      continue;
    }
    excelReferencedNfc.add(want.normalize('NFC'));
    const hit = resolveZipOnly(want, zipMap);
    if (hit) matchedPairs.push({ iconId: id, excelName: want, diskName: hit });
    else missingInZip.push({ iconId: id, icon_file_name: want });
  }

  const matchedByZipName = new Set(matchedPairs.map((p) => p.diskName.normalize('NFC')));
  const extraInZip = zipEntries.filter((f) => !excelReferencedNfc.has(f.normalize('NFC')));

  const summary = {
    sheet: sheetName,
    excelOsanpoRows: dataRows.length,
    zipPngCount: zipEntries.length,
    matchedCount: matchedPairs.length,
    missingInZipCount: missingInZip.length,
    badIconIdCount: badIconId,
    emptyIconFileNameCount: emptyName,
    /** ゲームに取り込まれるお題数（import と同義） */
    wouldImportTopics: matchedPairs.length,
    extraZipPngNotInExcel: extraInZip.length,
  };

  console.log(JSON.stringify(summary, null, 2));
  console.log('\n--- ZIP に無い（インポートでスキップ） ---');
  missingInZip.forEach((x) =>
    console.log(`  icon_id ${x.iconId}: ${x.icon_file_name}`)
  );
  if (extraInZip.length) {
    console.log('\n--- Excel が参照しない ZIP 内 PNG（サンプル最大20） ---');
    extraInZip.slice(0, 20).forEach((f) => console.log(' ', f));
    if (extraInZip.length > 20) console.log(`  … 計 ${extraInZip.length} 件`);
  }
}

main();
