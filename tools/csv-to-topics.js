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
    groups[diff].push({
      id: parseInt(row['ID']),
      text: row['display_name'],
      icon: '🔍',
      category: row['category'],
      weight: parseInt(row['spawn_permyriad']) || 1000
    });
  });

  // iconMap JS リテラル
  const iconMapStr = Object.entries(iconMap)
    .map(([id, file]) => `  ${id}: '${file}'`)
    .join(',\n');

  // お題配列 JS リテラル
  function topicArrayStr(arr) {
    return arr.map(t =>
      `    {id: ${t.id}, text: '${t.text}', icon: '${t.icon}', category: '${t.category}', weight: ${t.weight}}`
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
  const iconFile = topic.id && topicIconMap[topic.id];
  if (iconFile) {
    return \`<span class="cell-icon cell-icon-img-wrap"><img src="assets/icons/\${iconFile}" alt="" class="cell-icon-img"></span>\`;
  }
  return \`<span class="cell-icon">\${topic.icon}</span>\`;
}

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
