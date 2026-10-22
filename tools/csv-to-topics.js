#!/usr/bin/env node
/**
 * CSV → topics.js 変換スクリプト
 *
 * topics_list.csv を読み込んで topics.js を自動生成します。
 *
 * 使い方:
 *   node tools/csv-to-topics.js
 *   npm run build-topics
 *
 * CSV形式:
 *   ID,icon_file_name,display_name,category,difficulty,season
 *
 * difficulty は文字列: easy | normal | hard | oni
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '..', 'topics_list.csv');
const OUTPUT_PATH = process.argv[3] ? path.resolve(process.argv[3]) : path.join(__dirname, '..', 'topics.js');

function trimCell(s) {
  if (!s) return '';
  return s.replace(/^﻿+/g, '').trim();
}

function parseCSV(csvText) {
  const records = [];
  let record = [], cell = '', quoted = false;
  for (let i = 0; i < csvText.length; i++) {
    const ch = csvText[i];
    if (quoted) {
      if (ch === '"' && csvText[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { record.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && csvText[i + 1] === '\n') i++;
      record.push(cell); cell = '';
      if (record.some(value => value !== '')) records.push(record);
      record = [];
    } else cell += ch;
  }
  if (quoted) throw new Error('Unterminated quoted CSV cell');
  record.push(cell);
  if (record.some(value => value !== '')) records.push(record);
  const headers = records.shift().map(trimCell);
  return records.map(values => {
    const row = {};
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    return row;
  });
}

const VALID_DIFFS = new Set(['easy', 'normal', 'hard', 'oni']);

function buildIconMap(rows) {
  const map = {};
  rows.forEach(row => {
    if (row['icon_file_name']) map[Number(row['ID'])] = row['icon_file_name'];
  });
  return map;
}

function generateTopicsJS(rows) {
  const iconMap = buildIconMap(rows);

  const groups = { easy: [], normal: [], hard: [], oni: [] };
  rows.forEach(row => {
    if (!Number.isSafeInteger(Number(row['ID'])) || Number(row['ID']) < 1) {
      throw new Error(`Invalid topic ID: ${JSON.stringify(row['ID'])}`);
    }
    const diff = VALID_DIFFS.has(row['difficulty']) ? row['difficulty'] : 'normal';
    groups[diff].push({
      id: Number(row['ID']),
      text: row['display_name'],
      icon: '🔍',
      category: row['category'],
      diff,
      season: row['season'] || 'all'
    });
  });

  const iconMapStr = Object.entries(iconMap)
    .map(([id, file]) => `  ${JSON.stringify(id)}: ${JSON.stringify(file)}`)
    .join(',\n');

  function topicArrayStr(arr) {
    return arr.map(t =>
      `    ${JSON.stringify(t)}`
    ).join(',\n');
  }

  const topicSetsBundled = fs.readFileSync(
    path.join(__dirname, 'topic-sets-bundled.txt'),
    'utf8'
  );

  return `// お散歩ビンゴ - お題データベース
// このファイルは tools/csv-to-topics.js で自動生成されています
// 編集する場合は topics_list.csv を更新して npm run build-topics を実行してください
// 生成日時: ${new Date().toISOString().slice(0, 19).replace('T', ' ')}

// お題ID → アイコン画像ファイル名（なければ絵文字フォールバック）
const topicIconMap = {
${iconMapStr}
};

function getTopicIcon(topic) {
  const unsafeIconChars = ['/', String.fromCharCode(92), '<', '>', '"', "'", String.fromCharCode(96)];
  const safeIconFile = (file) => typeof file === 'string' &&
    !unsafeIconChars.some(ch => file.includes(ch)) &&
    !Array.from(file).some(ch => ch.charCodeAt(0) < 32 || ch.charCodeAt(0) === 127) &&
    file.toLowerCase().endsWith('.png');
  const escapeIconText = (value) => String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const image = (file, landmark) =>
    \`<span class="cell-icon cell-icon-img-wrap"><img src="assets/icons/\${landmark ? 'landmark/' : ''}\${encodeURIComponent(file)}" alt="" class="cell-icon-img"></span>\`;
  if (topic.type === 'landmark') {
    if (safeIconFile(topic.iconFile)) return image(topic.iconFile, true);
  }
  const iconFile = topic.type !== 'landmark' &&
    Object.prototype.hasOwnProperty.call(topicIconMap, topic.id) && topicIconMap[topic.id];
  if (safeIconFile(iconFile)) {
    return image(iconFile, false);
  }
  return \`<span class="cell-icon">\${escapeIconText(topic.icon)}<\/span>\`;
}

// ランドマークDB（地域の特別スポット・準備中）
const landmarkDatabase = [
  {id: 'landmark001', text: 'ランドマーク①', iconFile: 'landmark001_自然.png', type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark002', text: 'ランドマーク②', iconFile: 'landmark002_歴史的施設.png', type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark003', text: 'ランドマーク③', iconFile: 'landmark003_最新施設.png', type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark004', text: 'ランドマーク④', iconFile: 'landmark004_観光地.png', type: 'landmark', category: 'ランドマーク'},
];

const topicDatabase = {
  // かんたん（${groups.easy.length}個）: よく見かけるもの
  easy: [
${topicArrayStr(groups.easy)}
  ],

  // ふつう（${groups.normal.length}個）: 少し探す必要があるもの
  normal: [
${topicArrayStr(groups.normal)}
  ],

  // むずかしい（${groups.hard.length}個）: よく観察しないと見つからないもの
  hard: [
${topicArrayStr(groups.hard)}
  ],

  // おに（${groups.oni.length}個）: 相当注意しないと見つからないもの
  oni: [
${topicArrayStr(groups.oni)}
  ]
};

${topicSetsBundled}
// 現在の季節を返す（3-5月:spring / 6-8月:summer / 9-11月:autumn / 12-2月:winter）
function getCurrentSeason() {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 9 && m <= 11) return 'autumn';
  return 'winter';
}

// 文字列からシード値を生成
function stringToSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// シード付きシャッフル（決定論的・Mulberry32）
function shuffleWithSeed(array, seed) {
  const arr = [...array];
  let currentSeed = seed;
  const random = () => {
    currentSeed = (currentSeed + 0x6D2B79F5) | 0;
    let t = Math.imul(currentSeed ^ (currentSeed >>> 15), 1 | currentSeed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 通常シャッフル
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ユーザーIDを生成・取得
function getUserId() {
  let userId = localStorage.getItem('osanpo_userId');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('osanpo_userId', userId);
  }
  return userId;
}
`;
}

function main() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error('❌ CSVファイルが見つかりません:', CSV_PATH);
    process.exit(1);
  }

  const csvText = fs.readFileSync(CSV_PATH, 'utf-8');
  const rows = parseCSV(csvText);
  console.log(`📖 ${rows.length} 件のお題を読み込みました`);

  const counts = { easy: 0, normal: 0, hard: 0, oni: 0 };
  rows.forEach(r => {
    const d = VALID_DIFFS.has(r['difficulty']) ? r['difficulty'] : 'normal';
    counts[d]++;
  });
  console.log(`   かんたん: ${counts.easy}個 / ふつう: ${counts.normal}個 / むずかしい: ${counts.hard}個 / おに: ${counts.oni}個`);

  const code = generateTopicsJS(rows);
  fs.writeFileSync(OUTPUT_PATH, code, 'utf-8');
  console.log(`✅ topics.js を生成しました (${(code.length / 1024).toFixed(1)} KB)`);
}

main();
