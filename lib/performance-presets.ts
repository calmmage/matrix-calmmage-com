/**
 * Performance presets for the Matrix background
 * These presets control performance-heavy settings to ensure smooth rendering
 */

export type PerformanceMode = 'high' | 'medium' | 'low';

export interface PerformancePreset {
  // Particle settings
  particleCount: { min: number; max: number };
  particleLifetime: { min: number; max: number };

  // Ripple settings
  rippleParticleLimit: { min: number; max: number };
  rippleMaxCount: { min: number; max: number };

  // Background settings
  allowedBackgroundModes: Array<'matrix' | 'pulse' | 'sparkle' | 'waves' | 'grid'>;

  // Effect settings
  allowed3DShapes: boolean; // Whether 3D shapes (cube, octahedron) are allowed
  allowedEffects: Array<'explosion' | 'waterfall' | 'crack' | 'star' | 'fizzle' | 'matrix_rain' | 'glitch' | 'binary' | 'cascade' | 'square' | 'diamond' | 'cube' | 'octahedron' | 'random'>;
}

export const PERFORMANCE_PRESETS: Record<PerformanceMode, PerformancePreset> = {
  high: {
    // No restrictions - full quality
    particleCount: { min: 0.5, max: 3 },
    particleLifetime: { min: 0.2, max: 30 },
    rippleParticleLimit: { min: 1, max: 50 },
    rippleMaxCount: { min: 5, max: 200 },
    allowedBackgroundModes: ['matrix', 'pulse', 'sparkle', 'waves', 'grid'],
    allowed3DShapes: true,
    allowedEffects: ['explosion', 'waterfall', 'crack', 'star', 'fizzle', 'matrix_rain', 'glitch', 'binary', 'cascade', 'square', 'diamond', 'cube', 'octahedron', 'random']
  },

  medium: {
    // Moderate restrictions for balanced performance
    particleCount: { min: 0.5, max: 2 },
    particleLifetime: { min: 0.2, max: 15 },
    rippleParticleLimit: { min: 1, max: 30 },
    rippleMaxCount: { min: 5, max: 100 },
    allowedBackgroundModes: ['matrix', 'pulse', 'sparkle', 'waves', 'grid'],
    allowed3DShapes: true,
    allowedEffects: ['explosion', 'waterfall', 'crack', 'star', 'fizzle', 'matrix_rain', 'glitch', 'binary', 'cascade', 'square', 'diamond', 'cube', 'octahedron', 'random']
  },

  low: {
    // Heavy restrictions for maximum performance
    particleCount: { min: 0.5, max: 1.2 },
    particleLifetime: { min: 0.2, max: 5 },
    rippleParticleLimit: { min: 1, max: 8 },
    rippleMaxCount: { min: 5, max: 25 },
    allowedBackgroundModes: ['matrix', 'sparkle', 'grid'], // Exclude pulse and waves (most intensive)
    allowed3DShapes: false, // No 3D shapes in low mode
    allowedEffects: ['explosion', 'waterfall', 'crack', 'star', 'matrix_rain', 'binary', 'cascade', 'square', 'diamond', 'random'] // No fizzle, glitch, cube, octahedron
  }
};

/**
 * Clamp a value to the preset's allowed range
 */
export function clampToPreset(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Get a random value within the preset's allowed range
 */
export function randomInPreset(min: number, max: number, decimals: number = 1): number {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

/**
 * Check if an effect is allowed in the current performance mode
 */
export function isEffectAllowed(
  effect: string,
  mode: PerformanceMode
): boolean {
  return PERFORMANCE_PRESETS[mode].allowedEffects.includes(effect as any);
}

/**
 * Check if a background mode is allowed in the current performance mode
 */
export function isBackgroundModeAllowed(
  backgroundMode: string,
  mode: PerformanceMode
): boolean {
  return PERFORMANCE_PRESETS[mode].allowedBackgroundModes.includes(backgroundMode as any);
}

/**
 * Get a random effect that's allowed in the current performance mode
 */
export function getRandomAllowedEffect(mode: PerformanceMode): string {
  const allowed = PERFORMANCE_PRESETS[mode].allowedEffects;
  return allowed[Math.floor(Math.random() * allowed.length)];
}

/**
 * Get a random background mode that's allowed in the current performance mode
 */
export function getRandomAllowedBackgroundMode(mode: PerformanceMode): string {
  const allowed = PERFORMANCE_PRESETS[mode].allowedBackgroundModes;
  return allowed[Math.floor(Math.random() * allowed.length)];
}

/**
 * Performance mode descriptions for UI
 */
export const PERFORMANCE_MODE_DESCRIPTIONS: Record<PerformanceMode, string> = {
  high: 'Full quality - All effects enabled, no restrictions',
  medium: 'Balanced - Moderate limits on particle counts',
  low: 'Best performance - Heavy restrictions, no 3D shapes'
};
