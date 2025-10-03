import { SoundEffectSystem } from './base-sound-system'
import { ParticleVelocitySynth } from './particle-velocity-synth'
import { ParticleDensityDrone } from './particle-density-drone'
import { ParticleRhythmClicks } from './particle-rhythm-clicks'
import { ParticleChaosNoise } from './particle-chaos-noise'
import { ParticleAmbientSoundscape } from './particle-ambient-soundscape'
import { ParticleWhiteNoise } from './particle-white-noise'
import { ParticlePinkNoise } from './particle-pink-noise'
import { ParticleFilteredNoise } from './particle-filtered-noise'

export * from './base-sound-system'

/**
 * Registry of all available sound effect systems
 */
export const SOUND_EFFECT_SYSTEMS = {
  none: {
    name: 'None',
    description: 'No sound effects',
    create: () => null
  },
  brownNoise: {
    name: 'Brown Noise (Original)',
    description: 'Deep, warm continuous texture',
    create: () => new ParticleAmbientSoundscape()
  },
  whiteNoise: {
    name: 'White Noise',
    description: 'Bright static (like rain)',
    create: () => new ParticleWhiteNoise()
  },
  pinkNoise: {
    name: 'Pink Noise',
    description: 'Soft waves (like ocean)',
    create: () => new ParticlePinkNoise()
  },
  filteredNoise: {
    name: 'Filtered Noise',
    description: 'Evolving resonant texture',
    create: () => new ParticleFilteredNoise()
  },
  // velocitySynth: {
  //   name: 'Click Tones',
  //   description: 'Different tones for each click effect',
  //   create: () => new ParticleVelocitySynth()
  // },
  // densityDrone: {
  //   name: 'Density Drone',
  //   description: 'Pulsing drone (has beeps)',
  //   create: () => new ParticleDensityDrone()
  // },
  // rhythmClicks: {
  //   name: 'Rhythm Clicks',
  //   description: 'Clicks when particles cross zones',
  //   create: () => new ParticleRhythmClicks()
  // },
  // chaosNoise: {
  //   name: 'Chaos Noise',
  //   description: 'Glitchy noise bursts',
  //   create: () => new ParticleChaosNoise()
  // }
} as const

export type SoundEffectType = keyof typeof SOUND_EFFECT_SYSTEMS

/**
 * Sound Effect Manager
 * Manages the active sound effect system and volume
 */
export class SoundEffectManager {
  private currentSystem: SoundEffectSystem | null = null
  private currentType: SoundEffectType = 'none'
  private volume = 0.5

  setSystem(type: SoundEffectType) {
    // Cleanup old system
    if (this.currentSystem) {
      this.currentSystem.cleanup()
      this.currentSystem = null
    }

    this.currentType = type

    // Initialize new system
    const systemConfig = SOUND_EFFECT_SYSTEMS[type]
    if (!systemConfig) {
      console.error(`Sound effect system '${type}' not found`)
      return
    }

    const system = systemConfig.create()

    if (system) {
      system.initialize()
      system.setVolume(this.volume)
      this.currentSystem = system
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.currentSystem) {
      this.currentSystem.setVolume(this.volume)
    }
  }

  getCurrentSystem() {
    return this.currentSystem
  }

  getCurrentType() {
    return this.currentType
  }

  cleanup() {
    if (this.currentSystem) {
      this.currentSystem.cleanup()
      this.currentSystem = null
    }
  }
}
