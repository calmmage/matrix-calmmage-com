import { getPresetById, getPresetIds } from "@/lib/background-presets"
import { notFound } from "next/navigation"
import PresetBackground from "@/components/preset-background"
import type { Metadata } from 'next'

interface PresetPageProps {
  params: {
    id: string
  }
}

// Generate static params for all presets
export async function generateStaticParams() {
  return getPresetIds().map((id) => ({
    id: id,
  }))
}

// Generate metadata for each preset
export async function generateMetadata({ params }: PresetPageProps): Promise<Metadata> {
  const preset = getPresetById(params.id)

  if (!preset) {
    return {
      title: 'Preset Not Found',
    }
  }

  return {
    title: `${preset.name} - Matrix Stormwave`,
    description: preset.description,
  }
}

export default function PresetPage({ params }: PresetPageProps) {
  const preset = getPresetById(params.id)

  if (!preset) {
    notFound()
  }

  return <PresetBackground preset={preset} showTitle={true} />
}
