import { useState, useCallback } from 'react';
import { Upload, Camera, Download, Loader2, Sparkles } from 'lucide-react';
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from 'react-compare-slider';
import type { ConversionMode, StyleType, GeneratedImageData, RealisticModeOptions } from './types';
import { AVAILABLE_MODES, AVAILABLE_STYLES } from './types';
import { validateImageFile } from './utils/imageValidator';
import { compressImage, fileToBase64 } from './utils/imageCompressor';
import { generatePrompt } from './utils/promptGenerator';

function App() {
  // 状態管理
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ConversionMode>('addFurniture');
  const [style, setStyle] = useState<StyleType>('modern');
  const [customPrompt, setCustomPrompt] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // リアル化モード専用オプション
  const [realisticOptions, setRealisticOptions] = useState<RealisticModeOptions>({
    lightingBrightness: 0,
    outdoorBrightness: 0,
    enhanceSmallItems: false,
  });

  // 複数スタイル一括生成用の状態
  const [isMultiGenerating, setIsMultiGenerating] = useState(false);
  const [multiGeneratedImages, setMultiGeneratedImages] = useState<GeneratedImageData[]>([]);
  const [currentGeneratingStyle, setCurrentGeneratingStyle] = useState<StyleType | null>(null);

  /**
   * 画像ファイルの処理
   */
  const handleFile = useCallback(async (file: File) => {
    // バリデーション
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || '無効なファイルです');
      return;
    }

    setError(null);
    setUploadedFile(file);

    // プレビュー表示
    try {
      const base64 = await fileToBase64(file);
      setUploadedImage(base64);
    } catch (err) {
      setError('画像の読み込みに失敗しました');
      console.error('File read error:', err);
    }
  }, []);

  /**
   * ファイル選択時の処理
   */
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files[0]) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  /**
   * ドラッグ&ドロップ処理
   */
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  /**
   * 単一スタイル画像生成処理
   */
  const generateSingleImage = useCallback(
    async (targetStyle: StyleType, file: File): Promise<string | null> => {
      try {
        // 画像圧縮
        const compressionResult = await compressImage(file);

        if (!compressionResult.success || !compressionResult.compressedFile) {
          throw new Error(compressionResult.error || '画像圧縮に失敗しました');
        }

        // プロンプト生成
        const prompt = generatePrompt(
          mode,
          targetStyle,
          customPrompt,
          mode === 'makeRealistic' ? realisticOptions : undefined
        );
        console.log(`生成プロンプト (${targetStyle}):`, prompt);

        // FormData作成
        const formData = new FormData();
        formData.append('image', compressionResult.compressedFile);
        formData.append('prompt', prompt);
        formData.append('model', 'nano-banana');
        formData.append('n', '1');
        formData.append('response_format', 'b64_json');

        // API呼び出し
        const response = await fetch('https://api.youware.com/public/v1/ai/images/edits', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer sk-YOUWARE',
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `API Error: ${response.status}`);
        }

        const data = await response.json();

        // 生成画像の取得
        if (data.data && data.data[0] && data.data[0].b64_json) {
          return `data:image/png;base64,${data.data[0].b64_json}`;
        } else {
          throw new Error('生成された画像データが見つかりません');
        }
      } catch (err) {
        console.error(`Generation error (${targetStyle}):`, err);
        throw err;
      }
    },
    [mode, customPrompt, realisticOptions]
  );

  /**
   * AI画像生成処理（単一スタイル）
   */
  const handleGenerate = useCallback(async () => {
    if (!uploadedFile) {
      setError('画像をアップロードしてください');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      console.log('画像生成を開始...');
      const imageData = await generateSingleImage(style, uploadedFile);
      if (imageData) {
        setGeneratedImage(imageData);
        console.log('画像生成成功！');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '画像生成に失敗しました';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [uploadedFile, style, generateSingleImage]);

  /**
   * 全スタイル一括生成処理
   */
  const handleGenerateAllStyles = useCallback(async () => {
    if (!uploadedFile) {
      setError('画像をアップロードしてください');
      return;
    }

    setIsMultiGenerating(true);
    setError(null);
    setMultiGeneratedImages([]);

    const results: GeneratedImageData[] = [];

    try {
      // 全スタイルを順次生成
      for (const styleOption of AVAILABLE_STYLES) {
        setCurrentGeneratingStyle(styleOption.value);
        console.log(`${styleOption.label}スタイルの生成を開始...`);

        try {
          const imageData = await generateSingleImage(styleOption.value, uploadedFile);
          if (imageData) {
            results.push({
              style: styleOption.value,
              imageData,
              timestamp: Date.now(),
            });
            setMultiGeneratedImages([...results]);
          }
        } catch (err) {
          console.error(`${styleOption.label}の生成に失敗:`, err);
          // 1つ失敗しても続行
        }
      }

      console.log(`全スタイル生成完了！ (${results.length}/${AVAILABLE_STYLES.length})`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '一括生成中にエラーが発生しました';
      setError(errorMessage);
    } finally {
      setIsMultiGenerating(false);
      setCurrentGeneratingStyle(null);
    }
  }, [uploadedFile, generateSingleImage]);

  /**
   * ダウンロード処理（単一）
   */
  const handleDownload = useCallback((imageData: string, filename?: string) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = filename || `cad-to-photo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Camera className="w-8 h-8 text-stone-700" />
              <h1 className="text-3xl font-bold text-stone-800">CAD to Photo</h1>
            </div>
            <div className="text-xs text-stone-500">
              v2025.01.16 15:30
            </div>
          </div>
          <p className="mt-2 text-sm text-stone-600">
            建築設計者向けフォトリアル変換ツール
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左パネル: コントロール */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">
                コントロールパネル
              </h2>

              {/* 画像アップロード */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  CAD画像をアップロード
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-stone-500 bg-stone-50'
                      : 'border-stone-300 hover:border-stone-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {uploadedImage ? (
                    <div className="space-y-3">
                      <img
                        src={uploadedImage}
                        alt="アップロード画像"
                        className="max-h-48 mx-auto rounded-lg shadow-sm"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-block cursor-pointer text-sm text-stone-600 hover:text-stone-800"
                      >
                        別の画像を選択
                      </label>
                    </div>
                  ) : (
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="w-12 h-12 text-stone-400" />
                      <p className="text-stone-600">画像をドラッグ&ドロップ</p>
                      <p className="text-sm text-stone-500">または</p>
                      <span className="px-4 py-2 bg-stone-600 text-white rounded-md hover:bg-stone-700 transition-colors">
                        ファイルを選択
                      </span>
                      <p className="text-xs text-stone-400 mt-2">
                        JPG, PNG (最大10MB)
                      </p>
                    </label>
                  )}
                </div>
              </div>

              {/* モード選択 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-700 mb-3">
                  変換モード
                </label>
                <div className="space-y-2">
                  {AVAILABLE_MODES.map((modeOption) => (
                    <label
                      key={modeOption.value}
                      className="flex items-start gap-3 p-3 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="mode"
                        value={modeOption.value}
                        checked={mode === modeOption.value}
                        onChange={(e) =>
                          setMode(e.target.value as ConversionMode)
                        }
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium text-stone-800">
                          {modeOption.label}
                        </div>
                        <div className="text-sm text-stone-600">
                          {modeOption.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* スタイル選択 - 家具追加モード時のみ表示 */}
              {mode === 'addFurniture' && (
                <div className="mb-6">
                  <label
                    htmlFor="style-select"
                    className="block text-sm font-medium text-stone-700 mb-2"
                  >
                    スタイル
                  </label>
                  <select
                    id="style-select"
                    value={style}
                    onChange={(e) => setStyle(e.target.value as StyleType)}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                  >
                    {AVAILABLE_STYLES.map((styleOption) => (
                      <option key={styleOption.value} value={styleOption.value}>
                        {styleOption.label} - {styleOption.description}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* リアル化モード専用オプション */}
              {mode === 'makeRealistic' && (
                <div className="mb-6 space-y-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
                  <h3 className="text-sm font-semibold text-stone-800">
                    リアル化オプション
                  </h3>

                  {/* 照明器具の明るさ */}
                  <div>
                    <label
                      htmlFor="lighting-brightness"
                      className="block text-sm font-medium text-stone-700 mb-2"
                    >
                      照明器具の明るさ: {realisticOptions.lightingBrightness}
                      {realisticOptions.lightingBrightness === 0 && ' (強調なし)'}
                    </label>
                    <input
                      type="range"
                      id="lighting-brightness"
                      min="0"
                      max="5"
                      step="1"
                      value={realisticOptions.lightingBrightness}
                      onChange={(e) =>
                        setRealisticOptions({
                          ...realisticOptions,
                          lightingBrightness: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-stone-700"
                    />
                    <div className="flex justify-between text-xs text-stone-500 mt-1">
                      <span>0 (なし)</span>
                      <span>3 (中)</span>
                      <span>5 (最大)</span>
                    </div>
                  </div>

                  {/* 屋外の明るさ */}
                  <div>
                    <label
                      htmlFor="outdoor-brightness"
                      className="block text-sm font-medium text-stone-700 mb-2"
                    >
                      屋外の明るさ: {realisticOptions.outdoorBrightness}
                      {realisticOptions.outdoorBrightness === 0 && ' (強調なし)'}
                    </label>
                    <input
                      type="range"
                      id="outdoor-brightness"
                      min="0"
                      max="5"
                      step="1"
                      value={realisticOptions.outdoorBrightness}
                      onChange={(e) =>
                        setRealisticOptions({
                          ...realisticOptions,
                          outdoorBrightness: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-stone-700"
                    />
                    <div className="flex justify-between text-xs text-stone-500 mt-1">
                      <span>0 (なし)</span>
                      <span>3 (中)</span>
                      <span>5 (最大)</span>
                    </div>
                  </div>

                  {/* 小物類のリアル化 */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={realisticOptions.enhanceSmallItems}
                        onChange={(e) =>
                          setRealisticOptions({
                            ...realisticOptions,
                            enhanceSmallItems: e.target.checked,
                          })
                        }
                        className="mt-1 w-4 h-4 accent-stone-700"
                      />
                      <div>
                        <div className="text-sm font-medium text-stone-700">
                          小物類のリアル化
                        </div>
                        <div className="text-xs text-stone-600 mt-1">
                          観葉植物、食器、食べ物をリアルなグラフィックに置き換える
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* カスタムプロンプト */}
              <div className="mb-6">
                <label
                  htmlFor="custom-prompt"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  追加指示（オプション）
                </label>
                <textarea
                  id="custom-prompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="例: 大きなソファと観葉植物を追加"
                  rows={3}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent resize-none"
                />
              </div>

              {/* 生成ボタン */}
              <div className="space-y-3">
                <button
                  onClick={handleGenerate}
                  disabled={!uploadedImage || isLoading || isMultiGenerating}
                  className="w-full px-6 py-3 bg-stone-700 text-white font-medium rounded-lg hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5" />
                      画像を変換する
                    </>
                  )}
                </button>

                {/* 全スタイル一括生成ボタン */}
                <button
                  onClick={handleGenerateAllStyles}
                  disabled={!uploadedImage || isLoading || isMultiGenerating}
                  className="w-full px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isMultiGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {currentGeneratingStyle && (
                        <span>
                          {
                            AVAILABLE_STYLES.find(
                              (s) => s.value === currentGeneratingStyle
                            )?.label
                          }
                          を生成中...
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      全スタイルを一括生成
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 右パネル: プレビュー */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">
                プレビュー
              </h2>

              {/* エラー表示 */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* 画像比較スライダー */}
              {uploadedImage && generatedImage && !isLoading ? (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-stone-700">
                      Before / After 比較
                    </h3>
                    <button
                      onClick={() =>
                        handleDownload(
                          generatedImage,
                          `cad-to-photo-${style}-${Date.now()}.png`
                        )
                      }
                      className="flex items-center gap-1 px-3 py-1 text-sm text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      ダウンロード
                    </button>
                  </div>
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-stone-200">
                    <ReactCompareSlider
                      itemOne={
                        <ReactCompareSliderImage
                          src={uploadedImage}
                          alt="Before"
                        />
                      }
                      itemTwo={
                        <ReactCompareSliderImage
                          src={generatedImage}
                          alt="After"
                        />
                      }
                      style={{ width: '100%', height: '100%' }}
                    />
                    {/* Before ラベル（左上） */}
                    <div className="absolute top-3 left-3 bg-black/75 text-white px-3 py-1.5 rounded-md text-sm font-semibold shadow-lg backdrop-blur-sm z-10">
                      Before（元画像）
                    </div>
                    {/* After ラベル（右上） */}
                    <div className="absolute top-3 right-3 bg-black/75 text-white px-3 py-1.5 rounded-md text-sm font-semibold shadow-lg backdrop-blur-sm z-10">
                      After（生成画像）
                    </div>
                  </div>
                  <p className="text-xs text-stone-500 mt-2 text-center">
                    <span className="font-medium">左がBefore（元画像）</span>、<span className="font-medium">右がAfter（生成画像）</span> ｜ スライダーをドラッグして比較
                  </p>
                </div>
              ) : (
                <>
                  {/* Before画像 */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-stone-700 mb-2">
                      Before（元画像）
                    </h3>
                    <div className="aspect-video bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                      {uploadedImage ? (
                        <img
                          src={uploadedImage}
                          alt="Before"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-stone-400">
                          画像をアップロードしてください
                        </div>
                      )}
                    </div>
                  </div>

                  {/* After画像 */}
                  <div>
                    <h3 className="text-sm font-medium text-stone-700 mb-2">
                      After（生成画像）
                    </h3>
                    <div className="aspect-video bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <Loader2 className="w-8 h-8 text-stone-400 animate-spin mx-auto mb-2" />
                            <p className="text-sm text-stone-600">
                              画像を生成中...
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-stone-400">
                          生成画像がここに表示されます
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 複数スタイル生成結果 */}
            {multiGeneratedImages.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-stone-800 mb-4">
                  全スタイル生成結果 ({multiGeneratedImages.length}/{AVAILABLE_STYLES.length})
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {multiGeneratedImages.map((item) => {
                    const styleOption = AVAILABLE_STYLES.find(
                      (s) => s.value === item.style
                    );
                    return (
                      <div
                        key={item.style}
                        className="border border-stone-200 rounded-lg overflow-hidden"
                      >
                        <div className="aspect-square bg-stone-100">
                          <img
                            src={item.imageData}
                            alt={styleOption?.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3 bg-stone-50">
                          <p className="text-sm font-medium text-stone-800">
                            {styleOption?.label}
                          </p>
                          <button
                            onClick={() =>
                              handleDownload(
                                item.imageData,
                                `cad-to-photo-${item.style}-${item.timestamp}.png`
                              )
                            }
                            className="mt-2 text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            ダウンロード
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
