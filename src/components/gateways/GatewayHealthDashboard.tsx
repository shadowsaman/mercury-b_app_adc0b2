import React from 'react'
import type { PaymentGateway } from '@/types'
import { GatewayHealthCard } from './GatewayHealthCard'
import { Skeleton } from '@/components/ui/skeleton'

interface GatewayHealthDashboardProps {
  gateways: PaymentGateway[]
  isLoading?: boolean
  onConfigure?: (gateway: PaymentGateway) => void
  onDelete?: (guid: string) => void
  onTest?: (gateway: PaymentGateway) => void
}

export function GatewayHealthDashboard({
  gateways,
  isLoading = false,
  onConfigure,
  onDelete,
  onTest,
}: GatewayHealthDashboardProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="mercury-card p-6" style={{ minHeight: 240 }}>
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="w-10 h-10 rounded-sm" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-8 w-20 mb-4" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (gateways.length === 0) {
    return (
      <div
        className="flex items-center justify-center py-20 mercury-card"
        style={{ color: 'var(--color-silver)' }}
      >
        <p className="text-sm">No payment gateways configured.</p>
      </div>
    )
  }

  // Summary stats
  const online = gateways.filter((g) => (g.status ?? '').toLowerCase() === 'online').length
  const degraded = gateways.filter((g) => (g.status ?? '').toLowerCase() === 'degraded').length
  const offline = gateways.filter((g) => (g.status ?? '').toLowerCase() === 'offline').length
  const avgUptime =
    gateways.length > 0
      ? (gateways.reduce((acc, g) => acc + (g.uptime_percent ?? 0), 0) / gateways.length).toFixed(2)
      : '0.00'

  return (
    <div className="space-y-6">
      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="mercury-card p-4 kpi-glow">
          <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: 'var(--color-lead)' }}>Total</p>
          <p className="text-2xl font-light" style={{ color: 'var(--color-starlight)' }}>{gateways.length}</p>
        </div>
        <div className="mercury-card p-4">
          <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: 'var(--color-lead)' }}>Online</p>
          <p className="text-2xl font-light" style={{ color: '#22c55e' }}>{online}</p>
        </div>
        <div className="mercury-card p-4">
          <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: 'var(--color-lead)' }}>Degraded</p>
          <p className="text-2xl font-light" style={{ color: '#f59e0b' }}>{degraded}</p>
        </div>
        <div className="mercury-card p-4">
          <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: 'var(--color-lead)' }}>Avg Uptime</p>
          <p className="text-2xl font-light" style={{ color: 'var(--color-mercury-blue)' }}>{avgUptime}%</p>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gateways.map((gateway) => (
          <GatewayHealthCard
            key={gateway.guid}
            gateway={gateway}
            onConfigure={onConfigure}
            onDelete={onDelete}
            onTest={onTest}
          />
        ))}
      </div>
    </div>
  )
}
