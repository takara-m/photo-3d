# Monster Finder - モンスターファインダー

カメラで撮影した現実世界の画像に、AIがモンスターを自動生成・配置するWebアプリケーション（MVP版）

![Monster Finder](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178c6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8)

## 🎯 プロジェクト概要

### 目的
スマホカメラで撮影した現実世界の風景に、AIが自動的にモンスターを配置することで、AR（拡張現実）のような体験を提供します。

### 主な機能
- ✅ カメラ撮影機能（スマホ対応）
- ✅ ファイルアップロード（ドラッグ&ドロップ対応）
- ✅ 4つのモチーフ選択
  - **かわいい生物**: ポップでキュートな生き物
  - **怖い生物**: ダークでホラーな生き物
  - **ファンタジー**: ドラゴン、妖精などの幻想生物
  - **古代生物**: 恐竜や絶滅した古代の生き物
- ✅ カスタムプロンプト入力
- ✅ **Before/After画像比較スライダー**
- ✅ 生成画像のダウンロード
- ✅ 自動画像圧縮（パフォーマンス最適化）
- ✅ 自然な光・影の合成

## 🚀 セットアップ

### 必要な環境
- Node.js 18以上
- npm または yarn

### インストール手順

1. **依存関係のインストール**
```bash
npm install
```

2. **開発サーバーの起動**
```bash
npm run dev
```

3. **ブラウザでアクセス**
```
http://localhost:5173
```

### ビルド
```bash
npm run build
```

ビルドされたファイルは `dist/` ディレクトリに出力されます。

## 📁 プロジェクト構造

```
monster-finder/
├── src/
│   ├── App.tsx                 # メインアプリケーションコンポーネント
│   ├── main.tsx                # エントリーポイント
│   ├── index.css               # グローバルスタイル
│   ├── types/
│   │   └── index.ts            # 型定義
│   └── utils/
│       ├── promptGenerator.ts   # AI プロンプト生成
│       ├── imageValidator.ts    # 画像バリデーション
│       └── imageCompressor.ts   # 画像圧縮
├── index.html                   # HTMLエントリーポイント
├── yw_manifest.json            # YouWare AI設定
├── package.json                 # 依存関係
├── vite.config.ts              # Viteビルド設定
├── tsconfig.json               # TypeScript設定
├── tailwind.config.js          # Tailwind CSS設定
└── README.md                   # このファイル
```

## 🎨 使い方

### 基本的な使用方法

1. **写真を撮影またはアップロード**
   - スマホの場合: 「カメラで撮影」ボタンをタップ
   - PCの場合: 「ファイルを選択」またはドラッグ&ドロップ
   - 対応形式: JPG, PNG（最大10MB）

2. **モチーフを選択**
   - かわいい生物、怖い生物、ファンタジー、古代生物から選択

3. **追加の指示を入力（オプション）**
   - 例: 「大きなドラゴンを空に配置してください」

4. **モンスターを出現させる**
   - 「モンスターを出現させる」ボタンをクリック
   - 通常30秒〜1分で生成完了

5. **結果を確認・ダウンロード**
   - Before/After比較スライダーで確認
   - 「保存」ボタンで画像をダウンロード

## 🔧 技術スタック

### フロントエンド
- **React 18.3.1** - UIライブラリ
- **TypeScript 5.8.3** - 型安全な開発
- **Tailwind CSS 3.4.17** - ユーティリティファーストCSS
- **Vite 7.0.0** - 高速ビルドツール

### AI統合
- **AI SDK 4.3.16** - AI API統合
- **@ai-sdk/openai 1.3.22** - OpenAI互換APIクライアント
- **Nano Banana (gemini-2.5-flash-image)** - 画像生成モデル

### その他ライブラリ
- **lucide-react** - アイコンライブラリ
- **browser-image-compression** - 画像圧縮
- **react-compare-slider** - Before/After画像比較スライダー
- **zod** - スキーマバリデーション

## 🎯 AI プロンプトエンジニアリング

本アプリケーションは、モチーフに応じて最適化されたプロンプトを自動生成します。

### プロンプト例（ファンタジーモチーフ）
```
Add a magical fantasy creature to this real-world scene.
The creature should be:
- Mythical and enchanting (dragon, fairy, unicorn, griffin, phoenix, etc.)
- Magical and mystical appearance
- Elegant and majestic design
- Fantasy game or epic story inspired
- Glowing or shimmering magical effects

Place the creature naturally in the scene considering:
- Proper scale and perspective (can be large and impressive)
- Magical glow, sparkles, or ethereal lighting
- Majestic pose or flying position
- Photorealistic integration with fantasy elements
- Subtle magical aura or particle effects

General requirements:
- 8K ultra high quality, highly detailed
- Photorealistic rendering with natural lighting
- Professional compositing and integration
- Proper perspective and scale matching the photo
- Natural color grading matching the original scene
```

## 🛠️ カスタマイズ

### モチーフの追加

`src/types/index.ts` でモチーフを追加:

```typescript
export const AVAILABLE_MOTIFS: MotifOption[] = [
  // 既存のモチーフ...
  {
    value: 'robot',
    label: 'ロボット',
    description: 'SFメカニカル',
    emoji: '🤖',
  },
];
```

`src/utils/promptGenerator.ts` でプロンプトを追加:

```typescript
const PROMPT_TEMPLATES: Record<MotifType, string> = {
  // 既存のモチーフ...
  robot: `Your custom prompt here...`,
};
```

## 📊 パフォーマンス最適化

### 画像圧縮
- アップロード前に自動圧縮（最大5MB、2048px）
- API通信の高速化
- メモリ使用量の削減

### バリデーション
- ファイルサイズチェック（10MB制限）
- ファイル形式チェック（JPG/PNG）
- ユーザーフレンドリーなエラーメッセージ

## 🚧 今後の拡張予定

### 優先度: 高
- [ ] 複数回生成（ランダム性）
- [ ] 生成履歴の保存（メモリ内）
- [ ] ギャラリービュー

### 優先度: 中
- [ ] モチーフのカスタマイズ保存
- [ ] ソーシャル共有機能
- [ ] AR表示モード（実験的）

### 優先度: 低
- [ ] ユーザー認証
- [ ] クラウド保存
- [ ] コミュニティギャラリー

## 🐛 トラブルシューティング

### 画像が生成されない
- インターネット接続を確認
- ブラウザのコンソールでエラーメッセージを確認
- 画像サイズが10MB以下か確認

### カメラが起動しない
- ブラウザのカメラ権限を確認
- HTTPSまたはlocalhostでアクセスしているか確認

### ビルドエラー
```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install
```

## 📝 ライセンス

MIT License

## 👨‍💻 開発者

Youware Team

## 🙏 謝辞

- [Youware](https://www.youware.com) - AIアプリ開発プラットフォーム
- [Nano Banana](https://nanobanana.ai) - 画像生成モデル
- [Tailwind CSS](https://tailwindcss.com) - CSSフレームワーク
- [Lucide Icons](https://lucide.dev) - アイコンライブラリ

---

**Version**: 1.0.0
**Last Updated**: 2025-10-06

## 📋 更新履歴

### v1.0.0 (2025-10-06)
- 🎉 初回リリース（MVP版）
- ✅ カメラ撮影機能
- ✅ 4つのモチーフ選択
- ✅ AI モンスター生成
- ✅ Before/After 比較スライダー
- ✅ 画像ダウンロード機能
