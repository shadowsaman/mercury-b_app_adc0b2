import React from 'react'
import type { PaymentGateway } from '@/types'
import { formatDate, truncate } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from 'react-router-dom'

interface GatewayHealthStatusProps {
  gateways: PaymentGateway[]
  isLoading?: boolean
}

function getStatusColor(status: string | undefined): string {
  const s = (status ?? '').toLowerCase()
  if (s === 'online' || s === 'active') return '#22c55e'
  if (s === 'degraded') return '#f59e0b'
  if (s === 'offline') return '#ef4444'
  if (s === 'maintenance') return '#f59e0b'
  return 'var(--color-lead)'
}

function getStatusLabel(status: string | undefined): string {
  const s = (status ?? '').toLowerCase()
  if (s === 'online' || s === 'active') return 'Online'
  if (s === 'degraded') return 'Degraded'
  if (s === 'offline') return 'Offline'
  if (s === 'maintenance') return 'Maintenance'
  return status ?? '—'
}

function getUptimeColor(uptime: number | undefined): string {
  if (uptime === undefined) return 'var(--color-silver)'
  if (uptime >= 99) return 'var(--color-mercury-blue)'
  if (uptime >= 95) return '#f59e0b'
  return '#ef4444'
}

export function GatewayHealthStatus({ gateways, isLoading }: GatewayHealthStatusProps) {
  const displayed = gateways.slice(0, 6)

  return (
    <div
      className="mercury-card p-6 flex flex-col h-full"
      style={{ backgroundColor: 'var(--color-midnight-slate)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[18px] font-light" style={{ color: 'var(--color-starlight)' }}>
            Gateway Health
          </h3>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-silver)' }}>
            Payment gateway status
          </p>
        </div>
        <Link
          to="/payment-gateways"
          className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors duration-150"
          style={{
            backgroundColor: 'rgba(205,221,255,0.12)',
            color: 'var(--color-starlight)',
          }}
        >
          View All
        </Link>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <Skeleton className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-graphite)' }} />
              <Skeleton className="h-4 flex-1" style={{ backgroundColor: 'var(--color-graphite)' }} />
              <Skeleton className="h-4 w-12" style={{ backgroundColor: 'var(--color-graphite)' }} />
            </div>
          ))
        ) : displayed.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm" style={{ color: 'var(--color-silver)' }}>No gateways configured</p>
          </div>
        ) : (
          displayed.map((gw) => (
            <div
              key={gw.guid}
              className="flex items-center gap-3 py-2.5 px-3 rounded-sm transition-colors duration-150"
              style={{ backgroundColor: 'var(--color-graphite)' }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 status-pulse"
                style={{ backgroundColor: getStatusColor(gw.status) }}
              />
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: 'var(--color-starlight)' }}
                >
                  {gw.gateway_name ?? '—'}
                </p>
                <p className="text-[11px] truncate" style={{ color: 'var(--color-lead)' }}>
                  {gw.provider ?? '—'} · {formatDate(gw.last_health_check ?? '')}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span
                  className="text-sm font-semibold"
                  style={{ color: getUptimeColor(gw.uptime_percent) }}
                >
                  {gw.uptime_percent !== undefined ? `${gw.uptime_percent}%` : '—'}
                </span>
                <span
                  className="text-[10px] uppercase tracking-wide"
                  style={{ color: getStatusColor(gw.status) }}
                >
                  {getStatusLabel(gw.status)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
