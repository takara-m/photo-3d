import { IMAGE_VALIDATION } from '../types';

/**
 * 画像ファイルのバリデーション結果
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * 画像ファイルのバリデーション
 * @param file - チェックするファイル
 * @returns バリデーション結果
 */
export function validateImageFile(file: File): ValidationResult {
  // ファイルが存在するか
  if (!file) {
    return {
      valid: false,
      error: 'ファイルが選択されていません',
    };
  }

  // ファイルサイズチェック（10MB以下）
  if (file.size > IMAGE_VALIDATION.MAX_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `ファイルサイズが大きすぎます（${sizeMB}MB）。${IMAGE_VALIDATION.MAX_SIZE_MB}MB以下のファイルを選択してください。`,
    };
  }

  // ファイル形式チェック（JPG/PNG）
  if (!IMAGE_VALIDATION.SUPPORTED_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: `サポートされていないファイル形式です。JPGまたはPNG形式の画像を選択してください。（現在: ${file.type || '不明'}）`,
    };
  }

  // 空ファイルチェック
  if (file.size === 0) {
    return {
      valid: false,
      error: 'ファイルが空です。有効な画像ファイルを選択してください。',
    };
  }

  return {
    valid: true,
  };
}

/**
 * ファイル拡張子のチェック
 * @param filename - ファイル名
 * @returns 有効な拡張子かどうか
 */
export function hasValidExtension(filename: string): boolean {
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return IMAGE_VALIDATION.SUPPORTED_EXTENSIONS.includes(extension);
}

/**
 * ファイルサイズを人間が読みやすい形式に変換
 * @param bytes - バイト数
 * @returns フォーマットされた文字列（例: "2.5 MB"）
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * ドラッグ&ドロップイベントから画像ファイルを抽出
 * @param event - ドラッグイベント
 * @returns 画像ファイル（見つからない場合はnull）
 */
export function extractImageFromDragEvent(
  event: React.DragEvent<HTMLElement>
): File | null {
  const files = event.dataTransfer.files;

  if (files.length === 0) {
    return null;
  }

  const file = files[0];

  // 画像ファイルかチェック
  if (!file.type.startsWith('image/')) {
    return null;
  }

  return file;
}
