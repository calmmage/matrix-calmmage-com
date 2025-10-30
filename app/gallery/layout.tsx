import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery - Matrix Stormwave',
  description: 'Explore different Matrix background presets and effects',
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
