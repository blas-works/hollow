import React from 'react'
import { Pause, PinOff, Play } from 'lucide-react'
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

  if (isPinned) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center px-3 gap-2.5"
        style={{ display: isTransitioning ? 'none' : 'flex' }}
      >
        <button
          onClick={onTogglePin}
          title="Desanclar"
          className="app-no-drag rounded-full flex items-center justify-center p-1.5 text-text-main bg-white/10 transition-all duration-200 active:scale-95"
        >
          <PinOff size={12} strokeWidth={1.5} />
        </button>

        <motion.button
          onClick={onToggleTimer}
          animate={{
            boxShadow: isRunning
              ? '0 0 10px rgba(255,255,255,0.12)'
              : '0 0 0px rgba(255,255,255,0)'
          }}
          transition={{
            duration: 3.5,
            repeat: isRunning ? Infinity : 0,
            repeatType: 'mirror',
            ease: 'easeInOut',
            type: 'tween'
          }}
          title={isRunning ? 'Pausar' : 'Iniciar'}
          className="app-no-drag flex items-center justify-center rounded-full bg-text-main text-black w-7 h-7 active:scale-95 hover:bg-white/90"
        >
          {isRunning ? (
            <Pause size={12} fill="currentColor" />
          ) : (
            <Play size={12} fill="currentColor" className="ml-0.5" />
          )}
        </motion.button>

        <div className="flex items-baseline gap-0.5">
          <span
            className={`font-mono tracking-[-0.05em] text-text-main text-xl font-light ${
              isRunning ? 'opacity-100' : 'opacity-45'
            }`}
          >
            {displayMinutes}
          </span>
          <motion.span
            animate={{ opacity: isRunning ? 0.45 : 0.15 }}
            transition={{
              duration: 4,
              repeat: isRunning ? Infinity : 0,
              repeatType: 'mirror',
              ease: 'easeInOut',
              type: 'tween'
            }}
            className="font-mono font-light text-text-main text-xs"
          >
            m
          </motion.span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center p-5 transform-gpu backface-hidden"
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
    </div>
  )
}
