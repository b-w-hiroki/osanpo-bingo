// お散歩ビンゴ - お題データベース
// このファイルは tools/csv-to-topics.js で自動生成されています
// 編集する場合は topics_list.csv を更新して npm run build-topics を実行してください
// 生成日時: 2026-02-13 08:44:12

// お題ID → アイコン画像（画像ある場合のみ、なければ絵文字を使用）
const topicIconMap = {
  undefined: 'icon-hito.png'
};

function getTopicIcon(topic) {
  const iconFile = topic.id && topicIconMap[topic.id];
  if (iconFile) {
    return `<span class="cell-icon cell-icon-img-wrap"><img src="assets/icons/${iconFile}" alt="" class="cell-icon-img"></span>`;
  }
  return `<span class="cell-icon">${topic.icon}</span>`;
}

const topicDatabase = {
  // かんたん（40個） - よく見かけるもの
  easy: [
    {id: NaN, text: 'ネコ', icon: '🐱', category: '動物'},
    {id: NaN, text: '犬', icon: '🐶', category: '動物'},
    {id: NaN, text: '花', icon: '🌸', category: '植物'},
    {id: NaN, text: '木', icon: '🌳', category: '植物'},
    {id: NaN, text: '鳥', icon: '🐦', category: '動物'},
    {id: NaN, text: '車', icon: '🚗', category: '乗り物'},
    {id: NaN, text: '自転車', icon: '🚲', category: '乗り物'},
    {id: NaN, text: '家', icon: '🏠', category: '建物'},
    {id: NaN, text: '空', icon: '☁️', category: '自然'},
    {id: NaN, text: '雲', icon: '☁️', category: '自然'},
    {id: NaN, text: '太陽', icon: '☀️', category: '自然'},
    {id: NaN, text: '公園', icon: '🏞️', category: '場所'},
    {id: NaN, text: 'ベンチ', icon: '🪑', category: '物'},
    {id: NaN, text: '信号', icon: '🚦', category: '物'},
    {id: NaN, text: '橋', icon: '🌉', category: '建物'},
    {id: NaN, text: '川', icon: '🏞️', category: '自然'},
    {id: NaN, text: '石', icon: '🪨', category: '自然'},
    {id: NaN, text: '草', icon: '🌿', category: '植物'},
    {id: NaN, text: '葉っぱ', icon: '🍃', category: '植物'},
    {id: NaN, text: '子供', icon: '👶', category: '人'},
    {id: NaN, text: '赤い物', icon: '🔴', category: '色'},
    {id: NaN, text: '青い物', icon: '🔵', category: '色'},
    {id: NaN, text: '黄色い物', icon: '🟡', category: '色'},
    {id: NaN, text: '丸い物', icon: '⚪', category: '形'},
    {id: NaN, text: '三角の物', icon: '🔺', category: '形'},
    {id: NaN, text: '四角の物', icon: '🟦', category: '形'},
    {id: NaN, text: '大きい物', icon: '📏', category: '大きさ'},
    {id: NaN, text: '小さい物', icon: '🔬', category: '大きさ'},
    {id: NaN, text: '水', icon: '💧', category: '自然'},
    {id: NaN, text: '影', icon: '🌑', category: '自然'},
    {id: NaN, text: '光', icon: '💡', category: '自然'},
    {id: NaN, text: '音がする物', icon: '🔊', category: '感覚'},
    {id: NaN, text: 'いい匂い', icon: '👃', category: '感覚'},
    {id: NaN, text: '風', icon: '💨', category: '自然'},
    {id: NaN, text: '暖かい場所', icon: '🌡️', category: '場所'},
    {id: NaN, text: '涼しい場所', icon: '❄️', category: '場所'},
    {id: NaN, text: '道', icon: '🛣️', category: '場所'},
    {id: NaN, text: '門', icon: '🚪', category: '物'},
    {id: NaN, text: '窓', icon: '🪟', category: '物'},
    {id: NaN, text: '人', icon: '👤', category: '人'}
  ],
  
  // ふつう（40個） - 少し探す必要があるもの
  medium: [
    {id: NaN, text: '看板', icon: '🪧', category: '物'},
    {id: NaN, text: '郵便ポスト', icon: '📮', category: '物'},
    {id: NaN, text: '自販機', icon: '🥤', category: '物'},
    {id: NaN, text: 'コンビニ', icon: '🏪', category: '場所'},
    {id: NaN, text: 'バス停', icon: '🚏', category: '場所'},
    {id: NaN, text: '電車', icon: '🚃', category: '乗り物'},
    {id: NaN, text: '踏切', icon: '🚧', category: '場所'},
    {id: NaN, text: '神社', icon: '⛩️', category: '場所'},
    {id: NaN, text: 'お寺', icon: '🛕', category: '場所'},
    {id: NaN, text: '鳥居', icon: '⛩️', category: '物'},
    {id: NaN, text: '像', icon: '🗿', category: '物'},
    {id: NaN, text: '噴水', icon: '⛲', category: '物'},
    {id: NaN, text: '階段', icon: '🪜', category: '物'},
    {id: NaN, text: '坂道', icon: '⛰️', category: '場所'},
    {id: NaN, text: 'トンネル', icon: '🚇', category: '場所'},
    {id: NaN, text: '線路', icon: '🛤️', category: '場所'},
    {id: NaN, text: '工事現場', icon: '🚧', category: '場所'},
    {id: NaN, text: 'マンホール', icon: '⚙️', category: '物'},
    {id: NaN, text: '街灯', icon: '💡', category: '物'},
    {id: NaN, text: '標識', icon: '🚸', category: '物'},
    {id: NaN, text: '歩道橋', icon: '🌉', category: '建物'},
    {id: NaN, text: '駐車場', icon: '🅿️', category: '場所'},
    {id: NaN, text: '駐輪場', icon: '🚲', category: '場所'},
    {id: NaN, text: 'ゴミ箱', icon: '🗑️', category: '物'},
    {id: NaN, text: 'ポスター', icon: '📋', category: '物'},
    {id: NaN, text: '地図', icon: '🗺️', category: '物'},
    {id: NaN, text: '時計', icon: '🕐', category: '物'},
    {id: NaN, text: 'カラス', icon: '🐦‍⬛', category: '動物'},
    {id: NaN, text: '鳩', icon: '🕊️', category: '動物'},
    {id: NaN, text: '蝶', icon: '🦋', category: '動物'},
    {id: NaN, text: '虫', icon: '🐛', category: '動物'},
    {id: NaN, text: 'アリ', icon: '🐜', category: '動物'},
    {id: NaN, text: '桜', icon: '🌸', category: '植物'},
    {id: NaN, text: '紅葉', icon: '🍁', category: '植物'},
    {id: NaN, text: 'どんぐり', icon: '🌰', category: '物'},
    {id: NaN, text: 'つくし', icon: '🌱', category: '植物'},
    {id: NaN, text: '落ち葉', icon: '🍂', category: '物'},
    {id: NaN, text: '水たまり', icon: '💧', category: '自然'},
    {id: NaN, text: '霧', icon: '🌫️', category: '自然'},
    {id: NaN, text: '月', icon: '🌙', category: '自然'}
  ],
  
  // むずかしい（40個） - レアなもの
  hard: [
    {id: NaN, text: '虹', icon: '🌈', category: '自然'},
    {id: NaN, text: '流れ星', icon: '💫', category: '自然'},
    {id: NaN, text: 'キャンピングカー', icon: '🚐', category: '乗り物'},
    {id: NaN, text: '消防車', icon: '🚒', category: '乗り物'},
    {id: NaN, text: '救急車', icon: '🚑', category: '乗り物'},
    {id: NaN, text: 'パトカー', icon: '🚓', category: '乗り物'},
    {id: NaN, text: 'オートバイ', icon: '🏍️', category: '乗り物'},
    {id: NaN, text: 'トラック', icon: '🚚', category: '乗り物'},
    {id: NaN, text: 'タクシー', icon: '🚕', category: '乗り物'},
    {id: NaN, text: 'バス', icon: '🚌', category: '乗り物'},
    {id: NaN, text: '珍しい鳥', icon: '🦜', category: '動物'},
    {id: NaN, text: 'リス', icon: '🐿️', category: '動物'},
    {id: NaN, text: 'ウサギ', icon: '🐰', category: '動物'},
    {id: NaN, text: 'カメ', icon: '🐢', category: '動物'},
    {id: NaN, text: 'カエル', icon: '🐸', category: '動物'},
    {id: NaN, text: 'トカゲ', icon: '🦎', category: '動物'},
    {id: NaN, text: '魚', icon: '🐟', category: '動物'},
    {id: NaN, text: 'アヒル', icon: '🦆', category: '動物'},
    {id: NaN, text: '白鳥', icon: '🦢', category: '動物'},
    {id: NaN, text: 'フクロウ', icon: '🦉', category: '動物'},
    {id: NaN, text: '城', icon: '🏯', category: '建物'},
    {id: NaN, text: '塔', icon: '🗼', category: '建物'},
    {id: NaN, text: '灯台', icon: '🗼', category: '建物'},
    {id: NaN, text: '風車', icon: '🌬️', category: '建物'},
    {id: NaN, text: '水車', icon: '⚙️', category: '物'},
    {id: NaN, text: '滝', icon: '💦', category: '自然'},
    {id: NaN, text: '洞窟', icon: '🕳️', category: '場所'},
    {id: NaN, text: '池', icon: '💧', category: '自然'},
    {id: NaN, text: '湖', icon: '🏞️', category: '自然'},
    {id: NaN, text: '海', icon: '🌊', category: '自然'},
    {id: NaN, text: '山', icon: '⛰️', category: '自然'},
    {id: NaN, text: '森', icon: '🌲', category: '自然'},
    {id: NaN, text: '竹林', icon: '🎋', category: '場所'},
    {id: NaN, text: '梅', icon: '🌺', category: '植物'},
    {id: NaN, text: '藤', icon: '💜', category: '植物'},
    {id: NaN, text: '紫陽花', icon: '💙', category: '植物'},
    {id: NaN, text: '向日葵', icon: '🌻', category: '植物'},
    {id: NaN, text: 'コスモス', icon: '🌸', category: '植物'},
    {id: NaN, text: '彼岸花', icon: '🌹', category: '植物'},
    {id: NaN, text: '四つ葉のクローバー', icon: '🍀', category: '植物'}
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
