# 長文読解 5STEP

中学生が英語長文を5つの読解戦略で練習するローカルWebアプリです。

## 起動

```bash
npm install
npm run dev
```

表示された `http://localhost:5173` をブラウザで開きます。`index.html` を直接開く `file://` 方式では動作しません。

## 教材の追加・編集

教材は `src/data/materials.json` にあります。既存教材と同じ形式のオブジェクトを追加してください。

- `step4[].answerPatterns` に複数の許容範囲を登録できます。
- `step5[].type` は現在 `choice` を使用し、将来 `written` を追加できる構造です。
- 実戦問題数は中1が3問、中2が4問、中3・入試が5問です。
