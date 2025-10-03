# Sound Effects System

## Overview

This project supports both **particle-based** and **event-based** sound effects. The system is modular and extensible.

## Finding Sound Effects

### Free Sound Libraries

1. **[Freesound.org](https://freesound.org/)** - Large library with CC licenses
   - Search: "keyboard typing", "digital beep", "click", "glitch"
   - Download as MP3 or WAV

2. **[Zapsplat.com](https://zapsplat.com/)** - Professional quality (free account required)
   - Categories: UI sounds, digital effects, whooshes

3. **[Pixabay](https://pixabay.com/sound-effects/)** - Free sounds and music
   - Search: "computer", "matrix", "digital"

4. **[BBC Sound Effects](https://sound-effects.bbcrewind.co.uk/)** - BBC archive
   - Historical and modern effects

### Sound Ideas for Matrix Theme

- **Typing sounds**: mechanical keyboard, typewriter
- **Digital**: beeps, blips, data transfer, binary
- **Clicks**: mouse click, tap, drop
- **Whoosh**: wind, swoosh, fast movement
- **Glitch**: static, interference, distortion
- **Ambient**: drone, hum, atmospheric

## Current Implementations

### Particle-Based Systems

These use **Web Audio API** to generate sounds programmatically (no files needed):

1. **Velocity Synth** (`particle-velocity-synth.ts`)
   - Particles create tones based on speed
   - Fast = high frequency, slow = low frequency

2. **Density Drone** (`particle-density-drone.ts`)
   - Ambient drone that changes with particle count
   - More particles = higher/more intense sound

3. **Rhythm Clicks** (`particle-rhythm-clicks.ts`)
   - Clicks when particles cross screen zones
   - Creates rhythmic patterns

4. **Chaos Noise** (`particle-chaos-noise.ts`)
   - White noise bursts for high-energy scenes
   - Glitchy, chaotic sounds

### Event-Based Systems (To Be Implemented)

To add event-based sounds with audio files:

1. Create a new file in `lib/sound-effects/`
2. Implement the `SoundEffectSystem` interface
3. Use `AudioPool` for efficient playback of sound files
4. Implement callbacks:
   - `onBackgroundLoop` - looped ambient sounds for background animations
   - `onClickEvent` - one-shot sounds for click effects
   - `onRippleWave` - sounds for ripple/wave effects
5. Register in `lib/sound-effects/index.ts`

### Example: Event-Based System with Audio Files

```typescript
import { SoundEffectSystem, AudioPool } from './base-sound-system'

export class EventBasedClicks implements SoundEffectSystem {
  name = "Click Sounds"
  description = "Audio files for click events"

  private clickPool: AudioPool | null = null

  initialize() {
    // Create audio pool with pre-loaded sound files
    this.clickPool = new AudioPool('/sounds/click.mp3', 10)
  }

  cleanup() {
    if (this.clickPool) {
      this.clickPool.cleanup()
      this.clickPool = null
    }
  }

  setVolume(volume: number) {
    if (this.clickPool) {
      this.clickPool.setVolume(volume)
    }
  }

  onClickEvent(x: number, y: number, effect: string) {
    // Play click sound when user clicks
    if (this.clickPool) {
      this.clickPool.play()
    }
  }
}
```

## Adding Sound Files

1. Download sounds from sources above
2. Place in `public/sounds/` directory
3. Reference in code: `/sounds/filename.mp3`
4. Use `AudioPool` for multiple simultaneous playback

## Web Audio API Synthesizer

The `AudioSynthesizer` class generates sounds without files:

- `playTone(frequency, duration, type)` - Generate tones
  - Types: 'sine', 'square', 'triangle', 'sawtooth'
- `playNoise(duration)` - Generate white noise

Perfect for procedural/generative sound design!
