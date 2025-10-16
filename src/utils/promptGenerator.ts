import { MotifType } from '../types';

// モチーフ別のプロンプトテンプレート
const PROMPT_TEMPLATES: Record<MotifType, string> = {
  cute: `Add an adorable, cute creature to this real-world scene.
The creature should be:
- Kawaii-style with big eyes and rounded features
- Colorful and cheerful (pastel colors preferred)
- Small to medium size, fitting naturally in the environment
- Friendly and approachable appearance
- Cartoon-like but with realistic lighting and shadows

Place the creature naturally in the scene considering:
- Proper scale and perspective
- Realistic shadows matching the lighting direction
- Natural interaction with the environment (standing on ground, sitting on objects, etc.)
- Photorealistic integration while maintaining cute cartoon style`,

  scary: `Add a terrifying, scary creature to this real-world scene.
The creature should be:
- Dark and ominous appearance
- Menacing features (sharp teeth, claws, glowing eyes)
- Horror-inspired design (monster, ghost, demon-like)
- Unsettling but not excessively gory
- Medium to large size for intimidating presence

Place the creature naturally in the scene considering:
- Proper scale and perspective
- Dark, dramatic shadows and lighting
- Lurking or menacing pose
- Photorealistic integration with horror atmosphere
- Fog or darkness effects to enhance creepiness`,

  fantasy: `Add a magical fantasy creature to this real-world scene.
The creature should be:
- Mythical and enchanting (dragon, fairy, unicorn, griffin, phoenix, etc.)
- Magical and mystical appearance
- Elegant and majestic design
- Fantasy game or epic story inspired
- Glowing or shimmering magical effects

Place the creature naturally in the scene considering:
- Proper scale and perspective (can be large and impressive)
- Magical glow, sparkles, or ethereal lighting
- Majestic pose or flying position
- Photorealistic integration with fantasy elements
- Subtle magical aura or particle effects`,

  ancient: `Add a prehistoric ancient creature to this real-world scene.
The creature should be:
- Dinosaur or extinct ancient animal (T-Rex, Triceratops, Mammoth, Saber-tooth tiger, etc.)
- Scientifically accurate appearance based on paleontology
- Realistic skin texture, scales, or fur
- Powerful and imposing presence
- Natural, realistic coloring (earth tones, realistic patterns)

Place the creature naturally in the scene considering:
- Proper scale and perspective (often large and impressive)
- Realistic shadows matching natural lighting
- Natural pose and behavior
- Photorealistic integration matching documentary quality
- Detailed texture and anatomy`,
};

// 共通の品質要件
const QUALITY_REQUIREMENTS = `

General requirements:
- 8K ultra high quality, highly detailed
- Photorealistic rendering with natural lighting
- Professional compositing and integration
- Proper perspective and scale matching the photo
- Natural color grading matching the original scene
- Seamless blending with the environment
- Realistic shadows and highlights
- Natural interaction with the ground/objects
- Maintain the original scene unchanged (only add the creature)`;

/**
 * モチーフに基づいてモンスター生成プロンプトを生成
 */
export function generateMonsterPrompt(
  motif: MotifType,
  customPrompt?: string
): string {
  const basePrompt = PROMPT_TEMPLATES[motif];
  const quality = QUALITY_REQUIREMENTS;

  if (customPrompt && customPrompt.trim()) {
    return `${basePrompt}

Additional user requirements:
${customPrompt.trim()}
${quality}`;
  }

  return `${basePrompt}${quality}`;
}
