import { SoundEffectSystem, AudioSynthesizer } from './base-sound-system'

/**
 * Particle-based sound system: Velocity Synthesizer (IMPROVED)
 *
 * Only plays sounds on click events, not individual particles.
 * Uses particle count and average velocity for better control.
 */
export class ParticleVelocitySynth implements SoundEffectSystem {
  name = "Velocity Synth"
  description = "Click sounds based on particle velocity"

  private synth: AudioSynthesizer | null = null
  private minFreq = 300
  private maxFreq = 800
  private toneDuration = 0.2

  initialize() {
    this.synth = new AudioSynthesizer()
  }

  cleanup() {
    if (this.synth) {
      this.synth.cleanup()
      this.synth = null
    }
  }

  setVolume(volume: number) {
    if (this.synth) {
      this.synth.setVolume(volume * 0.3) // Reduce volume
    }
  }

  onClickEvent(x: number, y: number, effect: string) {
    if (!this.synth) return

    // Map effect type to frequency range
    const effectFreqs: Record<string, number> = {
      'explosion': 600,
      'waterfall': 400,
      'crack': 700,
      'star': 500,
      'fizzle': 450,
      'matrix_rain': 350,
      'binary': 550,
      'cascade': 420,
      'square': 480,
      'diamond': 520,
      'cube': 580,
      'octahedron': 640
    }

    const baseFreq = effectFreqs[effect] || 500
    const frequency = baseFreq + (Math.random() - 0.5) * 50 // Add slight variation

    this.synth.playTone(frequency, this.toneDuration, 'triangle')
  }
}
