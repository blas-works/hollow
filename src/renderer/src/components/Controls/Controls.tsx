import React from 'react'
import { Pause, Pin, PinOff, Play, RotateCcw, Menu as MenuIcon } from 'lucide-react'
import { motion } from 'motion/react'

interface ControlsProps {
  isPinned: boolean
  isRunning: boolean
  onTogglePin: () => void
  onReset: () => void
  onToggleTimer: () => void
  onOpenMenu: () => void
}

export function Controls({
  isPinned,
  isRunning,
  onTogglePin,
  onReset,
  onToggleTimer,
  onOpenMenu
}: ControlsProps): React.JSX.Element {
  return (
    <div className="app-no-drag flex items-center mt-auto gap-4">
      <button
        onClick={onTogglePin}
        title={isPinned ? 'Unpin window' : 'Pin window'}
        className={`rounded-full transition-all duration-200 flex items-center justify-center active:scale-95 p-2 ${
          isPinned
            ? 'text-text-main bg-white/10'
            : 'text-white/25 hover:text-white/60 hover:bg-white/5'
        }`}
      >
        {isPinned ? <PinOff size={15} strokeWidth={1.5} /> : <Pin size={15} strokeWidth={1.5} />}
      </button>

      <button
        onClick={onReset}
        title="Reset"
        className="rounded-full transition-all duration-200 flex items-center justify-center active:scale-95 p-2 text-white/20 hover:text-white/50 hover:bg-white/5"
      >
        <RotateCcw size={15} strokeWidth={1.5} />
      </button>

      <motion.button
        onClick={onToggleTimer}
        animate={{
          boxShadow: isRunning
            ? [
                '0 0 0px rgba(255,255,255,0)',
                '0 0 15px rgba(255,255,255,0.12)',
                '0 0 0px rgba(255,255,255,0)'
              ]
            : '0 0 0px rgba(255,255,255,0)'
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        title={isRunning ? 'Pause' : 'Start'}
        className="flex items-center justify-center rounded-full bg-text-main text-black transition-all duration-200 active:scale-95 hover:bg-white/90 w-10 h-10"
      >
        {isRunning ? (
          <Pause size={16} fill="currentColor" />
        ) : (
          <Play size={16} fill="currentColor" className="ml-0.5" />
        )}
      </motion.button>

      <button
        onClick={onOpenMenu}
        title="Menu"
        className="rounded-full transition-all duration-200 flex items-center justify-center active:scale-95 p-2 text-white/20 hover:text-white/50 hover:bg-white/5"
      >
        <MenuIcon size={15} strokeWidth={1.5} />
      </button>
    </div>
  )
}
