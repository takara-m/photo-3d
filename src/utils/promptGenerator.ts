import type { ConversionMode, StyleType, RealisticModeOptions } from '../types';

/**
 * リアル化モード専用の統一プロンプト生成
 */
function getMakeRealisticPrompt(options?: RealisticModeOptions): string {
  const lightingBrightness = options?.lightingBrightness ?? 0;
  const outdoorBrightness = options?.outdoorBrightness ?? 0;
  const enhanceSmallItems = options?.enhanceSmallItems ?? false;

  let lightingSection = `NATURAL LIGHTING - Maintain original lighting balance:
- Keep the existing light levels from the original image
- Preserve natural shadows and lighting atmosphere
- Maintain original contrast between lit areas and shadow zones`;

  // 照明器具の明るさが設定されている場合
  if (lightingBrightness > 0) {
    const intensityLevels = [
      '', // 0: 設定なし
      'warm glow from indoor lighting with visible light emission',
      'bright illumination from ceiling lights and lamps with strong light output',
      'strong indoor lighting creating well-lit ambiance with glowing fixtures',
      'very bright indoor lighting with intense illumination and radiant glow',
      'extremely bright, powerfully glowing indoor lighting with dramatic intense effect and strong light rays'
    ];
    lightingSection += `\n- Indoor lighting fixtures: ${intensityLevels[lightingBrightness]}`;
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
 * AI画像生成用のプロンプトを生成
 * @param mode - 変換モード（家具追加 or リアル化）
 * @param style - スタイルタイプ（モダン、ナチュラル等）
 * @param customInput - ユーザーの追加指示（オプション）
 * @param realisticOptions - リアル化モード専用オプション（オプション）
 * @returns 完全なプロンプト文字列
 */
export function generatePrompt(
  mode: ConversionMode,
  style: StyleType,
  customInput: string = '',
  realisticOptions?: RealisticModeOptions
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
  realisticOptions?: RealisticModeOptions
): string {
  return generatePrompt(mode, style, customInput, realisticOptions);
}
