/**
 * Base interface for sound effect systems
 */
export interface SoundEffectSystem {
  name: string
  description: string
  initialize: () => void
  cleanup: () => void
  setVolume: (volume: number) => void

  // Particle-based callbacks
  onParticleCreate?: (x: number, y: number, velocityX: number, velocityY: number) => void
  onParticleUpdate?: (x: number, y: number, velocityX: number, velocityY: number, age: number) => void
  onParticleDestroy?: (x: number, y: number) => void

  // Event-based callbacks
  onBackgroundLoop?: (mode: string) => void
  onClickEvent?: (x: number, y: number, effect: string) => void
  onRippleWave?: (x: number, y: number, intensity: number) => void

  // Total particle count callback (called every frame)
  onParticleCountUpdate?: (total: number) => void
}

/**
 * Audio pool for efficient sound playback
 */
export class AudioPool {
  private pool: HTMLAudioElement[] = []
  private currentIndex = 0
  private volume = 1

  constructor(audioPath: string, poolSize: number = 10) {
    for (let i = 0; i < poolSize; i++) {
      const audio = new Audio(audioPath)
      audio.volume = this.volume
      this.pool.push(audio)
    }
  }

  play() {
    const audio = this.pool[this.currentIndex]
    audio.currentTime = 0
    audio.play().catch(() => {}) // Silently fail if can't play
    this.currentIndex = (this.currentIndex + 1) % this.pool.length
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
    this.pool.forEach(audio => audio.volume = this.volume)
  }

  cleanup() {
    this.pool.forEach(audio => {
      audio.pause()
      audio.src = ''
    })
    this.pool = []
  }
}

/**
 * Web Audio API synthesizer for generating sounds programmatically
 */
export class AudioSynthesizer {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.connect(this.audioContext.destination)
      this.masterGain.gain.value = 0.3
    }
  }

  playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext || !this.masterGain) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = type
    oscillator.frequency.value = frequency

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  playNoise(duration: number) {
    if (!this.audioContext || !this.masterGain) return

    const bufferSize = this.audioContext.sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()

    source.buffer = buffer
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    source.connect(gainNode)
    gainNode.connect(this.masterGain)

    source.start(this.audioContext.currentTime)
  }

  setVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume))
    }
  }

  cleanup() {
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
      this.masterGain = null
    }
  }
}
