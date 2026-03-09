import { useState, useRef } from 'react'
import { windowService } from '../services'
import { TIMER_SIZE, MENU_SIZE } from '../constants'
import type { View } from '../schemas'

interface UseViewTransitionReturn {
  view: View
  switchView: (target: View) => Promise<void>
  isResizing: boolean
}

export function useViewTransition(): UseViewTransitionReturn {
  const [view, setView] = useState<View>('timer')
  const [isResizing, setIsResizing] = useState(false)
  const isTransitioning = useRef(false)

  const switchView = async (target: View): Promise<void> => {
    if (isTransitioning.current) return
    isTransitioning.current = true

    const size = target === 'menu' ? MENU_SIZE : TIMER_SIZE

    setIsResizing(true)
    await new Promise<void>((r) => setTimeout(r, 50))

    await windowService.resize(size.w, size.h)

    setView(target)

    setIsResizing(false)
    isTransitioning.current = false
  }

  return { view, switchView, isResizing }
}
