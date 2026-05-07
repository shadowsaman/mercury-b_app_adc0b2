import React from 'react'
import type { AuditLog } from '@/types'
import { formatDate, truncate } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from 'react-router-dom'

interface RecentAlertsPanelProps {
  logs: AuditLog[]
  isLoading?: boolean
}

function getSeverityColor(severity: string | undefined): string {
  const s = (severity ?? '').toLowerCase()
  if (s === 'critical') return '#ef4444'
  if (s === 'warning') return '#f59e0b'
  if (s === 'info') return '#5266eb'
  return 'var(--color-lead)'
}

export function RecentAlertsPanel({ logs, isLoading }: RecentAlertsPanelProps) {
  const recent = logs.slice(0, 8)

  return (
    <div
      className="mercury-card p-6 flex flex-col h-full"
      style={{ backgroundColor: 'var(--color-midnight-slate)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[18px] font-light" style={{ color: 'var(--color-starlight)' }}>
            Recent Alerts
          </h3>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-silver)' }}>
            Latest system events
          </p>
        </div>
        <Link
          to="/audit-logs"
          className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors duration-150"
          style={{
            backgroundColor: 'rgba(205,221,255,0.12)',
            color: 'var(--color-starlight)',
          }}
        >
          View All
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto space-y-0 divide-y" style={{ borderColor: 'rgba(112,112,125,0.1)' }}>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 py-3">
              <Skeleton className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: 'var(--color-graphite)' }} />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" style={{ backgroundColor: 'var(--color-graphite)' }} />
                <Skeleton className="h-3 w-1/3" style={{ backgroundColor: 'var(--color-graphite)' }} />
              </div>
            </div>
          ))
        ) : recent.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm" style={{ color: 'var(--color-silver)' }}>No recent alerts</p>
          </div>
        ) : (
          recent.map((log) => (
            <div key={log.guid} className="flex items-start gap-3 py-3">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5 status-pulse"
                style={{ backgroundColor: getSeverityColor(log.severity) }}
              />
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm leading-snug"
                  style={{ color: 'var(--color-starlight)' }}
                  title={log.action ?? ''}
                >
                  {truncate(log.action, 60) || '—'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {log.module && (
                    <span
                      className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'rgba(82,102,235,0.12)',
                        color: 'var(--color-mercury-blue)',
                      }}
                    >
                      {log.module}
                    </span>
                  )}
                  <span className="text-[11px]" style={{ color: 'var(--color-lead)' }}>
                    {formatDate(log.timestamp ?? log.created_at)}
                  </span>
                </div>
              </div>
              <span
                className="text-[10px] font-semibold uppercase flex-shrink-0 mt-0.5"
                style={{ color: getSeverityColor(log.severity) }}
              >
                {log.severity ?? '—'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
