# お散歩ビンゴ — ChatGPT 向けレビュー・ハンドオフ

このファイルを ChatGPT に貼り付けるか、リポジトリごと／`assets` フォルダごと ZIP で添付して「全体レビュー」と「画像生成」の依頼に使ってください。

---

## 1. プロジェクト概要

| 項目 | 内容 |
|------|------|
| 名称 | お散歩ビンゴ（osanpo-bingo） |
| 形態 | 静的サイト（HTML / CSS / JS）。PWA（`manifest.json`） |
| 主な画面 | `index.html` ランディング → `game.html` ゲーム本体 |
| テーマカラー | `#7eb89a`（manifest / meta theme-color と整合） |
| データ | お題は `topics.js`（`tools/csv-to-topics.js` が `topics_list.csv` から生成） |

---

## 2. 技術・ファイルの柱

- **ゲームロジック**: `app.js`（大きい単一クラス `OsanpoBingo`）
- **お題DB**: `topics.js` + `getTopicIcon(topic)`
- **スタイル**: `landing.css`（トップ）、`styles.css`（ゲーム想定 ※必要なら確認）
- **Node ツール**: `package.json` — `build-topics`, `resize-icons`（sharp）
- **最近の仕様（v1.0）**: バトルモードは `BATTLE_MODE_ENABLED`（`app.js` 先頭 `false`）で封印。UI 非表示・`gameType` 強制 `normal`・可視性同期の無効化・結果/共有のマーク数表示補正あり。

---

## 3. レビューしてほしい観点（例）

- アクセシビリティ（ランディング / モーダル / タッチターゲット）
- バトル封印後の分岐の漏れ（`gameType === 'battle'` の直参照残り等）
- `topics.js` の `topicIconMap`（現状は `undefined: 'icon-hito.png'` のみ。お題の `id` が `NaN` 等だとマッピングが効かない可能性 — CSV 生成と整合）
- PWA / OGP パスが相対参照でデプロイ先 URL と噛み合うか
- パフォーマンス（`app.js` 肥大化、画像最適化）

---

## 4. 画像・バナー参照一覧（パスはリポジトリルート相対）

ChatGPT に画像を**見せる**には、同じ階層のファイルを**添付**するか、パス名で指示してください（ローカル `file://` は AI からは一般的に参照不可）。

### 4.1 トップページ（`index.html`）＝メインバナー系

| 用途 | 参照パス | HTML / メタ上の用例 |
|------|----------|---------------------|
| **ヒーロー（メイン横長バナー）** | `assets/hero-osanpo-combined-v4.png` | `<img class="hero-image">`、`og:image` / Twitter カード |
| **Bingo Party ロゴ（SVG）** | `assets/logo-bingo-party.svg` | ヘッダー・ヒーロー上オーバーレイ `hero-title-logo` |
| **アプリ風アイコン（PNG）** | `icon-192.png` | ヘッダー小アイコン、`apple-touch-icon` |

### 4.2 その他の参照（存在はコード・文書上の契約。実体は未コミットの場合あり）

| 用途 | 参照パス | 出典 |
|------|----------|------|
| PWA 大アイコン | `icon-512.png` | `manifest.json` |
| 旧・代替ヒーロー素材 | `osanpo-hero.png` 等 | `assets/HERO_OPTIONS.md` |
| 旧ロゴ案 | `logo-osanpo-bingo-simple.png` 等 | `assets/LOGO_OPTIONS.md` |

**メモ（開発環境）**: ツリーによっては `assets` に **SVG 以外の PNG がコミットされていない** 場合があります。レビュー時はデプロイ先 or デザイナー素材フォルダと突き合わせてください。

### 4.3 マス上の各お題アイコン（ビンゴセル用）

- **格納先（仕様上）**: `assets/icons/icon-{名前}.png`（例: `icon-neko.png`）
- **実装**: `getTopicIcon()` が `assets/icons/${iconFile}` を参照。マッピングは `topics.js` の `topicIconMap` および文書 `assets/icons/ICON_MAPPING.md`（全120お題の対応表・フェーズ2計画）
- **規格**: `assets/icons/ICON_SPEC.md` — 512×512、PNG 透過、命名 `icon-*.png`
- **プレビュー用（あれば）**: `tools/icon-preview.html`

---

## 5. 画像生成の依頼文（ChatGPT / 画像AI 用・そのままコピー可）

以下を貼り、必要なら「作りたいもの」だけ残して使ってください。

```text
【プロジェクト】お散歩ビンゴ（散歩中にお題探しをするビンゴWebアプリ）の画像素材を作ってください。

【ブランド】
- トーン: 散歩・公園・家族向け。明るいパステル、フラット寄り、かわいい。
- 基調色: ミントグリーン #7eb89a、クリーム、ソフトブラウン、ソフトピンク（`assets/HERO_OPTIONS.md` / `assets/icons/ICON_SPEC.md` と整合）。

【A. ヒーロー / バナー】
- 現行採用名: hero-osanpo-combined-v4.png（16:9 横長想定。男性＋マスコット2体散歩、OSANPO BINGO ロゴ入り、と `HERO_OPTIONS.md` に記載）
- 用途: ランディング最上部、OGP サムネイル
- 依頼: 既存とトーンを揃えた差し替え案、または新シーズン用バリエーションを1案以上（安全な歩道・公園の雰囲気）

【B. PWA / アイコン】
- 参照: icon-192.png, icon-512.png（角丸 iOS 風でマスクable 想定。manifest 記載）
- 依頼: 散歩＋ビンゴのモチーフ。シンプルで小サイズでも判読できる

【C. お題アイコン（大量）】
- 保存先: assets/icons/、命名 icon-{英小文字ハイフン}.png
- 技術: 512×512px、透過 PNG、アイコンはキャンバス約70〜80%（`ICON_SPEC.md`）
- 凡例: ネコ icon-neko.png、犬 icon-inu.png … 詳細は `assets/icons/ICON_MAPPING.md` の未製作分を優先

【D. 依頼の出し方】
- まず1カテゴリ（例: 動物12種）ずつ、同じライティングで統一して生成
- 既存 `assets/logo-bingo-party.svg` の線の太さ・色と並べて違和感がないか確認
```

---

## 6. 同梱推奨ファイル（全体レビュー用）

可能なら ChatGPT に次をまとめて渡すと精度が上がります。

- `index.html`, `game.html`, `app.js`（先頭〜定数部と主要メソッド名だけでも可）, `topics.js`, `manifest.json`
- `assets/icons/ICON_SPEC.md`, `assets/icons/ICON_MAPPING.md`（の一部）
- 画像: `assets/logo-bingo-party.svg` ＋ 可能なら `assets/hero-osanpo-combined-v4.png` と `icon-192.png`

---

*生成日: 作業用ハンドオフ。リポジトリの実ファイルと差分があればリポジトリを正とする。*
