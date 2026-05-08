/**
 * 合言葉ボード共有のデバッグテスト
 * node tools/_test_same_board.js で実行
 */

// --- topics.js から移植 ---
function stringToSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function createRng(seed) {
  let s = seed;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

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

// --- シミュレーション ---
const dummyTopics = Array.from({length: 50}, (_, i) => `お題${i+1}`);

function simulateCreateBoard(roomCode, userId, shuffleSalt, topicSetId = 'default') {
  const isShared = roomCode && roomCode !== 'solo';
  const seedUserId = isShared ? '' : userId;
  const seedSalt   = isShared ? '' : shuffleSalt;

  // selectTopicsForGame のシード
  const topicSeedStr = [roomCode, seedUserId, seedSalt, topicSetId !== 'default' ? topicSetId : '']
    .filter(Boolean).join('-');
  const topicSeed = topicSeedStr ? stringToSeed(topicSeedStr) : 0;
  const rng = createRng(topicSeed);
  const topicPool = [...dummyTopics];
  // 24枚選ぶ（簡略）
  const selected = shuffleWithSeed(topicPool, topicSeed).slice(0, 24);

  // 全体シャッフルシード
  const seedStr = [roomCode, seedUserId, seedSalt, 'mix', topicSetId].filter(Boolean).join('-');
  const seed = stringToSeed(seedStr);
  const board = shuffleWithSeed(selected, seed);

  return { seedStr, seed, board: board.slice(0, 5) /* 先頭5件だけ表示 */ };
}

// --- テストケース ---
console.log('=== 合言葉ボード共有 デバッグテスト ===\n');

// 1. 同じ合言葉・別userId/salt → 同じボードになるべき（修正後）
const passphrase = 'さくら';
const userA = simulateCreateBoard(passphrase, 'user_A_abc', Date.now().toString());
const userB = simulateCreateBoard(passphrase, 'user_B_xyz', '');  // join側はsalt=''

console.log('【テスト1】同じ合言葉「さくら」で2人が参加');
console.log(`  Aのシード文字列: "${userA.seedStr}"`);
console.log(`  Bのシード文字列: "${userB.seedStr}"`);
console.log(`  A先頭5マス: ${userA.board.join(', ')}`);
console.log(`  B先頭5マス: ${userB.board.join(', ')}`);
console.log(`  ✅ 一致: ${JSON.stringify(userA.board) === JSON.stringify(userB.board) ? 'YES 🎉' : 'NO ❌'}\n`);

// 2. 違う合言葉 → 別ボードになるべき
const userC = simulateCreateBoard('うめ', 'user_C', '');
console.log('【テスト2】違う合言葉「うめ」');
console.log(`  C先頭5マス: ${userC.board.join(', ')}`);
console.log(`  さくらと異なる: ${JSON.stringify(userA.board) !== JSON.stringify(userC.board) ? 'YES 🎉' : 'NO ❌'}\n`);

// 3. ソロ（roomCode='solo'）→ userId/saltで毎回ランダムになるべき
const solo1 = simulateCreateBoard('solo', 'user_D', Date.now().toString());
const solo2 = simulateCreateBoard('solo', 'user_E', (Date.now() + 1).toString());
console.log('【テスト3】ソロモード（2人別々）');
console.log(`  ソロ1先頭5マス: ${solo1.board.join(', ')}`);
console.log(`  ソロ2先頭5マス: ${solo2.board.join(', ')}`);
console.log(`  ソロ同士は別ボード: ${JSON.stringify(solo1.board) !== JSON.stringify(solo2.board) ? 'YES 🎉' : '同じ(偶然一致の可能性あり)'}\n`);

// 4. 合言葉ありで何度作成しても同じ（冪等性）
const again = simulateCreateBoard(passphrase, 'user_A_abc', Date.now().toString()); // 別salt
console.log('【テスト4】同じ合言葉「さくら」でAがもう一度「作る」を押した場合');
console.log(`  再作成のシード文字列: "${again.seedStr}"`);
console.log(`  再作成先頭5マス: ${again.board.join(', ')}`);
console.log(`  最初と同じ: ${JSON.stringify(userA.board) === JSON.stringify(again.board) ? 'YES 🎉' : 'NO ❌'}\n`);
