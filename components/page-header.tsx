"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sun, Moon, Play, Pause, Eye, EyeOff, Zap, Shuffle } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

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
  const isMobile = useIsMobile()

  return (
    <div className="text-center relative">
      {mounted && (
        <div className={`flex gap-2 ${isMobile ? 'absolute top-0 right-0 flex-wrap justify-end max-w-[calc(100vw-2rem)] mobile-safe-top mobile-safe-right mobile-button-group' : 'absolute right-0 top-0'}`}>
          <Button 
            variant="ghost" 
            size={isMobile ? "sm" : "icon"} 
            onClick={onRandomizeSettings} 
            className="bg-white/20 hover:bg-white/30 touch-target mobile-no-select"
            title="Randomize Settings"
          >
            <Shuffle className="h-5 w-5" />
            {isMobile && <span className="ml-2 text-xs">Random</span>}
          </Button>
          <Button 
            variant="ghost" 
            size={isMobile ? "sm" : "icon"} 
            onClick={onStartStorm}
            disabled={isStormActive}
            className={`bg-white/20 hover:bg-white/30 min-h-[44px] min-w-[44px] ${isStormActive ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}`}
            title="Start Storm"
          >
            <Zap className="h-6 w-6" />
            {isMobile && <span className="ml-2 text-xs">Storm</span>}
          </Button>
          <Button 
            variant="ghost" 
            size={isMobile ? "sm" : "icon"} 
            onClick={toggleAnimation} 
            className="bg-white/20 hover:bg-white/30 touch-target mobile-no-select"
            title={isAnimationPaused ? "Resume Animation" : "Pause Animation"}
          >
            {isAnimationPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            {isMobile && <span className="ml-2 text-xs">{isAnimationPaused ? "Play" : "Pause"}</span>}
          </Button>
          <Button 
            variant="ghost" 
            size={isMobile ? "sm" : "icon"} 
            onClick={toggleZenMode} 
            className="bg-white/20 hover:bg-white/30 touch-target mobile-no-select"
            title={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
          >
            {isZenMode ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            {isMobile && <span className="ml-2 text-xs">{isZenMode ? "Show" : "Hide"}</span>}
          </Button>
          <Button 
            variant="ghost" 
            size={isMobile ? "sm" : "icon"} 
            onClick={toggleTheme} 
            className="bg-white/20 hover:bg-white/30 touch-target mobile-no-select"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Theme`}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            {isMobile && <span className="ml-2 text-xs">{theme === "dark" ? "Light" : "Dark"}</span>}
          </Button>
        </div>
      )}
      <Card className={`bg-background/20 backdrop-blur-sm w-fit mx-auto px-8 py-6 select-none ${isMobile ? 'mt-16 mx-4 px-4 py-4' : ''}`}>
        <h1 className={`font-bold mb-2 text-foreground ${isMobile ? 'text-2xl' : 'text-4xl'}`}>Matrix Stormwave</h1>
        <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>Interactive Matrix background with dynamic effects!</p>
      </Card>
    </div>
  )
}

