import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TransactionStatusBadgeProps {
  status: string | null | undefined
  className?: string
}

export function TransactionStatusBadge({ status, className }: TransactionStatusBadgeProps) {
  const s = (status ?? '').toLowerCase()

  const config: Record<string, { label: string; bg: string; color: string }> = {
    completed: { label: 'Completed', bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
    pending:   { label: 'Pending',   bg: 'rgba(251,191,36,0.12)', color: '#f59e0b' },
    failed:    { label: 'Failed',    bg: 'rgba(239,68,68,0.12)',  color: '#ef4444' },
    reversed:  { label: 'Reversed',  bg: 'rgba(168,85,247,0.12)', color: '#a855f7' },
    processing:{ label: 'Processing',bg: 'rgba(82,102,235,0.12)', color: '#5266eb' },
  }

  const style = config[s] ?? { label: status ?? '—', bg: 'rgba(112,112,125,0.15)', color: '#c3c3cc' }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        className
      )}
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {style.label}
    </span>
  )
}
