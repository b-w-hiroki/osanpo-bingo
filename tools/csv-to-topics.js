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
 *   ID,お題テキスト,絵文字,カテゴリ,難易度,文字数,アイコン画像,備考
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '..', 'topics_list.csv');
const OUTPUT_PATH = path.join(__dirname, '..', 'topics.js');

// CSV読み込み・パース
function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim());
  const headers = lines[0].replace(/^\uFEFF/, '').split(','); // BOM除去
  
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = {};
    headers.forEach((h, idx) => {
      row[h.trim()] = (values[idx] || '').trim();
    });
    rows.push(row);
  }
  return rows;
}

// 難易度名の変換
function difficultyKey(jpName) {
  const map = { 'かんたん': 'easy', 'ふつう': 'medium', 'むずかしい': 'hard' };
  return map[jpName] || 'easy';
}

// アイコンマッピング生成
function buildIconMap(rows) {
  const map = {};
  rows.forEach(row => {
    if (row['アイコン画像']) {
      map[row['ID']] = row['アイコン画像'];
    }
  });
  return map;
}

// topics.js のソースコードを生成
function generateTopicsJS(rows) {
  const iconMap = buildIconMap(rows);
  
  // グループ分け
  const groups = { easy: [], medium: [], hard: [] };
  rows.forEach(row => {
    const key = difficultyKey(row['難易度']);
    groups[key].push({
      id: parseInt(row['ID']),
      text: row['お題テキスト'],
      icon: row['絵文字'],
      category: row['カテゴリ']
    });
  });

  // iconMap のJSリテラル
  const iconMapEntries = Object.entries(iconMap)
    .map(([id, file]) => `  ${id}: '${file}'`)
    .join(',\n');

  // お題配列のJSリテラル
  function topicArrayStr(arr) {
    return arr.map(t => 
      `    {id: ${t.id}, text: '${t.text}', icon: '${t.icon}', category: '${t.category}'}`
    ).join(',\n');
  }

  const code = `// お散歩ビンゴ - お題データベース
// このファイルは tools/csv-to-topics.js で自動生成されています
// 編集する場合は topics_list.csv を更新して npm run build-topics を実行してください
// 生成日時: ${new Date().toISOString().slice(0, 19).replace('T', ' ')}

// お題ID → アイコン画像（画像ある場合のみ、なければ絵文字を使用）
const topicIconMap = {
${iconMapEntries}
};

function getTopicIcon(topic) {
  const iconFile = topic.id && topicIconMap[topic.id];
  if (iconFile) {
    return \`<span class="cell-icon cell-icon-img-wrap"><img src="assets/icons/\${iconFile}" alt="" class="cell-icon-img"></span>\`;
  }
  return \`<span class="cell-icon">\${topic.icon}</span>\`;
}

const topicDatabase = {
  // かんたん（${groups.easy.length}個） - よく見かけるもの
  easy: [
${topicArrayStr(groups.easy)}
  ],
  
  // ふつう（${groups.medium.length}個） - 少し探す必要があるもの
  medium: [
${topicArrayStr(groups.medium)}
  ],
  
  // むずかしい（${groups.hard.length}個） - レアなもの
  hard: [
${topicArrayStr(groups.hard)}
  ]
};

// 難易度に応じてお題を選択する関数
// shuffleSalt: 作り直し時に毎回異なるシャッフルにするため（省略時は合言葉で固定）
function selectTopicsByDifficulty(difficulty, roomCode = '', userId = '', shuffleSalt = '') {
  let selectedTopics = [];
  
  switch(difficulty) {
    case 'easy':
      // かんたん: easy のみから24個
      selectedTopics = [...topicDatabase.easy];
      break;
      
    case 'medium':
      // ふつう: easy 12個 + medium 12個
      selectedTopics = [
        ...topicDatabase.easy.slice(0, 12),
        ...topicDatabase.medium.slice(0, 12)
      ];
      break;
      
    case 'hard':
      // むずかしい: easy 8個 + medium 8個 + hard 8個
      selectedTopics = [
        ...topicDatabase.easy.slice(0, 8),
        ...topicDatabase.medium.slice(0, 8),
        ...topicDatabase.hard.slice(0, 8)
      ];
      break;
      
    default:
      selectedTopics = [...topicDatabase.easy];
  }
  
  // シャッフル（合言葉・ユーザーID・塩でシード生成。塩があれば毎回異なる並びに）
  const seedStr = [roomCode, userId, shuffleSalt].filter(Boolean).join('-');
  if (seedStr) {
    const seed = stringToSeed(seedStr);
    selectedTopics = shuffleWithSeed(selectedTopics, seed);
  } else {
    selectedTopics = shuffle(selectedTopics);
  }
  
  return selectedTopics.slice(0, 24); // FREE分を除いて24個
}

// 文字列からシード値を生成
function stringToSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit整数に変換
  }
  return Math.abs(hash);
}

// シード付きシャッフル（決定論的）
function shuffleWithSeed(array, seed) {
  const arr = [...array];
  let currentSeed = seed;
  
  // Mulberry32 アルゴリズム（高速な疑似乱数生成）
  const random = () => {
    currentSeed = (currentSeed + 0x6D2B79F5) | 0;
    let t = Math.imul(currentSeed ^ (currentSeed >>> 15), 1 | currentSeed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  
  // Fisher-Yates シャッフル
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  
  return arr;
}

// 通常のシャッフル（ランダム）
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

  return code;
}

// メイン処理
function main() {
  // CSV読み込み
  if (!fs.existsSync(CSV_PATH)) {
    console.error('❌ CSVファイルが見つかりません:', CSV_PATH);
    process.exit(1);
  }
  
  let csvText = fs.readFileSync(CSV_PATH, 'utf-8');
  // Excelで開いても文字化けしないよう UTF-8 BOM を付与（なければ付ける）
  if (!csvText.startsWith('\uFEFF')) {
    fs.writeFileSync(CSV_PATH, '\uFEFF' + csvText, 'utf-8');
    csvText = '\uFEFF' + csvText;
  }
  const rows = parseCSV(csvText);
  
  console.log(`📖 ${rows.length} 件のお題を読み込みました`);
  
  // 難易度別カウント
  const counts = { 'かんたん': 0, 'ふつう': 0, 'むずかしい': 0 };
  rows.forEach(r => { if (counts[r['難易度']] !== undefined) counts[r['難易度']]++; });
  console.log(`   かんたん: ${counts['かんたん']}個 / ふつう: ${counts['ふつう']}個 / むずかしい: ${counts['むずかしい']}個`);
  
  // topics.js 生成
  const code = generateTopicsJS(rows);
  fs.writeFileSync(OUTPUT_PATH, code, 'utf-8');
  
  console.log(`✅ topics.js を生成しました (${(code.length / 1024).toFixed(1)} KB)`);
}

main();
