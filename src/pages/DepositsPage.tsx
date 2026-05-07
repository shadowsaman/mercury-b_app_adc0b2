import React, { useState } from 'react'
import { Plus, RefreshCw, Pencil, Trash2, RotateCcw } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { DepositSummaryCards } from '@/components/deposits/DepositSummaryCards'
import { DepositFormModal } from '@/components/deposits/DepositFormModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useDeposits, useDeleteDeposit } from '@/hooks/useDeposits'
import { useApiQuery } from '@/hooks/useApi'
import { extractList } from '@/lib/apiUtils'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import type { Deposit, Customer } from '@/types'
import type { Column } from '@/components/shared/DataTable'

function getStatusBadgeVariant(status: string | undefined) {
  switch (status?.toLowerCase()) {
    case 'active': return 'success'
    case 'matured': return 'info'
    case 'frozen': return 'destructive'
    case 'closed': return 'secondary'
    case 'pending': return 'warning'
    default: return 'outline'
  }
}

export function DepositsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editDeposit, setEditDeposit] = useState<Deposit | null>(null)

  const { data: depositsData, isLoading } = useDeposits()
  const deposits = extractList<Deposit>(depositsData)

  const { data: customersData } = useApiQuery<unknown>(['customers'], '/v2/items/customers')
  const customers = extractList<Customer>(customersData)

  const deleteMutation = useDeleteDeposit()

  function getCustomerName(customersId: string | undefined) {
    if (!customersId) return '—'
    return customers.find((c) => c.guid === customersId)?.full_name ?? '—'
  }

  function handleEdit(deposit: Deposit) {
    setEditDeposit(deposit)
    setModalOpen(true)
  }

  function handleDelete(deposit: Deposit) {
    if (window.confirm('Delete this deposit?')) {
      deleteMutation.mutate(deposit.guid)
    }
  }

  function handleAddNew() {
    setEditDeposit(null)
    setModalOpen(true)
  }

  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  function isMaturityNear(maturityDate: string | undefined) {
    if (!maturityDate) return false
    const md = new Date(maturityDate)
    return md >= now && md <= thirtyDaysFromNow
  }

  const columns: Column<Deposit>[] = [
    {
      key: 'deposit_id',
      label: 'Deposit ID',
      render: (row) => (
        <span className="mono" style={{ color: 'var(--color-mercury-blue)' }}>
          {row.deposit_id ?? '—'}
        </span>
      ),
    },
    {
      key: 'deposit_type',
      label: 'Type',
      render: (row) => (
        <Badge variant="info" className="text-xs">
          {row.deposit_type ?? '—'}
        </Badge>
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
      key: 'principal_amount',
      label: 'Principal',
      render: (row) => (
        <span className="font-medium" style={{ color: 'var(--color-starlight)' }}>
          {formatCurrency(row.principal_amount ?? 0, 'USD')}
        </span>
      ),
    },
    {
      key: 'interest_rate',
      label: 'Rate',
      render: (row) => (
        <span style={{ color: 'var(--color-silver)' }}>
          {row.interest_rate != null ? `${row.interest_rate}%` : '—'}
        </span>
      ),
    },
    {
      key: 'term_months',
      label: 'Term',
      render: (row) => (
        <span style={{ color: 'var(--color-silver)' }}>
          {row.term_months != null ? `${row.term_months} mo` : '—'}
        </span>
      ),
    },
    {
      key: 'start_date',
      label: 'Start Date',
      render: (row) => (
        <span style={{ color: 'var(--color-silver)' }}>
          {formatDate(row.start_date ?? '')}
        </span>
      ),
    },
    {
      key: 'maturity_date',
      label: 'Maturity Date',
      render: (row) => (
        <span
          style={{
            color: isMaturityNear(row.maturity_date)
              ? '#f59e0b'
              : 'var(--color-silver)',
            fontWeight: isMaturityNear(row.maturity_date) ? 600 : 400,
          }}
        >
          {formatDate(row.maturity_date ?? '')}
        </span>
      ),
    },
    {
      key: 'accrued_interest',
      label: 'Accrued',
      render: (row) => (
        <span style={{ color: 'var(--color-silver)' }}>
          {row.accrued_interest != null
            ? formatCurrency(row.accrued_interest, 'USD')
            : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={getStatusBadgeVariant(row.status)}>
          {row.status ?? '—'}
        </Badge>
      ),
    },
    {
      key: 'auto_renew',
      label: 'Auto Renew',
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.auto_renew ? (
            <RotateCcw className="h-4 w-4" style={{ color: 'var(--color-mercury-blue)' }} />
          ) : (
            <span style={{ color: 'var(--color-lead)' }}>—</span>
          )}
        </div>
      ),
    },
    {
      key: 'guid',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); handleEdit(row) }}
          >
            <Pencil className="h-4 w-4" style={{ color: 'var(--color-silver)' }} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); handleDelete(row) }}
          >
            <Trash2 className="h-4 w-4" style={{ color: '#ef4444' }} />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Deposits"
        subtitle="Term deposit and CD management with maturity tracking"
        action="Add Deposit"
        onAction={handleAddNew}
        actionIcon={<Plus className="h-4 w-4" />}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 skeleton-shimmer" />
          ))}
        </div>
      ) : (
        <DepositSummaryCards deposits={deposits} />
      )}

      <div
        className="flex flex-col gap-4"
        style={{
          backgroundColor: 'var(--color-midnight-slate)',
          border: '1px solid rgba(112,112,125,0.15)',
          padding: '24px',
        }}
      >
        <div className="flex items-center justify-between">
          <h2
            className="text-lg font-light"
            style={{ color: 'var(--color-starlight)' }}
          >
            All Deposits
          </h2>
          <span
            className="text-sm"
            style={{ color: 'var(--color-silver)' }}
          >
            {deposits.length} records
          </span>
        </div>
        <DataTable<Deposit>
          columns={columns}
          data={deposits}
          isLoading={isLoading}
          emptyMessage="No deposits found. Create your first deposit."
        />
      </div>

      <DepositFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditDeposit(null) }}
        deposit={editDeposit}
      />
    </div>
  )
}
