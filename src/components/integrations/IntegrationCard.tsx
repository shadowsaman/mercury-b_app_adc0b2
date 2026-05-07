import React from 'react'
import { cn, formatCurrency } from '@/lib/utils'
import type { ApiIntegration } from '@/types'
import { Button } from '@/components/ui/button'
import { Network, Settings, Trash2, RefreshCw, FileText } from 'lucide-react'

interface IntegrationCardProps {
  integration: ApiIntegration
  onConfigure?: (integration: ApiIntegration) => void
  onDelete?: (guid: string) => void
  onSync?: (integration: ApiIntegration) => void
}

function getStatusConfig(status: string | undefined) {
  switch ((status ?? '').toLowerCase()) {
    case 'active':
      return { color: '#22c55e', label: 'Active', pulse: true, bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.25)' }
    case 'maintenance':
      return { color: '#f59e0b', label: 'Maintenance', pulse: false, bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' }
    case 'error':
      return { color: '#ef4444', label: 'Error', pulse: false, bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)' }
    case 'inactive':
      return { color: '#70707d', label: 'Inactive', pulse: false, bg: 'rgba(112,112,125,0.12)', border: 'rgba(112,112,125,0.25)' }
    default:
      return { color: '#70707d', label: status ?? '—', pulse: false, bg: 'rgba(112,112,125,0.12)', border: 'rgba(112,112,125,0.25)' }
  }
}

function getApiTypeBadgeStyle(apiType: string | undefined) {
  switch ((apiType ?? '').toUpperCase()) {
    case 'REST': return { bg: 'rgba(82,102,235,0.15)', color: 'var(--color-mercury-blue)', border: 'rgba(82,102,235,0.25)' }
    case 'GRAPHQL': return { bg: 'rgba(139,92,246,0.15)', color: '#c084fc', border: 'rgba(139,92,246,0.25)' }
    case 'SOAP': return { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)' }
    case 'WEBHOOK': return { bg: 'rgba(34,197,94,0.15)', color: '#4ade80', border: 'rgba(34,197,94,0.25)' }
    default: return { bg: 'rgba(112,112,125,0.15)', color: 'var(--color-silver)', border: 'rgba(112,112,125,0.25)' }
  }
}

export function IntegrationCard({ integration, onConfigure, onDelete, onSync }: IntegrationCardProps) {
  const statusConfig = getStatusConfig(integration.status)
  const apiTypeStyle = getApiTypeBadgeStyle(integration.api_type)

  // Rate limit usage — visual bar (mock usage at ~60% for display)
  const rateLimit = integration.rate_limit ?? 0
  const rateUsagePercent = rateLimit > 0 ? Math.min(60, (rateLimit / 1000) * 100) : 0

  return (
    <div
      className="relative flex flex-col p-6 mercury-card transition-all duration-150 hover:bg-[#272735] group"
      style={{ minHeight: 220 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-sm flex-shrink-0"
            style={{ backgroundColor: 'rgba(82,102,235,0.15)', border: '1px solid rgba(82,102,235,0.25)' }}
          >
            <Network className="h-5 w-5" style={{ color: 'var(--color-mercury-blue)' }} />
          </div>
          <div>
            <p className="text-[15px] font-medium" style={{ color: 'var(--color-starlight)' }}>
              {integration.integration_name ?? '—'}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: apiTypeStyle.bg, color: apiTypeStyle.color, border: `1px solid ${apiTypeStyle.border}` }}
              >
                {integration.api_type ?? '—'}
              </span>
              {integration.version && (
                <span className="text-[10px]" style={{ color: 'var(--color-lead)' }}>v{integration.version}</span>
              )}
            </div>
          </div>
        </div>
        {/* Status */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div
            className={cn('w-2 h-2 rounded-full', statusConfig.pulse && 'status-pulse')}
            style={{ backgroundColor: statusConfig.color }}
          />
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: statusConfig.bg, color: statusConfig.color, border: `1px solid ${statusConfig.border}` }}
          >
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Base URL */}
      {integration.base_url && (
        <p className="mono text-[11px] mb-3 truncate" style={{ color: 'var(--color-lead)' }}>
          {integration.base_url}
        </p>
      )}

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest mb-0.5" style={{ color: 'var(--color-lead)' }}>Auth</p>
          <p className="text-[12px]" style={{ color: 'var(--color-silver)' }}>{integration.auth_method ?? '—'}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest mb-0.5" style={{ color: 'var(--color-lead)' }}>Last Sync</p>
          <p className="text-[12px]" style={{ color: 'var(--color-silver)' }}>{integration.last_sync ?? '—'}</p>
        </div>
      </div>

      {/* Rate limit bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--color-lead)' }}>Rate Limit</p>
          <p className="text-[11px]" style={{ color: 'var(--color-silver)' }}>
            {rateLimit > 0 ? formatCurrency(rateLimit, 'USD') : '—'} / min
          </p>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(112,112,125,0.2)' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${rateUsagePercent}%`, backgroundColor: 'var(--color-mercury-blue)' }}
          />
        </div>
      </div>

      {/* Description */}
      {integration.description && (
        <p className="text-[12px] mb-3 line-clamp-2" style={{ color: 'var(--color-silver)' }}>
          {integration.description}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onSync?.(integration)}
          className="h-7 px-2 text-[11px]"
          style={{ color: 'var(--color-mercury-blue)' }}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Sync
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onConfigure?.(integration)}
          className="h-7 px-2 text-[11px]"
          style={{ color: 'var(--color-silver)' }}
        >
          <Settings className="h-3 w-3 mr-1" />
          Configure
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-[11px]"
          style={{ color: 'var(--color-silver)' }}
        >
          <FileText className="h-3 w-3 mr-1" />
          Logs
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => integration.guid && onDelete?.(integration.guid)}
          className="h-7 px-2 text-[11px] ml-auto"
          style={{ color: '#ef4444' }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
