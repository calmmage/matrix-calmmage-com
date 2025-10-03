import { SoundEffectSystem, AudioSynthesizer } from './base-sound-system'

/**
 * Particle-based sound system: Ambient Soundscape
 *
 * Creates continuous brown noise that modulates with particle count.
 * Individual particles trigger subtle randomized blips.
 */
export class ParticleAmbientSoundscape implements SoundEffectSystem {
  name = "Ambient Soundscape"
  description = "Continuous sound texture from particles"

  private audioContext: AudioContext | null = null
  private noiseNode: AudioBufferSourceNode | null = null
  private gainNode: GainNode | null = null
  private filterNode: BiquadFilterNode | null = null
  private particleCount = 0
  private blipInterval: NodeJS.Timeout | null = null

  // Rolling average for smoothing
  private particleHistory: number[] = []
  private maxHistorySize = 10 // ~0.3 seconds at 30fps
  private averageParticleCount = 0

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
      data[i] *= 3.5 // Amplify
    }

    this.noiseNode = this.audioContext.createBufferSource()
    this.noiseNode.buffer = buffer
    this.noiseNode.loop = true

    // Filter for softer sound
    this.filterNode = this.audioContext.createBiquadFilter()
    this.filterNode.type = 'lowpass'
    this.filterNode.frequency.value = 800

    // Gain control
    this.gainNode = this.audioContext.createGain()
    this.gainNode.gain.value = 0

    // Connect: noise -> filter -> gain -> destination
    this.noiseNode.connect(this.filterNode)
    this.filterNode.connect(this.gainNode)
    this.gainNode.connect(this.audioContext.destination)

    this.noiseNode.start()

    // Random blips based on particle activity
    this.blipInterval = setInterval(() => {
      if (this.averageParticleCount > 0 && this.audioContext && this.gainNode) {
        // Random chance to blip based on average particle count
        const blipChance = Math.min(this.averageParticleCount / 500, 0.8)
        if (Math.random() < blipChance) {
          this.playBlip()
        }
      }
    }, 100)
  }

  cleanup() {
    if (this.blipInterval) {
      clearInterval(this.blipInterval)
      this.blipInterval = null
    }
    if (this.noiseNode) {
      this.noiseNode.stop()
      this.noiseNode.disconnect()
      this.noiseNode = null
    }
    if (this.filterNode) {
      this.filterNode.disconnect()
      this.filterNode = null
    }
    if (this.gainNode) {
      this.gainNode.disconnect()
      this.gainNode = null
    }
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.particleCount = 0
  }

  setVolume(volume: number) {
    this.updateVolume(volume)
  }

  private playBlip() {
    if (!this.audioContext) return

    const osc = this.audioContext.createOscillator()
    const blipGain = this.audioContext.createGain()

    const freq = 200 + Math.random() * 400
    osc.frequency.value = freq
    osc.type = 'sine'

    blipGain.gain.setValueAtTime(0.05, this.audioContext.currentTime)
    blipGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05)

    osc.connect(blipGain)
    blipGain.connect(this.audioContext.destination)

    osc.start(this.audioContext.currentTime)
    osc.stop(this.audioContext.currentTime + 0.05)
  }

  onParticleCountUpdate(total: number) {
    this.particleCount = total

    // Update rolling average
    this.particleHistory.push(total)
    if (this.particleHistory.length > this.maxHistorySize) {
      this.particleHistory.shift()
    }

    // Calculate average
    const sum = this.particleHistory.reduce((acc, val) => acc + val, 0)
    this.averageParticleCount = sum / this.particleHistory.length

    this.updateVolume()
  }

  private updateVolume(volume?: number) {
    if (!this.gainNode || !this.audioContext) return
    if (this.particleHistory.length === 0) return

    // Use average particle count for smoother response
    // Scale: 0-2000 particles → 0-1 volume
    if (!isFinite(this.averageParticleCount)) return

    const normalizedCount = Math.min(this.averageParticleCount / 2000, 1)
    if (!isFinite(normalizedCount)) return

    // Apply volume control (default to current volume if not provided)
    const masterVolume = volume ?? 0.5
    if (!isFinite(masterVolume)) return

    const targetGain = normalizedCount * masterVolume * 0.2
    if (!isFinite(targetGain)) return

    this.gainNode.gain.setTargetAtTime(targetGain, this.audioContext.currentTime, 0.05)
  }
}
