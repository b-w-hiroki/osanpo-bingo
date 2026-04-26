// お散歩ビンゴ - お題データベース
// このファイルは tools/csv-to-topics.js で自動生成されています
// 編集する場合は topics_list.csv を更新して npm run build-topics を実行してください
// 生成日時: 2026-04-25 03:51:21

// お題ID → アイコン画像（画像ある場合のみ、なければ絵文字を使用）
const topicIconMap = {
  1: 'icon-neko.png',
  2: 'icon-inu.png',
  3: 'icon-hana.png',
  4: 'icon-ki.png',
  5: 'icon-tori.png',
  6: 'icon-kuruma.png',
  7: 'icon-jitensha.png',
  8: 'icon-ie.png',
  9: 'icon-kumo.png',
  10: 'icon-kumo.png',
  11: 'icon-taiyou.png',
  12: 'icon-koen.png',
  13: 'icon-bench.png',
  14: 'icon-shingou.png',
  15: 'icon-hashi.png',
  16: 'icon-mizu.png',
  17: 'icon-ishi.png',
  18: 'icon-kusa.png',
  19: 'icon-happa.png',
  20: 'icon-kodomo.png',
  40: 'icon-hito.png'
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
    {id: 1, text: 'ネコ', icon: '🐱', category: '動物'},
    {id: 2, text: '犬', icon: '🐶', category: '動物'},
    {id: 3, text: '花', icon: '🌸', category: '植物'},
    {id: 4, text: '木', icon: '🌳', category: '植物'},
    {id: 5, text: '鳥', icon: '🐦', category: '動物'},
    {id: 6, text: '車', icon: '🚗', category: '乗り物'},
    {id: 7, text: '自転車', icon: '🚲', category: '乗り物'},
    {id: 8, text: '家', icon: '🏠', category: '建物'},
    {id: 9, text: '空', icon: '☁️', category: '自然'},
    {id: 10, text: '雲', icon: '☁️', category: '自然'},
    {id: 11, text: '太陽', icon: '☀️', category: '自然'},
    {id: 12, text: '公園', icon: '🏞️', category: '場所'},
    {id: 13, text: 'ベンチ', icon: '🪑', category: '物'},
    {id: 14, text: '信号', icon: '🚦', category: '物'},
    {id: 15, text: '橋', icon: '🌉', category: '建物'},
    {id: 16, text: '川', icon: '🏞️', category: '自然'},
    {id: 17, text: '石', icon: '🪨', category: '自然'},
    {id: 18, text: '草', icon: '🌿', category: '植物'},
    {id: 19, text: '葉っぱ', icon: '🍃', category: '植物'},
    {id: 20, text: '子供', icon: '👶', category: '人'},
    {id: 21, text: '赤い物', icon: '🔴', category: '色'},
    {id: 22, text: '青い物', icon: '🔵', category: '色'},
    {id: 23, text: '黄色い物', icon: '🟡', category: '色'},
    {id: 24, text: '丸い物', icon: '⚪', category: '形'},
    {id: 25, text: '三角の物', icon: '🔺', category: '形'},
    {id: 26, text: '四角の物', icon: '🟦', category: '形'},
    {id: 27, text: '大きい物', icon: '📏', category: '大きさ'},
    {id: 28, text: '小さい物', icon: '🔬', category: '大きさ'},
    {id: 29, text: '水', icon: '💧', category: '自然'},
    {id: 30, text: '影', icon: '🌑', category: '自然'},
    {id: 31, text: '光', icon: '💡', category: '自然'},
    {id: 32, text: '音がする物', icon: '🔊', category: '感覚'},
    {id: 33, text: 'いい匂い', icon: '👃', category: '感覚'},
    {id: 34, text: '風', icon: '💨', category: '自然'},
    {id: 35, text: '暖かい場所', icon: '🌡️', category: '場所'},
    {id: 36, text: '涼しい場所', icon: '❄️', category: '場所'},
    {id: 37, text: '道', icon: '🛣️', category: '場所'},
    {id: 38, text: '門', icon: '🚪', category: '物'},
    {id: 39, text: '窓', icon: '🪟', category: '物'},
    {id: 40, text: '人', icon: '👤', category: '人'}
  ],
  
  // ふつう（40個） - 少し探す必要があるもの
  medium: [
    {id: 41, text: '看板', icon: '🪧', category: '物'},
    {id: 42, text: '郵便ポスト', icon: '📮', category: '物'},
    {id: 43, text: '自販機', icon: '🥤', category: '物'},
    {id: 44, text: 'コンビニ', icon: '🏪', category: '場所'},
    {id: 45, text: 'バス停', icon: '🚏', category: '場所'},
    {id: 46, text: '電車', icon: '🚃', category: '乗り物'},
    {id: 47, text: '踏切', icon: '🚧', category: '場所'},
    {id: 48, text: '神社', icon: '⛩️', category: '場所'},
    {id: 49, text: 'お寺', icon: '🛕', category: '場所'},
    {id: 50, text: '鳥居', icon: '⛩️', category: '物'},
    {id: 51, text: '像', icon: '🗿', category: '物'},
    {id: 52, text: '噴水', icon: '⛲', category: '物'},
    {id: 53, text: '階段', icon: '🪜', category: '物'},
    {id: 54, text: '坂道', icon: '⛰️', category: '場所'},
    {id: 55, text: 'トンネル', icon: '🚇', category: '場所'},
    {id: 56, text: '線路', icon: '🛤️', category: '場所'},
    {id: 57, text: '工事現場', icon: '🚧', category: '場所'},
    {id: 58, text: 'マンホール', icon: '⚙️', category: '物'},
    {id: 59, text: '街灯', icon: '💡', category: '物'},
    {id: 60, text: '標識', icon: '🚸', category: '物'},
    {id: 61, text: '歩道橋', icon: '🌉', category: '建物'},
    {id: 62, text: '駐車場', icon: '🅿️', category: '場所'},
    {id: 63, text: '駐輪場', icon: '🚲', category: '場所'},
    {id: 64, text: 'ゴミ箱', icon: '🗑️', category: '物'},
    {id: 65, text: 'ポスター', icon: '📋', category: '物'},
    {id: 66, text: '地図', icon: '🗺️', category: '物'},
    {id: 67, text: '時計', icon: '🕐', category: '物'},
    {id: 68, text: 'カラス', icon: '🐦‍⬛', category: '動物'},
    {id: 69, text: '鳩', icon: '🕊️', category: '動物'},
    {id: 70, text: '蝶', icon: '🦋', category: '動物'},
    {id: 71, text: '虫', icon: '🐛', category: '動物'},
    {id: 72, text: 'アリ', icon: '🐜', category: '動物'},
    {id: 73, text: '桜', icon: '🌸', category: '植物'},
    {id: 74, text: '紅葉', icon: '🍁', category: '植物'},
    {id: 75, text: 'どんぐり', icon: '🌰', category: '物'},
    {id: 76, text: 'つくし', icon: '🌱', category: '植物'},
    {id: 77, text: '落ち葉', icon: '🍂', category: '物'},
    {id: 78, text: '水たまり', icon: '💧', category: '自然'},
    {id: 79, text: '霧', icon: '🌫️', category: '自然'},
    {id: 80, text: '月', icon: '🌙', category: '自然'}
  ],
  
  // むずかしい（40個） - レアなもの
  hard: [
    {id: 81, text: '虹', icon: '🌈', category: '自然'},
    {id: 82, text: '流れ星', icon: '💫', category: '自然'},
    {id: 83, text: 'キャンピングカー', icon: '🚐', category: '乗り物'},
    {id: 84, text: '消防車', icon: '🚒', category: '乗り物'},
    {id: 85, text: '救急車', icon: '🚑', category: '乗り物'},
    {id: 86, text: 'パトカー', icon: '🚓', category: '乗り物'},
    {id: 87, text: 'オートバイ', icon: '🏍️', category: '乗り物'},
    {id: 88, text: 'トラック', icon: '🚚', category: '乗り物'},
    {id: 89, text: 'タクシー', icon: '🚕', category: '乗り物'},
    {id: 90, text: 'バス', icon: '🚌', category: '乗り物'},
    {id: 91, text: '珍しい鳥', icon: '🦜', category: '動物'},
    {id: 92, text: 'リス', icon: '🐿️', category: '動物'},
    {id: 93, text: 'ウサギ', icon: '🐰', category: '動物'},
    {id: 94, text: 'カメ', icon: '🐢', category: '動物'},
    {id: 95, text: 'カエル', icon: '🐸', category: '動物'},
    {id: 96, text: 'トカゲ', icon: '🦎', category: '動物'},
    {id: 97, text: '魚', icon: '🐟', category: '動物'},
    {id: 98, text: 'アヒル', icon: '🦆', category: '動物'},
    {id: 99, text: '白鳥', icon: '🦢', category: '動物'},
    {id: 100, text: 'フクロウ', icon: '🦉', category: '動物'},
    {id: 101, text: '城', icon: '🏯', category: '建物'},
    {id: 102, text: '塔', icon: '🗼', category: '建物'},
    {id: 103, text: '灯台', icon: '🗼', category: '建物'},
    {id: 104, text: '風車', icon: '🌬️', category: '建物'},
    {id: 105, text: '水車', icon: '⚙️', category: '物'},
    {id: 106, text: '滝', icon: '💦', category: '自然'},
    {id: 107, text: '洞窟', icon: '🕳️', category: '場所'},
    {id: 108, text: '池', icon: '💧', category: '自然'},
    {id: 109, text: '湖', icon: '🏞️', category: '自然'},
    {id: 110, text: '海', icon: '🌊', category: '自然'},
    {id: 111, text: '山', icon: '⛰️', category: '自然'},
    {id: 112, text: '森', icon: '🌲', category: '自然'},
    {id: 113, text: '竹林', icon: '🎋', category: '場所'},
    {id: 114, text: '梅', icon: '🌺', category: '植物'},
    {id: 115, text: '藤', icon: '💜', category: '植物'},
    {id: 116, text: '紫陽花', icon: '💙', category: '植物'},
    {id: 117, text: '向日葵', icon: '🌻', category: '植物'},
    {id: 118, text: 'コスモス', icon: '🌸', category: '植物'},
    {id: 119, text: '彼岸花', icon: '🌹', category: '植物'},
    {id: 120, text: '四つ葉のクローバー', icon: '🍀', category: '植物'}
  ]
};


/**
 * お題セット（将来: 有料・スポンサー拡張用。MVP では free のみ使用）
 * topicIds が空 = 従来どおり難易度プール全件から。非空 = 難易度プール内の当該IDに限定（不足分は従来ロジックで補完）
 */
const topicSets = [
  {
    id: 'default',
    name: 'いつものお散歩',
    description: '道ばたや公園で見つけやすい、基本のお題セットです。',
    monetizationType: 'free',
    topicIds: []
  },
  {
    id: 'park',
    name: '公園さんぽ',
    description: '公園で見つけやすいものを集めたお題セットです。',
    monetizationType: 'free',
    topicIds: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 32, 33, 34, 50, 51, 52, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 80, 90, 91, 92, 93, 95, 98, 99, 100, 102, 104, 105, 106, 108, 110, 111, 112, 113
    ]
  },
  {
    id: 'family',
    name: '親子で発見',
    description: '親子で一緒に探しやすいお題セットです。',
    monetizationType: 'free',
    topicIds: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 32, 33, 40, 68, 69, 70, 91, 92, 93, 99, 100, 5, 11, 14, 15, 16, 17, 30, 31, 35, 36, 37, 38, 39, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 80
    ]
  },
  {
    id: 'shopping-street',
    name: '商店街さんぽ',
    description: 'お店や街なかで楽しめるお題セットです。',
    monetizationType: 'sponsored-ready',
    sponsorName: null,
    sponsorLogo: null,
    campaignUrl: null,
    topicIds: [
      6, 7, 8, 12, 14, 15, 18, 25, 26, 27, 28, 29, 30, 31, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 86, 88, 89, 90, 1, 2, 3, 4, 5, 9, 10, 11, 19, 20, 32, 33, 34, 68, 69, 70, 71, 72, 80
    ]
  }
];

function getTopicSetById(id) {
  return topicSets.find((s) => s.id === id) || topicSets[0];
}

function getTopicById(id) {
  for (const key of ['easy', 'medium', 'hard']) {
    const t = topicDatabase[key].find((x) => x.id === id);
    if (t) return t;
  }
  return null;
}

// 難易度に対応するプール（未シャッフル）
function selectTopicsByDifficultyList(difficulty) {
  let selectedTopics = [];
  switch (difficulty) {
    case 'easy':
      selectedTopics = [...topicDatabase.easy];
      break;
    case 'medium':
      selectedTopics = [
        ...topicDatabase.easy.slice(0, 12),
        ...topicDatabase.medium.slice(0, 12)
      ];
      break;
    case 'hard':
      selectedTopics = [
        ...topicDatabase.easy.slice(0, 8),
        ...topicDatabase.medium.slice(0, 8),
        ...topicDatabase.hard.slice(0, 8)
      ];
      break;
    default:
      selectedTopics = [...topicDatabase.easy];
  }
  return selectedTopics;
}

// 難易度に応じてお題を選択する関数
// shuffleSalt: 作り直し時に毎回異なるシャッフルにするため（省略時は合言葉で固定）
function selectTopicsByDifficulty(difficulty, roomCode = '', userId = '', shuffleSalt = '') {
  let selectedTopics = selectTopicsByDifficultyList(difficulty);
  const seedStr = [roomCode, userId, shuffleSalt].filter(Boolean).join('-');
  if (seedStr) {
    const seed = stringToSeed(seedStr);
    selectedTopics = shuffleWithSeed(selectedTopics, seed);
  } else {
    selectedTopics = shuffle(selectedTopics);
  }
  return selectedTopics.slice(0, 24);
}

/**
 * 難易度プール＋任意のお題セット制限に基づき24件を返す
 */
function selectTopicsForGame(
  difficulty,
  roomCode = '',
  userId = '',
  shuffleSalt = '',
  topicSetId = 'default'
) {
  const set = getTopicSetById(topicSetId);
  const useSetInSeed =
    set.id !== 'default' || (set.topicIds && set.topicIds.length > 0);
  const seedStr = (useSetInSeed
    ? [roomCode, userId, shuffleSalt, set.id]
    : [roomCode, userId, shuffleSalt]
  )
    .filter(Boolean)
    .join('-');

  const baseList = selectTopicsByDifficultyList(difficulty);
  const allowed = set.topicIds && set.topicIds.length > 0 ? new Set(set.topicIds) : null;
  let pool = allowed
    ? baseList.filter((t) => allowed.has(t.id))
    : [...baseList];

  if (allowed && pool.length < 24) {
    const filler = selectTopicsByDifficulty(
      difficulty,
      roomCode,
      userId,
      `${shuffleSalt}-topicset-fill`
    );
    for (const t of filler) {
      if (pool.length >= 24) break;
      if (!pool.some((p) => p.id === t.id)) pool.push(t);
    }
  }

  if (pool.length < 24) {
    const flat = topicDatabase.easy.concat(
      topicDatabase.medium,
      topicDatabase.hard
    );
    for (const t of flat) {
      if (pool.length >= 24) break;
      if (allowed && !allowed.has(t.id)) continue;
      if (!pool.some((p) => p.id === t.id)) pool.push(t);
    }
  }

  if (pool.length < 24) {
    for (const t of topicDatabase.hard) {
      if (pool.length >= 24) break;
      if (!pool.some((p) => p.id === t.id)) pool.push(t);
    }
  }

  let selectedTopics = pool;
  if (seedStr) {
    const seed = stringToSeed(seedStr);
    selectedTopics = shuffleWithSeed([...pool], seed);
  } else {
    selectedTopics = shuffle([...pool]);
  }
  return selectedTopics.slice(0, 24);
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
