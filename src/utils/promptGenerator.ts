import type { ConversionMode, StyleType, RealisticModeOptions, FocusOptions } from '../types';

/**
 * リアル化モード専用の統一プロンプト生成
 */
function getMakeRealisticPrompt(options?: RealisticModeOptions): string {
  const lightingBrightness = options?.lightingBrightness ?? 0;
  const outdoorBrightness = options?.outdoorBrightness ?? 0;
  const enhanceSmallItems = options?.enhanceSmallItems ?? false;

  let lightingSection = `NATURAL LIGHTING:`;

  // 照明器具の明るさが設定されている場合
  if (lightingBrightness > 0) {
    const intensityLevels = [
      '', // 0: 設定なし
      'Warm ambient lighting throughout the room with gentle brightness',
      'Well-lit interior with bright ambient lighting and even illumination',
      'Strongly illuminated space with enhanced brightness from lighting fixtures',
      'Very bright interior with high illumination levels and vibrant lighting',
      'Extremely well-lit space with maximum brightness and brilliant illumination throughout'
    ];
    lightingSection += `\n- Indoor lighting level: ${intensityLevels[lightingBrightness]}`;
    lightingSection += `\n- Focus on brightening the space, not the light sources themselves`;
    lightingSection += `\n- Avoid creating bright spots or light blobs on fixtures`;
  } else {
    lightingSection += `\n- Preserve natural lighting from the original image`;
  }

  // 屋外の明るさが設定されている場合
  if (outdoorBrightness > 0) {
    const outdoorLevels = [
      '', // 0: 設定なし
      'soft natural light from windows with gentle rays',
      'comfortable daylight coming through windows',
      'bright natural sunlight streaming through windows',
      'strong outdoor light creating clear shadows and highlights',
      'intense sunlight with dramatic light rays and high contrast'
    ];
    lightingSection += `\n- Outdoor light through windows: ${outdoorLevels[outdoorBrightness]}`;
  }

  let basePrompt = `Transform existing furniture and materials into ultra-photorealistic elements with authentic real-world quality.

${lightingSection}

MATERIAL-SPECIFIC PHOTOREALISTIC TEXTURES:

Wood Materials:
- Deep, rich grain patterns with visible wood fiber direction
- Natural knots, burls, and growth rings
- Color variation within each wood piece
- Surface sheen showing light reflection along grain
- Subtle wear marks and aging on edges
- Shadow depth in grain grooves

Metal Surfaces:
- Sharp, bright highlights and reflections
- Mirror-like reflections of surroundings
- Polished surface showing fingerprints or subtle smudges
- Brushed metal showing directional grain
- Light streaks and reflective spots
- Environmental reflections clearly visible

Fabric & Textiles:
- Detailed weave pattern with individual thread visibility
- Soft shadows in fabric folds and creases
- Light diffusion through semi-transparent fabrics
- Texture depth showing pile height (for carpets/velvet)
- Natural fabric irregularities and slight pilling
- Color variation in weave pattern

Leather:
- Natural grain texture with pores visible
- Creases and wrinkles from use
- Subtle shine on worn areas
- Color depth and variation
- Surface reflections on polished leather
- Natural imperfections and character marks

Glass & Transparent Materials:
- Clear transparency with visible refraction
- Sharp reflections of light sources
- Subtle surface imperfections or dust
- Light passing through creating color shifts
- Edge highlights and reflections
- Environmental reflections and see-through clarity

Stone & Concrete:
- Surface texture with tiny pits and irregularities
- Natural color variation and veining (for marble/granite)
- Matte or polished finish clearly visible
- Shadow depth in surface texture
- Weathering and natural aging marks`;

  // 小物類のリアル化オプション
  if (enhanceSmallItems) {
    basePrompt += `

SMALL ITEMS ENHANCEMENT - Transform decorative items into photorealistic elements:

Indoor Plants:
- Replace with realistic, living plants with detailed leaf textures
- Natural green color variations and subtle imperfections
- Realistic soil, pots, and planters with authentic materials
- Visible leaf veins, natural shine, and organic shapes
- Include realistic shadows and light interaction with leaves

Tableware & Dishes (ON TABLES AND SURFACES):
- Transform ALL items on tables, countertops, and surfaces into photorealistic elements
- Replace any objects on table surfaces (dishes, cups, bowls, utensils, decorations, small items)
- Transform into photorealistic ceramic, porcelain, or glass items
- Show realistic surface reflections and material properties
- Include subtle imperfections like fingerprints or slight wear
- Natural shadows and highlights on curved surfaces
- Authentic color and glaze textures

Food Items:
- Replace with ultra-realistic food photography quality
- Show natural textures, moisture, and appetizing details
- Realistic colors with natural variations
- Proper shadows and highlights showing food dimensionality
- Include authentic imperfections that prove real food quality`;
  }

  basePrompt += `

CRITICAL REALISM REQUIREMENTS:
- Remove ALL 3D/CGI appearance - make it look like a professional photograph
- Every surface must show the depth, texture, and light interaction of real materials
- Shadows must have natural softness gradients (sharp near object, softer at edges)
- Highlights must be bright and realistic, not overblown
- Materials must look touchable, with visible tactile texture
- Light must interact naturally with each material type
- Include subtle imperfections that prove authenticity (slight dust, minor wear, natural variations)`;

  return basePrompt;
}

/**
 * プロンプトテンプレート - モード別・スタイル別
 */
const PROMPT_TEMPLATES: Record<ConversionMode, Record<StyleType, string>> = {
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
Photorealistic leather, marble veining, metallic finishes, crystal details.`,
  },

  makeRealistic: {
    // リアル化モードは動的にプロンプトを生成するため、空文字を設定
    modern: '',
    natural: '',
    scandinavian: '',
    minimalist: '',
    luxury: '',
  },
};

/**
 * ピント調整用のプロンプトセクション生成
 */
function getFocusSection(focusOptions?: FocusOptions): string {
  if (!focusOptions || focusOptions.blurIntensity === 0) {
    return '';
  }

  const { position, blurIntensity } = focusOptions;

  const positionDescriptions = {
    foreground: 'foreground elements (objects closest to camera)',
    center: 'center/middle distance elements',
    background: 'background elements (far from camera)'
  };

  const blurLevels = [
    '',
    'Subtle depth of field with slight blur on out-of-focus areas',
    'Moderate depth of field with noticeable blur on out-of-focus areas',
    'Strong depth of field with significant blur on out-of-focus areas',
    'Very strong depth of field with heavy blur on out-of-focus areas',
    'Extreme depth of field with maximum blur creating strong bokeh effect on out-of-focus areas'
  ];

  return `

DEPTH OF FIELD (Focus Adjustment):
- Sharp focus on ${positionDescriptions[position]}
- ${blurLevels[blurIntensity]}
- Professional camera depth of field effect with natural bokeh
- Maintain realistic focus transition between sharp and blurred areas`;
}

/**
 * AI画像生成用のプロンプトを生成
 * @param mode - 変換モード（家具追加 or リアル化）
 * @param style - スタイルタイプ（モダン、ナチュラル等）
 * @param customInput - ユーザーの追加指示（オプション）
 * @param realisticOptions - リアル化モード専用オプション（オプション）
 * @param focusOptions - ピント調整オプション（オプション）
 * @returns 完全なプロンプト文字列
 */
export function generatePrompt(
  mode: ConversionMode,
  style: StyleType,
  customInput: string = '',
  realisticOptions?: RealisticModeOptions,
  focusOptions?: FocusOptions
): string {
  // リアル化モードの場合は動的にプロンプトを生成
  let basePrompt: string;
  if (mode === 'makeRealistic') {
    basePrompt = getMakeRealisticPrompt(realisticOptions);
  } else {
    basePrompt = PROMPT_TEMPLATES[mode][style];
  }

  if (!basePrompt) {
    console.error(`Invalid mode/style combination: ${mode}/${style}`);
    return '';
  }

  let finalPrompt = basePrompt;

  // ピント調整の追加
  const focusSection = getFocusSection(focusOptions);
  if (focusSection) {
    finalPrompt += focusSection;
  }

  // カスタム入力の追加
  if (customInput && customInput.trim()) {
    finalPrompt += `\n\nAdditional requirements: ${customInput.trim()}`;
  }

  // 共通の品質向上指示
  finalPrompt += `\n\nGeneral requirements:
- Highly detailed, photorealistic rendering
- Professional architectural visualization
- Proper perspective and scale
- Natural color grading`;

  // 部屋の構造保持指示（重要）
  finalPrompt += `\n\nCRITICAL - Preserve room structure:
- Keep walls, floor, ceiling, windows, doors EXACTLY as they are
- Maintain original room layout, dimensions, and architectural elements
- Do NOT change wall colors, flooring, ceiling design, or window positions
- Preserve the original perspective and camera angle
- Keep all structural elements unchanged (columns, beams, architectural details)
- Only enhance or add furniture and decorative elements
- Maintain the exact same room shape and proportions`;

  return finalPrompt;
}

/**
 * プロンプトのプレビュー取得（デバッグ用）
 */
export function getPromptPreview(
  mode: ConversionMode,
  style: StyleType,
  customInput: string = '',
  realisticOptions?: RealisticModeOptions,
  focusOptions?: FocusOptions
): string {
  return generatePrompt(mode, style, customInput, realisticOptions, focusOptions);
}
