import React, { type ReactNode } from 'react'
import { Button as UIButton } from '@/components/ui/button'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  title?: string
  className?: string
  variant?: 'icon' | 'play' | 'back' | 'clear' | 'export' | 'update'
  isActive?: boolean
  disabled?: boolean
}

export function Button({
  children,
  onClick,
  title,
  className = '',
  variant = 'icon',
  isActive,
  disabled
}: ButtonProps): React.JSX.Element {
  return (
    <UIButton
      variant={variant}
      size={variant === 'icon' ? 'icon-sm' : undefined}
      onClick={onClick}
      title={title}
      disabled={disabled}
      isActive={isActive}
      className={className}
    >
      {children}
    </UIButton>
  )
}
