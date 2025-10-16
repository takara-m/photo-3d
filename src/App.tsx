import { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, Download, X } from 'lucide-react';
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from 'react-compare-slider';
import { AVAILABLE_MOTIFS, MotifType, ImageValidationError } from './types';
import { generateMonsterPrompt } from './utils/promptGenerator';
import { validateImage, createImagePreview } from './utils/imageValidator';
import { compressImage } from './utils/imageCompressor';

function App() {
  const [selectedMotif, setSelectedMotif] = useState<MotifType>('cute');
  const [customPrompt, setCustomPrompt] = useState('');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // ファイル選択処理
  const handleFileSelect = async (file: File) => {
    try {
      setError(null);
      validateImage(file);
      const preview = await createImagePreview(file);
      setOriginalImage(preview);
      setGeneratedImage(null);
    } catch (err) {
      if (err instanceof ImageValidationError) {
        setError(err.message);
      } else {
        setError('画像の読み込みに失敗しました');
      }
    }
  };

  // ファイルアップロード
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // カメラ撮影
  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // ドラッグ&ドロップ
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // モンスター生成
  const handleGenerate = async () => {
    if (!originalImage) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Base64からFileオブジェクトを作成
      const response = await fetch(originalImage);
      const blob = await response.blob();
      const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });

      // 画像を圧縮
      const compressedFile = await compressImage(file);

      // プロンプト生成
      const prompt = generateMonsterPrompt(selectedMotif, customPrompt);
      console.log(`生成プロンプト (${selectedMotif}):`, prompt);

      // FormDataを作成
      const formData = new FormData();
      formData.append('image', compressedFile);
      formData.append('prompt', prompt);
      formData.append('model', 'nano-banana');
      formData.append('n', '1');
      formData.append('response_format', 'b64_json');

      // API呼び出し（YouWare AIエンドポイント）
      const apiResponse = await fetch('https://api.youware.com/public/v1/ai/images/edits', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer sk-YOUWARE',
        },
        body: formData,
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${apiResponse.status}`);
      }

      const data = await apiResponse.json();

      // 生成画像の取得
      if (data.data && data.data[0] && data.data[0].b64_json) {
        setGeneratedImage(`data:image/png;base64,${data.data[0].b64_json}`);
        console.log('モンスター生成成功！');
      } else {
        throw new Error('生成された画像データが見つかりません');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(
        err instanceof Error ? err.message : 'モンスターの生成に失敗しました'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // 画像ダウンロード
  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `monster-finder-${Date.now()}.jpg`;
    link.click();
  };

  // リセット
  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setError(null);
    setCustomPrompt('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🔍 Monster Finder
          </h1>
          <p className="text-blue-200 text-lg">
            カメラで現実世界にモンスターを出現させよう！
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20">
          {/* 画像アップロード/カメラエリア */}
          {!originalImage ? (
            <div className="space-y-4">
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors bg-white/5"
              >
                <div className="space-y-4">
                  <Camera className="w-16 h-16 mx-auto text-blue-300" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      写真を撮影またはアップロード
                    </h3>
                    <p className="text-blue-200 text-sm">
                      現実世界の画像にモンスターを出現させます
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {/* カメラ撮影ボタン */}
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      <Camera className="w-5 h-5" />
                      カメラで撮影
                    </button>

                    {/* ファイル選択ボタン */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Upload className="w-5 h-5" />
                      ファイルを選択
                    </button>
                  </div>

                  <p className="text-blue-300 text-xs">
                    対応形式: JPG, PNG（最大10MB）
                  </p>
                </div>
              </div>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* 画像表示エリア */}
              <div className="relative">
                {generatedImage ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-white text-sm font-medium">
                        スライダーで比較: 左=元の写真 | 右=モンスター出現
                      </p>
                      <button
                        onClick={handleReset}
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="rounded-xl overflow-hidden border-2 border-white/20 relative">
                      <ReactCompareSlider
                        itemOne={
                          <ReactCompareSliderImage
                            src={originalImage}
                            alt="元の写真"
                          />
                        }
                        itemTwo={
                          <ReactCompareSliderImage
                            src={generatedImage}
                            alt="モンスター出現"
                          />
                        }
                        position={50}
                        className="w-full"
                      />
                      {/* ラベル */}
                      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                        元の写真
                      </div>
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                        モンスター出現
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-white text-sm font-medium">
                        撮影した写真
                      </p>
                      <button
                        onClick={handleReset}
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <img
                      src={originalImage}
                      alt="撮影した写真"
                      className="w-full rounded-xl border-2 border-white/20"
                    />
                  </div>
                )}
              </div>

              {/* モチーフ選択 */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  モンスターのモチーフを選択
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {AVAILABLE_MOTIFS.map((motif) => (
                    <button
                      key={motif.value}
                      onClick={() => setSelectedMotif(motif.value)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedMotif === motif.value
                          ? 'border-purple-400 bg-purple-500/30 shadow-lg'
                          : 'border-white/20 bg-white/5 hover:border-white/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{motif.emoji}</span>
                        <div>
                          <div className="text-white font-medium">
                            {motif.label}
                          </div>
                          <div className="text-blue-200 text-xs">
                            {motif.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 追加指示 */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  追加の指示（オプション）
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="例: 大きなドラゴンを空に配置してください"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                  rows={3}
                />
              </div>

              {/* アクションボタン */}
              <div className="flex gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      モンスターを出現させる
                    </>
                  )}
                </button>

                {generatedImage && (
                  <button
                    onClick={handleDownload}
                    className="px-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                    保存
                  </button>
                )}
              </div>
            </div>
          )}

          {/* エラー表示 */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              {error}
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="text-center mt-8 text-blue-200 text-sm">
          <p>Powered by Youware AI & Nano Banana</p>
        </div>
      </div>
    </div>
  );
}

export default App;
