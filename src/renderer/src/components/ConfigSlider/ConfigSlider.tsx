import React from 'react'
import { Slider } from '@/components/ui/slider'

interface ConfigSliderProps {
  value: number
  min: number
  max: number
  label: string
  subtitle?: string
  onChange: (value: number) => void
  disabled?: boolean
}

export function ConfigSlider({
  value,
  min,
  max,
  label,
  subtitle,
  onChange,
  disabled
}: ConfigSliderProps): React.JSX.Element {
  return (
    <div className="rounded-xl bg-secondary p-5 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-foreground font-medium">{label}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <span className="text-2xl font-light text-foreground tabular-nums">{value}m</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={([v]) => onChange(v)}
        disabled={disabled}
        aria-label={label}
      />
      <div className="flex justify-between mt-2 text-xs text-muted-foreground uppercase tracking-wide">
        <span>{min}m</span>
        <span>{max}m</span>
      </div>
    </div>
  )
}
