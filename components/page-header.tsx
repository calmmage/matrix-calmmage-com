"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sun, Moon, Play, Pause, Sparkles, Eye, EyeOff } from "lucide-react"

interface PageHeaderProps {
  mounted: boolean
  onOpenVisualSettings: () => void
  isAnimationPaused: boolean
  toggleAnimation: () => void
  theme?: string
  toggleTheme: () => void
  isZenMode: boolean
  toggleZenMode: () => void
}

export function PageHeader({ mounted, onOpenVisualSettings, isAnimationPaused, toggleAnimation, theme, toggleTheme, isZenMode, toggleZenMode }: PageHeaderProps) {
  return (
    <div className="text-center relative">
      {mounted && (
        <div className="absolute right-0 top-0 flex gap-2">
          <Button variant="ghost" size="icon" onClick={onOpenVisualSettings} className="bg-white/20 hover:bg-white/30">
            <Sparkles className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleAnimation} className="bg-white/20 hover:bg-white/30">
            {isAnimationPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleZenMode} className="bg-white/20 hover:bg-white/30">
            {isZenMode ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="bg-white/20 hover:bg-white/30">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      )}
      <Card className="bg-background/20 backdrop-blur-sm w-fit mx-auto px-8 py-6">
        <h1 className="text-4xl font-bold mb-2">Matrix Stormwave</h1>
        <p className="text-muted-foreground">Interactive Matrix background with dynamic effects!</p>
      </Card>
    </div>
  )
}

