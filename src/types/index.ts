/**
 * CAD to Photo アプリケーションの型定義
 */

// 変換モード
export type ConversionMode = 'addFurniture' | 'makeRealistic';

// スタイルタイプ
export type StyleType = 'modern' | 'natural' | 'scandinavian' | 'minimalist' | 'luxury';

// ピント位置
export type FocusPosition = 'foreground' | 'center' | 'background';

// ピント調整オプション
export interface FocusOptions {
  position: FocusPosition; // ピント位置（手前/中央/奥）
  blurIntensity: number; // ボケ感の強さ (0-5)
}

// リアル化モード専用オプション
export interface RealisticModeOptions {
  lightingBrightness: number; // 照明器具の明るさ (0-5)
  outdoorBrightness: number; // 屋外の明るさ (0-5)
  enhanceSmallItems: boolean; // 小物類のリアル化
}

// アプリケーション状態
export interface AppState {
  uploadedImage: string | null;
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  mode: ConversionMode;
  style: StyleType;
  customPrompt: string;
  realisticOptions: RealisticModeOptions; // リアル化モード専用オプション
  focusOptions: FocusOptions; // ピント調整オプション
}

// 複数スタイル生成用の画像データ
export interface GeneratedImageData {
  style: StyleType;
  imageData: string;
  timestamp: number;
}

// 複数画像生成の状態
export interface MultiGenerationState {
  isGenerating: boolean;
  currentStyle: StyleType | null;
  progress: number; // 0-100
  generatedImages: GeneratedImageData[];
}

// 画像生成リクエスト
export interface GenerationRequest {
  imageFile: File;
  mode: ConversionMode;
  style: StyleType;
  customPrompt?: string;
  realisticOptions?: RealisticModeOptions; // リアル化モード専用オプション
  focusOptions?: FocusOptions; // ピント調整オプション
}

// 画像生成レスポンス
export interface GenerationResponse {
  success: boolean;
  imageData?: string; // base64 encoded image
  error?: string;
}

// スタイルオプション
export interface StyleOption {
  value: StyleType;
  label: string;
  description: string;
}

// モードオプション
export interface ModeOption {
  value: ConversionMode;
  label: string;
  description: string;
}

// 定数: 利用可能なスタイル
export const AVAILABLE_STYLES: StyleOption[] = [
  {
    value: 'modern',
    label: 'モダン',
    description: '現代的で洗練されたデザイン',
  },
  {
    value: 'natural',
    label: 'ナチュラル',
    description: '温かみのある自然素材',
  },
  {
    value: 'scandinavian',
    label: '北欧',
    description: 'シンプルで機能的',
  },
  {
    value: 'minimalist',
    label: 'ミニマリスト',
    description: '必要最小限の美',
  },
  {
    value: 'luxury',
    label: 'ラグジュアリー',
    description: '高級感あふれる空間',
  },
];

// 定数: 利用可能なモード
export const AVAILABLE_MODES: ModeOption[] = [
  {
    value: 'addFurniture',
    label: '家具を追加',
    description: '無機質な部屋に家具・装飾を自動配置',
  },
  {
    value: 'makeRealistic',
    label: 'リアル化',
    description: '既存家具をフォトリアルな質感に変換',
  },
];

// 画像バリデーション設定
export const IMAGE_VALIDATION = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  SUPPORTED_FORMATS: ['image/jpeg', 'image/png'],
  SUPPORTED_EXTENSIONS: ['.jpg', '.jpeg', '.png'],
} as const;

// 画像圧縮設定
export const IMAGE_COMPRESSION = {
  MAX_SIZE_MB: 5,
  MAX_WIDTH_OR_HEIGHT: 2048,
  QUALITY: 0.8,
  USE_WEB_WORKER: true,
} as const;
