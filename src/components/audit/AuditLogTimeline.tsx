import React, { useState } from 'react'
import { cn, formatDate, truncate } from '@/lib/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import type { AuditLog } from '@/types'

function getSeverityColor(severity: string | undefined) {
  const s = (severity ?? '').toLowerCase()
  if (s === 'critical') return '#ef4444'
  if (s === 'warning') return '#f59e0b'
  if (s === 'info') return '#5266eb'
  if (s === 'debug') return '#70707d'
  return '#5266eb'
}

function getModuleColor(module: string | undefined) {
  const colors = ['#5266eb', '#8b5cf6', '#06b6d4', '#f59e0b', '#22c55e', '#ec4899']
  const m = module ?? ''
  const idx = m.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % colors.length
  return colors[idx]
}

interface AuditLogTimelineProps {
  logs: AuditLog[]
  isLoading?: boolean
}

function TimelineEntry({ log }: { log: AuditLog }) {
  const [expanded, setExpanded] = useState(false)
  const severityColor = getSeverityColor(log.severity)
  const moduleColor = getModuleColor(log.module)

  return (
    <div className="relative flex gap-4">
      {/* Left bar */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
          style={{ backgroundColor: severityColor, boxShadow: `0 0 6px ${severityColor}60` }}
        />
        <div className="flex-1 w-px mt-2" style={{ backgroundColor: 'rgba(112,112,125,0.2)' }} />
      </div>

      {/* Content */}
      <div
        className="flex-1 mb-4 p-4 transition-colors duration-150 hover:bg-[rgba(82,102,235,0.03)]"
        style={{
          backgroundColor: 'var(--color-midnight-slate)',
          border: '1px solid rgba(112,112,125,0.12)',
          borderLeft: `3px solid ${severityColor}`,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Action + Module */}
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-sm font-medium" style={{ color: 'var(--color-starlight)' }}>
                {log.action ?? '—'}
              </span>
              {log.module && (
                <span
                  className="inline-block px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: `${moduleColor}20`,
                    color: moduleColor,
                  }}
                >
                  {log.module}
                </span>
              )}
              {log.severity && (
                <span
                  className="inline-block px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: `${severityColor}15`,
                    color: severityColor,
                  }}
                >
                  {log.severity}
                </span>
              )}
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* User */}
              <div className="flex items-center gap-1.5">
                <Avatar className="w-5 h-5">
                  <AvatarFallback className="text-[9px]" style={{ backgroundColor: 'var(--color-graphite)', color: 'var(--color-silver)' }}>
                    {getInitials(log.performed_by)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs" style={{ color: 'var(--color-silver)' }}>
                  {log.performed_by ?? '—'}
                </span>
              </div>

              {/* Entity */}
              {log.entity_type && (
                <span className="text-xs" style={{ color: 'var(--color-lead)' }}>
                  {log.entity_type}
                  {log.entity_id && (
                    <span className="mono ml-1" style={{ color: 'var(--color-silver)' }}>
                      #{truncate(log.entity_id, 12)}
                    </span>
                  )}
                </span>
              )}

              {/* IP */}
              {log.ip_address && (
                <span className="mono text-xs" style={{ color: 'var(--color-lead)' }}>
                  {log.ip_address}
                </span>
              )}
            </div>
          </div>

          {/* Right: timestamp + expand */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="text-xs" style={{ color: 'var(--color-lead)' }}>
              {formatDate(log.timestamp ?? log.created_at)}
            </span>
            {log.details && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="flex items-center gap-1 text-xs transition-colors"
                style={{ color: 'var(--color-mercury-blue)' }}
              >
                {expanded ? 'Hide' : 'Details'}
                {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            )}
          </div>
        </div>

        {/* Expanded details */}
        {expanded && log.details && (
          <div
            className="mt-3 p-3 text-xs"
            style={{
              backgroundColor: 'var(--color-graphite)',
              border: '1px solid rgba(112,112,125,0.15)',
              color: 'var(--color-silver)',
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
            }}
          >
            {log.details}
          </div>
        )}
      </div>
    </div>
  )
}

export function AuditLogTimeline({ logs, isLoading }: AuditLogTimelineProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-graphite)' }} />
              <div className="flex-1 w-px mt-2" style={{ backgroundColor: 'rgba(112,112,125,0.2)' }} />
            </div>
            <div
              className="flex-1 h-20 mb-4 animate-pulse"
              style={{ backgroundColor: 'var(--color-graphite)', border: '1px solid rgba(112,112,125,0.12)' }}
            />
          </div>
        ))}
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div
        className="flex items-center justify-center py-16 text-sm"
        style={{ color: 'var(--color-lead)' }}
      >
        No audit log entries found.
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {logs.map((log) => (
        <TimelineEntry key={log.guid} log={log} />
      ))}
    </div>
  )
}
