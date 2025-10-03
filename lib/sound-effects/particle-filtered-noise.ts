import { SoundEffectSystem } from './base-sound-system'

/**
 * Filtered Noise Soundscape
 * Brown noise with dynamic filtering based on particle velocity
 */
export class ParticleFilteredNoise implements SoundEffectSystem {
  name = "Filtered Noise"
  description = "Evolving filtered texture"

  private audioContext: AudioContext | null = null
  private noiseNode: AudioBufferSourceNode | null = null
  private gainNode: GainNode | null = null
  private filterNode: BiquadFilterNode | null = null
  private particleHistory: number[] = []
  private maxHistorySize = 10

  initialize() {
    if (typeof window === 'undefined') return

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    // Create brown noise
    const bufferSize = this.audioContext.sampleRate * 2
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    let lastOut = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      data[i] = (lastOut + (0.02 * white)) / 1.02
      lastOut = data[i]
      data[i] *= 3.5
    }

    this.noiseNode = this.audioContext.createBufferSource()
    this.noiseNode.buffer = buffer
    this.noiseNode.loop = true

    // Resonant low-pass filter that will modulate
    this.filterNode = this.audioContext.createBiquadFilter()
    this.filterNode.type = 'lowpass'
    this.filterNode.frequency.value = 400
    this.filterNode.Q.value = 5 // Resonance

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
    this.updateFilter(total)
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

    const targetGain = normalized * masterVolume * 0.2
    if (!isFinite(targetGain)) return

    this.gainNode.gain.setTargetAtTime(targetGain, this.audioContext.currentTime, 0.05)
  }

  private updateFilter(particleCount: number) {
    if (!this.filterNode || !this.audioContext) return

    // More particles = higher filter frequency (brighter sound)
    const targetFreq = 200 + (particleCount / 2000) * 1500
    this.filterNode.frequency.setTargetAtTime(
      Math.min(targetFreq, 2000),
      this.audioContext.currentTime,
      0.1
    )
  }
}
