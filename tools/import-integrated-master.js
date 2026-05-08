#!/usr/bin/env node
/**
 * 統合マスタ（xlsx） + osanpo-icon ZIP を正として topics_list.csv を生成し、アイコン実体を同期する。
 *
 * 【注意】本スクリプトは assets/icons 直下の PNG のみバックアップ・差し替えする。
 * ランディング用ヒーロー等は static/ を使う（ここを触らない）。
 *
 * 使い方:
 *   node tools/import-integrated-master.js \
 *     "C:/Users/.../Downloads/walking_bingo_master.xlsx" \
 *     "C:/Users/.../Downloads/osanpo-icon.zip"
 *
 * - Excel のお題が ZIP に存在しないファイル名を参照している場合は **レコード削除**（旧 assets へのフォールバックなし）。
 * - コピーも ZIP のみから行う。
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const XLSX = require('xlsx');

const ROOT = path.join(__dirname, '..');
const DEFAULT_XLSX = path.join(process.env.USERPROFILE || '', 'Downloads', 'walking_bingo_master.xlsx');
const DEFAULT_ZIP_DIR = path.join(ROOT, '_import-extract', 'osanpo-icon');
const ICONS_OUT = path.join(ROOT, 'assets', 'icons');
const LANDMARK_DIR = path.join(ICONS_OUT, 'landmark');
const CSV_OUT = path.join(ROOT, 'topics_list.csv');
const TMP_EXTRACT = path.join(ROOT, '_master-import-extract');

const SHEET_CANDIDATES = ['統合シート', '統合マスタ'];

/** difficulty_level → csv-to-topics 用 difficulty */
function levelToDiff(level) {
  const n = parseInt(String(level).trim(), 10);
  if (n <= 1) return 'easy';
  if (n === 2) return 'normal';
  if (n === 3) return 'hard';
  return 'oni'; // 4, 5+
}

function csvCell(s) {
  const x = String(s ?? '');
  if (/[,"\n\r]/.test(x)) return `"${x.replace(/"/g, '""')}"`;
  return x;
}

function pickSheet(workbook) {
  for (const name of SHEET_CANDIDATES) {
    if (workbook.Sheets[name]) return { name, sheet: workbook.Sheets[name] };
  }
  const first = workbook.SheetNames[0];
  console.warn(`候補シート (${SHEET_CANDIDATES.join(', ')}) が無く、先頭シートを使用します: ${first}`);
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

/**
 * ZIP 内のファイル名のみ（Unicode NFC 正規化で照合）。
 * Excel の icon_file_name が ZIP に無い場合は null（レコード削除）。
 */
function resolveZipOnly(wantName, zipMap) {
  const wantNorm = String(wantName).normalize('NFC');
  if (!wantNorm.endsWith('.png')) return null;
  if (zipMap.mapNorm[wantNorm]) return zipMap.mapNorm[wantNorm];
  return null;
}

function unzipTo(zipPath, destDir) {
  if (!fs.existsSync(zipPath)) {
    console.error('ZIP が見つかりません:', zipPath);
    process.exit(1);
  }
  fs.rmSync(destDir, { recursive: true, force: true });
  fs.mkdirSync(destDir, { recursive: true });
  const ps = [
    '-NoProfile',
    '-Command',
    `Expand-Archive -LiteralPath ${JSON.stringify(zipPath)} -DestinationPath ${JSON.stringify(destDir)} -Force`,
  ];
  execFileSync('powershell.exe', ps, { stdio: 'inherit' });
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

  let zipSourceDir = path.resolve(zipArg ? '' : DEFAULT_ZIP_DIR);

  if (zipArg) {
    const zp = path.resolve(zipArg);
    if (zp.endsWith('.zip')) {
      unzipTo(zp, TMP_EXTRACT);
      zipSourceDir = findOsanpoSubdir(TMP_EXTRACT);
    } else {
      zipSourceDir = zp;
    }
  } else if (!fs.existsSync(DEFAULT_ZIP_DIR)) {
    console.error('ZIP 展開先がありません:', DEFAULT_ZIP_DIR, 'または第3引数で ZIP を指定してください。');
    process.exit(1);
  } else {
    zipSourceDir = DEFAULT_ZIP_DIR;
  }

  const backupIcons = path.join(ROOT, '_icons-backup-before-import');
  fs.mkdirSync(ROOT, { recursive: true });

  const wb = XLSX.readFile(xlsxPath);
  const { name: sheetName, sheet } = pickSheet(wb);
  const aoa = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  /** ヘッダー名が number または 番号 にも対応 */
  let h0 = aoa[0] || [];
  const headNorm = (c) =>
    String(c)
      .trim()
      .replace(/\ufeff/g, '')
      .toLowerCase();
  const col = {
    number: -1,
    icon_id: -1,
    asset_type: -1,
    icon_file_name: -1,
    display_name: -1,
    category: -1,
    difficulty_level: -1,
    season: -1,
  };
  for (let j = 0; j < h0.length; j++) {
    const hn = headNorm(h0[j]);
    if (hn.includes('number') || hn === '番号') col.number = j;
    else if (hn.includes('icon_id')) col.icon_id = j;
    else if (hn.includes('asset')) col.asset_type = j;
    else if (hn.includes('icon_file')) col.icon_file_name = j;
    else if (hn.includes('display') || hn.includes('表示')) col.display_name = j;
    else if (hn === 'category' || hn.includes('カテゴリ')) col.category = j;
    else if (hn.includes('difficulty') || hn.includes('難易')) col.difficulty_level = j;
    else if (hn.includes('season')) col.season = j;
  }

  const report = [];

  /** 明示マッピング（number ヘッダー形式）なら順序インデックス */
  let dataRows = [];
  if (col.icon_id >= 0 && col.asset_type >= 0) {
    for (let i = 1; i < aoa.length; i++) {
      const r = aoa[i];
      if (!r || String(r[col.asset_type] || '').trim() !== 'osanpo') continue;
      dataRows.push(r);
    }
  } else {
    /** 統合ツール標準順: asset_type が col index 欠落時も列位置フォールバック（旧フォーマット） */
    console.warn('列名の一部が読み取れません。標準順 [number, icon_id, asset_type, icon_file_name, ...] とみなします');
    col.number = col.number >= 0 ? col.number : 0;
    col.icon_id = col.icon_id >= 0 ? col.icon_id : 1;
    col.asset_type = col.asset_type >= 0 ? col.asset_type : 2;
    col.icon_file_name = col.icon_file_name >= 0 ? col.icon_file_name : 3;
    col.display_name = col.display_name >= 0 ? col.display_name : 4;
    col.category = col.category >= 0 ? col.category : 5;
    col.difficulty_level = col.difficulty_level >= 0 ? col.difficulty_level : 7;
    col.season = col.season >= 0 ? col.season : 8;
    for (let i = 1; i < aoa.length; i++) {
      const r = aoa[i];
      if (!r || String(r[col.asset_type] || '').trim() !== 'osanpo') continue;
      dataRows.push(r);
    }
  }

  const zipMap = buildNzMap(zipSourceDir);

  let resolvedRows = [];
  for (const r of dataRows) {
    const id = iconNumericId(r[col.icon_id]);
    if (!Number.isFinite(id)) {
      report.push({ kind: 'skip', msg: `icon_id 不正の行をスキップ: ${JSON.stringify(r[col.icon_id])}` });
      continue;
    }
    const wantFile = String(r[col.icon_file_name] || '').trim();
    if (!wantFile) {
      report.push({ kind: 'skip', msg: `icon ${id}: icon_file_name が空のためスキップ` });
      continue;
    }
    const file = resolveZipOnly(wantFile, zipMap);
    if (!file) {
      report.push({
        kind: 'skip',
        msg: `icon ${id}: ZIP に無いためレコード削除 (${wantFile})`,
      });
      continue;
    }

    resolvedRows.push({
      id,
      icon_file_name: file,
      display_name: String(r[col.display_name] || '').trim(),
      category: String(r[col.category] || '').trim(),
      difficulty: levelToDiff(r[col.difficulty_level]),
      season: String(r[col.season] || '').trim() || 'all',
    });
  }

  const byId = new Map();
  for (const row of resolvedRows) {
    if (byId.has(row.id)) {
      console.warn(`⚠️ icon_id ${row.id} が複数行 → 末尾行を採用`);
    }
    byId.set(row.id, row);
  }
  resolvedRows = [...byId.values()];

  if (resolvedRows.length === 0) {
    console.error('❌ ZIP と突合できるお題が0件です。Excel と ZIP の icon_file_name を確認してください。');
    process.exit(1);
  }

  const skipped = report.filter((x) => x.kind === 'skip');
  if (skipped.length) {
    console.log(`⏭️ スキップ（Excel 行はマスタ削除漏れ等）: ${skipped.length} 件`);
    skipped.slice(0, 30).forEach((s) => console.log(' ', s.msg));
    if (skipped.length > 30) console.log(`  … 他 ${skipped.length - 30} 件`);
  }

  resolvedRows.sort((a, b) => a.id - b.id);

  /** バックアップ + 削除（お散歩用 PNG のみ。landmark / その他は保持） */
  fs.rmSync(backupIcons, { recursive: true, force: true });
  fs.mkdirSync(backupIcons, { recursive: true });
  if (fs.existsSync(ICONS_OUT)) {
    for (const f of fs.readdirSync(ICONS_OUT)) {
      if (!f.endsWith('.png')) continue;
      const from = path.join(ICONS_OUT, f);
      const st = fs.statSync(from);
      if (!st.isFile()) continue;
      fs.copyFileSync(from, path.join(backupIcons, f));
      fs.unlinkSync(from);
    }
  }
  fs.mkdirSync(ICONS_OUT, { recursive: true });
  if (!fs.existsSync(LANDMARK_DIR)) {
    fs.mkdirSync(LANDMARK_DIR, { recursive: true });
  }
  /** 直下の icon*.png のみ削除済み。subfolder landmark はそのまま残る。 */

  console.log(`📄 シート: ${sheetName} / osanpo 行 → ${resolvedRows.length} 件`);

  /** ZIP のみから assets/icons にコピー */
  const copied = new Set();
  for (const row of resolvedRows) {
    const src = path.join(zipSourceDir, row.icon_file_name);
    if (!fs.existsSync(src)) {
      console.error('内部エラー: ZIP に解決済みファイルが無い:', row.icon_file_name);
      process.exit(1);
    }
    const dest = path.join(ICONS_OUT, row.icon_file_name);
    fs.copyFileSync(src, dest);
    copied.add(row.icon_file_name);
  }

  const lines = ['ID,icon_file_name,display_name,category,difficulty,season'];
  for (const row of resolvedRows) {
    lines.push(
      [
        csvCell(row.id),
        csvCell(row.icon_file_name),
        csvCell(row.display_name),
        csvCell(row.category),
        csvCell(row.difficulty),
        csvCell(row.season),
      ].join(',')
    );
  }
  fs.writeFileSync(CSV_OUT, `\uFEFF${lines.join('\n')}`, 'utf8');

  console.log(`✅ ${CSV_OUT} を書き出し (${resolvedRows.length} 行)`);
  console.log(`✅ アイコン ${copied.size} ファイルを ${ICONS_OUT} に配置（ZIP のみ）`);
}

main();
