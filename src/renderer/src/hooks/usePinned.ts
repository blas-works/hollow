import { useState, useEffect, useRef } from 'react'
import { windowService } from '../services'
import { TIMER_SIZE, TIMER_PINNED_SIZE } from '../constants'

interface UsePinnedReturn {
  isPinned: boolean
  isResizingPin: boolean
  togglePin: () => Promise<void>
}

export function usePinned(): UsePinnedReturn {
  const [isPinned, setIsPinned] = useState(false)
  const [isResizingPin, setIsResizingPin] = useState(false)
  const isTransitioning = useRef(false)

  useEffect(() => {
    windowService.getPinnedState().then(setIsPinned)
    windowService.onPinnedState(setIsPinned)
  }, [])

  const togglePin = async (): Promise<void> => {
    if (isTransitioning.current) return
    isTransitioning.current = true

    const newPinned = !isPinned

    setIsResizingPin(true)
    await new Promise<void>((r) => setTimeout(r, 30))

    const size = newPinned ? TIMER_PINNED_SIZE : TIMER_SIZE
    await windowService.resize(size.w, size.h)
    await windowService.setAlwaysOnTop(newPinned)

    setIsPinned(newPinned)
    setIsResizingPin(false)
    isTransitioning.current = false
  }

  return { isPinned, isResizingPin, togglePin }
}
