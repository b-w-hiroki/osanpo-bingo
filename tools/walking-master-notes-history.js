#!/usr/bin/env node
/**
 * walking_bingo_master.xlsx: notes 列の右に「変更履歴」を追加し、
 * メモベースで対応が残る項目を CSV に抽出する。
 *
 * 入力: argv[2] または Downloads/walking_bingo_master.xlsx
 * 出力: ROOT/walking_bingo_master_with_history.xlsx
 *       ROOT/walking_bingo_notes_pending.csv
 *       ROOT/walking_bingo_notes_pending.xlsx
 */
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const ROOT = path.join(__dirname, '..');
const NOTE_COL = 'notes（良し悪し等のメモ欄）';

const DEFAULT_SRC = path.join(
  process.env.USERPROFILE || '',
  'Downloads',
  'walking_bingo_master.xlsx'
);
const SRC = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_SRC;
const OUT_XLSX = path.join(ROOT, 'walking_bingo_master_with_history.xlsx');
const OUT_PENDING_CSV = path.join(ROOT, 'walking_bingo_notes_pending.csv');
const OUT_PENDING_XLSX = path.join(ROOT, 'walking_bingo_notes_pending.xlsx');

/** メモ反映済みリネーム（topics_list / assets と同期済み前提） */
const CHANGE_HISTORY = {
  110: 'アイコン／表示名「パン」→「パン屋さん」（メモ反映・マスタ同期済み）',
  112: 'アイコン／表示名「アイスクリーム」→「アイスクリーム屋さん」（同上）',
  113: 'アイコン／表示名「ドーナツ」→「ドーナツ屋さん」（同上）',
  114: 'アイコン／表示名「クッキー」→「クッキー屋さん」（同上）',
  118: 'アイコン／表示名「お弁当」→「お弁当屋さん」（同上）',
  119: 'アイコン／表示名「たい焼き」→「たい焼き屋さん」（同上）',
  120: 'アイコン／表示名「焼きいも」→「焼きいも屋さん」（同上）',
  166: 'アイコン／表示名「クリスマス飾り」→「リース」（同上）',
  177: 'アイコン／表示名「星プレート」→「星」（同上）',
  180: 'アイコン／表示名「しましま板」→「カラフル板」（同上）',
  223: 'アイコン／表示名「きのこ群」→「きのこ」（同上）',
  245: 'アイコン／表示名「マンホール周りの円形補修」→「補修されたマンホール」（同上）',
  274: 'アイコン／表示名「コンクリート側溝」→「フタなし側溝」（同上）',
  275: 'アイコン／表示名「丸い排水穴」→「水抜き穴」（同上）※イラスト描き直しは別途メモ参照',
  280: 'アイコン／表示名「集水ますのふた」→「集水ます」（同上）※イラストは別途メモ参照',
  426: 'アイコン／表示名「コンビニ外観」→「コンビニ」（同上）※比率調整は別途メモ参照',
};

/** メモに対してまだ手が要る内容のみ（名称変更メモで履歴列に済んだものは除外） */
function pendingSummary(note, num) {
  const t = String(note || '').trim();
  if (!t) return null;
  const tags = [];
  if (/描き直し/.test(t)) tags.push('イラスト描き直し');
  if (/重複/.test(t)) tags.push('重複の整理');
  if (/アイコン名/.test(t) && /変更/.test(t) && !CHANGE_HISTORY[num]) {
    tags.push('名称変更の検討・適用');
  }
  return tags.length ? tags.join('／') : null;
}

function escapeCsv(s) {
  const x = String(s ?? '');
  if (/[",\r\n]/.test(x)) return `"${x.replace(/"/g, '""')}"`;
  return x;
}

function main() {
  if (!fs.existsSync(SRC)) {
    console.error('見つかりません:', SRC);
    process.exit(1);
  }

  const wb = XLSX.readFile(SRC);
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  if (!aoa.length) throw new Error('empty sheet');

  const h0 = aoa[0].map((c) => String(c || '').trim());
  const ni = h0.indexOf(NOTE_COL);
  if (ni === -1) throw new Error(`列がありません: ${NOTE_COL}`);

  const newHeader = [...h0.slice(0, ni + 1), '変更履歴', ...h0.slice(ni + 1)];
  const newAoa = [newHeader];

  const pendingHeader = [
    'number',
    'icon_id',
    'display_name',
    NOTE_COL,
    '必要対応の概要',
  ];
  const pendingAoa = [pendingHeader];

  for (let r = 1; r < aoa.length; r++) {
    const old = aoa[r];
    const rowObj = {};
    h0.forEach((key, i) => {
      rowObj[key] = old[i] ?? '';
    });
    const num = Number(rowObj.number);
    const hist = CHANGE_HISTORY[num] || '';
    const note = String(rowObj[NOTE_COL] || '').trim();
    const follow = pendingSummary(note, num);
    if (follow) {
      pendingAoa.push([
        rowObj.number,
        rowObj.icon_id,
        rowObj.display_name,
        rowObj[NOTE_COL],
        follow,
      ]);
    }

    const newRow = newHeader.map((col) => {
      if (col === '変更履歴') return hist;
      return rowObj[col] ?? '';
    });
    newAoa.push(newRow);
  }

  const outWb = XLSX.utils.book_new();
  const outWs = XLSX.utils.aoa_to_sheet(newAoa);
  XLSX.utils.book_append_sheet(outWb, outWs, sheetName);
  XLSX.writeFile(outWb, OUT_XLSX);

  const csvBody = pendingAoa
    .map((row) => row.map((cell) => escapeCsv(cell)).join(','))
    .join('\r\n');
  fs.writeFileSync(OUT_PENDING_CSV, `\uFEFF${csvBody}`, 'utf8');

  const pendingWb = XLSX.utils.book_new();
  const pendingWs = XLSX.utils.aoa_to_sheet(pendingAoa);
  XLSX.utils.book_append_sheet(pendingWb, pendingWs, '対応必要メモ');
  XLSX.writeFile(pendingWb, OUT_PENDING_XLSX);

  console.log('出力:', OUT_XLSX);
  console.log('抽出 CSV:', OUT_PENDING_CSV, `(${pendingAoa.length - 1} 件)`);
  console.log('抽出 XLSX:', OUT_PENDING_XLSX);
}

main();
