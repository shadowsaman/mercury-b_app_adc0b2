import React from 'react'
import { cn } from '@/lib/utils'
import { ShieldAlert, Clock, AlertTriangle } from 'lucide-react'
import type { KycVerification } from '@/types'

interface KycPriorityQueueProps {
  verifications: KycVerification[]
  onFilterChange: (filter: string) => void
  activeFilter: string
}

export function KycPriorityQueue({ verifications, onFilterChange, activeFilter }: KycPriorityQueueProps) {
  const pendingCount = verifications.filter(
    (v) => (v.status ?? '').toLowerCase() === 'submitted' || (v.status ?? '').toLowerCase() === 'pending'
  ).length

  const highRiskCount = verifications.filter(
    (v) => (v.risk_level ?? '').toLowerCase() === 'high' || (v.risk_level ?? '').toLowerCase() === 'critical'
  ).length

  const inProgressCount = verifications.filter(
    (v) => (v.status ?? '').toLowerCase() === 'in progress'
  ).length

  const cards = [
    {
      key: 'pending',
      label: 'Pending Review',
      count: pendingCount,
      icon: Clock,
      color: '#5266eb',
      bg: 'rgba(82,102,235,0.12)',
      border: 'rgba(82,102,235,0.3)',
    },
    {
      key: 'high-risk',
      label: 'High Risk',
      count: highRiskCount,
      icon: ShieldAlert,
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.1)',
      border: 'rgba(239,68,68,0.3)',
    },
    {
      key: 'in-progress',
      label: 'In Progress',
      count: inProgressCount,
      icon: AlertTriangle,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.1)',
      border: 'rgba(245,158,11,0.3)',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        const isActive = activeFilter === card.key
        return (
          <button
            key={card.key}
            onClick={() => onFilterChange(isActive ? 'all' : card.key)}
            className="relative text-left p-5 transition-all duration-150 kpi-glow"
            style={{
              backgroundColor: isActive ? card.bg : 'var(--color-midnight-slate)',
              border: `1px solid ${isActive ? card.border : 'rgba(112,112,125,0.15)'}`,
              borderRadius: 0,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-silver)' }}>
                {card.label}
              </span>
              <div
                className="flex items-center justify-center w-8 h-8"
                style={{ backgroundColor: card.bg, borderRadius: 4 }}
              >
                <Icon className="h-4 w-4" style={{ color: card.color }} />
              </div>
            </div>
            <div className="text-3xl font-light" style={{ color: card.color }}>
              {card.count}
            </div>
            {isActive && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: card.color }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
