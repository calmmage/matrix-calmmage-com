/**
 * Background preset configurations for the gallery showcase
 * Each preset defines a unique visual style and theme
 */

export type BackgroundPreset = {
  id: string
  name: string
  description: string
  config: {
    performanceMode: 'high' | 'medium' | 'low'
    clickEffect: 'explosion' | 'waterfall' | 'crack' | 'star' | 'fizzle' | 'matrix_rain' | 'glitch' | 'binary' | 'cascade' | 'square' | 'diamond' | 'cube' | 'octahedron' | 'random'
    particleSpeed: number
    particleCount: number
    particleColor: string
    backgroundColor: string
    particleLifetime: number
    backgroundMode: 'matrix' | 'pulse' | 'sparkle' | 'waves' | 'grid'
    backgroundSpeed: number
    rippleIntensity: number
    rippleCharacter: string
    rippleParticleLimit: number
    rippleFadeSpeed: number
    rippleFadeFromCenter: boolean
    rippleMaxCount: number
    enableTrails: boolean
    enableMouseRipples: boolean
  }
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: 'classic-matrix',
    name: 'Classic Matrix',
    description: 'The iconic green Matrix rain effect with explosive interactions',
    config: {
      performanceMode: 'high',
      clickEffect: 'explosion',
      particleSpeed: 1.2,
      particleCount: 1.5,
      particleColor: '#1DD11D',
      backgroundColor: '#1DD11D',
      particleLifetime: 1.0,
      backgroundMode: 'matrix',
      backgroundSpeed: 1.0,
      rippleIntensity: 1.5,
      rippleCharacter: '',
      rippleParticleLimit: 30,
      rippleFadeSpeed: 0.05,
      rippleFadeFromCenter: false,
      rippleMaxCount: 50,
      enableTrails: true,
      enableMouseRipples: true,
    }
  },
  {
    id: 'neon-pulse',
    name: 'Neon Pulse',
    description: 'Vibrant pink and cyan cyberpunk vibes with pulsing background',
    config: {
      performanceMode: 'high',
      clickEffect: 'star',
      particleSpeed: 1.8,
      particleCount: 1.2,
      particleColor: '#FF0080',
      backgroundColor: '#00FFFF',
      particleLifetime: 1.5,
      backgroundMode: 'pulse',
      backgroundSpeed: 1.5,
      rippleIntensity: 2.0,
      rippleCharacter: '•',
      rippleParticleLimit: 25,
      rippleFadeSpeed: 0.08,
      rippleFadeFromCenter: true,
      rippleMaxCount: 40,
      enableTrails: true,
      enableMouseRipples: true,
    }
  },
  {
    id: 'electric-storm',
    name: 'Electric Storm',
    description: 'Chaotic lightning-like cracks with high-energy yellow particles',
    config: {
      performanceMode: 'high',
      clickEffect: 'crack',
      particleSpeed: 2.5,
      particleCount: 2.0,
      particleColor: '#FFFF00',
      backgroundColor: '#FFFF00',
      particleLifetime: 0.8,
      backgroundMode: 'waves',
      backgroundSpeed: 2.0,
      rippleIntensity: 2.5,
      rippleCharacter: '~',
      rippleParticleLimit: 35,
      rippleFadeSpeed: 0.12,
      rippleFadeFromCenter: false,
      rippleMaxCount: 60,
      enableTrails: true,
      enableMouseRipples: true,
    }
  },
  {
    id: 'cosmic-cascade',
    name: 'Cosmic Cascade',
    description: 'Purple galaxy theme with cascading waterfalls of stars',
    config: {
      performanceMode: 'high',
      clickEffect: 'cascade',
      particleSpeed: 0.8,
      particleCount: 1.8,
      particleColor: '#9932CC',
      backgroundColor: '#9932CC',
      particleLifetime: 2.0,
      backgroundMode: 'sparkle',
      backgroundSpeed: 0.6,
      rippleIntensity: 1.2,
      rippleCharacter: '*',
      rippleParticleLimit: 40,
      rippleFadeSpeed: 0.03,
      rippleFadeFromCenter: true,
      rippleMaxCount: 45,
      enableTrails: true,
      enableMouseRipples: true,
    }
  },
  {
    id: 'binary-ocean',
    name: 'Binary Ocean',
    description: 'Cool cyan waves with binary storm effects',
    config: {
      performanceMode: 'high',
      clickEffect: 'binary',
      particleSpeed: 1.3,
      particleCount: 1.6,
      particleColor: '#00FFFF',
      backgroundColor: '#00FFFF',
      particleLifetime: 1.4,
      backgroundMode: 'waves',
      backgroundSpeed: 1.2,
      rippleIntensity: 1.8,
      rippleCharacter: '1',
      rippleParticleLimit: 28,
      rippleFadeSpeed: 0.06,
      rippleFadeFromCenter: false,
      rippleMaxCount: 55,
      enableTrails: true,
      enableMouseRipples: true,
    }
  },
  {
    id: 'geometric-sunset',
    name: 'Geometric Sunset',
    description: 'Warm orange tones with geometric shapes and grid patterns',
    config: {
      performanceMode: 'high',
      clickEffect: 'diamond',
      particleSpeed: 1.0,
      particleCount: 1.3,
      particleColor: '#FF4500',
      backgroundColor: '#FF4500',
      particleLifetime: 1.6,
      backgroundMode: 'grid',
      backgroundSpeed: 0.8,
      rippleIntensity: 1.4,
      rippleCharacter: '◇',
      rippleParticleLimit: 22,
      rippleFadeSpeed: 0.04,
      rippleFadeFromCenter: true,
      rippleMaxCount: 35,
      enableTrails: true,
      enableMouseRipples: true,
    }
  },
  {
    id: 'holographic-cube',
    name: 'Holographic Cube',
    description: 'Futuristic pink holograms with 3D cube explosions',
    config: {
      performanceMode: 'high',
      clickEffect: 'cube',
      particleSpeed: 1.5,
      particleCount: 1.4,
      particleColor: '#FF1493',
      backgroundColor: '#FF1493',
      particleLifetime: 1.8,
      backgroundMode: 'pulse',
      backgroundSpeed: 1.3,
      rippleIntensity: 1.6,
      rippleCharacter: '■',
      rippleParticleLimit: 20,
      rippleFadeSpeed: 0.07,
      rippleFadeFromCenter: true,
      rippleMaxCount: 30,
      enableTrails: true,
      enableMouseRipples: true,
    }
  },
  {
    id: 'zen-garden',
    name: 'Zen Garden',
    description: 'Calm and minimal with gentle sparkles and soft trails',
    config: {
      performanceMode: 'medium',
      clickEffect: 'waterfall',
      particleSpeed: 0.5,
      particleCount: 0.8,
      particleColor: '#00FF00',
      backgroundColor: '#00FF00',
      particleLifetime: 2.5,
      backgroundMode: 'sparkle',
      backgroundSpeed: 0.4,
      rippleIntensity: 0.8,
      rippleCharacter: '∘',
      rippleParticleLimit: 15,
      rippleFadeSpeed: 0.02,
      rippleFadeFromCenter: false,
      rippleMaxCount: 25,
      enableTrails: true,
      enableMouseRipples: true,
    }
  },
  {
    id: 'glitch-dimension',
    name: 'Glitch Dimension',
    description: 'Reality-bending glitch effects with chaotic fizzle patterns',
    config: {
      performanceMode: 'high',
      clickEffect: 'glitch',
      particleSpeed: 2.2,
      particleCount: 1.7,
      particleColor: '#00FFFF',
      backgroundColor: '#FF0080',
      particleLifetime: 1.0,
      backgroundMode: 'matrix',
      backgroundSpeed: 1.8,
      rippleIntensity: 2.8,
      rippleCharacter: 'x',
      rippleParticleLimit: 32,
      rippleFadeSpeed: 0.15,
      rippleFadeFromCenter: false,
      rippleMaxCount: 65,
      enableTrails: true,
      enableMouseRipples: true,
    }
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    description: 'Mystical northern lights with flowing waves and octahedron effects',
    config: {
      performanceMode: 'high',
      clickEffect: 'octahedron',
      particleSpeed: 1.1,
      particleCount: 1.5,
      particleColor: '#00FFFF',
      backgroundColor: '#9932CC',
      particleLifetime: 2.2,
      backgroundMode: 'waves',
      backgroundSpeed: 0.7,
      rippleIntensity: 1.3,
      rippleCharacter: '≈',
      rippleParticleLimit: 26,
      rippleFadeSpeed: 0.04,
      rippleFadeFromCenter: true,
      rippleMaxCount: 42,
      enableTrails: true,
      enableMouseRipples: true,
    }
  },
  {
    id: 'retro-arcade',
    name: 'Retro Arcade',
    description: 'Nostalgic 8-bit vibes with square particles and grid aesthetics',
    config: {
      performanceMode: 'medium',
      clickEffect: 'square',
      particleSpeed: 1.4,
      particleCount: 1.2,
      particleColor: '#00FF00',
      backgroundColor: '#00FF00',
      particleLifetime: 1.5,
      backgroundMode: 'grid',
      backgroundSpeed: 1.1,
      rippleIntensity: 1.7,
      rippleCharacter: '■',
      rippleParticleLimit: 24,
      rippleFadeSpeed: 0.09,
      rippleFadeFromCenter: false,
      rippleMaxCount: 38,
      enableTrails: true,
      enableMouseRipples: true,
    }
  },
  {
    id: 'fire-and-ice',
    name: 'Fire and Ice',
    description: 'Contrasting orange and cyan with explosive fizzle effects',
    config: {
      performanceMode: 'high',
      clickEffect: 'fizzle',
      particleSpeed: 2.0,
      particleCount: 1.9,
      particleColor: '#FF4500',
      backgroundColor: '#00FFFF',
      particleLifetime: 1.2,
      backgroundMode: 'pulse',
      backgroundSpeed: 1.6,
      rippleIntensity: 2.3,
      rippleCharacter: 'o',
      rippleParticleLimit: 38,
      rippleFadeSpeed: 0.11,
      rippleFadeFromCenter: true,
      rippleMaxCount: 58,
      enableTrails: true,
      enableMouseRipples: true,
    }
  },
  {
    id: 'random-chaos',
    name: 'Random Chaos',
    description: 'Every click is a surprise with randomized effects',
    config: {
      performanceMode: 'high',
      clickEffect: 'random',
      particleSpeed: 1.5,
      particleCount: 1.5,
      particleColor: '#1DD11D',
      backgroundColor: '#FF0080',
      particleLifetime: 1.5,
      backgroundMode: 'matrix',
      backgroundSpeed: 1.5,
      rippleIntensity: 1.5,
      rippleCharacter: '',
      rippleParticleLimit: 30,
      rippleFadeSpeed: 0.05,
      rippleFadeFromCenter: false,
      rippleMaxCount: 50,
      enableTrails: true,
      enableMouseRipples: true,
    }
  }
]

// Helper function to get preset by ID
export function getPresetById(id: string): BackgroundPreset | undefined {
  return BACKGROUND_PRESETS.find(preset => preset.id === id)
}

// Helper function to get all preset IDs
export function getPresetIds(): string[] {
  return BACKGROUND_PRESETS.map(preset => preset.id)
}
