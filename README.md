# CAD to Photo - 建築設計者向けフォトリアル変換ツール

CADで作成した3D部屋画像を、家具や装飾を配置した生活感あふれるフォトリアルな画像に変換するWebアプリケーション（MVP版）

![CAD to Photo](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178c6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8)

## 🎯 プロジェクト概要

### 目的
建築設計者やインテリアデザイナーが、CAD画像を簡単にフォトリアルな空間ビジュアルに変換できるツールを提供します。

### 主な機能
- ✅ 画像アップロード（ドラッグ&ドロップ対応）
- ✅ 2つの変換モード
  - **家具を追加**: 無機質な部屋に家具・装飾を自動配置
  - **リアル化**: 既存家具をフォトリアルな質感に変換（強化版）
- ✅ 5つのスタイルプリセット
  - モダン / ナチュラル / 北欧 / ミニマリスト / ラグジュアリー
- ✅ カスタムプロンプト入力
- ✅ **Before/After画像比較スライダー** 🆕
- ✅ **全スタイル一括生成機能** 🆕
- ✅ 生成画像のダウンロード（個別・一括対応）
- ✅ 自動画像圧縮（パフォーマンス最適化）
- ✅ 部屋構造保持（壁・床・天井は変更せず）

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
cad-to-photo/
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

1. **画像をアップロード**
   - ドラッグ&ドロップまたはファイル選択でCAD画像をアップロード
   - 対応形式: JPG, PNG（最大10MB）

2. **変換モードを選択**
   - **家具を追加**: 空の部屋に家具を配置
   - **リアル化**: 既存の家具を高品質に変換

3. **スタイルを選択**
   - モダン、ナチュラル、北欧、ミニマリスト、ラグジュアリーから選択

4. **追加指示を入力（オプション）**
   - 例: 「大きなソファと観葉植物を追加」

5. **生成方法を選択**
   - **単一スタイル生成**: 「画像を変換する」ボタンで選択したスタイル1つを生成（通常30秒〜1分）
   - **全スタイル一括生成**: 「全スタイルを一括生成」ボタンで5つ全てのスタイルを一度に生成（通常3〜5分）

6. **結果を確認・ダウンロード**
   - Before/After比較スライダーで変換結果を確認
   - 個別または一括でダウンロード

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
- **react-compare-slider** - Before/After画像比較スライダー 🆕
- **zod** - スキーマバリデーション

## 🎯 AI プロンプトエンジニアリング

本アプリケーションは、モードとスタイルに応じて最適化されたプロンプトを自動生成します。

### プロンプト例（モダン × 家具追加）
```
Transform this architectural CAD rendering into a photorealistic modern interior.
Add contemporary furniture including: designer sofa, minimalist coffee table, modern floor lamp.
Use clean lines, neutral colors with accent pieces, ambient lighting.
Include subtle decorative elements: abstract art, books, minimal plants.
Ensure photorealistic materials: leather, glass, polished wood.

General requirements:
- 4K quality, highly detailed
- Photorealistic rendering
- Professional architectural visualization
- Proper perspective and scale
- Natural color grading
```

## 🛠️ カスタマイズ

### スタイルの追加

`src/types/index.ts` でスタイルを追加:

```typescript
export const AVAILABLE_STYLES: StyleOption[] = [
  // 既存のスタイル...
  {
    value: 'industrial',
    label: 'インダストリアル',
    description: '工業的でクールな空間',
  },
];
```

`src/utils/promptGenerator.ts` でプロンプトを追加:

```typescript
const PROMPT_TEMPLATES = {
  addFurniture: {
    // 既存のスタイル...
    industrial: `Your custom prompt here...`,
  },
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
- [x] Before/After画像比較スライダー ✅
- [x] 複数スタイルの一括生成 ✅
- [ ] 生成履歴の保存（メモリ内）
- [ ] ギャラリービュー

### 優先度: 中
- [ ] プリセットのカスタマイズ保存
- [ ] バッチ処理（複数画像の一括変換）
- [ ] 設定のエクスポート/インポート

### 優先度: 低
- [ ] ユーザー認証
- [ ] クラウド保存
- [ ] ソーシャル共有機能

## 🐛 トラブルシューティング

### 画像が生成されない
- インターネット接続を確認
- ブラウザのコンソールでエラーメッセージを確認
- 画像サイズが10MB以下か確認

### ビルドエラー
```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install
```

### 型エラー
```bash
# TypeScriptの型チェック
npx tsc --noEmit
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

**Version**: 1.2.0
**Last Updated**: 2025-10-06

## 📋 更新履歴

### v1.2.0 (2025-10-06) - 品質改善版
- 🔥 「リアル化」モードのプロンプトを大幅強化
  - より強い影とハイライトの追加
  - 材質ごとの質感を詳細に指定（木材・金属・布・革・ガラス・石材）
  - 窓からの光の方向性を明確化
- 🎨 UIの改善
  - リアル化モード時はスタイル選択を非表示（不要なため）
  - Before/Afterラベルをスライダー上に表示（視認性向上）
  - 説明文を明確化（左=Before、右=After）

### v1.1.0 (2025-10-06)
- ✨ Before/After画像比較スライダーを追加
- ✨ 全スタイル一括生成機能を追加
- 🔧 「リアル化」モードのプロンプトを強化（よりリアルな質感）
- 🔧 部屋の構造を保持する指示を追加（壁・床・天井は変更なし）
- 📦 react-compare-sliderライブラリを統合

### v1.0.0 (2025-10-05)
- 🎉 初回リリース（MVP版）
- ✅ 基本的な画像生成機能
- ✅ 5つのスタイルプリセット
- ✅ 2つの変換モード
