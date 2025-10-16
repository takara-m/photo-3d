// モチーフタイプ
export type MotifType = 'cute' | 'scary' | 'fantasy' | 'ancient';

// モチーフオプション
export interface MotifOption {
  value: MotifType;
  label: string;
  description: string;
  emoji: string;
}

// 利用可能なモチーフ
export const AVAILABLE_MOTIFS: MotifOption[] = [
  {
    value: 'cute',
    label: 'かわいい生物',
    description: 'ポップでキュートな生き物',
    emoji: '🐰',
  },
  {
    value: 'scary',
    label: '怖い生物',
    description: 'ダークでホラーな生き物',
    emoji: '👹',
  },
  {
    value: 'fantasy',
    label: 'ファンタジー',
    description: 'ドラゴン、妖精などの幻想生物',
    emoji: '🐉',
  },
  {
    value: 'ancient',
    label: '古代生物',
    description: '恐竜や絶滅した古代の生き物',
    emoji: '🦕',
  },
];

// 画像バリデーションエラー
export class ImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageValidationError';
  }
}

// 生成された画像の情報
export interface GeneratedImage {
  id: string;
  motif: MotifType;
  imageUrl: string;
  originalImage: string;
  timestamp: number;
}
