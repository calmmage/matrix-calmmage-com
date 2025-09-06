"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sun, Moon, Play, Pause, Eye, EyeOff, Zap, Shuffle } from "lucide-react"

interface PageHeaderProps {
  mounted: boolean
  isAnimationPaused: boolean
  toggleAnimation: () => void
  theme?: string
  toggleTheme: () => void
  isZenMode: boolean
  toggleZenMode: () => void
  onRandomizeSettings: () => void
  onStartStorm: () => void
  isStormActive: boolean
}

export function PageHeader({ mounted, isAnimationPaused, toggleAnimation, theme, toggleTheme, isZenMode, toggleZenMode, onRandomizeSettings, onStartStorm, isStormActive }: PageHeaderProps) {
  return (
    <div className="text-center">
      <Card className="bg-background/20 backdrop-blur-sm w-fit mx-auto px-4 md:px-8 py-4 md:py-6 select-none pointer-events-auto">
        <h1 className="text-2xl md:text-4xl text-muted-foreground mb-4">Matrix Stormwave</h1>
        {mounted && (
          <div className="flex gap-1 md:gap-2 justify-center flex-wrap">
            <Button variant="ghost" size="sm" onClick={onRandomizeSettings} className="bg-white/20 hover:bg-white/30 h-8 w-8 md:h-10 md:w-10">
              <Shuffle className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <Button
              variant="ghost" 
              size="sm" 
              onClick={onStartStorm}
              disabled={isStormActive}
              className={`bg-white/20 hover:bg-white/30 h-8 w-8 md:h-10 md:w-10 ${isStormActive ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}`}
            >
              <Zap className="h-4 w-4 md:h-6 md:w-6" />
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleAnimation} className="bg-white/20 hover:bg-white/30 h-8 w-8 md:h-10 md:w-10">
              {isAnimationPaused ? <Play className="h-4 w-4 md:h-5 md:w-5" /> : <Pause className="h-4 w-4 md:h-5 md:w-5" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleZenMode} className="bg-white/20 hover:bg-white/30 h-8 w-8 md:h-10 md:w-10">
              {isZenMode ? <Eye className="h-4 w-4 md:h-5 md:w-5" /> : <EyeOff className="h-4 w-4 md:h-5 md:w-5" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="bg-white/20 hover:bg-white/30 h-8 w-8 md:h-10 md:w-10">
              {theme === "dark" ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

