/**
 * Background definitions - one page per background
 */

export type BackgroundMode =
  | 'matrix'
  | 'pulse'
  | 'sparkle'
  | 'waves'
  | 'grid'
  | 'spiral'
  | 'rain'
  | 'snow'
  | 'fireflies'
  | 'nebula'

export type BackgroundInfo = {
  id: BackgroundMode
  name: string
  description: string
  color: string  // default color for this background
}

export const BACKGROUNDS: BackgroundInfo[] = [
  {
    id: 'matrix',
    name: 'Matrix',
    description: 'Classic falling Matrix rain - the iconic green code cascade',
    color: '#1DD11D'
  },
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'Pulsing waves emanating from the center',
    color: '#FF0080'
  },
  {
    id: 'sparkle',
    name: 'Sparkle',
    description: 'Randomly twinkling particles drifting across the screen',
    color: '#FFFF00'
  },
  {
    id: 'waves',
    name: 'Waves',
    description: 'Smooth sine wave patterns flowing horizontally',
    color: '#00FFFF'
  },
  {
    id: 'grid',
    name: 'Grid',
    description: 'Pulsing grid nodes creating a structured network',
    color: '#9932CC'
  },
  {
    id: 'spiral',
    name: 'Spiral',
    description: 'Hypnotic spiral pattern rotating from center',
    color: '#FF4500'
  },
  {
    id: 'rain',
    name: 'Rain',
    description: 'Diagonal rain streaks falling across the screen',
    color: '#1DD11D'
  },
  {
    id: 'snow',
    name: 'Snow',
    description: 'Gentle snowflakes falling with realistic sway',
    color: '#00FFFF'
  },
  {
    id: 'fireflies',
    name: 'Fireflies',
    description: 'Glowing fireflies floating with ethereal trails',
    color: '#FFFF00'
  },
  {
    id: 'nebula',
    name: 'Nebula',
    description: 'Swirling cosmic clouds with layered depth',
    color: '#9932CC'
  }
]

export function getBackgroundById(id: string): BackgroundInfo | undefined {
  return BACKGROUNDS.find(bg => bg.id === id)
}

export function getBackgroundIds(): string[] {
  return BACKGROUNDS.map(bg => bg.id)
}
