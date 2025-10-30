"use client"

import { useEffect, useState, useRef } from "react"
import MatrixBackground from "@/components/matrix-background"
import BackgroundAudio, { BackgroundAudioRef } from "@/components/background-audio"
import { SoundEffectManager } from "@/lib/sound-effects"
import { BackgroundPreset } from "@/lib/background-presets"

interface PresetBackgroundProps {
  preset: BackgroundPreset
  showTitle?: boolean
}

export default function PresetBackground({ preset, showTitle = false }: PresetBackgroundProps) {
  const [mounted, setMounted] = useState(false)
  const audioRef = useRef<BackgroundAudioRef>(null)
  const soundEffectManagerRef = useRef<SoundEffectManager>(new SoundEffectManager())

  const [particleCounts, setParticleCounts] = useState({
    total: 0,
    particles: 0,
    background: 0,
    ripples: 0,
    shapes: 0
  })

  const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleParticleCountChange = (counts: typeof particleCounts) => {
    setParticleCounts(counts)
    fpsCounterRef.current.frames++
  }

  // Cleanup sound effects on unmount
  useEffect(() => {
    return () => {
      soundEffectManagerRef.current.cleanup()
    }
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <BackgroundAudio ref={audioRef} />
      <MatrixBackground
        isAnimationPaused={false}
        clickEffect={preset.config.clickEffect}
        particleSpeed={preset.config.particleSpeed}
        particleCount={preset.config.particleCount}
        particleColor={preset.config.particleColor}
        particleLifetime={preset.config.particleLifetime}
        backgroundMode={preset.config.backgroundMode}
        backgroundSpeed={preset.config.backgroundSpeed}
        backgroundColor={preset.config.backgroundColor}
        rippleIntensity={preset.config.rippleIntensity}
        rippleCharacter={preset.config.rippleCharacter}
        rippleParticleLimit={preset.config.rippleParticleLimit}
        rippleFadeSpeed={preset.config.rippleFadeSpeed}
        rippleFadeFromCenter={preset.config.rippleFadeFromCenter}
        rippleMaxCount={preset.config.rippleMaxCount}
        enableTrails={preset.config.enableTrails}
        enableMouseRipples={preset.config.enableMouseRipples}
        performanceMode={preset.config.performanceMode}
        soundEffectManager={soundEffectManagerRef.current}
        onParticleCountChange={handleParticleCountChange}
      />

      {showTitle && (
        <div className="fixed top-4 left-4 z-10 bg-background/80 backdrop-blur-sm rounded-lg p-4 shadow-lg pointer-events-none">
          <h1 className="text-2xl font-bold">{preset.name}</h1>
          <p className="text-muted-foreground mt-1">{preset.description}</p>
        </div>
      )}
    </>
  )
}
