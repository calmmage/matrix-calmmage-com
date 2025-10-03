import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

export const metadata: Metadata = {
  title: 'Matrix Stormwave',
  description: 'Interactive Matrix background with dynamic effects',
  generator: 'Matrix Stormwave',
  icons: {
    icon: [
      { url: '/icon_sets/M3d/favicon.ico' },
      // { url: '/icon_sets/pixel3d/favicon.ico' },
      // { url: '/icon_sets/spiral3d/favicon.ico' },
      // { url: '/icon_sets/toroid3d/favicon.ico' },

      { url: '/icon_sets/M3d/icon.svg', type: 'image/svg+xml' },
      // { url: '/icon_sets/pixel3d/icon.svg', type: 'image/svg+xml' },
      // { url: '/icon_sets/spiral3d/icon.svg', type: 'image/svg+xml' },
      // { url: '/icon_sets/toroid3d/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon_sets/M3d/icon-180.png',
    // apple: '/icon_sets/pixel3d/icon-180.png',
    // apple: '/icon_sets/M3d/spiral3d-180.png',
    // apple: '/icon_sets/M3d/toroid3d-180.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
