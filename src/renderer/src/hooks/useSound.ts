import { useState, useRef, useCallback } from 'react'
import { playSoundById } from '../utils/audio.utils'

interface UseSoundReturn {
  isPlaying: boolean
  play: (soundId: string) => Promise<void>
  stop: () => void
  preview: (soundId: string) => Promise<void>
}

export function useSound(): UseSoundReturn {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    setIsPlaying(false)
  }, [])

  const play = useCallback(
    async (soundId: string): Promise<void> => {
      stop()
      setIsPlaying(true)

      try {
        const audio = await playSoundById(soundId)
        audioRef.current = audio

        audio.onended = () => {
          setIsPlaying(false)
          audioRef.current = null
        }
      } catch {
        setIsPlaying(false)
      }
    },
    [stop]
  )

  const preview = useCallback(
    async (soundId: string): Promise<void> => {
      await play(soundId)
    },
    [play]
  )

  return { isPlaying, play, stop, preview }
}
