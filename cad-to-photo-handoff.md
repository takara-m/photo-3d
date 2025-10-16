# Claude Code引き継ぎ資料

## 📋 プロジェクト概要

### プロジェクト名
**CAD to Photo - 建築設計者向けフォトリアル変換ツール**

### 目的
CADで作成した3D部屋画像を、家具や装飾を配置した生活感あふれるフォトリアルな画像に変換するWebアプリケーション

### ユースケース
1. **無機質な部屋画像** → 家具・装飾を自動配置してフォトリアル化
2. **CADで家具配置済み** → 既存家具をよりリアルな質感に変換

---

## 🔧 開発環境とツール

### YouWare（バイブコーディングプラットフォーム）
- **概要**: 自然言語でWebアプリ・ゲームを作成できるAIサービス
- **特徴**:
  - チャットでの指示でコード生成
  - HTML、TSX、CSS、JSファイルのペースト可能
  - MCP（Model Context Protocol）toolで外部AI連携可能
  - ワンクリックで公開・共有

### YouWare VSCodeプラグイン
- **機能**:
  - ワンクリック公開（HTML/Reactプロジェクト）
  - 即座に共有可能なリンク取得
  - プライバシー設定（Public/Private/パスワード保護）
  - セットアップ不要
- **インストール済み**: VSCode拡張機能として導入完了

---

## 🔄 推奨ワークフロー

```
ステップ1: YouWareで基本UI生成
   ↓
ステップ2: Claude CodeでUI/ロジック改善・機能追加
   ↓
ステップ3: VSCode YouWareプラグインで公開
   ↓
ステップ4: フィードバック収集・反復改善
```

### 各ステップの詳細

**ステップ1: YouWareで基本生成**
- プロンプトを使ってプロトタイプ作成
- MCP toolでAI App（画像生成AI）連携
- 基本的なUI/UXの確認

**ステップ2: Claude Codeで高度化**
- コード品質向上
- エラーハンドリング追加
- プロンプトエンジニアリングロジック実装
- 状態管理の最適化
- パフォーマンス改善

**ステップ3: 公開**
- VSCodeからワンクリック公開
- 共有リンク取得

**ステップ4: 改善サイクル**
- ユーザーフィードバック収集
- 必要に応じてClaude Codeで再開発

---

## 🎨 アプリケーション仕様

### 機能要件

#### 1. 画像アップロード機能
- ドラッグ&ドロップ対応
- JPG/PNG形式サポート
- プレビュー表示

#### 2. 変換モード選択
- **モードA「家具を追加」**: 無機質な部屋に家具・装飾を自動配置
- **モードB「リアル化」**: 既存家具をフォトリアルな質感に変換

#### 3. スタイルプリセット
- モダン
- ナチュラル
- 北欧スタイル
- ミニマリスト
- ラグジュアリー（高級感）

#### 4. カスタムプロンプト入力
- ユーザーが追加指示を入力できる自由記述欄
- 例: 「大きなソファと観葉植物を追加」

#### 5. AI画像生成
- MCP toolのAI App機能で画像生成API連携
- ローディング表示
- エラーハンドリング

#### 6. 結果表示
- Before/After比較表示
- 生成画像のダウンロード機能
- 再生成ボタン

### UI/UXデザイン

#### レイアウト
```
┌─────────────────────────────────────────┐
│ ヘッダー: CAD to Photo                   │
├──────────────┬──────────────────────────┤
│              │                          │
│ 左パネル      │   右パネル（プレビュー）   │
│ (コントロール) │                          │
│              │   [Before画像]           │
│ - アップロード │                          │
│ - モード選択  │   ↓                      │
│ - スタイル    │                          │
│ - 追加指示    │   [After画像]            │
│ - 変換ボタン  │                          │
│              │   [ダウンロード]          │
│              │                          │
└──────────────┴──────────────────────────┘
```

#### デザインガイドライン
- **カラースキーム**: 白ベース、グレーアクセント（#2C3E50など）
- **フォント**: Roboto または San-serif系
- **スタイル**: プロフェッショナル、クリーン、洗練
- **ターゲット**: 建築設計者向けの信頼感あるデザイン
- **レスポンシブ**: モバイル/タブレット対応

---

## 📝 YouWare初期生成用プロンプト

```
建築設計者向けの「CAD to Photo」変換ツールを作成。

【画面構成】
横2列レイアウト（左：コントロール、右：プレビュー）

【左側：コントロールパネル】
1. タイトル：「CAD to Photo」
2. 画像アップロードエリア（ドラッグ&ドロップ対応）
3. 変換モード選択
   ◉ 家具を追加して生活感を出す
   ◯ 既存家具をフォトリアルに変換
4. スタイル選択（ドロップダウン）
   - モダン / ナチュラル / 北欧 / ミニマリスト / ラグジュアリー
5. カスタム指示入力欄（オプション）
6. 「変換する」ボタン（大きく目立つ）

【右側：プレビューエリア】
1. Before画像（アップロード画像）
2. After画像（生成結果）
3. ダウンロードボタン

【デザイン】
- 白ベース、グレーアクセント
- プロフェッショナルで洗練された印象
- 大きなプレビューエリア
- レスポンシブ対応

【技術】
- MCP toolで画像生成AIと連携
- 生成中はローディング表示

まずは基本UIを作成してください。
```

---

## 🔨 Claude Code作業指示

### 作業1: YouWare生成コードの品質向上

**想定されるYouWare生成物**:
- HTML/CSS/JavaScriptまたはReactベースのコード
- 基本的なUI構造
- 簡易的なイベントハンドリング

**Claude Codeでの改善点**:

#### 1. コード構造の整理
- コンポーネント分割（React使用の場合）
- 関数の責務を明確化
- 定数・設定の分離

#### 2. エラーハンドリング強化
```javascript
// アップロード時の検証
- ファイルサイズチェック（推奨: 10MB以下）
- ファイル形式検証（JPG/PNG）
- 空ファイルチェック

// API通信時
- タイムアウト設定
- リトライロジック
- エラーメッセージの表示
```

#### 3. プロンプトエンジニアリング実装
```javascript
// モードとスタイルに応じた最適なプロンプト生成
function generateAIPrompt(mode, style, customInput, hasImage) {
  const basePrompts = {
    addFurniture: {
      modern: "Transform this architectural CAD rendering into a photorealistic modern interior with contemporary furniture, clean lines, and ambient lighting. Add designer sofas, minimalist tables, and subtle decorative elements.",
      natural: "Transform this CAD rendering into a warm, natural interior with wooden furniture, plants, and soft natural lighting. Include organic textures and earth-tone elements.",
      scandinavian: "Convert this architectural rendering into a Scandinavian-style interior with light woods, neutral colors, and functional minimalist furniture. Add cozy textiles and indoor plants.",
      minimalist: "Transform into a minimalist photorealistic interior with essential furniture only, clean white surfaces, and strategic lighting.",
      luxury: "Create a luxurious photorealistic interior with high-end furniture, premium materials, elegant lighting, and sophisticated decorative elements."
    },
    makeRealistic: {
      modern: "Enhance this CAD rendering with photorealistic materials, realistic lighting, and high-quality textures for modern furniture.",
      natural: "Add photorealistic wood grain textures, natural fabric details, and warm realistic lighting to existing furniture.",
      scandinavian: "Apply photorealistic light wood textures, soft fabric details, and natural daylight to existing elements.",
      minimalist: "Add subtle realistic textures and soft shadows to create a photorealistic minimalist space.",
      luxury: "Apply premium material textures including leather, marble, and polished wood with sophisticated lighting."
    }
  };
  
  let prompt = basePrompts[mode][style];
  
  // カスタム指示の統合
  if (customInput && customInput.trim()) {
    prompt += ` Additional requirements: ${customInput}`;
  }
  
  return prompt;
}
```

#### 4. 状態管理の実装
```javascript
// React使用の場合
import { useState } from 'react';

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('addFurniture');
  const [style, setStyle] = useState('modern');
  const [customPrompt, setCustomPrompt] = useState('');
  
  // ...
}
```

#### 5. パフォーマンス最適化
- 画像圧縮（アップロード前）
- 遅延ローディング
- デバウンス処理（連続クリック防止）
- メモ化（useMemo, useCallback）

#### 6. アクセシビリティ
```jsx
// ARIAラベル追加例
<button 
  onClick={handleGenerate}
  aria-label="画像を変換"
  disabled={!uploadedImage || isLoading}
>
  変換する
</button>

<input
  type="file"
  accept="image/jpeg,image/png"
  aria-label="CAD画像をアップロード"
  onChange={handleImageUpload}
/>
```

### 作業2: 追加機能実装

#### 優先度: 高
1. **画像比較スライダー（Before/After）**
   - react-compare-imageなどのライブラリ使用
   - またはカスタム実装

2. **複数スタイルの一括生成**
   - 全スタイルを一度に生成
   - グリッド表示

3. **生成履歴の保存（メモリ内）**
   - 最近の5件を保持
   - クリックで再表示

4. **ギャラリービュー**
   - 生成した画像の一覧表示
   - サムネイル表示

#### 優先度: 中
1. **プリセットのカスタマイズ保存**
   - よく使う設定を保存
   - ワンクリックで適用

2. **バッチ処理（複数画像の一括変換）**
   - 複数ファイルアップロード
   - 順次処理

3. **設定のエクスポート/インポート**
   - JSON形式で保存
   - 他の環境で再利用

#### 優先度: 低
1. ユーザー認証
2. クラウド保存
3. ソーシャル共有機能

### 作業3: テスト実装

```javascript
// 単体テスト例（Jest）
describe('promptGenerator', () => {
  test('should generate correct prompt for modern furniture addition', () => {
    const prompt = generateAIPrompt('addFurniture', 'modern', '', true);
    expect(prompt).toContain('contemporary furniture');
    expect(prompt).toContain('modern interior');
  });
  
  test('should include custom input in prompt', () => {
    const customInput = 'Add a blue sofa';
    const prompt = generateAIPrompt('addFurniture', 'modern', customInput, true);
    expect(prompt).toContain(customInput);
  });
});

describe('imageValidator', () => {
  test('should reject files larger than 10MB', () => {
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg');
    expect(validateImageFile(largeFile)).toBe(false);
  });
  
  test('should accept valid JPG files', () => {
    const validFile = new File(['data'], 'test.jpg', { type: 'image/jpeg' });
    expect(validateImageFile(validFile)).toBe(true);
  });
});
```

---

## 📂 推奨ファイル構造（React使用の場合）

```
cad-to-photo/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── ControlPanel/
│   │   │   ├── index.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── ModeSelector.jsx
│   │   │   ├── StyleSelector.jsx
│   │   │   ├── CustomPromptInput.jsx
│   │   │   └── GenerateButton.jsx
│   │   ├── PreviewPanel/
│   │   │   ├── index.jsx
│   │   │   ├── BeforeImage.jsx
│   │   │   ├── AfterImage.jsx
│   │   │   ├── ImageComparison.jsx
│   │   │   └── DownloadButton.jsx
│   │   └── UI/
│   │       ├── LoadingSpinner.jsx
│   │       ├── ErrorMessage.jsx
│   │       └── Toast.jsx
│   ├── utils/
│   │   ├── promptGenerator.js
│   │   ├── imageValidator.js
│   │   ├── imageCompressor.js
│   │   └── apiClient.js
│   ├── constants/
│   │   ├── config.js
│   │   ├── styles.js
│   │   └── prompts.js
│   ├── hooks/
│   │   ├── useImageGeneration.js
│   │   ├── useImageUpload.js
│   │   └── useLocalHistory.js
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── package.json
├── README.md
└── .gitignore
```

---

## 🔑 重要な技術情報

### MCP Tool（AI App）連携について
- YouWareのMCP toolで画像生成AIと連携
- 利用可能なAI（2025年時点）:
  - Claude（テキスト生成）
  - 画像生成AI（VEO3、Midjourney、Nanobanana等）
  
### API呼び出し形式（想定）
```javascript
// YouWare環境でのAI App呼び出し（仮想コード）
const result = await youware.aiApp.generate({
  model: 'image-generation-model',
  prompt: generatedPrompt,
  image: uploadedImage,
  style: selectedStyle,
  // その他パラメータ
});
```

### ブラウザストレージの制約
⚠️ **重要**: YouWare環境では`localStorage`/`sessionStorage`が使用できない可能性
- データ保存はメモリ内（Reactのstateなど）で管理
- または代替手段を検討（IndexedDB、サーバーサイド保存など）

### 画像処理の考慮事項
```javascript
// 画像サイズ制限
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// サポート形式
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png'];

// 圧縮推奨
// 大きな画像はアップロード前に圧縮
import imageCompression from 'browser-image-compression';

async function compressImage(file) {
  const options = {
    maxSizeMB: 5,
    maxWidthOrHeight: 2048,
    useWebWorker: true
  };
  
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('圧縮エラー:', error);
    return file;
  }
}
```

---

## 📚 参考コード例

### 画像アップロードコンポーネント（React）

```jsx
import React, { useState, useCallback } from 'react';

function ImageUploader({ onImageUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, []);

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    // ファイルバリデーション
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      alert('JPGまたはPNG形式の画像をアップロードしてください');
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      alert('ファイルサイズは10MB以下にしてください');
      return;
    }

    // プレビュー表示
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      onImageUpload(file, e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="image-uploader">
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="image-upload"
          accept="image/jpeg,image/png"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="image-upload" className="upload-label">
          {preview ? (
            <img src={preview} alt="アップロード画像" className="preview-image" />
          ) : (
            <>
              <div className="upload-icon">📁</div>
              <p>画像をドラッグ&ドロップ</p>
              <p className="or-text">または</p>
              <button type="button" className="select-button">
                ファイルを選択
              </button>
            </>
          )}
        </label>
      </div>
    </div>
  );
}

export default ImageUploader;
```

### プロンプト生成ユーティリティ

```javascript
// utils/promptGenerator.js

const PROMPT_TEMPLATES = {
  addFurniture: {
    modern: `Transform this architectural CAD rendering into a photorealistic modern interior.
Add contemporary furniture including: designer sofa, minimalist coffee table, modern floor lamp.
Use clean lines, neutral colors with accent pieces, ambient lighting.
Include subtle decorative elements: abstract art, books, minimal plants.
Ensure photorealistic materials: leather, glass, polished wood.`,
    
    natural: `Convert this CAD rendering into a warm, natural interior.
Add wooden furniture: rustic dining table, natural wood chairs, bookshelf.
Include plenty of indoor plants, woven textiles, ceramic decorations.
Use warm natural lighting, earth tones, organic textures.
Photorealistic wood grain, fabric details, plant leaves.`,
    
    scandinavian: `Transform into a Scandinavian-style photorealistic interior.
Add light wood furniture: simple sofa, wooden side table, minimalist shelving.
Include cozy textiles: wool throw, linen cushions, woven rug.
White walls, natural light, neutral palette with soft colors.
Photorealistic pine/birch textures, soft fabric details.`,
    
    minimalist: `Create a minimalist photorealistic interior with essential furniture only.
Add: simple sofa or seating, one functional table, minimal storage.
Use white/neutral surfaces, clean lines, hidden lighting.
Minimal decoration, maximum 1-2 accent pieces.
Photorealistic smooth surfaces, subtle shadows.`,
    
    luxury: `Generate a luxurious photorealistic interior.
Add high-end furniture: designer sofa, marble coffee table, elegant lighting fixtures.
Include: premium decorative elements, artwork, luxury textiles.
Use sophisticated color palette, dramatic lighting, premium materials.
Photorealistic leather, marble veining, metallic finishes, crystal details.`
  },
  
  makeRealistic: {
    modern: `Enhance existing furniture with photorealistic modern materials.
Apply: smooth leather textures, brushed metal finishes, tempered glass reflections.
Add realistic lighting with soft shadows and ambient occlusion.
Include environmental reflections and subtle wear details.`,
    
    natural: `Add photorealistic natural material textures to existing furniture.
Apply: detailed wood grain, woven fabric patterns, natural stone textures.
Enhance with warm realistic lighting, soft shadows.
Include organic imperfections and natural material variations.`,
    
    scandinavian: `Apply Scandinavian-style photorealistic textures.
Use: light wood grain (pine/birch), soft linen fabrics, matte finishes.
Add natural daylight simulation with soft shadows.
Include subtle texture variations and material authenticity.`,
    
    minimalist: `Enhance with minimalist photorealistic materials.
Apply: smooth matte finishes, subtle texture variations.
Use soft diffused lighting, minimal shadows.
Include clean edges and precise material boundaries.`,
    
    luxury: `Apply premium photorealistic material textures.
Use: genuine leather grain, polished marble veining, metallic luster.
Add sophisticated lighting with highlights and reflections.
Include rich material depth and luxury finish details.`
  }
};

export function generatePrompt(mode, style, customInput = '') {
  const basePrompt = PROMPT_TEMPLATES[mode][style];
  
  if (!basePrompt) {
    console.error(`Invalid mode/style combination: ${mode}/${style}`);
    return '';
  }
  
  let finalPrompt = basePrompt;
  
  // カスタム入力の追加
  if (customInput && customInput.trim()) {
    finalPrompt += `\n\nAdditional requirements: ${customInput.trim()}`;
  }
  
  // 共通の品質向上指示
  finalPrompt += `\n\nGeneral requirements:
- 4K quality, highly detailed
- Photorealistic rendering
- Professional architectural visualization
- Proper perspective and scale
- Natural color grading`;
  
  return finalPrompt;
}

export const AVAILABLE_STYLES = {
  modern: 'モダン',
  natural: 'ナチュラル',
  scandinavian: '北欧',
  minimalist: 'ミニマリスト',
  luxury: 'ラグジュアリー'
};

export const AVAILABLE_MODES = {
  addFurniture: '家具を追加して生活感を出す',
  makeRealistic: '既存家具をフォトリアルに変換'
};
```

---

## ✅ Claude Code作業チェックリスト

### フェーズ1: コード品質向上
- [ ] YouWare生成コードのレビュー
- [ ] コンポーネント/関数の整理とリファクタリング
- [ ] エラーハンドリングの追加
- [ ] バリデーション実装（ファイルサイズ、形式）
- [ ] TypeScript型定義追加（オプション）
- [ ] コメント・JSDoc追加

### フェーズ2: 機能実装
- [ ] プロンプトエンジニアリングロジック実装
- [ ] 画像比較UI実装
- [ ] ローディング状態の適切な表示
- [ ] エラー状態の適切な表示
- [ ] ダウンロード機能の実装
- [ ] 画像圧縮機能の追加

### フェーズ3: UI/UX改善
- [ ] レスポンシブデザインの確認・調整
- [ ] アクセシビリティ対応（ARIA、キーボード操作）
- [ ] アニメーション・トランジション追加
- [ ] ユーザーフィードバック（トースト通知等）
- [ ] ローディングスピナーのデザイン

### フェーズ4: 品質保証
- [ ] ローカル環境でのテスト実行
- [ ] エッジケースの確認（大きなファイル、無効なファイル等）
- [ ] ブラウザ互換性確認（Chrome、Firefox、Safari）
- [ ] モバイル表示の確認
- [ ] パフォーマンス測定・最適化

### フェーズ5: ドキュメント作成
- [ ] README.md作成（使い方、インストール方法）
- [ ] コード内コメント追加
- [ ] API仕様書作成（必要に応じて）
- [ ] トラブルシューティングガイド

### フェーズ6: デプロイ準備
- [ ] コードの最終レビュー
- [ ] 不要なコンソールログ削除
- [ ] 環境変数の設定確認
- [ ] VSCode YouWareプラグインで公開テスト
- [ ] 本番公開

---

## 🐛 想定される課題と対策

### 課題1: AI生成の品質が不安定
**対策:**
- プロンプトの詳細化とテンプレート化
- 複数回生成してベストな結果を選択する機能
- ユーザーがパラメータ調整できるUI

### 課題2: 大きな画像のアップロード
**対策:**
- ファイルサイズ制限の明示
- 自動圧縮機能の実装
- プログレスバー表示

### 課題3: API通信の遅延
**対策:**
- ローディング状態の適切な表示
- タイムアウト設定
- リトライ機能

### 課題4: ブラウザ互換性
**対策:**
- Polyfillの使用
- 主要ブラウザでのテスト
- フォールバック機能の実装

---

## 📞 サポート・質問

### 開発中に困ったら
1. コード内のコメントを確認
2. この資料を再確認
3. YouWare公式ドキュメントを参照
4. VSCodeプラグインのヘルプを確認

### 参考リンク
- YouWare公式: https://www.youware.com
- YouWareプラグイン: https://www.youware.com/plugin
- React公式ドキュメント: https://react.dev
- MDN Web Docs: https://developer.mozilla.org

---

## 📌 次のアクション

1. **YouWareでプロトタイプ生成** 
   - 上記のプロンプトを使用
   - 基本UIの確認

2. **生成コードをClaude Codeで受け取り**
   - このドキュメントと共に作業開始
   - フェーズ1から順次実施

3. **改善・機能追加**
   - チェックリストに従って実施
   - 段階的にコミット

4. **VSCodeプラグインで公開**
   - テスト公開
   - フィードバック収集
   - 反復改善

---

**作成日**: 2025年10月5日  
**バージョン**: 1.0  
**対象**: Claude Code開発環境

このドキュメントを基に、効率的な開発を進めてください！🚀
