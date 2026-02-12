# お散歩ビンゴ - 再設計プラン（グループ体験重視版）

## 🎯 新しいコンセプト

**「グループで楽しむ、ビジュアル重視のお散歩ビンゴ」**

### 優先順位の変更

**旧**: 継続プレイ（ポイント、ストリーク、デイリーチャレンジ）重視

**新**: グループ体験 + ビジュアル + 写真機能 重視

---

## 📋 新しい実装フェーズ

### Phase 1: 基本ビンゴ（最小限）⭐
**目的**: 確実に動く土台を作る

**機能**:
1. ビンゴボード表示（5×5）
2. セルのマーク/アンマーク
3. ビンゴ判定（8ライン）
4. ビンゴメッセージ
5. リセット/新規ゲーム
6. LocalStorage保存

**コード量**: 約200行
**所要時間**: 1時間
**ファイル**: `app-simple.js`

---

### Phase 2: グループ体験の核心 ⭐⭐⭐
**目的**: グループで楽しめる最高の体験を作る

#### 2-1. グループ機能（合言葉）
**シーン**: 友達と同じお題で遊びたいが、完全に同じだとつまらない

**実装**:
```javascript
// 合言葉 + ユーザーID でシャッフル
const seed = hash(roomCode + userId);
const shuffledTopics = shuffleWithSeed(allTopics, seed);

// 同じ合言葉でも、ユーザーごとに若干異なる配置
// 重複度: 40-60%（バランス調整可能）
```

**UI**:
```
🔑 合言葉を入力
[___________]
難易度: [かんたん ▼]
[ゲーム開始]
```

**難易度設定**:
- **かんたん**: よく見るもの（ネコ、花、公園など）
- **ふつう**: 少し探す必要がある（郵便ポスト、看板など）
- **むずかしい**: レアなもの（虹、珍しい車など）

**お題の分類**:
```javascript
const topics = {
  easy: [
    {text: 'ネコ', icon: '🐱'},
    {text: '犬', icon: '🐶'},
    {text: '花', icon: '🌸'},
    {text: '木', icon: '🌳'},
    // 40種類
  ],
  medium: [
    {text: '看板', icon: '🪧'},
    {text: '郵便ポスト', icon: '📮'},
    {text: '自販機', icon: '🥤'},
    // 40種類
  ],
  hard: [
    {text: '虹', icon: '🌈'},
    {text: 'キャンピングカー', icon: '🚐'},
    {text: '珍しい鳥', icon: '🦜'},
    // 40種類
  ]
};
```

**難易度ごとのお題配分**:
```javascript
function selectTopicsByDifficulty(difficulty) {
  switch(difficulty) {
    case 'easy':
      return [...shuffle(topics.easy).slice(0, 24)];
    case 'medium':
      return [
        ...shuffle(topics.easy).slice(0, 12),
        ...shuffle(topics.medium).slice(0, 12)
      ];
    case 'hard':
      return [
        ...shuffle(topics.easy).slice(0, 8),
        ...shuffle(topics.medium).slice(0, 8),
        ...shuffle(topics.hard).slice(0, 8)
      ];
  }
}
```

#### 2-2. 写真機能
**シーン**: お題を達成したら証拠写真を撮りたい

**実装**:
1. セルをクリック → 写真アップロードプロンプト
2. 写真選択 → 自動圧縮（800px、JPEG 0.8）
3. サムネイル表示（セルに📷アイコン）
4. クリックで拡大表示

**UI**:
```
[セルクリック]
↓
┌─────────────────┐
│  📸 写真を撮る？   │
│                   │
│ [📷 撮影する]     │
│ [⏭️ スキップ]     │
└─────────────────┘
```

**写真表示**:
```css
.bingo-cell.has-photo {
  background-image: url(...);
  background-size: cover;
  opacity: 0.8;
}

.bingo-cell.has-photo::after {
  content: '📷';
  position: absolute;
  top: 4px;
  right: 4px;
}
```

#### 2-3. イラスト表示（ビジュアル強化）⭐⭐⭐
**シーン**: 文字だけだと味気ない、見てすぐわかるように

**実装方法**:
```javascript
// お題データ構造
const topics = [
  {text: 'ネコ', icon: '🐱'},
  {text: '犬', icon: '🐶'},
  {text: '花', icon: '🌸'},
  // ...
];

// レンダリング
cell.innerHTML = `
  <div class="cell-icon">${topic.icon}</div>
  <div class="cell-text">${topic.text}</div>
`;
```

**CSS**:
```css
.bingo-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.cell-icon {
  font-size: 32px;
  line-height: 1;
}

.cell-text {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}
```

**アイコンの選択肢**:
1. **絵文字** (推奨、シンプル)
   - 🐱 🐶 🌸 🌳 🚗 🏠
   - 追加実装不要
   - すぐに使える

2. **SVGアイコン** (よりプロフェッショナル)
   - Font Awesome CDN
   - Material Icons
   - 要CDN追加

3. **カスタムイラスト** (最もオリジナル)
   - 手描き風のイラスト
   - 画像ファイルが必要

**推奨**: まず絵文字で実装 → 後でSVGに変更可能

---

### Phase 3: 拡張機能 ⭐
**目的**: さらに便利に

**機能**:
1. エクスポート/インポート
2. シェア機能（画像生成）
3. カスタムお題
4. 統計表示

---

## 🎨 お題データベース設計

### 構造

```javascript
const topicDatabase = {
  // かんたん（40個）
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
    {id: 12, text: '月', icon: '🌙', category: '自然'},
    {id: 13, text: '星', icon: '⭐', category: '自然'},
    {id: 14, text: '公園', icon: '🏞️', category: '場所'},
    {id: 15, text: 'ベンチ', icon: '🪑', category: '物'},
    {id: 16, text: '信号', icon: '🚦', category: '物'},
    {id: 17, text: '橋', icon: '🌉', category: '建物'},
    {id: 18, text: '川', icon: '🏞️', category: '自然'},
    {id: 19, text: '石', icon: '🪨', category: '自然'},
    {id: 20, text: '草', icon: '🌿', category: '植物'},
    {id: 21, text: '葉っぱ', icon: '🍃', category: '植物'},
    {id: 22, text: '子供', icon: '👶', category: '人'},
    {id: 23, text: '赤い物', icon: '🔴', category: '色'},
    {id: 24, text: '青い物', icon: '🔵', category: '色'},
    {id: 25, text: '黄色い物', icon: '🟡', category: '色'},
    {id: 26, text: '丸い物', icon: '⚪', category: '形'},
    {id: 27, text: '三角の物', icon: '🔺', category: '形'},
    {id: 28, text: '四角の物', icon: '🟦', category: '形'},
    {id: 29, text: '大きい物', icon: '📏', category: '大きさ'},
    {id: 30, text: '小さい物', icon: '🔬', category: '大きさ'},
    {id: 31, text: '柔らかい物', icon: '🧸', category: '質感'},
    {id: 32, text: '硬い物', icon: '🪨', category: '質感'},
    {id: 33, text: '水', icon: '💧', category: '自然'},
    {id: 34, text: '影', icon: '🌑', category: '自然'},
    {id: 35, text: '光', icon: '💡', category: '自然'},
    {id: 36, text: '音', icon: '🔊', category: '感覚'},
    {id: 37, text: '匂い', icon: '👃', category: '感覚'},
    {id: 38, text: '風', icon: '💨', category: '自然'},
    {id: 39, text: '暖かい場所', icon: '🌡️', category: '場所'},
    {id: 40, text: '涼しい場所', icon: '❄️', category: '場所'},
  ],
  
  // ふつう（40個）
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
    {id: 80, text: '露', icon: '💧', category: '自然'},
  ],
  
  // むずかしい（40個）
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
    {id: 100, text: '鶴', icon: '🦩', category: '動物'},
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
    {id: 120, text: '四つ葉のクローバー', icon: '🍀', category: '植物'},
  ]
};
```

---

## 🎨 UI/UXデザイン

### 色設計（グループ体験重視）

```css
:root {
  /* メインカラー: 爽やかなグリーン */
  --primary: #7eb89a;
  --primary-light: #a8d5ba;
  --primary-dark: #5a9b7d;
  
  /* アクセント: 明るいオレンジ */
  --accent: #ffb347;
  
  /* グループ用カラー */
  --group-1: #ff6b6b;  /* 赤 */
  --group-2: #4ecdc4;  /* ターコイズ */
  --group-3: #ffd93d;  /* 黄色 */
  --group-4: #a8e6cf;  /* ミント */
  
  /* 背景 */
  --bg: #f8faf9;
  --card-bg: #ffffff;
  
  /* テキスト */
  --text: #2d3436;
  --text-light: #636e72;
  
  /* ビンゴセル */
  --cell-bg: #ffffff;
  --cell-marked: #7eb89a;
  --cell-border: #e0e0e0;
}
```

### レイアウト

```
┌────────────────────────────┐
│   お散歩ビンゴ 🚶           │
├────────────────────────────┤
│ 🔑 合言葉: [さくら2024]    │
│ 難易度: かんたん            │
├────────────────────────────┤
│  [5×5 ビンゴボード]        │
│   各セル:                   │
│   ┌───────┐              │
│   │  🐱   │              │
│   │ ネコ  │              │
│   └───────┘              │
├────────────────────────────┤
│ ビンゴ: 2本 | マーク: 12個  │
├────────────────────────────┤
│ [リセット] [新しいゲーム]  │
└────────────────────────────┘
```

---

## 📁 ファイル構成

```
osanpo-bingo/
├── index.html           # メインHTML
├── styles.css           # スタイル
├── app.js              # メインロジック
├── topics.js           # お題データベース
├── utils.js            # ユーティリティ関数
├── manifest.json       # PWA
├── service-worker.js   # オフライン対応
└── backup/             # 旧バージョン
    ├── app-old.js
    └── index-old.html
```

---

## 🚀 実装開始

次のステップ:
1. 旧ファイルをバックアップ
2. `topics.js` を作成（お題データベース）
3. `app.js` を新規作成（Phase 1）
4. `index.html` をシンプルに書き換え
5. 動作確認
6. Phase 2 の機能追加

準備完了です！実装を開始しますか？
