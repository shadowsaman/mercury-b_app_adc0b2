import React from 'react'
import { TrendingUp, Calendar, DollarSign, Activity } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Deposit } from '@/types'

interface DepositSummaryCardsProps {
  deposits: Deposit[]
}

export function DepositSummaryCards({ deposits }: DepositSummaryCardsProps) {
  const totalValue = deposits.reduce((sum, d) => sum + (d.principal_amount ?? 0), 0)
  const totalAccrued = deposits.reduce((sum, d) => sum + (d.accrued_interest ?? 0), 0)

  const avgRate =
    deposits.length > 0
      ? deposits.reduce((sum, d) => sum + (d.interest_rate ?? 0), 0) / deposits.length
      : 0

  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const upcomingMaturities = deposits.filter((d) => {
    if (!d.maturity_date) return false
    const md = new Date(d.maturity_date)
    return md >= now && md <= thirtyDaysFromNow
  }).length

  const cards = [
    {
      label: 'Total Deposits Value',
      value: formatCurrency(totalValue, 'USD'),
      icon: DollarSign,
      sub: `${deposits.length} deposits`,
    },
    {
      label: 'Average Interest Rate',
      value: `${avgRate.toFixed(2)}%`,
      icon: TrendingUp,
      sub: 'across all active deposits',
    },
    {
      label: 'Upcoming Maturities',
      value: upcomingMaturities.toString(),
      icon: Calendar,
      sub: 'within next 30 days',
      highlight: upcomingMaturities > 0,
    },
    {
      label: 'Total Accrued Interest',
      value: formatCurrency(totalAccrued, 'USD'),
      icon: Activity,
      sub: 'current period',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="kpi-glow relative flex flex-col gap-3 p-6"
            style={{
              backgroundColor: 'var(--color-midnight-slate)',
              border: '1px solid rgba(112,112,125,0.15)',
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--color-silver)' }}
              >
                {card.label}
              </span>
              <div
                className="flex items-center justify-center w-8 h-8 rounded-sm"
                style={{ backgroundColor: 'rgba(82,102,235,0.15)' }}
              >
                <Icon className="h-4 w-4" style={{ color: 'var(--color-mercury-blue)' }} />
              </div>
            </div>
            <div
              className="text-2xl font-light"
              style={{ color: card.highlight ? '#f59e0b' : 'var(--color-starlight)' }}
            >
              {card.value}
            </div>
            <div className="text-xs" style={{ color: 'var(--color-lead)' }}>
              {card.sub}
            </div>
          </div>
        )
      })}
    </div>
  )
}
