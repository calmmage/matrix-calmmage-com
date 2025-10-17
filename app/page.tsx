"use client"

import {useEffect, useState, useRef} from "react"
import {Slider} from "@/components/ui/slider"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button"
import {useTheme} from "next-themes"
import {Eye, ChevronDown, ChevronUp} from "lucide-react"
import MatrixBackground from "@/components/matrix-background"
import {PageHeader} from "@/components/page-header"
import BackgroundAudio, {BackgroundAudioRef} from "@/components/background-audio"
import {SoundEffectType, SOUND_EFFECT_SYSTEMS, SoundEffectManager} from "@/lib/sound-effects"
import {
  PerformanceMode,
  PERFORMANCE_PRESETS,
  PERFORMANCE_MODE_DESCRIPTIONS,
  clampToPreset,
  randomInPreset,
  getRandomAllowedEffect,
  getRandomAllowedBackgroundMode,
  isEffectAllowed,
  isBackgroundModeAllowed
} from "@/lib/performance-presets"


export default function MatrixStormwave() {
  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)
  const [isAnimationPaused, setIsAnimationPaused] = useState(false)
  const [performanceMode, setPerformanceMode] = useState<PerformanceMode>('high')
  const [clickEffect, setClickEffect] = useState<'explosion' | 'waterfall' | 'crack' | 'star' | 'fizzle' | 'matrix_rain' | 'glitch' | 'binary' | 'cascade' | 'square' | 'diamond' | 'cube' | 'octahedron' | 'random'>('random')
  const [particleSpeed, setParticleSpeed] = useState(1)
  const [particleCount, setParticleCount] = useState(1)
  const [particleColor, setParticleColor] = useState('#1DD11D')
  const [backgroundColor, setBackgroundColor] = useState('#1DD11D')
  const [particleLifetime, setParticleLifetime] = useState(1)
  const [backgroundMode, setBackgroundMode] = useState<'matrix' | 'pulse' | 'sparkle' | 'waves' | 'grid'>('matrix')
  const [backgroundSpeed, setBackgroundSpeed] = useState(1)
  const [rippleIntensity, setRippleIntensity] = useState(1)
  const [rippleCharacter, setRippleCharacter] = useState('')
  const [rippleParticleLimit, setRippleParticleLimit] = useState(20)
  const [rippleFadeSpeed, setRippleFadeSpeed] = useState(0.05)
  const [rippleFadeFromCenter, setRippleFadeFromCenter] = useState(false)
  const [rippleMaxCount, setRippleMaxCount] = useState(50)
  const [enableTrails, setEnableTrails] = useState(true)
  const [enableMouseRipples, setEnableMouseRipples] = useState(true)
  const [isZenMode, setIsZenMode] = useState(false)
  const [isSettingsCollapsed, setIsSettingsCollapsed] = useState(true)

  // Audio state
  const audioRef = useRef<BackgroundAudioRef>(null)
  const [isMusicMuted, setIsMusicMuted] = useState(false)
  const [soundEffectType, setSoundEffectType] = useState<SoundEffectType>('none')
  const [soundEffectVolume, setSoundEffectVolume] = useState(0.5)
  const soundEffectManagerRef = useRef<SoundEffectManager>(new SoundEffectManager())

  // Particle counter
  const [particleCounts, setParticleCounts] = useState({ total: 0, particles: 0, background: 0, ripples: 0, shapes: 0 })
  const [fps, setFps] = useState(0)
  const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() })
  const particleHistoryRef = useRef<number[]>([])
  const [avgParticles, setAvgParticles] = useState(0)
  const [showStats, setShowStats] = useState(false)

  // Storm state
  const [isStormActive, setIsStormActive] = useState(false)
  const [stormDuration, setStormDuration] = useState(0)
  const [stormIntensity, setStormIntensity] = useState(0)
  const [stormTimeLeft, setStormTimeLeft] = useState(0)
  const [stormEventType, setStormEventType] = useState<typeof clickEffect>('explosion')


  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle music mute
  const toggleMusicMute = () => {
    const newMuted = !isMusicMuted
    setIsMusicMuted(newMuted)
    if (audioRef.current) {
      audioRef.current.setMuted(newMuted)
    }
  }

  // Handle sound effect system changes
  useEffect(() => {
    const manager = soundEffectManagerRef.current
    manager.setSystem(soundEffectType)
    console.log('Sound effect system changed to:', soundEffectType)
  }, [soundEffectType])

  // Handle sound effect volume changes
  useEffect(() => {
    const manager = soundEffectManagerRef.current
    manager.setVolume(soundEffectVolume)
  }, [soundEffectVolume])

  // Cleanup sound effects on unmount
  useEffect(() => {
    return () => {
      soundEffectManagerRef.current.cleanup()
    }
  }, [])

  // FPS counter
  useEffect(() => {
    const interval = setInterval(() => {
      const counter = fpsCounterRef.current
      const now = Date.now()
      const elapsed = now - counter.lastTime

      if (elapsed >= 1000) {
        setFps(Math.round((counter.frames * 1000) / elapsed))
        counter.frames = 0
        counter.lastTime = now
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Track frames for FPS and rolling average
  const handleParticleCountChange = (counts: typeof particleCounts) => {
    setParticleCounts(counts)
    fpsCounterRef.current.frames++

    // Update rolling average (10 samples = ~0.3 seconds)
    const history = particleHistoryRef.current
    history.push(counts.total)
    if (history.length > 10) {
      history.shift()
    }
    const avg = Math.round(history.reduce((sum, val) => sum + val, 0) / history.length)
    setAvgParticles(avg)
  }

  // Keyboard handlers
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target !== document.body) return

      if (e.code === 'Space') {
        e.preventDefault()
        setEnableMouseRipples(prev => !prev)
      } else if (e.code === 'KeyS') {
        e.preventDefault()
        setShowStats(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Auto-adjust particle and background colors based on theme
  useEffect(() => {
    if (!mounted) return
    if (theme === 'dark') {
      setParticleColor('#1DD11D') // Matrix green for dark theme
      setBackgroundColor('#1DD11D')
    } else {
      setParticleColor('#333333') // Dark grey for light theme
      setBackgroundColor('#333333')
    }
  }, [theme, mounted])

  // Apply performance mode constraints and randomize settings on mode change
  useEffect(() => {
    if (!mounted) return // Don't run on initial mount

    // When performance mode changes, randomize all settings within the new limits
    randomizeSettings()
  }, [performanceMode]) // Only run when performance mode changes

  // Storm effect useEffect
  useEffect(() => {
    if (!isStormActive) return

    const stormInterval = setInterval(() => {
      // Generate random screen position
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight
      
      // Trigger the chosen storm effect at random location
      // We'll simulate a click event to reuse existing effect logic
      const syntheticEvent = {
        clientX: x,
        clientY: y,
        preventDefault: () => {},
        stopPropagation: () => {}
      } as MouseEvent
      
      // Create a custom event that the MatrixBackground can listen to
      const stormEvent = new CustomEvent('storm-effect', {
        detail: { x, y, effect: stormEventType }
      })
      window.dispatchEvent(stormEvent)
      
    }, 1000 / stormIntensity) // Spawn based on intensity (events per second)

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setStormTimeLeft(prev => {
        if (prev <= 100) {
          // Storm is ending
          setIsStormActive(false)
          setStormTimeLeft(0)
          console.log('🌪️ Storm ended!')
          return 0
        }
        return prev - 100
      })
    }, 100)

    return () => {
      clearInterval(stormInterval)
      clearInterval(countdownInterval)
    }
  }, [isStormActive, stormIntensity, stormEventType])

  // Randomize all settings function
  const randomizeSettings = () => {
    const preset = PERFORMANCE_PRESETS[performanceMode]
    const colors = ['#1DD11D', '#FF0080', '#00FFFF', '#FFFF00', '#FF4500', '#9932CC', '#00FF00', '#FF1493']
    const rippleChars = ['', '~', '≈', 'o', 'O', '*', '•', '∘', 'q', 'x', 'u', '1', '8', '5']

    // Use only allowed background modes and effects for current performance mode
    setBackgroundMode(getRandomAllowedBackgroundMode(performanceMode) as any)
    setClickEffect(getRandomAllowedEffect(performanceMode) as any)

    // Randomize within performance mode limits
    setParticleSpeed(Number((Math.random() * 2.9 + 0.1).toFixed(1)))
    setParticleCount(randomInPreset(preset.particleCount.min, preset.particleCount.max, 1))
    setParticleColor(colors[Math.floor(Math.random() * colors.length)])
    setBackgroundColor(colors[Math.floor(Math.random() * colors.length)])
    setParticleLifetime(randomInPreset(preset.particleLifetime.min, preset.particleLifetime.max, 1))
    setBackgroundSpeed(Number((Math.random() * 2.9 + 0.1).toFixed(1)))
    setRippleIntensity(Number((Math.random() * 3).toFixed(1)))
    setRippleCharacter(rippleChars[Math.floor(Math.random() * rippleChars.length)])
    setRippleParticleLimit(Math.round(randomInPreset(preset.rippleParticleLimit.min, preset.rippleParticleLimit.max, 0)))
    setRippleFadeSpeed(Number((Math.random() * 0.49 + 0.01).toFixed(2)))
    setRippleFadeFromCenter(Math.random() > 0.5)
    setRippleMaxCount(Math.round(randomInPreset(preset.rippleMaxCount.min, preset.rippleMaxCount.max, 0)))
  }

  // Storm generation function
  const startStorm = () => {
    if (isStormActive) return // Don't start if already active
    
    // Random storm parameters
    const duration = Math.random() * 8000 + 3000 // 3-11 seconds
    const intensity = Math.random() * 8 + 2 // 2-10 events per second
    
    // Pick ONE event type for the entire storm (including 'random')
    const allEffects: Array<typeof clickEffect> = [
      'explosion', 'waterfall', 'crack', 'star', 'fizzle',
      'matrix_rain', 'binary', 'cascade',
      'square', 'diamond', 'cube', 'octahedron', 'random'
    ]
    const chosenEffect = allEffects[Math.floor(Math.random() * allEffects.length)]
    
    // Set storm state
    setIsStormActive(true)
    setStormDuration(duration)
    setStormIntensity(intensity)
    setStormTimeLeft(duration)
    setStormEventType(chosenEffect)
    
    console.log(`🌪️ Storm started! Effect: ${chosenEffect}, Duration: ${(duration/1000).toFixed(1)}s, Intensity: ${intensity.toFixed(1)} events/sec`)
  }

  // Separate state for tracking if we should be polling
  return (
    <>
      <BackgroundAudio ref={audioRef} />
      <MatrixBackground
        isAnimationPaused={isAnimationPaused}
        clickEffect={clickEffect}
        particleSpeed={particleSpeed}
        particleCount={particleCount}
        particleColor={particleColor}
        particleLifetime={particleLifetime}
        backgroundMode={backgroundMode}
        backgroundSpeed={backgroundSpeed}
        backgroundColor={backgroundColor}
        rippleIntensity={rippleIntensity}
        rippleCharacter={rippleCharacter}
        rippleParticleLimit={rippleParticleLimit}
        rippleFadeSpeed={rippleFadeSpeed}
        rippleFadeFromCenter={rippleFadeFromCenter}
        rippleMaxCount={rippleMaxCount}
        enableTrails={enableTrails}
        enableMouseRipples={enableMouseRipples}
        performanceMode={performanceMode}
        soundEffectManager={soundEffectManagerRef.current}
        onParticleCountChange={handleParticleCountChange}
      />
      {!isZenMode && (
        <div className="min-h-screen p-4 md:p-8 relative z-10 pointer-events-none">
          <div className="max-w-4xl mx-auto space-y-4 md:space-y-8 pointer-events-none flex flex-col items-center">
          <PageHeader
            mounted={mounted}
            isAnimationPaused={isAnimationPaused}
            toggleAnimation={() => setIsAnimationPaused(!isAnimationPaused)}
            theme={theme}
            toggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
            isZenMode={isZenMode}
            toggleZenMode={() => setIsZenMode(!isZenMode)}
            onRandomizeSettings={randomizeSettings}
            onStartStorm={startStorm}
            isStormActive={isStormActive}
            isMusicMuted={isMusicMuted}
            toggleMusicMute={toggleMusicMute}
          />

          {/* Particle counter & FPS - toggle with 'S' key */}
          {showStats && (
            <div className="text-xs text-muted-foreground/80 text-center pointer-events-none bg-background/10 backdrop-blur-sm rounded px-3 py-1.5">
              <div className="font-mono">
                <span className={fps < 30 ? "text-red-500 font-bold" : fps < 50 ? "text-yellow-500" : "text-green-500"}>
                  {fps} FPS
                </span>
                <span className="mx-2 text-muted-foreground/40">|</span>
                Total: <span className="font-bold text-foreground">{particleCounts.total}</span>
                <span className="mx-1 text-muted-foreground/60">(avg: {avgParticles})</span>
                <span className="mx-2 text-muted-foreground/40">|</span>
                Events: {particleCounts.particles}
                <span className="mx-1 text-muted-foreground/40">·</span>
                BG: {particleCounts.background}
                <span className="mx-1 text-muted-foreground/40">·</span>
                Ripples: {particleCounts.ripples}
                {particleCounts.shapes > 0 && (
                  <>
                    <span className="mx-1 text-muted-foreground/40">·</span>
                    3D: {particleCounts.shapes}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Keyboard hints - desktop only */}
          <div className="hidden md:block text-xs text-muted-foreground/60 text-center pointer-events-none select-none">
            Press <kbd className="px-1.5 py-0.5 bg-muted/30 rounded border border-muted-foreground/20">Space</kbd> to toggle mouse ripples
            {' · '}
            <kbd className="px-1.5 py-0.5 bg-muted/30 rounded border border-muted-foreground/20">S</kbd> to toggle stats
          </div>

          {/* Collapsible Settings - centered below header */}
          <div className="w-full max-w-sm md:max-w-xs bg-background/20 backdrop-blur-sm rounded-lg p-3 md:p-4 pointer-events-auto shadow-2">
            <div 
              className="flex items-center justify-between cursor-pointer mb-2 select-none"
              onClick={() => setIsSettingsCollapsed(!isSettingsCollapsed)}
            >
              <h3 className="text-lg font-bold  text-muted-foreground">
                  Animation Settings
              </h3>

              {isSettingsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </div>
            {!isSettingsCollapsed && (
              <div className="space-y-3 text-sm md:text-sm text-foreground max-h-[60vh] overflow-y-auto overscroll-contain">
              {/* Performance Mode Selector */}
              <div className="space-y-2 pb-3 border-b border-muted-foreground/20">
                <Label htmlFor="performance-mode" className="font-semibold">Performance Mode</Label>
                <select
                  id="performance-mode"
                  value={performanceMode}
                  onChange={(e) => setPerformanceMode(e.target.value as PerformanceMode)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm font-medium"
                >
                  <option value="high">High - {PERFORMANCE_MODE_DESCRIPTIONS.high}</option>
                  <option value="medium">Medium - {PERFORMANCE_MODE_DESCRIPTIONS.medium}</option>
                  <option value="low">Low - {PERFORMANCE_MODE_DESCRIPTIONS.low}</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Limits particle counts and effects for smoother performance
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background-mode">Background Animation</Label>
                <select
                  id="background-mode"
                  value={backgroundMode}
                  onChange={(e) => {
                    setBackgroundMode(e.target.value as any);
                    // Set a random click effect when background changes
                    setClickEffect(getRandomAllowedEffect(performanceMode) as any);
                  }}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="matrix">Matrix Rain</option>
                  <option value="pulse">Pulse</option>
                  <option value="sparkle">Sparkle</option>
                  <option value="waves">Waves</option>
                  <option value="grid">Grid</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="click-effect">Click Effect</Label>
                <select
                  id="click-effect"
                  value={clickEffect}
                  onChange={(e) => setClickEffect(e.target.value as any)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="random">Random</option>
                  <option value="explosion">Explosion</option>
                  <option value="waterfall">Waterfall</option>
                  <option value="crack">Crack</option>
                  <option value="star">Star</option>
                  <option value="fizzle" disabled={!isEffectAllowed('fizzle', performanceMode)}>
                    Fizzle (Chaotic) {!isEffectAllowed('fizzle', performanceMode) && '(High/Medium only)'}
                  </option>
                  <option value="matrix_rain">Matrix Rain</option>
                  <option value="glitch" disabled={!isEffectAllowed('glitch', performanceMode)}>
                    Glitch {!isEffectAllowed('glitch', performanceMode) && '(High/Medium only)'}
                  </option>
                  <option value="binary">Binary Storm</option>
                  <option value="cascade">Cascade</option>
                  <option value="square">Square</option>
                  <option value="diamond">Diamond</option>
                  <option value="cube" disabled={!isEffectAllowed('cube', performanceMode)}>
                    3D Cube {!isEffectAllowed('cube', performanceMode) && '(High/Medium only)'}
                  </option>
                  <option value="octahedron" disabled={!isEffectAllowed('octahedron', performanceMode)}>
                    Octahedron {!isEffectAllowed('octahedron', performanceMode) && '(High/Medium only)'}
                  </option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="background-speed">Background Particle Speed: {backgroundSpeed.toFixed(1)}x</Label>
                <Slider
                  id="background-speed"
                  min={0.1}
                  max={3}
                  step={0.1}
                  value={[backgroundSpeed]}
                  onValueChange={(value) => setBackgroundSpeed(value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="particle-speed">Particle Speed: {particleSpeed.toFixed(1)}x</Label>
                <Slider
                  id="particle-speed"
                  min={0.1}
                  max={3}
                  step={0.1}
                  value={[particleSpeed]}
                  onValueChange={(value) => setParticleSpeed(value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="particle-count">Particle Count: {Math.round(particleCount * 20)}</Label>
                <Slider
                  id="particle-count"
                  min={PERFORMANCE_PRESETS[performanceMode].particleCount.min}
                  max={PERFORMANCE_PRESETS[performanceMode].particleCount.max}
                  step={0.1}
                  value={[particleCount]}
                  onValueChange={(value) => setParticleCount(value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="particle-lifetime">Particle Lifetime: {(particleLifetime * 2).toFixed(1)}s</Label>
                <Slider
                  id="particle-lifetime"
                  min={PERFORMANCE_PRESETS[performanceMode].particleLifetime.min}
                  max={PERFORMANCE_PRESETS[performanceMode].particleLifetime.max}
                  step={0.2}
                  value={[particleLifetime]}
                  onValueChange={(value) => setParticleLifetime(value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ripple-intensity">Mouse Ripple Intensity: {rippleIntensity.toFixed(1)}x</Label>
                <Slider
                  id="ripple-intensity"
                  min={0}
                  max={3}
                  step={0.1}
                  value={[rippleIntensity]}
                  onValueChange={(value) => setRippleIntensity(value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ripple-character">Ripple Character (empty = random)</Label>
                <Input
                  type="text"
                  id="ripple-character"
                  value={rippleCharacter}
                  onChange={(e) => setRippleCharacter(e.target.value.slice(0, 1))}
                  placeholder="Random"
                  maxLength={1}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ripple-particle-limit">Ripple Particle Limit: {rippleParticleLimit}</Label>
                <Slider
                  id="ripple-particle-limit"
                  min={PERFORMANCE_PRESETS[performanceMode].rippleParticleLimit.min}
                  max={PERFORMANCE_PRESETS[performanceMode].rippleParticleLimit.max}
                  step={1}
                  value={[rippleParticleLimit]}
                  onValueChange={(value) => setRippleParticleLimit(value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ripple-fade-speed">Trail Fade Speed: {rippleFadeSpeed.toFixed(2)}</Label>
                <Slider
                  id="ripple-fade-speed"
                  min={0.01}
                  max={0.5}
                  step={0.01}
                  value={[rippleFadeSpeed]}
                  onValueChange={(value) => setRippleFadeSpeed(value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ripple-max-count">Max Simultaneous Ripples: {rippleMaxCount}</Label>
                <Slider
                  id="ripple-max-count"
                  min={PERFORMANCE_PRESETS[performanceMode].rippleMaxCount.min}
                  max={PERFORMANCE_PRESETS[performanceMode].rippleMaxCount.max}
                  step={5}
                  value={[rippleMaxCount]}
                  onValueChange={(value) => setRippleMaxCount(value[0])}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ripple-fade-from-center"
                  checked={rippleFadeFromCenter}
                  onChange={(e) => setRippleFadeFromCenter(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="ripple-fade-from-center">Fade ripples from center</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enable-trails"
                  checked={enableTrails}
                  onChange={(e) => setEnableTrails(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="enable-trails">Enable particle trails</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enable-mouse-ripples"
                  checked={enableMouseRipples}
                  onChange={(e) => setEnableMouseRipples(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="enable-mouse-ripples">Enable mouse ripples</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sound-effects">Sound Effects</Label>
                <select
                  id="sound-effects"
                  value={soundEffectType}
                  onChange={(e) => setSoundEffectType(e.target.value as SoundEffectType)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  {Object.entries(SOUND_EFFECT_SYSTEMS).map(([key, system]) => (
                    <option key={key} value={key}>
                      {system.name} - {system.description}
                    </option>
                  ))}
                </select>
              </div>

              {soundEffectType !== 'none' && (
                <div className="space-y-2">
                  <Label htmlFor="sound-effect-volume">Sound Effect Volume: {Math.round(soundEffectVolume * 100)}%</Label>
                  <Slider
                    id="sound-effect-volume"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[soundEffectVolume]}
                    onValueChange={(value) => setSoundEffectVolume(value[0])}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="particle-color">Particle Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="particle-color"
                    value={particleColor}
                    onChange={(e) => setParticleColor(e.target.value)}
                    className="h-10 w-20 rounded border border-input"
                  />
                  <Input
                    type="text"
                    value={particleColor}
                    onChange={(e) => setParticleColor(e.target.value)}
                    className="flex-1"
                    placeholder="#1DD11D"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background-color">Background Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="background-color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="h-10 w-20 rounded border border-input"
                  />
                  <Input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1"
                    placeholder="#1DD11D"
                  />
                </div>
              </div>

              </div>
            )}
          </div>
          
          </div>
        </div>
      )}
      
      {/* Zen mode exit button */}
      {isZenMode && (
        <div className="fixed top-4 right-4 z-20">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsZenMode(false)}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
          >
            <Eye className="h-5 w-5" />
          </Button>
        </div>
      )}
    </>
  )
}
