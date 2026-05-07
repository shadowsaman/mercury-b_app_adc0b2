import React, { useState } from 'react'
import { cn, formatDate, truncate } from '@/lib/utils'
import { extractList, extractCount } from '@/lib/apiUtils'
import { useApiQuery } from '@/hooks/useApi'
import { useAuditLogs } from '@/hooks/useAuditLogs'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { AuditLogTimeline } from '@/components/audit/AuditLogTimeline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Download, Search, Filter, LayoutList, Clock } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { AuditLog, User } from '@/types'
import type { Column } from '@/components/shared/DataTable'

function getSeverityStyle(severity: string | undefined) {
  const s = (severity ?? '').toLowerCase()
  if (s === 'critical') return { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' }
  if (s === 'warning') return { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' }
  if (s === 'info') return { bg: 'rgba(82,102,235,0.15)', color: '#5266eb' }
  if (s === 'debug') return { bg: 'rgba(112,112,125,0.15)', color: '#70707d' }
  return { bg: 'rgba(112,112,125,0.15)', color: '#c3c3cc' }
}

function getModuleColor(module: string | undefined) {
  const colors = ['#5266eb', '#8b5cf6', '#06b6d4', '#f59e0b', '#22c55e', '#ec4899']
  const m = module ?? ''
  const idx = m.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % colors.length
  return colors[idx]
}

export function AuditLogsPage() {
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [moduleFilter, setModuleFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('timeline')

  const { data, isLoading } = useAuditLogs()
  const logs = extractList<AuditLog>(data)
  const total = extractCount(data)

  const { data: usersData } = useApiQuery<unknown>(['users'], '/v2/items/users')
  const users = extractList<User>(usersData)

  function getUserName(usersId: string | undefined): string {
    if (!usersId) return '—'
    return users.find((u) => u.guid === usersId)?.full_name ?? '—'
  }

  // Unique modules for filter
  const modules = Array.from(new Set(logs.map((l) => l.module).filter(Boolean))) as string[]

  const filtered = logs.filter((log) => {
    if (severityFilter !== 'all' && (log.severity ?? '').toLowerCase() !== severityFilter.toLowerCase()) return false
    if (moduleFilter !== 'all' && (log.module ?? '') !== moduleFilter) return false
    if (search) {
      const q = search.toLowerCase()
      const matchAction = (log.action ?? '').toLowerCase().includes(q)
      const matchPerformed = (log.performed_by ?? '').toLowerCase().includes(q)
      const matchEntity = (log.entity_type ?? '').toLowerCase().includes(q)
      const matchDetails = (log.details ?? '').toLowerCase().includes(q)
      if (!matchAction && !matchPerformed && !matchEntity && !matchDetails) return false
    }
    return true
  })

  const columns: Column<AuditLog>[] = [
    {
      key: 'timestamp',
      label: 'Timestamp',
      render: (row) => (
        <span className="text-xs mono" style={{ color: 'var(--color-silver)' }}>
          {formatDate(row.timestamp ?? row.created_at)}
        </span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (row) => (
        <span className="text-sm font-medium" style={{ color: 'var(--color-starlight)' }}>
          {row.action ?? '—'}
        </span>
      ),
    },
    {
      key: 'module',
      label: 'Module',
      render: (row) => {
        if (!row.module) return <span style={{ color: 'var(--color-lead)' }}>—</span>
        const color = getModuleColor(row.module)
        return (
          <span
            className="inline-block px-2 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {row.module}
          </span>
        )
      },
    },
    {
      key: 'entity_type',
      label: 'Entity',
      render: (row) => (
        <div>
          <span className="text-xs" style={{ color: 'var(--color-silver)' }}>{row.entity_type ?? '—'}</span>
          {row.entity_id && (
            <span className="block mono text-xs" style={{ color: 'var(--color-lead)' }}>
              {truncate(row.entity_id, 14)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'performed_by',
      label: 'Performed By',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-[9px]" style={{ backgroundColor: 'var(--color-graphite)', color: 'var(--color-silver)' }}>
              {getInitials(row.performed_by)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs" style={{ color: 'var(--color-silver)' }}>
            {row.performed_by ?? '—'}
          </span>
        </div>
      ),
    },
    {
      key: 'ip_address',
      label: 'IP Address',
      render: (row) => (
        <span className="mono text-xs" style={{ color: 'var(--color-lead)' }}>
          {row.ip_address ?? '—'}
        </span>
      ),
    },
    {
      key: 'severity',
      label: 'Severity',
      render: (row) => {
        const style = getSeverityStyle(row.severity)
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: style.bg, color: style.color }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.color }} />
            {row.severity ?? '—'}
          </span>
        )
      },
    },
    {
      key: 'details',
      label: 'Details',
      render: (row) => (
        <span className="text-xs" style={{ color: 'var(--color-silver)' }}>
          {truncate(row.details, 60)}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Audit Logs"
        subtitle="Complete system activity trail for compliance and security monitoring"
        action="Export Report"
        onAction={() => {}}
        actionIcon={<Download className="h-4 w-4" />}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Entries', value: total, color: '#5266eb' },
          {
            label: 'Critical',
            value: logs.filter((l) => (l.severity ?? '').toLowerCase() === 'critical').length,
            color: '#ef4444',
          },
          {
            label: 'Warnings',
            value: logs.filter((l) => (l.severity ?? '').toLowerCase() === 'warning').length,
            color: '#f59e0b',
          },
          {
            label: 'Info',
            value: logs.filter((l) => (l.severity ?? '').toLowerCase() === 'info').length,
            color: '#5266eb',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 kpi-glow"
            style={{
              backgroundColor: 'var(--color-midnight-slate)',
              border: '1px solid rgba(112,112,125,0.15)',
            }}
          >
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--color-lead)' }}>
              {stat.label}
            </p>
            {isLoading ? (
              <Skeleton className="h-8 w-16" style={{ backgroundColor: 'var(--color-graphite)' }} />
            ) : (
              <p className="text-2xl font-light" style={{ color: stat.color }}>
                {stat.value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="flex flex-wrap items-center gap-3 p-4"
        style={{
          backgroundColor: 'var(--color-midnight-slate)',
          border: '1px solid rgba(112,112,125,0.15)',
        }}
      >
        <div className="relative flex-1 min-w-48">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
            style={{ color: 'var(--color-lead)' }}
          />
          <Input
            placeholder="Search actions, users, details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            style={{
              backgroundColor: 'var(--color-graphite)',
              border: '1px solid rgba(112,112,125,0.2)',
              color: 'var(--color-starlight)',
              borderRadius: 32,
            }}
          />
        </div>

        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger
            className="w-36"
            style={{ backgroundColor: 'var(--color-graphite)', border: '1px solid rgba(112,112,125,0.2)' }}
          >
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="debug">Debug</SelectItem>
          </SelectContent>
        </Select>

        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger
            className="w-40"
            style={{ backgroundColor: 'var(--color-graphite)', border: '1px solid rgba(112,112,125,0.2)' }}
          >
            <SelectValue placeholder="Module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {modules.map((m) => (
              <SelectItem key={m} value={m || 'unknown'}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* View toggle */}
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setViewMode('timeline')}
            className="flex items-center justify-center w-8 h-8 transition-colors"
            style={{
              backgroundColor: viewMode === 'timeline' ? 'var(--color-mercury-blue)' : 'var(--color-graphite)',
              color: viewMode === 'timeline' ? '#fff' : 'var(--color-silver)',
            }}
          >
            <Clock className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className="flex items-center justify-center w-8 h-8 transition-colors"
            style={{
              backgroundColor: viewMode === 'table' ? 'var(--color-mercury-blue)' : 'var(--color-graphite)',
              color: viewMode === 'table' ? '#fff' : 'var(--color-silver)',
            }}
          >
            <LayoutList className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Results count */}
      <div>
        <p className="text-xs mb-4" style={{ color: 'var(--color-lead)' }}>
          Showing {filtered.length} entries
          {(search || severityFilter !== 'all' || moduleFilter !== 'all') ? ' (filtered)' : ''}
        </p>

        {viewMode === 'timeline' ? (
          <AuditLogTimeline logs={filtered} isLoading={isLoading} />
        ) : (
          <DataTable<AuditLog>
            columns={columns}
            data={filtered}
            isLoading={isLoading}
            emptyMessage="No audit log entries found."
          />
        )}
      </div>
    </div>
  )
}
