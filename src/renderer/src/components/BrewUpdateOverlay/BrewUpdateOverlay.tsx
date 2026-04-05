import { motion, AnimatePresence } from 'motion/react'
import type { BrewStep } from '../../../../shared/types'
import { useI18n } from '../../providers'

interface BrewUpdateOverlayProps {
  step: BrewStep | undefined
  version: string | undefined
}

type StepKey = 'preparing' | 'updatingBrew' | 'downloadingUpdate' | 'installing' | 'restarting'

const STEP_KEYS: Record<BrewStep, StepKey> = {
  preparing: 'preparing',
  'updating-brew': 'updatingBrew',
  downloading: 'downloadingUpdate',
  installing: 'installing',
  restarting: 'restarting'
}

const STEP_ORDER: BrewStep[] = [
  'preparing',
  'updating-brew',
  'downloading',
  'installing',
  'restarting'
]

export function BrewUpdateOverlay({ step, version }: BrewUpdateOverlayProps): React.JSX.Element {
  const { t } = useI18n()
  const currentStep = step ?? 'preparing'
  const key = STEP_KEYS[currentStep]
  const label = t.update[key]
  const description = t.update[`${key}Desc` as keyof typeof t.update] as string
  const currentIndex = STEP_ORDER.indexOf(currentStep)
  const totalSteps = STEP_ORDER.length

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-bg-window rounded-[1.5rem]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center">
          <motion.div
            className="h-12 w-12 rounded-full border-[2.5px] border-border border-t-foreground/60"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute flex items-center justify-center">
            <svg
              className="h-4.5 w-4.5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={key}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-[11px] font-medium text-foreground"
            >
              {label}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.span
              key={`${key}-desc`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="text-[9px] text-muted-foreground"
            >
              {description}
            </motion.span>
          </AnimatePresence>

          {version && (
            <span className="text-[8px] text-muted-foreground/50 font-mono mt-0.5">v{version}</span>
          )}
        </div>

        <div
          className="flex gap-1"
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
        >
          {STEP_ORDER.map((s, i) => (
            <div
              key={s}
              className={`h-[3px] rounded-full transition-all duration-500 ${
                i <= currentIndex ? 'w-5 bg-foreground/80' : 'w-2.5 bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
