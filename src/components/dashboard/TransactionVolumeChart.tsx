import React, { useState, useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { Transaction } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface TransactionVolumeChartProps {
  transactions: Transaction[]
  isLoading?: boolean
}

type Period = 'daily' | 'weekly' | 'monthly'

function groupTransactions(transactions: Transaction[], period: Period) {
  const now = new Date()
  const map = new Map<string, number>()

  transactions.forEach((t) => {
    if (!t.transaction_date) return
    const d = new Date(t.transaction_date)
    if (isNaN(d.getTime())) return
    let key = ''
    if (period === 'daily') {
      key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } else if (period === 'weekly') {
      const weekNum = Math.ceil(d.getDate() / 7)
      key = `W${weekNum} ${d.toLocaleDateString('en-US', { month: 'short' })}`
    } else {
      key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    }
    map.set(key, (map.get(key) ?? 0) + (t.amount ?? 0))
  })

  if (map.size === 0) {
    // Generate placeholder data points for empty state
    const labels: string[] = []
    if (period === 'daily') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
      }
    } else if (period === 'weekly') {
      for (let i = 3; i >= 0; i--) {
        labels.push(`W${4 - i} Jan`)
      }
    } else {
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now)
        d.setMonth(d.getMonth() - i)
        labels.push(d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }))
      }
    }
    return labels.map((label) => ({ label, volume: 0 }))
  }

  return Array.from(map.entries()).map(([label, volume]) => ({ label, volume }))
}

export function TransactionVolumeChart({ transactions, isLoading }: TransactionVolumeChartProps) {
  const [period, setPeriod] = useState<Period>('daily')

  const data = useMemo(() => groupTransactions(transactions, period), [transactions, period])

  const periods: { value: Period; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ]

  return (
    <div
      className="mercury-card p-6 h-full flex flex-col"
      style={{ backgroundColor: 'var(--color-midnight-slate)' }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[18px] font-light" style={{ color: 'var(--color-starlight)' }}>
            Transaction Volume
          </h3>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-silver)' }}>
            Volume over time
          </p>
        </div>
        <div
          className="flex items-center gap-1 p-1 rounded-full"
          style={{ backgroundColor: 'var(--color-graphite)' }}
        >
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className="px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-150"
              style={{
                backgroundColor: period === p.value ? 'var(--color-mercury-blue)' : 'transparent',
                color: period === p.value ? '#fff' : 'var(--color-silver)',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 space-y-3">
          <Skeleton className="h-full w-full min-h-[200px]" style={{ backgroundColor: 'var(--color-graphite)' }} />
        </div>
      ) : (
        <div className="flex-1 min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5266eb" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#5266eb" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(112,112,125,0.2)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: 'var(--color-silver)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--color-silver)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => {
                  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`
                  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`
                  return `$${v}`
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-graphite)',
                  border: '1px solid rgba(112,112,125,0.3)',
                  borderRadius: '6px',
                  color: 'var(--color-starlight)',
                  fontSize: '12px',
                }}
                formatter={(value) => [formatCurrency(Number(value), 'USD'), 'Volume']}
                labelStyle={{ color: 'var(--color-silver)' }}
                cursor={{ stroke: 'rgba(82,102,235,0.3)', strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#5266eb"
                strokeWidth={2}
                fill="url(#volumeGradient)"
                dot={false}
                activeDot={{ r: 4, fill: '#5266eb', stroke: 'var(--color-midnight-slate)', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
