"use client"

import { useEffect, useState, useRef } from "react"
import MatrixBackground from "@/components/matrix-background"
import BackgroundAudio, { BackgroundAudioRef } from "@/components/background-audio"
import { SoundEffectManager } from "@/lib/sound-effects"
import { type BackgroundMode, type BackgroundInfo } from "@/lib/backgrounds"

interface BackgroundViewerProps {
  background: BackgroundInfo
}

export default function BackgroundViewer({ background }: BackgroundViewerProps) {
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
        clickEffect="random"
        particleSpeed={1}
        particleCount={1}
        particleColor={background.color}
        particleLifetime={1}
        backgroundMode={background.id as BackgroundMode}
        backgroundSpeed={1}
        backgroundColor={background.color}
        rippleIntensity={1}
        rippleCharacter=""
        rippleParticleLimit={20}
        rippleFadeSpeed={0.05}
        rippleFadeFromCenter={false}
        rippleMaxCount={50}
        enableTrails={true}
        enableMouseRipples={true}
        performanceMode="high"
        soundEffectManager={soundEffectManagerRef.current}
        onParticleCountChange={handleParticleCountChange}
      />

      <div className="fixed top-4 left-4 z-10 bg-background/80 backdrop-blur-sm rounded-lg p-4 shadow-lg pointer-events-none">
        <h1 className="text-2xl font-bold">{background.name}</h1>
        <p className="text-muted-foreground mt-1">{background.description}</p>
      </div>
    </>
  )
}
