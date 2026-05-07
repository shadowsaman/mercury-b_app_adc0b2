import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Account } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'

interface AccountDistributionChartProps {
  accounts: Account[]
  isLoading?: boolean
}

const ACCOUNT_COLORS = [
  '#5266eb',
  '#cdddff',
  '#272735',
  '#70707d',
  '#a78bfa',
]

export function AccountDistributionChart({ accounts, isLoading }: AccountDistributionChartProps) {
  const data = useMemo(() => {
    const map = new Map<string, number>()
    accounts.forEach((a) => {
      const type = a.account_type ?? 'Unknown'
      map.set(type, (map.get(type) ?? 0) + 1)
    })
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
  }, [accounts])

  return (
    <div
      className="mercury-card p-6 flex flex-col h-full"
      style={{ backgroundColor: 'var(--color-midnight-slate)' }}
    >
      <div className="mb-5">
        <h3 className="text-[18px] font-light" style={{ color: 'var(--color-starlight)' }}>
          Account Distribution
        </h3>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-silver)' }}>
          By account type
        </p>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Skeleton className="w-36 h-36 rounded-full" style={{ backgroundColor: 'var(--color-graphite)' }} />
        </div>
      ) : data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm" style={{ color: 'var(--color-silver)' }}>No account data</p>
        </div>
      ) : (
        <div className="flex-1 min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius="50%"
                outerRadius="72%"
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={ACCOUNT_COLORS[index % ACCOUNT_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-graphite)',
                  border: '1px solid rgba(112,112,125,0.3)',
                  borderRadius: '6px',
                  color: 'var(--color-starlight)',
                  fontSize: '12px',
                }}
                itemStyle={{ color: 'var(--color-starlight)' }}
                labelStyle={{ color: 'var(--color-silver)' }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ color: 'var(--color-silver)', fontSize: '11px' }}>{value}</span>
                )}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
