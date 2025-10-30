"use client"

import { useState } from "react"
import { BACKGROUNDS } from "@/lib/backgrounds"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function GalleryPage() {
  const [selectedBackgroundId, setSelectedBackgroundId] = useState(BACKGROUNDS[0].id)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const selectedBackground = BACKGROUNDS.find(bg => bg.id === selectedBackgroundId)

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
            <h1 className="text-xl font-bold">Backgrounds</h1>
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

        {/* Background List */}
        {!isSidebarCollapsed && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-1">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setSelectedBackgroundId(bg.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedBackgroundId === bg.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="font-semibold text-sm">{bg.name}</div>
                  <div className="text-xs opacity-80 mt-1 line-clamp-2">
                    {bg.description}
                  </div>
                  <div
                    className="w-4 h-4 rounded-full mt-2"
                    style={{ backgroundColor: bg.color }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sidebar Footer */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-t space-y-2">
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                Back to Editor
              </Button>
            </Link>
            {selectedBackground && (
              <Link
                href={`/${selectedBackground.id}`}
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
        {selectedBackground && (
          <iframe
            key={selectedBackground.id}
            src={`/${selectedBackground.id}`}
            className="w-full h-full border-0"
            title={selectedBackground.name}
          />
        )}
      </div>
    </div>
  )
}
