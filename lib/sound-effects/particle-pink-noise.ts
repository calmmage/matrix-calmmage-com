import { SoundEffectSystem } from './base-sound-system'

/**
 * Pink Noise Soundscape
 * Softer than white noise - like ocean waves or wind
 */
export class ParticlePinkNoise implements SoundEffectSystem {
  name = "Pink Noise"
  description = "Soft noise (like ocean waves)"

  private audioContext: AudioContext | null = null
  private noiseNode: AudioBufferSourceNode | null = null
  private gainNode: GainNode | null = null
  private particleHistory: number[] = []
  private maxHistorySize = 10

  initialize() {
    if (typeof window === 'undefined') return

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    // Create pink noise (1/f spectrum)
    const bufferSize = this.audioContext.sampleRate * 2
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
      data[i] *= 0.11 // Normalize
      b6 = white * 0.115926
    }

    this.noiseNode = this.audioContext.createBufferSource()
    this.noiseNode.buffer = buffer
    this.noiseNode.loop = true

    this.gainNode = this.audioContext.createGain()
    this.gainNode.gain.value = 0

    this.noiseNode.connect(this.gainNode)
    this.gainNode.connect(this.audioContext.destination)

    this.noiseNode.start()
  }

  cleanup() {
    if (this.noiseNode) {
      this.noiseNode.stop()
      this.noiseNode.disconnect()
    }
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
    if (!isFinite(avg)) return

    const normalized = Math.min(avg / 2000, 1)
    if (!isFinite(normalized)) return

    const masterVolume = volume ?? 0.5
    if (!isFinite(masterVolume)) return

    const targetGain = normalized * masterVolume * 0.25
    if (!isFinite(targetGain)) return

    this.gainNode.gain.setTargetAtTime(targetGain, this.audioContext.currentTime, 0.05)
  }
}
