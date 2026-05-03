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
 * CSV形式 (新フォーマット):
 *   ID,icon_file_name,display_name,category,difficulty,spawn_permyriad
 *
 * difficulty は星表記: ★☆☆☆☆ / ★★☆☆☆ / ★★★☆☆ / ★★★★☆ / ★★★★★
 *   → ★1-2: easy（かんたん）
 *   → ★3:   medium（ふつう）
 *   → ★4-5: hard（むずかしい）
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '..', 'topics_list.csv');
const OUTPUT_PATH = path.join(__dirname, '..', 'topics.js');

// BOM除去 & トリム
function trimCell(s) {
  if (!s) return '';
  return s.replace(/^﻿+/g, '').replace(/^\\uFEFF/i, '').trim();
}

// CSV パース
function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(l => l.trim());
  const headers = trimCell(lines[0]).split(',').map(trimCell);
  return lines.slice(1).map(line => {
    const values = line.split(',').map(trimCell);
    const row = {};
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    return row;
  });
}

// 星表記 → 難易度キー
function starsToDifficulty(stars) {
  const count = (stars.match(/★/g) || []).length;
  if (count <= 2) return 'easy';
  if (count === 3) return 'medium';
  return 'hard';
}

// アイコンマップ生成: {ID: icon_file_name}
function buildIconMap(rows) {
  const map = {};
  rows.forEach(row => {
    if (row['icon_file_name']) map[row['ID']] = row['icon_file_name'];
  });
  return map;
}

// topics.js 生成
function generateTopicsJS(rows) {
  const iconMap = buildIconMap(rows);

  // 難易度別グループ
  const groups = { easy: [], medium: [], hard: [] };
  rows.forEach(row => {
    const diff = starsToDifficulty(row['difficulty']);
    const starCount = (row['difficulty'].match(/★/g) || []).length;
    groups[diff].push({
      id: parseInt(row['ID']),
      text: row['display_name'],
      icon: '🔍',
      category: row['category'],
      weight: parseInt(row['spawn_permyriad']) || 1000,
      diff: diff,
      stars: starCount,
      season: row['season'] || 'all'
    });
  });

  // iconMap JS リテラル
  const iconMapStr = Object.entries(iconMap)
    .map(([id, file]) => `  ${id}: '${file}'`)
    .join(',\n');

  // お題配列 JS リテラル
  function topicArrayStr(arr) {
    return arr.map(t =>
      `    {id: ${t.id}, text: '${t.text}', icon: '${t.icon}', category: '${t.category}', weight: ${t.weight}, diff: '${t.diff}', stars: ${t.stars}, season: '${t.season}'}`
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
  if (topic.type === 'landmark') {
    return \`<span class="cell-icon cell-icon-img-wrap"><img src="assets/icons/landmark/\${topic.iconFile}" alt="" class="cell-icon-img"></span>\`;
  }
  const iconFile = topic.id && topicIconMap[topic.id];
  if (iconFile) {
    return \`<span class="cell-icon cell-icon-img-wrap"><img src="assets/icons/\${iconFile}" alt="" class="cell-icon-img"></span>\`;
  }
  return \`<span class="cell-icon">\${topic.icon}</span>\`;
}

// ランドマークDB（お城・神社など地域の特別スポット）
const landmarkDatabase = [
  {id: 'landmark0100', text: '姫路城',       iconFile: 'landmark0100_姫路城.png',       type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0101', text: '松本城',       iconFile: 'landmark0101_松本城.png',       type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0102', text: '大阪城',       iconFile: 'landmark0102_大阪城.png',       type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0103', text: '名古屋城',     iconFile: 'landmark0103_名古屋城.png',     type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0104', text: '熊本城',       iconFile: 'landmark0104_熊本城.png',       type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0105', text: '松江城',       iconFile: 'landmark0105_松江城.png',       type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0106', text: '犬山城',       iconFile: 'landmark0106_犬山城.png',       type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0107', text: '彦根城',       iconFile: 'landmark0107_彦根城.png',       type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0108', text: '二条城',       iconFile: 'landmark0108_二条城.png',       type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0109', text: '松山城',       iconFile: 'landmark0109_松山城.png',       type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0110', text: '弘前城',       iconFile: 'landmark0110_弘前城.png',       type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0111', text: '小田原城',     iconFile: 'landmark0111_小田原城.png',     type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0112', text: '岡山城',       iconFile: 'landmark0112_岡山城.png',       type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0113', text: '高知城',       iconFile: 'landmark0113_高知城.png',       type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0114', text: '会津若松城',   iconFile: 'landmark0114_会津若松城.png',   type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0115', text: '首里城',       iconFile: 'landmark0115_首里城.png',       type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0200', text: '伏見稲荷大社', iconFile: 'landmark0200_伏見稲荷大社.png', type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0201', text: '厳島神社',     iconFile: 'landmark0201_厳島神社.png',     type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0202', text: '出雲大社',     iconFile: 'landmark0202_出雲大社.png',     type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0203', text: '明治神宮',     iconFile: 'landmark0203_明治神宮.png',     type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0204', text: '日光東照宮',   iconFile: 'landmark0204_日光東照宮.png',   type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0205', text: '宇佐神宮',     iconFile: 'landmark0205_宇佐神宮.png',     type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0207', text: '太宰府天満宮', iconFile: 'landmark0207_太宰府天満宮.png', type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0208', text: '氷川神社',     iconFile: 'landmark0208_氷川神社.png',     type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0209', text: '鹿島神宮',     iconFile: 'landmark0209_鹿島神宮.png',     type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0212', text: '住吉大社',     iconFile: 'landmark0212_住吉大社.png',     type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0213', text: '吉野神宮',     iconFile: 'landmark0213_吉野神宮.png',     type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark0206', text: '春日大社',     iconFile: 'landmark206_春日大社.png',      type: 'landmark', category: 'ランドマーク'},
];

const topicDatabase = {
  // かんたん（${groups.easy.length}個） ★1-2: よく見かけるもの
  easy: [
${topicArrayStr(groups.easy)}
  ],

  // ふつう（${groups.medium.length}個） ★3: 少し探す必要があるもの
  medium: [
${topicArrayStr(groups.medium)}
  ],

  // むずかしい（${groups.hard.length}個） ★4-5: よく観察しないと見つからないもの
  hard: [
${topicArrayStr(groups.hard)}
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

// メイン処理
function main() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error('❌ CSVファイルが見つかりません:', CSV_PATH);
    process.exit(1);
  }

  let csvText = fs.readFileSync(CSV_PATH, 'utf-8');
  if (!csvText.startsWith('﻿')) {
    fs.writeFileSync(CSV_PATH, '﻿' + csvText, 'utf-8');
    csvText = '﻿' + csvText;
  }

  const rows = parseCSV(csvText);
  console.log(`📖 ${rows.length} 件のお題を読み込みました`);

  const counts = { easy: 0, medium: 0, hard: 0 };
  rows.forEach(r => { counts[starsToDifficulty(r['difficulty'])]++; });
  console.log(`   かんたん: ${counts.easy}個 / ふつう: ${counts.medium}個 / むずかしい: ${counts.hard}個`);

  const code = generateTopicsJS(rows);
  fs.writeFileSync(OUTPUT_PATH, code, 'utf-8');
  console.log(`✅ topics.js を生成しました (${(code.length / 1024).toFixed(1)} KB)`);
}

main();
