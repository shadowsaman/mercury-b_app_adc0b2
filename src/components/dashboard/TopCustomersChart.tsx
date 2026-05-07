import React, { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { Customer, Account } from '@/types'
import { truncate, formatCurrency } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface TopCustomersChartProps {
  customers: Customer[]
  accounts: Account[]
  isLoading?: boolean
}

export function TopCustomersChart({ customers, accounts, isLoading }: TopCustomersChartProps) {
  const data = useMemo(() => {
    // Sum balance per customer from their accounts
    const balanceMap = new Map<string, number>()
    accounts.forEach((a) => {
      if (!a.customers_id) return
      balanceMap.set(a.customers_id, (balanceMap.get(a.customers_id) ?? 0) + (a.balance ?? 0))
    })

    return customers
      .map((c) => ({
        name: truncate(c.full_name ?? 'Unknown', 16),
        balance: balanceMap.get(c.guid) ?? 0,
        guid: c.guid,
      }))
      .filter((c) => c.balance > 0)
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 5)
  }, [customers, accounts])

  return (
    <div
      className="mercury-card p-6 flex flex-col h-full"
      style={{ backgroundColor: 'var(--color-midnight-slate)' }}
    >
      <div className="mb-5">
        <h3 className="text-[18px] font-light" style={{ color: 'var(--color-starlight)' }}>
          Top Customers
        </h3>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-silver)' }}>
          By total balance
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3 flex-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-4 flex-1" style={{ backgroundColor: 'var(--color-graphite)' }} />
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm" style={{ color: 'var(--color-silver)' }}>No customer balance data</p>
        </div>
      ) : (
        <div className="flex-1 min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fill: 'var(--color-silver)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => {
                  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`
                  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`
                  return `$${v}`
                }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: 'var(--color-silver)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={96}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-graphite)',
                  border: '1px solid rgba(112,112,125,0.3)',
                  borderRadius: '6px',
                  color: 'var(--color-starlight)',
                  fontSize: '12px',
                }}
                formatter={(value) => [formatCurrency(Number(value), 'USD'), 'Balance']}
                labelStyle={{ color: 'var(--color-silver)' }}
                cursor={{ fill: 'rgba(82,102,235,0.06)' }}
              />
              <Bar dataKey="balance" radius={[0, 3, 3, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`bar-${entry.guid}`}
                    fill={index === 0 ? '#5266eb' : `rgba(82,102,235,${0.7 - index * 0.12})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
