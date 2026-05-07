import React from 'react'
import type { Account } from '@/types'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Briefcase, DollarSign, TrendingUp, Lock } from 'lucide-react'

interface AccountSummaryCardsProps {
  accounts: Account[]
  isLoading?: boolean
}

export function AccountSummaryCards({ accounts, isLoading }: AccountSummaryCardsProps) {
  const totalAccounts = accounts.length
  const totalBalance = accounts.reduce((sum, a) => sum + (a.balance ?? 0), 0)
  const avgBalance = totalAccounts > 0 ? totalBalance / totalAccounts : 0
  const frozenCount = accounts.filter(
    (a) => (a.status ?? '').toLowerCase() === 'frozen'
  ).length

  const cards = [
    {
      label: 'Total Accounts',
      value: isLoading ? '—' : formatNumber(totalAccounts),
      icon: <Briefcase className="h-5 w-5" />,
      sub: 'All registered accounts',
    },
    {
      label: 'Total Balance',
      value: isLoading ? '—' : formatCurrency(totalBalance, 'USD'),
      icon: <DollarSign className="h-5 w-5" />,
      sub: 'Across all accounts',
    },
    {
      label: 'Average Balance',
      value: isLoading ? '—' : formatCurrency(avgBalance, 'USD'),
      icon: <TrendingUp className="h-5 w-5" />,
      sub: 'Per account',
    },
    {
      label: 'Frozen Accounts',
      value: isLoading ? '—' : formatNumber(frozenCount),
      icon: <Lock className="h-5 w-5" />,
      sub: 'Require attention',
      highlight: frozenCount > 0,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="kpi-glow relative p-6 flex flex-col gap-3"
          style={{
            backgroundColor: 'var(--color-midnight-slate)',
            border: '1px solid rgba(112,112,125,0.15)',
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--color-silver)', letterSpacing: '0.1em' }}
            >
              {card.label}
            </span>
            <span
              className="flex items-center justify-center w-9 h-9 rounded-sm"
              style={{
                backgroundColor: card.highlight
                  ? 'rgba(239,68,68,0.12)'
                  : 'rgba(82,102,235,0.12)',
                color: card.highlight ? '#ef4444' : 'var(--color-mercury-blue)',
              }}
            >
              {card.icon}
            </span>
          </div>
          <div>
            <p
              className="text-2xl font-light count-animate"
              style={{ color: 'var(--color-starlight)' }}
            >
              {card.value}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-lead)' }}>
              {card.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
