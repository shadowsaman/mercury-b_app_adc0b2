import React, { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { Account } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface BalanceTrendChartProps {
  account: Account
  period?: 30 | 60 | 90
}

function generateTrendData(balance: number, days: number) {
  const data: { date: string; balance: number }[] = []
  const now = new Date()
  let current = balance * 0.85
  for (let i = days; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const delta = (Math.random() - 0.42) * balance * 0.02
    current = Math.max(0, current + delta)
    if (i === 0) current = balance
    data.push({ date: label, balance: Math.round(current) })
  }
  return data
}

export function BalanceTrendChart({ account, period = 30 }: BalanceTrendChartProps) {
  const data = useMemo(
    () => generateTrendData(account.balance ?? 0, period),
    [account.guid, account.balance, period]
  )

  const tickCount = period === 30 ? 6 : period === 60 ? 7 : 8
  const step = Math.floor(data.length / tickCount)
  const tickDates = data
    .filter((_, i) => i % step === 0 || i === data.length - 1)
    .map((d) => d.date)

  return (
    <div
      className="p-5"
      style={{
        backgroundColor: 'var(--color-midnight-slate)',
        border: '1px solid rgba(112,112,125,0.15)',
      }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: 'var(--color-silver)' }}
      >
        Balance Trend — Last {period} Days
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5266eb" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#cdddff" stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(112,112,125,0.15)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: 'var(--color-lead)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            ticks={tickDates}
          />
          <YAxis
            tick={{ fill: 'var(--color-lead)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => '$' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)}
            width={56}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-graphite)',
              border: '1px solid rgba(112,112,125,0.25)',
              borderRadius: 4,
              color: 'var(--color-starlight)',
              fontSize: 12,
            }}
            formatter={(value) => [formatCurrency(Number(value), 'USD'), 'Balance']}
            labelStyle={{ color: 'var(--color-silver)', marginBottom: 4 }}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="url(#balanceLine)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#5266eb', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
