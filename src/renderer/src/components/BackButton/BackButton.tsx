import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BackButtonProps {
  onClick: () => void
  label?: string
}

export function BackButton({ onClick, label = 'Volver' }: BackButtonProps): React.JSX.Element {
  return (
    <Button variant="back" onClick={onClick} className="app-no-drag btn-back">
      <ArrowLeft size={15} strokeWidth={1.5} className="transition-transform duration-200" />
      <span className="text-xs font-medium tracking-widest uppercase">{label}</span>
    </Button>
  )
}
