import imageCompression from 'browser-image-compression';
import { IMAGE_COMPRESSION } from '../types';

/**
 * 画像圧縮の結果
 */
export interface CompressionResult {
  success: boolean;
  compressedFile?: File;
  originalSize?: number;
  compressedSize?: number;
  error?: string;
}

/**
 * 画像ファイルを圧縮
 * @param file - 元の画像ファイル
 * @returns 圧縮結果
 */
export async function compressImage(file: File): Promise<CompressionResult> {
  try {
    const originalSize = file.size;

    // 圧縮オプション
    const options = {
      maxSizeMB: IMAGE_COMPRESSION.MAX_SIZE_MB,
      maxWidthOrHeight: IMAGE_COMPRESSION.MAX_WIDTH_OR_HEIGHT,
      useWebWorker: IMAGE_COMPRESSION.USE_WEB_WORKER,
      initialQuality: IMAGE_COMPRESSION.QUALITY,
    };

    console.log('画像圧縮開始:', {
      originalFileName: file.name,
      originalSize: `${(originalSize / (1024 * 1024)).toFixed(2)} MB`,
      options,
    });

    // 圧縮実行
    const compressedFile = await imageCompression(file, options);
    const compressedSize = compressedFile.size;

    console.log('画像圧縮完了:', {
      compressedSize: `${(compressedSize / (1024 * 1024)).toFixed(2)} MB`,
      compressionRatio: `${((1 - compressedSize / originalSize) * 100).toFixed(1)}% 削減`,
    });

    return {
      success: true,
      compressedFile,
      originalSize,
      compressedSize,
    };
  } catch (error) {
    console.error('画像圧縮エラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '画像圧縮中にエラーが発生しました',
    };
  }
}

/**
 * 画像ファイルをBase64文字列に変換
 * @param file - 画像ファイル
 * @returns Base64エンコードされた画像データ
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };

    reader.onerror = () => {
      reject(new Error('File reading failed'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Base64文字列から画像サイズ（幅・高さ）を取得
 * @param base64 - Base64エンコードされた画像データ
 * @returns 画像の幅と高さ
 */
export function getImageDimensions(base64: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = base64;
  });
}

/**
 * 圧縮が必要かどうかを判定
 * @param file - ファイル
 * @returns 圧縮が必要ならtrue
 */
export function needsCompression(file: File): boolean {
  const maxSizeBytes = IMAGE_COMPRESSION.MAX_SIZE_MB * 1024 * 1024;
  return file.size > maxSizeBytes;
}
