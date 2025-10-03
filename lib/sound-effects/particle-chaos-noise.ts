import { SoundEffectSystem, AudioSynthesizer } from './base-sound-system'

/**
 * Particle-based sound system: Chaos Noise
 *
 * Generates white noise bursts based on particle velocity and count.
 * Creates chaotic, glitchy sounds for high-energy scenes.
 */
export class ParticleChaosNoise implements SoundEffectSystem {
  name = "Chaos Noise"
  description = "Glitchy noise based on particle chaos"

  private synth: AudioSynthesizer | null = null
  private recentParticles: Array<{ velocity: number, time: number }> = []
  private chaosThreshold = 50 // Trigger noise when recent particles exceed this
  private lastNoiseTime = 0
  private noiseThrottle = 200 // Min ms between noise bursts

  initialize() {
    this.synth = new AudioSynthesizer()
  }

  cleanup() {
    if (this.synth) {
      this.synth.cleanup()
      this.synth = null
    }
    this.recentParticles = []
  }

  setVolume(volume: number) {
    if (this.synth) {
      this.synth.setVolume(volume)
    }
  }

  onParticleCreate(x: number, y: number, velocityX: number, velocityY: number) {
    if (!this.synth) return

    const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY)
    const now = Date.now()

    // Track recent particles (last 500ms)
    this.recentParticles.push({ velocity, time: now })
    this.recentParticles = this.recentParticles.filter(p => now - p.time < 500)

    // Calculate total velocity of recent particles
    const totalVelocity = this.recentParticles.reduce((sum, p) => sum + p.velocity, 0)

    // Trigger noise burst if chaos level is high
    if (totalVelocity > this.chaosThreshold && now - this.lastNoiseTime > this.noiseThrottle) {
      const noiseDuration = 0.05 + Math.random() * 0.1 // 50-150ms
      this.synth.playNoise(noiseDuration)
      this.lastNoiseTime = now
    }
  }
}
