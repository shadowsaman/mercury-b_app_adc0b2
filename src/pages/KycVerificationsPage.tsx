import React, { useState } from 'react'
import { cn, formatDate, truncate } from '@/lib/utils'
import { extractList, extractCount } from '@/lib/apiUtils'
import { useApiQuery } from '@/hooks/useApi'
import { useKycVerifications, useDeleteKycVerification } from '@/hooks/useKycVerifications'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { KycPriorityQueue } from '@/components/kyc/KycPriorityQueue'
import { KycReviewPanel } from '@/components/kyc/KycReviewPanel'
import { KycKanbanBoard } from '@/components/kyc/KycKanbanBoard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, LayoutList, LayoutGrid, Check, X, Minus } from 'lucide-react'
import type { KycVerification, Customer } from '@/types'
import type { Column } from '@/components/shared/DataTable'

function getStatusStyle(status: string | undefined) {
  const s = (status ?? '').toLowerCase()
  if (s === 'approved') return { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' }
  if (s === 'failed') return { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' }
  if (s === 'in progress') return { bg: 'rgba(82,102,235,0.15)', color: '#5266eb' }
  if (s === 'under review') return { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' }
  if (s === 'submitted') return { bg: 'rgba(205,221,255,0.15)', color: '#cdddff' }
  return { bg: 'rgba(112,112,125,0.15)', color: '#c3c3cc' }
}

function getRiskStyle(risk: string | undefined) {
  const r = (risk ?? '').toLowerCase()
  if (r === 'low') return { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' }
  if (r === 'medium') return { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' }
  if (r === 'high') return { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' }
  if (r === 'critical') return { bg: 'rgba(124,58,237,0.15)', color: '#7c3aed' }
  return { bg: 'rgba(112,112,125,0.15)', color: '#c3c3cc' }
}

function CheckIcon({ value }: { value: string | undefined }) {
  const v = (value ?? '').toLowerCase()
  const isPass = v === 'clear' || v === 'pass' || v === 'no'
  const isFail = v === 'found' || v === 'fail' || v === 'yes' || v === 'match'
  if (isPass) return <Check className="h-3.5 w-3.5" style={{ color: '#22c55e' }} />
  if (isFail) return <X className="h-3.5 w-3.5" style={{ color: '#ef4444' }} />
  return <Minus className="h-3.5 w-3.5" style={{ color: '#c3c3cc' }} />
}

export function KycVerificationsPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedVerification, setSelectedVerification] = useState<KycVerification | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')

  const { data, isLoading } = useKycVerifications()
  const verifications = extractList<KycVerification>(data)
  const total = extractCount(data)

  const { data: customersData } = useApiQuery<unknown>(['customers'], '/v2/items/customers')
  const customers = extractList<Customer>(customersData)

  function getCustomerName(customersId: string | undefined): string {
    if (!customersId) return '—'
    return customers.find((c) => c.guid === customersId)?.full_name ?? '—'
  }

  const filtered = verifications.filter((v) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'pending') {
      const s = (v.status ?? '').toLowerCase()
      return s === 'submitted' || s === 'pending'
    }
    if (activeFilter === 'high-risk') {
      const r = (v.risk_level ?? '').toLowerCase()
      return r === 'high' || r === 'critical'
    }
    if (activeFilter === 'in-progress') {
      return (v.status ?? '').toLowerCase() === 'in progress'
    }
    return true
  })

  const columns: Column<KycVerification>[] = [
    {
      key: 'verification_id',
      label: 'Verification ID',
      render: (row) => (
        <span className="mono text-xs" style={{ color: 'var(--color-silver)' }}>
          {truncate(row.verification_id ?? row.guid, 18)}
        </span>
      ),
    },
    {
      key: 'customers_id',
      label: 'Customer',
      render: (row) => (
        <span style={{ color: 'var(--color-starlight)' }}>
          {getCustomerName(row.customers_id)}
        </span>
      ),
    },
    {
      key: 'verification_type',
      label: 'Type',
      render: (row) => (
        <span style={{ color: 'var(--color-silver)' }}>{row.verification_type ?? '—'}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const style = getStatusStyle(row.status)
        return (
          <span
            className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: style.bg, color: style.color }}
          >
            {row.status ?? '—'}
          </span>
        )
      },
    },
    {
      key: 'risk_level',
      label: 'Risk Level',
      render: (row) => {
        const style = getRiskStyle(row.risk_level)
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: style.bg, color: style.color }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.color }} />
            {row.risk_level ?? '—'}
          </span>
        )
      },
    },
    {
      key: 'submitted_date',
      label: 'Submitted',
      render: (row) => (
        <span style={{ color: 'var(--color-silver)' }}>{formatDate(row.submitted_date)}</span>
      ),
    },
    {
      key: 'completed_date',
      label: 'Completed',
      render: (row) => (
        <span style={{ color: 'var(--color-silver)' }}>{formatDate(row.completed_date)}</span>
      ),
    },
    {
      key: 'reviewed_by',
      label: 'Reviewer',
      render: (row) => (
        <span style={{ color: 'var(--color-silver)' }}>{row.reviewed_by ?? '—'}</span>
      ),
    },
    {
      key: 'sanctions_check',
      label: 'Sanctions',
      render: (row) => <CheckIcon value={row.sanctions_check} />,
    },
    {
      key: 'pep_check',
      label: 'PEP',
      render: (row) => <CheckIcon value={row.pep_check} />,
    },
    {
      key: 'adverse_media',
      label: 'Adverse Media',
      render: (row) => <CheckIcon value={row.adverse_media} />,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="KYC / AML Verifications"
        subtitle="Compliance workflow for customer identity verification and AML screening"
      />

      {/* Priority Queue */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-lead)' }}>
          Priority Queue
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-24" style={{ backgroundColor: 'var(--color-graphite)' }} />
            ))}
          </div>
        ) : (
          <KycPriorityQueue
            verifications={verifications}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        )}
      </div>

      {/* View Toggle + Tab */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-light" style={{ color: 'var(--color-starlight)' }}>
              Verification Pipeline
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-silver)' }}>
              {filtered.length} of {total} verifications
              {activeFilter !== 'all' ? ` (filtered: ${activeFilter})` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('table')}
              className="flex items-center justify-center w-8 h-8 transition-colors duration-150"
              style={{
                backgroundColor: viewMode === 'table' ? 'var(--color-mercury-blue)' : 'var(--color-graphite)',
                color: viewMode === 'table' ? '#fff' : 'var(--color-silver)',
              }}
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className="flex items-center justify-center w-8 h-8 transition-colors duration-150"
              style={{
                backgroundColor: viewMode === 'kanban' ? 'var(--color-mercury-blue)' : 'var(--color-graphite)',
                color: viewMode === 'kanban' ? '#fff' : 'var(--color-silver)',
              }}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>

        {viewMode === 'table' ? (
          <DataTable<KycVerification>
            columns={columns}
            data={filtered}
            isLoading={isLoading}
            emptyMessage="No verifications found."
            onRowClick={(row) => setSelectedVerification(row)}
          />
        ) : (
          isLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-64 h-48 flex-shrink-0" style={{ backgroundColor: 'var(--color-graphite)' }} />
              ))}
            </div>
          ) : (
            <KycKanbanBoard
              verifications={filtered}
              onCardClick={(v) => setSelectedVerification(v)}
            />
          )
        )}
      </div>

      {/* Review Panel */}
      {selectedVerification && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedVerification(null)}
          />
          <KycReviewPanel
            verification={selectedVerification}
            onClose={() => setSelectedVerification(null)}
          />
        </>
      )}
    </div>
  )
}
