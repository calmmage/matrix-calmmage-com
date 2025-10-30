"use client"

import { useState } from "react"
import { BACKGROUND_PRESETS } from "@/lib/background-presets"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function GalleryPage() {
  const [selectedPresetId, setSelectedPresetId] = useState(BACKGROUND_PRESETS[0].id)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const selectedPreset = BACKGROUND_PRESETS.find(p => p.id === selectedPresetId)

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-background border-r transition-all duration-300 flex flex-col ${
          isSidebarCollapsed ? 'w-12' : 'w-72'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between">
          {!isSidebarCollapsed && (
            <h1 className="text-xl font-bold">Matrix Gallery</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="ml-auto"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Preset List */}
        {!isSidebarCollapsed && (
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {BACKGROUND_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedPresetId === preset.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="font-semibold text-sm">{preset.name}</div>
                  <div className="text-xs opacity-80 mt-1 line-clamp-2">
                    {preset.description}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Sidebar Footer */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-t space-y-2">
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                Back to Editor
              </Button>
            </Link>
            {selectedPreset && (
              <Link
                href={`/preset/${selectedPreset.id}`}
                target="_blank"
                className="block"
              >
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Fullscreen
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area - Iframe */}
      <div className="flex-1 relative">
        {selectedPreset && (
          <>
            {/* Preset Info Overlay */}
            <div className="absolute top-4 left-4 right-4 z-10 bg-background/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <h2 className="text-2xl font-bold">{selectedPreset.name}</h2>
              <p className="text-muted-foreground mt-1">{selectedPreset.description}</p>
            </div>

            {/* Iframe showing the preset */}
            <iframe
              key={selectedPreset.id}
              src={`/preset/${selectedPreset.id}`}
              className="w-full h-full border-0"
              title={selectedPreset.name}
            />
          </>
        )}
      </div>
    </div>
  )
}
