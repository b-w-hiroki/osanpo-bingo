#!/usr/bin/env node
/**
 * walking_bingo_master.csv + topics_list.csv + アイコン実体（ZIP・landmark）
 * を突合し、統合マスタ Excel を出力する。
 *
 * ルール:
 * - osanpo / number 1–548: icon_file_name は osanpo-icon ZIP のファイル名を正とする
 * - landmark: icon_file_name は assets/icons/landmark 上の実ファイルを正とする
 * - display_name, category, difficulty（星）, spawn_permyriad, season は topics_list.csv（アプリマスタ）を正とする
 * - walking の拡張列（region_tags 等）は walking を維持
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const ROOT = path.join(__dirname, '..');
const DEFAULT_WALKING = path.join(process.env.USERPROFILE || '', 'Downloads', 'walking_bingo_master.csv');
const WALKING_CSV = process.argv[2] || DEFAULT_WALKING;
const TOPICS_CSV = path.join(ROOT, 'topics_list.csv');
const ZIP_DIR = path.join(ROOT, '_osanpo-icon-extract', 'osanpo-icon');
const LANDMARK_DIR = path.join(ROOT, 'assets', 'icons', 'landmark');
const OUT_XLSX = path.join(ROOT, 'walking_bingo_master_merged.xlsx');

const WALKING_COLS = 15;

function stripBom(s) {
  return s.replace(/^\uFEFF/, '');
}

function parseWalkingLine(line) {
  const parts = line.split(',');
  while (parts.length < WALKING_COLS) parts.push('');
  if (parts.length > WALKING_COLS) {
    const tail = parts.slice(14).join(',');
    parts.splice(14, parts.length - 14, tail);
  }
  return parts;
}

function loadZipIcons() {
  if (!fs.existsSync(ZIP_DIR)) {
    console.warn('ZIP展開先が見つかりません:', ZIP_DIR);
    return {};
  }
  const map = {};
  for (const f of fs.readdirSync(ZIP_DIR)) {
    if (!f.endsWith('.png')) continue;
    const m = f.match(/^icon(\d+)_/);
    if (m) map[parseInt(m[1], 10)] = f;
  }
  return map;
}

function loadLandmarkFiles() {
  if (!fs.existsSync(LANDMARK_DIR)) return [];
  return fs.readdirSync(LANDMARK_DIR).filter((f) => f.endsWith('.png'));
}

function resolveLandmarkIcon(iconId, currentFile, landFiles) {
  const tryPrefixes = [iconId];
  const m = iconId && iconId.match(/^landmark0*(\d+)$/);
  if (m) {
    const n = parseInt(m[1], 10);
    tryPrefixes.push(`landmark${n}`);
  }
  for (const pre of tryPrefixes) {
    const hit = landFiles.find((f) => f.startsWith(`${pre}_`));
    if (hit) return hit;
  }
  return currentFile;
}

function loadTopics() {
  const text = stripBom(fs.readFileSync(TOPICS_CSV, 'utf8'));
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const map = {};
  for (let i = 1; i < lines.length; i++) {
    const a = lines[i].split(',');
    const id = parseInt(a[0], 10);
    if (Number.isNaN(id)) continue;
    const stars = a[4] || '';
    const level = (stars.match(/★/g) || []).length;
    map[id] = {
      icon_file_name: a[1],
      display_name: a[2],
      category: a[3],
      difficulty: stars,
      spawn_permyriad: a[5],
      season: a[6] || '',
      difficulty_level: String(level),
    };
  }
  return map;
}

function starLevel(difficultyCell) {
  return String((difficultyCell.match(/★/g) || []).length);
}

function main() {
  if (!fs.existsSync(WALKING_CSV)) {
    console.error('見つかりません:', WALKING_CSV);
    process.exit(1);
  }

  const zipIcons = loadZipIcons();
  const landFiles = loadLandmarkFiles();
  const topics = loadTopics();

  const walkText = stripBom(fs.readFileSync(WALKING_CSV, 'utf8'));
  const walkLines = walkText.split(/\r?\n/).filter((l) => l.trim());
  const header = parseWalkingLine(walkLines[0]);
  const mergedHeader = [...header, 'season'];

  const aoa = [mergedHeader];
  let iconFixes = 0;
  let topicFieldFixes = 0;

  for (let i = 1; i < walkLines.length; i++) {
    const row = parseWalkingLine(walkLines[i]);
    const [assetType, iconId, numStr] = row;
    const num = parseInt(numStr, 10);

    if (assetType === 'osanpo' && topics[num]) {
      const t = topics[num];
      if (zipIcons[num] && row[3] !== zipIcons[num]) {
        row[3] = zipIcons[num];
        iconFixes++;
      }
      if (row[4] !== t.display_name) {
        row[4] = t.display_name;
        topicFieldFixes++;
      }
      if (row[5] !== t.category) {
        row[5] = t.category;
        topicFieldFixes++;
      }
      if (row[7] !== t.difficulty) {
        row[7] = t.difficulty;
        topicFieldFixes++;
      }
      const lvl = t.difficulty_level;
      if (row[6] !== lvl) {
        row[6] = lvl;
        topicFieldFixes++;
      }
      if (row[8] !== t.spawn_permyriad) {
        row[8] = t.spawn_permyriad;
        topicFieldFixes++;
      }
      row.push(t.season);
    } else if (assetType === 'landmark') {
      const resolved = resolveLandmarkIcon(iconId, row[3], landFiles);
      if (resolved !== row[3]) {
        row[3] = resolved;
        iconFixes++;
      }
      row.push('');
    } else {
      row.push('');
    }

    aoa.push(row);
  }

  const has0213 = walkLines.some((l) => l.includes('landmark0213'));
  if (!has0213 && landFiles.some((f) => f.startsWith('landmark0213_'))) {
    const extra = parseWalkingLine(
      'landmark,landmark0213,213,landmark0213_吉野神宮.png,吉野神宮,ランドマーク・神社,5,★★★★★,150,community|roadside,landmark|rare|shrine|temple|tourism,TRUE,300,FALSE,ランドマーク専用プール推奨'
    );
    extra[3] = resolveLandmarkIcon('landmark0213', extra[3], landFiles);
    extra.push('');
    aoa.push(extra);
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  XLSX.utils.book_append_sheet(wb, ws, '統合マスタ');

  const legend = [
    ['項目', '内容'],
    [
      'walking_bingo_master.csv',
      '土台。asset_type / region_tags / category_tags など拡張列の原本。',
    ],
    ['topics_list.csv', 'ゲーム用マスタ。表示名・カテゴリ・難易度・重み・season を正とする。'],
    ['osanpo-icon ZIP', 'icon001–548 の icon_file_name（実ファイル名・Unicode正規形）を正とする。'],
    ['assets/icons/landmark', 'ランドマークの icon_file_name（実ファイル名）を正とする。'],
    [
      '今回の修正件数（参考）',
      `icon_file_name 置換: ${iconFixes} フィールド / topics 同期によるセル更新回数: ${topicFieldFixes}`,
    ],
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(legend);
  XLSX.utils.book_append_sheet(wb, ws2, '突合ルール');

  XLSX.writeFile(wb, OUT_XLSX);
  console.log('出力:', OUT_XLSX);
  console.log('icon_file_name 修正件数:', iconFixes, '/ topics 由来フィールド更新回数:', topicFieldFixes);
}

main();
