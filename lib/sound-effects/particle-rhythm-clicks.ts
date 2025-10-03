import { SoundEffectSystem, AudioSynthesizer } from './base-sound-system'

/**
 * Particle-based sound system: Rhythm Clicks
 *
 * Creates rhythmic click sounds based on particle positions.
 * Particles trigger clicks when they cross certain screen zones.
 */
export class ParticleRhythmClicks implements SoundEffectSystem {
  name = "Rhythm Clicks"
  description = "Clicks when particles cross screen zones"

  private synth: AudioSynthesizer | null = null
  private particleZones = new Map<string, number>() // Track which zone each particle is in
  private screenZones = 8 // Divide screen into N horizontal zones
  private lastClickTime = 0
  private clickThrottle = 50 // Min ms between clicks

  initialize() {
    this.synth = new AudioSynthesizer()
  }

  cleanup() {
    if (this.synth) {
      this.synth.cleanup()
      this.synth = null
    }
    this.particleZones.clear()
  }

  setVolume(volume: number) {
    if (this.synth) {
      this.synth.setVolume(volume)
    }
  }

  onParticleUpdate(x: number, y: number, velocityX: number, velocityY: number, age: number) {
    if (!this.synth) return

    const particleId = `${Math.round(x)}-${Math.round(y)}-${age}`
    const zone = Math.floor((y / window.innerHeight) * this.screenZones)
    const previousZone = this.particleZones.get(particleId)

    // Play click when particle enters a new zone
    if (previousZone !== undefined && previousZone !== zone) {
      const now = Date.now()
      if (now - this.lastClickTime > this.clickThrottle) {
        // Frequency varies by zone
        const frequency = 200 + zone * 100
        this.synth.playTone(frequency, 0.05, 'square')
        this.lastClickTime = now
      }
    }

    this.particleZones.set(particleId, zone)
  }

  onParticleDestroy() {
    // Clean up old particle zone data periodically
    if (this.particleZones.size > 1000) {
      this.particleZones.clear()
    }
  }
}
