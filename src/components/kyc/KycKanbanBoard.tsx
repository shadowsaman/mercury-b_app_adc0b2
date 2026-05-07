import React from 'react'
import { cn, formatDate, truncate } from '@/lib/utils'
import { useApiQuery } from '@/hooks/useApi'
import { extractList } from '@/lib/apiUtils'
import type { KycVerification, Customer } from '@/types'

const COLUMNS = [
  { key: 'submitted', label: 'Submitted', color: '#5266eb' },
  { key: 'in progress', label: 'In Progress', color: '#f59e0b' },
  { key: 'under review', label: 'Under Review', color: '#8b5cf6' },
  { key: 'approved', label: 'Approved', color: '#22c55e' },
  { key: 'failed', label: 'Failed', color: '#ef4444' },
]

function getRiskColor(risk: string | undefined) {
  const r = (risk ?? '').toLowerCase()
  if (r === 'low') return '#22c55e'
  if (r === 'medium') return '#f59e0b'
  if (r === 'high') return '#ef4444'
  if (r === 'critical') return '#7c3aed'
  return '#c3c3cc'
}

function getDaysElapsed(dateStr: string | undefined): number {
  if (!dateStr) return 0
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return 0
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24))
}

interface KycKanbanBoardProps {
  verifications: KycVerification[]
  onCardClick: (v: KycVerification) => void
}

export function KycKanbanBoard({ verifications, onCardClick }: KycKanbanBoardProps) {
  const { data: customersData } = useApiQuery<unknown>(['customers'], '/v2/items/customers')
  const customers = extractList<Customer>(customersData)

  function getCustomerName(customersId: string | undefined): string {
    if (!customersId) return '—'
    return customers.find((c) => c.guid === customersId)?.full_name ?? '—'
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const cards = verifications.filter(
          (v) => (v.status ?? '').toLowerCase() === col.key
        )
        return (
          <div
            key={col.key}
            className="flex-shrink-0 w-64"
          >
            {/* Column Header */}
            <div
              className="flex items-center justify-between px-3 py-2 mb-3"
              style={{
                backgroundColor: `${col.color}18`,
                border: `1px solid ${col.color}40`,
              }}
            >
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: col.color }}>
                {col.label}
              </span>
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: `${col.color}30`, color: col.color }}
              >
                {cards.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {cards.length === 0 ? (
                <div
                  className="px-3 py-6 text-center text-xs"
                  style={{
                    color: 'var(--color-lead)',
                    border: '1px dashed rgba(112,112,125,0.2)',
                  }}
                >
                  No items
                </div>
              ) : (
                cards.map((v) => {
                  const days = getDaysElapsed(v.submitted_date)
                  return (
                    <button
                      key={v.guid}
                      onClick={() => onCardClick(v)}
                      className="w-full text-left p-3 transition-colors duration-150 hover:opacity-90"
                      style={{
                        backgroundColor: 'var(--color-midnight-slate)',
                        border: '1px solid rgba(112,112,125,0.15)',
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-medium" style={{ color: 'var(--color-starlight)' }}>
                          {truncate(getCustomerName(v.customers_id), 24)}
                        </span>
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                          style={{ backgroundColor: getRiskColor(v.risk_level) }}
                        />
                      </div>
                      <p className="text-xs mb-2" style={{ color: 'var(--color-silver)' }}>
                        {v.verification_type ?? '—'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: 'var(--color-lead)' }}>
                          {formatDate(v.submitted_date)}
                        </span>
                        <span
                          className="text-xs px-1.5 py-0.5"
                          style={{
                            backgroundColor: days > 7 ? 'rgba(239,68,68,0.15)' : 'rgba(112,112,125,0.15)',
                            color: days > 7 ? '#ef4444' : 'var(--color-lead)',
                          }}
                        >
                          {days}d
                        </span>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
