# 長文読解 5STEP

中学生が英語長文を5つの読解戦略で練習するローカルWebアプリです。

## 起動

```bash
npm install
npm run dev
```

表示された `http://localhost:5173` をブラウザで開きます。`index.html` を直接開く `file://` 方式では動作しません。

## GitHub → Vercel 公開

### 1. GitHubにリポジトリを作成

GitHubで新しいリポジトリを作成します。

- Repository name: `reading-5step`
- Public / Private: どちらでも可
- README / .gitignore / license: 追加しない

作成後、表示されるURLを使ってローカルから送信します。

```bash
git remote add origin https://github.com/morik7554/reading-5step.git
git push -u origin main
```

### 2. Vercelに接続

Vercelで `Add New...` → `Project` を選び、GitHubの `reading-5step` をImportします。

Vercel設定は `vercel.json` に入っています。

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

### 3. 更新方法

修正後は以下でGitHubへ送信すると、Vercelが自動で再公開します。

```bash
git add .
git commit -m "Update reading app"
git push
```

## 教材の追加・編集

教材は `src/data/materials.json` にあります。既存教材と同じ形式のオブジェクトを追加してください。

- `step4[].answerPatterns` に複数の許容範囲を登録できます。
- `step5[].type` は現在 `choice` を使用し、将来 `written` を追加できる構造です。
- 実戦問題数は中1が3問、中2が4問、中3・入試が5問です。
