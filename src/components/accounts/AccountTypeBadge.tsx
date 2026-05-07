import React from 'react'
import { cn } from '@/lib/utils'

interface AccountTypeBadgeProps {
  type: string | null | undefined
  className?: string
}

const typeConfig: Record<string, { label: string; bg: string; color: string }> = {
  Checking: { label: 'Checking', bg: 'rgba(82,102,235,0.18)', color: '#5266eb' },
  Savings: { label: 'Savings', bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  Business: { label: 'Business', bg: 'rgba(168,85,247,0.18)', color: '#a855f7' },
  Corporate: { label: 'Corporate', bg: 'rgba(249,115,22,0.15)', color: '#f97316' },
  Investment: { label: 'Investment', bg: 'rgba(20,184,166,0.15)', color: '#14b8a6' },
}

export function AccountTypeBadge({ type, className }: AccountTypeBadgeProps) {
  const normalized = (type ?? '').trim()
  const config = typeConfig[normalized] ?? {
    label: normalized || '—',
    bg: 'rgba(112,112,125,0.15)',
    color: 'var(--color-silver)',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        className
      )}
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  )
}
