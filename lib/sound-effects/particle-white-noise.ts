import { SoundEffectSystem } from './base-sound-system'

/**
 * White Noise Soundscape
 * Bright, crispy static sound - like TV static or rain
 */
export class ParticleWhiteNoise implements SoundEffectSystem {
  name = "White Noise"
  description = "Bright static texture (like rain)"

  private audioContext: AudioContext | null = null
  private noiseNode: AudioBufferSourceNode | null = null
  private gainNode: GainNode | null = null
  private filterNode: BiquadFilterNode | null = null
  private particleHistory: number[] = []
  private maxHistorySize = 10

  initialize() {
    if (typeof window === 'undefined') return

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    // Create white noise
    const bufferSize = this.audioContext.sampleRate * 2
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    this.noiseNode = this.audioContext.createBufferSource()
    this.noiseNode.buffer = buffer
    this.noiseNode.loop = true

    // High-pass filter for brightness
    this.filterNode = this.audioContext.createBiquadFilter()
    this.filterNode.type = 'highpass'
    this.filterNode.frequency.value = 500

    this.gainNode = this.audioContext.createGain()
    this.gainNode.gain.value = 0

    this.noiseNode.connect(this.filterNode)
    this.filterNode.connect(this.gainNode)
    this.gainNode.connect(this.audioContext.destination)

    this.noiseNode.start()
  }

  cleanup() {
    if (this.noiseNode) {
      this.noiseNode.stop()
      this.noiseNode.disconnect()
    }
    if (this.filterNode) this.filterNode.disconnect()
    if (this.gainNode) this.gainNode.disconnect()
    if (this.audioContext) this.audioContext.close()
    this.particleHistory = []
  }

  setVolume(volume: number) {
    this.updateVolume(volume)
  }

  onParticleCountUpdate(total: number) {
    this.particleHistory.push(total)
    if (this.particleHistory.length > this.maxHistorySize) {
      this.particleHistory.shift()
    }
    this.updateVolume()
  }

  private updateVolume(volume?: number) {
    if (!this.gainNode || !this.audioContext) return
    if (this.particleHistory.length === 0) return

    const avg = this.particleHistory.reduce((s, v) => s + v, 0) / this.particleHistory.length
    const normalized = Math.min(avg / 2000, 1)
    const masterVolume = volume ?? 0.5
    const targetGain = normalized * masterVolume * 0.15

    if (!isFinite(targetGain)) return

    this.gainNode.gain.setTargetAtTime(targetGain, this.audioContext.currentTime, 0.05)
  }
}
