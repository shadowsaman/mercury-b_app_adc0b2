import React from 'react'
import { cn, formatCurrency } from '@/lib/utils'
import type { PaymentGateway } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Zap, Settings, Trash2, RefreshCw } from 'lucide-react'

interface GatewayHealthCardProps {
  gateway: PaymentGateway
  onConfigure?: (gateway: PaymentGateway) => void
  onDelete?: (guid: string) => void
  onTest?: (gateway: PaymentGateway) => void
}

function getStatusConfig(status: string | undefined) {
  switch ((status ?? '').toLowerCase()) {
    case 'online':
      return { color: '#22c55e', label: 'Online', pulse: true, badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' }
    case 'degraded':
      return { color: '#f59e0b', label: 'Degraded', pulse: false, badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30' }
    case 'offline':
      return { color: '#ef4444', label: 'Offline', pulse: false, badgeClass: 'bg-red-500/20 text-red-400 border-red-500/30' }
    case 'maintenance':
      return { color: '#8b5cf6', label: 'Maintenance', pulse: false, badgeClass: 'bg-violet-500/20 text-violet-400 border-violet-500/30' }
    default:
      return { color: '#70707d', label: status ?? '—', pulse: false, badgeClass: 'bg-[rgba(112,112,125,0.2)] text-[#c3c3cc] border-[rgba(112,112,125,0.3)]' }
  }
}

function getUptimeColor(uptime: number | undefined) {
  if (!uptime) return 'var(--color-lead)'
  if (uptime >= 99) return 'var(--color-mercury-blue)'
  if (uptime >= 95) return '#f59e0b'
  return '#ef4444'
}

export function GatewayHealthCard({ gateway, onConfigure, onDelete, onTest }: GatewayHealthCardProps) {
  const statusConfig = getStatusConfig(gateway.status)
  const uptimeColor = getUptimeColor(gateway.uptime_percent)

  const currencies = (gateway.supported_currencies ?? '').split(',').map((c) => c.trim()).filter(Boolean)

  return (
    <div
      className="relative flex flex-col p-6 mercury-card kpi-glow transition-all duration-150 hover:bg-[#272735] group"
      style={{ minHeight: 240 }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-sm flex-shrink-0"
            style={{ backgroundColor: 'rgba(82,102,235,0.15)', border: '1px solid rgba(82,102,235,0.25)' }}
          >
            <Zap className="h-5 w-5" style={{ color: 'var(--color-mercury-blue)' }} />
          </div>
          <div>
            <p className="text-[15px] font-medium" style={{ color: 'var(--color-starlight)' }}>
              {gateway.gateway_name ?? '—'}
            </p>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--color-silver)' }}>
              {gateway.provider ?? '—'}
            </p>
          </div>
        </div>
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div
            className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0', statusConfig.pulse && 'status-pulse')}
            style={{ backgroundColor: statusConfig.color }}
          />
          <span
            className="text-[12px] font-medium px-2.5 py-0.5 rounded-full border"
            style={{}} // use inline badgeClass via className below
          >
            <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full border', statusConfig.badgeClass)}>
              {statusConfig.label}
            </span>
          </span>
        </div>
      </div>

      {/* Uptime */}
      <div className="mb-4">
        <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: 'var(--color-lead)' }}>Uptime</p>
        <p className="text-3xl font-light" style={{ color: uptimeColor }}>
          {gateway.uptime_percent != null ? `${gateway.uptime_percent}%` : '—'}
        </p>
      </div>

      {/* Details row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest mb-0.5" style={{ color: 'var(--color-lead)' }}>Type</p>
          <p className="text-[13px]" style={{ color: 'var(--color-silver)' }}>{gateway.gateway_type ?? '—'}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest mb-0.5" style={{ color: 'var(--color-lead)' }}>Fee %</p>
          <p className="text-[13px]" style={{ color: 'var(--color-silver)' }}>
            {gateway.transaction_fee_percent != null ? `${gateway.transaction_fee_percent}%` : '—'}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest mb-0.5" style={{ color: 'var(--color-lead)' }}>Daily Limit</p>
          <p className="text-[13px]" style={{ color: 'var(--color-silver)' }}>
            {gateway.daily_volume_limit != null ? formatCurrency(gateway.daily_volume_limit, 'USD') : '—'}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest mb-0.5" style={{ color: 'var(--color-lead)' }}>Last Check</p>
          <p className="text-[12px] mono" style={{ color: 'var(--color-silver)' }}>
            {gateway.last_health_check ?? '—'}
          </p>
        </div>
      </div>

      {/* Currencies */}
      {currencies.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {currencies.slice(0, 5).map((c) => (
            <span
              key={c}
              className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(82,102,235,0.15)', color: 'var(--color-mercury-blue)', border: '1px solid rgba(82,102,235,0.25)' }}
            >
              {c}
            </span>
          ))}
          {currencies.length > 5 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(112,112,125,0.15)', color: 'var(--color-silver)' }}>
              +{currencies.length - 5}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onTest?.(gateway)}
          className="h-7 px-2 text-[11px]"
          style={{ color: 'var(--color-mercury-blue)' }}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Test
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onConfigure?.(gateway)}
          className="h-7 px-2 text-[11px]"
          style={{ color: 'var(--color-silver)' }}
        >
          <Settings className="h-3 w-3 mr-1" />
          Configure
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => gateway.guid && onDelete?.(gateway.guid)}
          className="h-7 px-2 text-[11px] ml-auto"
          style={{ color: '#ef4444' }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
