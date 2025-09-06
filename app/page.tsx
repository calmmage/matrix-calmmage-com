"use client"

import {useEffect, useState} from "react"
import {Slider} from "@/components/ui/slider"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {useTheme} from "next-themes"
import MatrixBackground from "@/components/matrix-background"
import {VisualSettingsPanel} from "@/components/visual-settings-panel"
import {PageHeader} from "@/components/page-header"

export default function CoinTossSimulator() {
  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)
  const [isAnimationPaused, setIsAnimationPaused] = useState(false)
  const [clickEffect, setClickEffect] = useState<'explosion' | 'waterfall' | 'crack' | 'star' | 'fizzle' | 'matrix_rain' | 'glitch' | 'binary' | 'cascade' | 'square' | 'diamond' | 'cube' | 'octahedron' | 'random'>('random')
  const [alignToGrid, setAlignToGrid] = useState(true)
  const [particleSpeed, setParticleSpeed] = useState(1)
  const [particleCount, setParticleCount] = useState(1)
  const [particleColor, setParticleColor] = useState('#1DD11D')
  const [particleLifetime, setParticleLifetime] = useState(1)
  const [backgroundMode, setBackgroundMode] = useState<'matrix' | 'pulse' | 'sparkle' | 'waves' | 'grid'>('matrix')
  const [backgroundSpeed, setBackgroundSpeed] = useState(1)
  const [backgroundRefreshRate, setBackgroundRefreshRate] = useState(1)
  const [isVisualSettingsOpen, setIsVisualSettingsOpen] = useState(false)


  useEffect(() => {
    setMounted(true)
  }, [])

  // Separate state for tracking if we should be polling
  return (
    <>
      <MatrixBackground 
        isAnimationPaused={isAnimationPaused}
        clickEffect={clickEffect}
        alignToGrid={alignToGrid}
        particleSpeed={particleSpeed}
        particleCount={particleCount}
        particleColor={particleColor}
        particleLifetime={particleLifetime}
        backgroundMode={backgroundMode}
        backgroundSpeed={backgroundSpeed}
        backgroundRefreshRate={backgroundRefreshRate}
      />
      <div className="min-h-screen p-8 relative z-10 pointer-events-none">
        <div className="max-w-4xl mx-auto space-y-8 pointer-events-auto">
          <PageHeader
            mounted={mounted}
            onOpenVisualSettings={() => setIsVisualSettingsOpen(true)}
            isAnimationPaused={isAnimationPaused}
            toggleAnimation={() => setIsAnimationPaused(!isAnimationPaused)}
            theme={theme}
            toggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          />

          <VisualSettingsPanel open={isVisualSettingsOpen} onOpenChange={setIsVisualSettingsOpen}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="background-mode">Background Animation</Label>
                <select
                  id="background-mode"
                  value={backgroundMode}
                  onChange={(e) => {
                    setBackgroundMode(e.target.value as any);
                    // Set a random click effect when background changes
                    const effects: Array<typeof clickEffect> = ['explosion', 'waterfall', 'crack', 'star', 'fizzle', 'matrix_rain', 'glitch', 'binary', 'cascade', 'square', 'diamond', 'cube', 'octahedron'];
                    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
                    setClickEffect(randomEffect);
                  }}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="matrix">🟢 Matrix Rain</option>
                  <option value="pulse">💗 Pulse</option>
                  <option value="sparkle">✨ Sparkle</option>
                  <option value="waves">🌊 Waves</option>
                  <option value="grid">⚡ Grid</option>
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
                  <option value="random">🎲 Random</option>
                  <option value="explosion">💥 Explosion</option>
                  <option value="waterfall">💧 Waterfall</option>
                  <option value="crack">⚡ Crack</option>
                  <option value="star">⭐ Star</option>
                  <option value="fizzle">✨ Fizzle (Chaotic)</option>
                  <option value="matrix_rain">🟢 Matrix Rain</option>
                  <option value="glitch">📺 Glitch</option>
                  <option value="binary">🔢 Binary Storm</option>
                  <option value="cascade">🌊 Cascade</option>
                  <option value="square">⬜ Square</option>
                  <option value="diamond">💎 Diamond</option>
                  <option value="cube">📦 3D Cube</option>
                  <option value="octahedron">🔷 Octahedron</option>
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
                <Label htmlFor="background-refresh">Background Refresh Rate: {backgroundRefreshRate.toFixed(1)}x</Label>
                <Slider
                  id="background-refresh"
                  min={0.1}
                  max={3}
                  step={0.1}
                  value={[backgroundRefreshRate]}
                  onValueChange={(value) => setBackgroundRefreshRate(value[0])}
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
                  min={0.5}
                  max={3}
                  step={0.1}
                  value={[particleCount]}
                  onValueChange={(value) => setParticleCount(value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="particle-lifetime">Particle Lifetime: {(particleLifetime * 2).toFixed(1)}s</Label>
                <Slider
                  id="particle-lifetime"
                  min={0.2}
                  max={30}
                  step={0.2}
                  value={[particleLifetime]}
                  onValueChange={(value) => setParticleLifetime(value[0])}
                />
              </div>

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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="align-to-grid"
                  checked={alignToGrid}
                  onChange={(e) => setAlignToGrid(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="align-to-grid">Align particles to grid</Label>
              </div>
            </div>
          </VisualSettingsPanel>
          
        </div>
      </div>
    </>
  )
}
