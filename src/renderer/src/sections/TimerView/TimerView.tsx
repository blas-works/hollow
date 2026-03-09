import React from 'react'
import { motion } from 'motion/react'
import { Timer, Controls } from '../../components'

interface TimerViewProps {
  timeLeft: number
  isRunning: boolean
  isPinned: boolean
  isTransitioning: boolean
  onToggleTimer: () => void
  onResetTimer: () => void
  onTogglePin: () => void
  onOpenMenu: () => void
}

export function TimerView({
  timeLeft,
  isRunning,
  isPinned,
  isTransitioning,
  onToggleTimer,
  onResetTimer,
  onTogglePin,
  onOpenMenu
}: TimerViewProps): React.JSX.Element {
  const displayMinutes = Math.ceil(timeLeft / 60).toString()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 transform-gpu backface-hidden"
      style={{ display: isTransitioning ? 'none' : 'flex' }}
    >
      <Timer minutes={displayMinutes} isRunning={isRunning} />
      <Controls
        isPinned={isPinned}
        isRunning={isRunning}
        onTogglePin={onTogglePin}
        onReset={onResetTimer}
        onToggleTimer={onToggleTimer}
        onOpenMenu={onOpenMenu}
      />
    </motion.div>
  )
}
