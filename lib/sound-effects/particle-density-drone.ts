import { SoundEffectSystem, AudioSynthesizer } from './base-sound-system'

/**
 * Particle-based sound system: Density Drone
 *
 * Creates an ambient drone that changes pitch based on total particle count.
 * More particles = higher/more intense sound
 */
export class ParticleDensityDrone implements SoundEffectSystem {
  name = "Density Drone"
  description = "Ambient drone intensity based on particle count"

  private synth: AudioSynthesizer | null = null
  private particleCount = 0
  private droneInterval: NodeJS.Timeout | null = null
  private minFreq = 100
  private maxFreq = 500

  initialize() {
    this.synth = new AudioSynthesizer()

    // Play continuous drone that varies with particle count
    this.droneInterval = setInterval(() => {
      if (this.synth && this.particleCount > 0) {
        const normalizedCount = Math.min(this.particleCount / 100, 1)
        const frequency = this.minFreq + (this.maxFreq - this.minFreq) * normalizedCount
        this.synth.playTone(frequency, 0.3, 'triangle')
      }
    }, 250)
  }

  cleanup() {
    if (this.droneInterval) {
      clearInterval(this.droneInterval)
      this.droneInterval = null
    }
    if (this.synth) {
      this.synth.cleanup()
      this.synth = null
    }
    this.particleCount = 0
  }

  setVolume(volume: number) {
    if (this.synth) {
      this.synth.setVolume(volume * 0.5) // Lower volume for ambient drone
    }
  }

  onParticleCreate() {
    this.particleCount++
  }

  onParticleDestroy() {
    this.particleCount = Math.max(0, this.particleCount - 1)
  }
}
