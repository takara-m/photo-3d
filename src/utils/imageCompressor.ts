import imageCompression from 'browser-image-compression';

const MAX_SIZE_MB = 5;
const MAX_WIDTH_OR_HEIGHT = 2048;

/**
 * 画像を圧縮してAPI送信用に最適化
 */
export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: MAX_SIZE_MB,
    maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT,
    useWebWorker: true,
    fileType: 'image/jpeg',
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('画像圧縮エラー:', error);
    // 圧縮に失敗した場合は元のファイルを返す
    return file;
  }
}

/**
 * Base64文字列から画像ファイルを作成
 */
export function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
