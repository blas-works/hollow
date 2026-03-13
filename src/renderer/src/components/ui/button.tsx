import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/80',
        outline: 'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        icon: 'rounded-full active:scale-95 text-muted-foreground hover:text-foreground hover:bg-accent',
        play: 'rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:bg-primary/90 active:scale-95',
        back: 'flex items-center gap-2.5 text-muted-foreground hover:text-foreground mb-10 w-fit',
        clear:
          'flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive/50 mt-4',
        export:
          'flex items-center gap-2 text-xs text-muted-foreground hover:text-green-400/50 mt-4',
        update: 'flex items-center gap-2 text-xs text-muted-foreground hover:text-blue-400/50 mt-4'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8 p-2'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isActive?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isActive, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    const activeClass =
      variant === 'icon' && isActive !== undefined
        ? isActive
          ? 'bg-accent text-foreground'
          : 'text-muted-foreground'
        : ''
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), activeClass)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
