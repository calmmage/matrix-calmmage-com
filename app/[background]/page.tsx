import { getBackgroundById, getBackgroundIds } from "@/lib/backgrounds"
import { notFound } from "next/navigation"
import BackgroundViewer from "@/components/background-viewer"
import type { Metadata } from 'next'

interface BackgroundPageProps {
  params: {
    background: string
  }
}

export function generateStaticParams() {
  return getBackgroundIds().map((id) => ({
    background: id,
  }))
}

export async function generateMetadata({ params }: BackgroundPageProps): Promise<Metadata> {
  const bgInfo = getBackgroundById(params.background)

  if (!bgInfo) {
    return {
      title: 'Background Not Found',
    }
  }

  return {
    title: `${bgInfo.name} - Matrix Stormwave`,
    description: bgInfo.description,
  }
}

export default function BackgroundPage({ params }: BackgroundPageProps) {
  const bgInfo = getBackgroundById(params.background)

  if (!bgInfo) {
    notFound()
  }

  return <BackgroundViewer background={bgInfo} />
}
