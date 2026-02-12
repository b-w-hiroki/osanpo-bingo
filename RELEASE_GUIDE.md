# お散歩ビンゴ - GitHub を通じたリリース手順

## 概要

このアプリは静的サイト（HTML/CSS/JS）のため、**GitHub Pages** で無料公開できます。

---

## 事前準備

### 1. Git のインストール確認

```powershell
git --version
```

未インストールの場合: [git-scm.com](https://git-scm.com/) からインストール

### 2. GitHub アカウント

- [github.com](https://github.com) でアカウント作成・ログイン

### 3. 認証設定（推奨）

`git push` に **Personal Access Token** を使う場合:

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens**
2. **Generate new token** で新規作成
3. 権限で `repo` にチェック
4. 発行されたトークンを控えておく（パスワードの代わりに使用）

---

## リリース手順（初回）

### ステップ 1: GitHub にリポジトリを作成

1. GitHub にログイン
2. 右上 **+** → **New repository**
3. 設定:
   - **Repository name**: `osanpo-bingo`（任意）
   - **Description**: 散歩が楽しくなるビンゴゲーム
   - **Public** を選択
   - **Add a README file** は **チェックしない**（既存コードをプッシュするため）
4. **Create repository** をクリック
5. 表示される URL をメモ（例: `https://github.com/YourName/osanpo-bingo.git`）

---

### ステップ 2: ローカルで Git 初期化と初回プッシュ

プロジェクトフォルダで次を実行:

```powershell
# プロジェクトフォルダへ移動
cd "C:\Users\kojac\Desktop\AITEST\osanpo bingo"

# Git 初期化（未初期化の場合）
git init

# 全ファイルをステージング
git add .

# 初回コミット
git commit -m "Initial release: お散歩ビンゴ"

# ブランチを main に
git branch -M main

# リモート追加（URL を自分のリポジトリに置き換え）
git remote add origin https://github.com/YourName/osanpo-bingo.git

# プッシュ
git push -u origin main
```

認証を求められたら、GitHub のユーザー名とパスワード（または Personal Access Token）を入力。

---

### ステップ 3: GitHub Pages で公開設定

1. リポジトリの **Settings** タブを開く
2. 左メニューの **Pages** をクリック
3. **Build and deployment** で:
   - **Source**: **Deploy from a branch**
   - **Branch**: `main` / **/(root)** を選択
4. **Save** をクリック
5. 数分待つと公開される

---

### ステップ 4: 公開 URL の確認

| リポジトリ名 | 公開 URL |
|-------------|----------|
| `osanpo-bingo` | `https://YourName.github.io/osanpo-bingo/` |
| ユーザーサイト（`YourName.github.io`）の場合 | `https://YourName.github.io/` |

ブラウザで上記 URL にアクセスして動作確認する。

---

### ステップ 5: manifest.json のパス確認（サブディレクトリ公開時）

`https://xxx.github.io/osanpo-bingo/` のようにサブパスで公開する場合:

`manifest.json` の `start_url` と `scope` を調整:

```json
{
  "start_url": "/osanpo-bingo/",
  "scope": "/osanpo-bingo/"
}
```

ルート（`https://xxx.github.io/`）で公開する場合は `/` のままで問題ない。

---

## 更新・再リリース手順（2回目以降）

```powershell
# プロジェクトフォルダへ移動
cd "C:\Users\kojac\Desktop\AITEST\osanpo bingo"

# 変更をステージング
git add .

# コミット（内容に合わせてメッセージ変更）
git commit -m "Update: モーダル対応、終了文言修正"

# プッシュ
git push origin main
```

プッシュ後、GitHub Pages が自動で再デプロイされ、数分以内に反映される。

---

## トラブルシュート

| 現象 | 対処 |
|------|------|
| `git push` で認証エラー | Personal Access Token を使う（パスワードは使用不可） |
| Pages の URL が 404 | 数分待つ。Settings → Pages で Source が正しいか確認 |
| 画像・リンクが壊れる | 相対パスで書かれているか確認。サブディレクトリ公開時は `manifest.json` も確認 |
| 既に別リモートがある | `git remote -v` で確認し、必要なら `git remote set-url origin <新しいURL>` で変更 |

---

## 参考: 他のホスティング

| サービス | 主な特徴 |
|----------|----------|
| **Netlify** | ドラッグ&ドロップまたは GitHub 連携でデプロイ |
| **Vercel** | GitHub 連携で自動デプロイ |
| **Cloudflare Pages** | 無料枠あり、Git 連携対応 |

いずれも GitHub リポジトリを連携すれば、`main` へのプッシュで自動デプロイできる。
