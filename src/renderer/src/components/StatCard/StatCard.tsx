import React from 'react'

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
  if (variant === 'secondary') {
    return (
      <div className="rounded-xl bg-white/2 px-4 py-3 border border-white/3 flex flex-col items-center justify-center text-center">
        <p className="text-[0.625rem] text-white/25 uppercase tracking-widest mb-0.5 whitespace-nowrap">{label}</p>
        <p className="text-lg font-light text-white/80">{value}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white/3 p-4 border border-white/4 flex flex-col items-center justify-center text-center">
      <p className="text-[0.625rem] text-white/30 uppercase tracking-widest mb-1 whitespace-nowrap">{label}</p>
      <p className="text-2xl font-light text-text-main">{value}</p>
      {subtext && <p className="text-[0.625rem] text-white/20 mt-0.5">{subtext}</p>}
    </div>
  )
}
