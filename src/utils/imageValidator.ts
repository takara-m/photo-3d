import { ImageValidationError } from '../types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

/**
 * 画像ファイルをバリデーション
 */
export function validateImage(file: File): void {
  // ファイルサイズチェック
  if (file.size > MAX_FILE_SIZE) {
    throw new ImageValidationError(
      `ファイルサイズが大きすぎます。${MAX_FILE_SIZE / (1024 * 1024)}MB以下のファイルを選択してください。`
    );
  }

  // ファイル形式チェック
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ImageValidationError(
      'サポートされていないファイル形式です。JPGまたはPNG形式の画像を選択してください。'
    );
  }
}

/**
 * 画像のプレビューURLを生成
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('画像の読み込みに失敗しました'));
      }
    };
    reader.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
    reader.readAsDataURL(file);
  });
}
