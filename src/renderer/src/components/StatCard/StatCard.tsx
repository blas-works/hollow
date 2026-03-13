import React from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: number | string
  subtext?: string
  variant?: 'primary' | 'secondary'
}

export function StatCard({
  label,
  value,
  subtext,
  variant = 'primary'
}: StatCardProps): React.JSX.Element {
  return (
    <Card variant={variant}>
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 whitespace-nowrap">
        {label}
      </p>
      <p
        className={cn(
          'font-light text-foreground',
          variant === 'secondary' ? 'text-lg' : 'text-2xl'
        )}
      >
        {value}
      </p>
      {subtext && <p className="text-xs text-muted-foreground mt-0.5">{subtext}</p>}
    </Card>
  )
}
