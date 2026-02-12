# GitHub へのプッシュ手順

## 1. 準備

### Git のインストール確認

```powershell
git --version
```

未インストールの場合: [https://git-scm.com/](https://git-scm.com/) からインストール

### GitHub アカウント

- [https://github.com](https://github.com) でアカウント作成
- ログイン状態にしておく

---

## 2. リポジトリ作成（GitHub 上）

1. GitHub にログイン
2. 右上の **+** → **New repository**
3. 設定例:
   - **Repository name**: `osanpo-bingo`（任意）
   - **Description**: 散歩が楽しくなるビンゴゲーム
   - **Public** を選択
   - **Add a README file** はチェックしない（既存のファイルをプッシュするため）
4. **Create repository** をクリック
5. 表示される URL をメモ（例: `https://github.com/ユーザー名/osanpo-bingo.git`）

---

## 3. ローカルで Git 初期化とプッシュ

### プロジェクトフォルダで実行

```powershell
# プロジェクトフォルダへ移動
cd "C:\Users\kojac\Desktop\AITEST\osanpo bingo"

# Git 初期化
git init

# 全ファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: お散歩ビンゴ"

# ブランチ名を main に（必要に応じて）
git branch -M main

# GitHub のリモートを追加（URL は自分のリポジトリに置き換え）
git remote add origin https://github.com/ユーザー名/osanpo-bingo.git

# プッシュ
git push -u origin main
```

### 認証について

- 初回 `git push` 時に GitHub のユーザー名とパスワード（または Personal Access Token）を求められます
- パスワードの代わりに **Personal Access Token** の利用が推奨されています
  - GitHub → Settings → Developer settings → Personal access tokens で作成
  - `repo` 権限を付与

---

## 4. 2回目以降の更新手順

```powershell
# 変更をステージング
git add .

# コミット（メッセージは変更内容に合わせる）
git commit -m "トップへ戻るボタン修正、アイコンサイズ調整"

# プッシュ
git push origin main
```

---

## 5. .gitignore（任意・推奨）

大きいファイルや不要なファイルを除外したい場合、プロジェクト直下に `.gitignore` を作成:

```
# エディタ
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# ログ・一時ファイル
*.log
*.tmp
```

---

## 6. GitHub Pages で公開する場合

1. リポジトリの **Settings** → **Pages**
2. **Source** で **Deploy from a branch** を選択
3. **Branch** で `main`、フォルダは `/ (root)` を選択
4. **Save** をクリック
5. 数分後、`https://ユーザー名.github.io/osanpo-bingo/` でアクセス可能

※ リポジトリ名が `osanpo-bingo` の場合の URL 例
