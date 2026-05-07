import React from 'react'
import { DollarSign, ArrowUpDown, Clock, XCircle } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import type { Transaction } from '@/types'

interface TransactionStatPillsProps {
  transactions: Transaction[]
  isLoading?: boolean
}

interface StatPill {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  accent: string
  bg: string
}

export function TransactionStatPills({ transactions, isLoading }: TransactionStatPillsProps) {
  const today = new Date().toDateString()

  const todayTxns = transactions.filter((t) => {
    if (!t.transaction_date) return false
    const d = new Date(t.transaction_date)
    return !isNaN(d.getTime()) && d.toDateString() === today
  })

  const todayVolume = todayTxns.reduce((sum, t) => sum + (t.amount ?? 0), 0)
  const todayCount = todayTxns.length
  const pendingCount = transactions.filter(
    (t) => (t.status ?? '').toLowerCase() === 'pending'
  ).length
  const failedCount = transactions.filter(
    (t) => (t.status ?? '').toLowerCase() === 'failed'
  ).length

  const pills: StatPill[] = [
    {
      label: "Today's Volume",
      value: formatCurrency(todayVolume, 'USD'),
      icon: DollarSign,
      accent: '#5266eb',
      bg: 'rgba(82,102,235,0.1)',
    },
    {
      label: 'Transaction Count',
      value: todayCount.toString(),
      icon: ArrowUpDown,
      accent: '#22c55e',
      bg: 'rgba(34,197,94,0.1)',
    },
    {
      label: 'Pending',
      value: pendingCount.toString(),
      icon: Clock,
      accent: '#f59e0b',
      bg: 'rgba(245,158,11,0.1)',
    },
    {
      label: 'Failed',
      value: failedCount.toString(),
      icon: XCircle,
      accent: '#ef4444',
      bg: 'rgba(239,68,68,0.1)',
    },
  ]

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-16 w-48 rounded-lg skeleton-shimmer"
            style={{ backgroundColor: 'var(--color-graphite)' }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-3">
      {pills.map((pill) => {
        const Icon = pill.icon
        return (
          <div
            key={pill.label}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border"
            style={{
              backgroundColor: pill.bg,
              borderColor: `${pill.accent}30`,
            }}
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-md"
              style={{ backgroundColor: `${pill.accent}20` }}
            >
              <Icon className="h-4 w-4" style={{ color: pill.accent }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--color-silver)' }}>
                {pill.label}
              </p>
              <p
                className="text-base font-semibold"
                style={{ color: 'var(--color-starlight)' }}
              >
                {pill.value}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
