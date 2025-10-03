"use client"

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'

const SEGMENT_COUNT = 88 // Total number of audio segments
const FADE_DURATION = 2000 // Fade in/out duration in ms
const MIN_SEGMENT_DURATION = 10000 // Minimum playback duration per segment (10s)
const MAX_SEGMENT_DURATION = 30000 // Maximum playback duration per segment (30s)

export interface BackgroundAudioRef {
  setMuted: (muted: boolean) => void
}

const BackgroundAudio = forwardRef<BackgroundAudioRef>((props, ref) => {
  const isMutedRef = useRef(false)
  const isPlayingRef = useRef(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const nextAudioRef = useRef<HTMLAudioElement | null>(null)
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const usedSegments = useRef<Set<number>>(new Set())

  const getRandomSegment = (): number => {
    // If all segments have been used, reset
    if (usedSegments.current.size >= SEGMENT_COUNT) {
      usedSegments.current.clear()
    }

    let segment: number
    do {
      segment = Math.floor(Math.random() * SEGMENT_COUNT)
    } while (usedSegments.current.has(segment))

    usedSegments.current.add(segment)
    return segment
  }

  const fadeIn = (audio: HTMLAudioElement) => {
    audio.volume = 0
    audio.play().catch(err => console.error('Play failed:', err))

    let volume = 0
    const step = 0.05
    const interval = FADE_DURATION / (1 / step)

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current)
    }

    fadeIntervalRef.current = setInterval(() => {
      volume = Math.min(1, volume + step)
      audio.volume = isMutedRef.current ? 0 : volume

      if (volume >= 1) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current)
        }
      }
    }, interval)
  }

  const fadeOut = (audio: HTMLAudioElement, onComplete: () => void) => {
    let volume = audio.volume
    const step = 0.05
    const interval = FADE_DURATION / (1 / step)

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current)
    }

    fadeIntervalRef.current = setInterval(() => {
      volume = Math.max(0, volume - step)
      audio.volume = volume

      if (volume <= 0) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current)
        }
        audio.pause()
        onComplete()
      }
    }, interval)
  }

  const playRandomSegment = () => {
    if (!audioRef.current) return

    const segment = getRandomSegment()
    const segmentPath = `/audio/segments/segment_${String(segment).padStart(3, '0')}.mp3`

    // Preload next segment
    const nextSegment = getRandomSegment()
    const nextSegmentPath = `/audio/segments/segment_${String(nextSegment).padStart(3, '0')}.mp3`

    if (nextAudioRef.current) {
      nextAudioRef.current.src = nextSegmentPath
      nextAudioRef.current.load()
    }

    audioRef.current.src = segmentPath
    fadeIn(audioRef.current)
    isPlayingRef.current = true

    // Schedule transition to next segment
    const playDuration = Math.random() * (MAX_SEGMENT_DURATION - MIN_SEGMENT_DURATION) + MIN_SEGMENT_DURATION

    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current)
    }

    playbackTimeoutRef.current = setTimeout(() => {
      if (audioRef.current) {
        fadeOut(audioRef.current, () => {
          playRandomSegment()
        })
      }
    }, playDuration)
  }

  useImperativeHandle(ref, () => ({
    setMuted: (muted: boolean) => {
      isMutedRef.current = muted
      if (audioRef.current && isPlayingRef.current) {
        audioRef.current.volume = muted ? 0 : 1
      }
    }
  }))

  useEffect(() => {
    // Create audio elements
    audioRef.current = new Audio()
    nextAudioRef.current = new Audio()

    // Start playback immediately
    playRandomSegment()

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
      if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (nextAudioRef.current) {
        nextAudioRef.current.pause()
        nextAudioRef.current = null
      }
    }
  }, [])

  return null
})

BackgroundAudio.displayName = 'BackgroundAudio'

export default BackgroundAudio
