import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertVariants = cva('flex items-start gap-2 rounded-lg px-4 py-3 text-xs leading-relaxed', {
  variants: {
    variant: {
      default: 'bg-secondary border border-border',
      warning: 'border'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
  )
)
Alert.displayName = 'Alert'

export { Alert }
