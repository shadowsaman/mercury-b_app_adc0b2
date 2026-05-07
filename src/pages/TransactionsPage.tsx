import React, { useState, useMemo } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { TransactionStatPills } from '@/components/transactions/TransactionStatPills'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import type { TransactionFilterValues } from '@/components/transactions/TransactionFilters'
import { TransactionStatusBadge } from '@/components/transactions/TransactionStatusBadge'
import { TransactionDetailModal } from '@/components/transactions/TransactionDetailModal'
import { useTransactions } from '@/hooks/useTransactions'
import { useApiQuery } from '@/hooks/useApi'
import { extractList } from '@/lib/apiUtils'
import { formatDate, formatCurrency, truncate } from '@/lib/utils'
import type { Transaction, Account } from '@/types'
import type { Column } from '@/components/shared/DataTable'
import {
  ArrowUpDown,
  Smartphone,
  Globe,
  Building2,
  CreditCard,
  Monitor,
  Download,
  Plus,
} from 'lucide-react'

const DEFAULT_FILTERS: TransactionFilterValues = {
  search: '',
  type: 'All',
  status: 'All',
  channel: 'All',
  currency: 'All',
  dateFrom: '',
  dateTo: '',
}

function ChannelIcon({ channel }: { channel: string | undefined }) {
  const c = (channel ?? '').toLowerCase()
  const iconProps = { className: 'h-3.5 w-3.5', style: { color: 'var(--color-silver)' } }
  if (c === 'mobile') return <Smartphone {...iconProps} />
  if (c === 'online') return <Monitor {...iconProps} />
  if (c === 'branch') return <Building2 {...iconProps} />
  if (c === 'atm') return <CreditCard {...iconProps} />
  if (c === 'api') return <Globe {...iconProps} />
  return <ArrowUpDown {...iconProps} />
}

export function TransactionsPage() {
  const { data: txnData, isLoading } = useTransactions()
  const { data: accountsData } = useApiQuery<unknown>(['accounts'], '/v2/items/accounts')

  const transactions = extractList<Transaction>(txnData)
  const accounts = extractList<Account>(accountsData)

  const [filters, setFilters] = useState<TransactionFilterValues>(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<TransactionFilterValues>(DEFAULT_FILTERS)
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)

  function applyFilters() {
    setAppliedFilters({ ...filters })
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS)
    setAppliedFilters(DEFAULT_FILTERS)
  }

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const search = appliedFilters.search.toLowerCase()
      if (
        search &&
        !(t.transaction_id ?? '').toLowerCase().includes(search) &&
        !(t.counterparty ?? '').toLowerCase().includes(search) &&
        !(t.description ?? '').toLowerCase().includes(search) &&
        !(t.reference_number ?? '').toLowerCase().includes(search)
      ) {
        return false
      }
      if (appliedFilters.type !== 'All' && (t.type ?? '') !== appliedFilters.type) return false
      if (appliedFilters.status !== 'All' && (t.status ?? '') !== appliedFilters.status) return false
      if (appliedFilters.channel !== 'All' && (t.channel ?? '') !== appliedFilters.channel) return false
      if (appliedFilters.currency !== 'All' && (t.currency ?? '') !== appliedFilters.currency) return false
      if (appliedFilters.dateFrom) {
        const d = new Date(t.transaction_date ?? '')
        const from = new Date(appliedFilters.dateFrom)
        if (!isNaN(d.getTime()) && !isNaN(from.getTime()) && d < from) return false
      }
      if (appliedFilters.dateTo) {
        const d = new Date(t.transaction_date ?? '')
        const to = new Date(appliedFilters.dateTo)
        if (!isNaN(d.getTime()) && !isNaN(to.getTime()) && d > to) return false
      }
      return true
    })
  }, [transactions, appliedFilters])

  const columns: Column<Transaction>[] = [
    {
      key: 'transaction_id',
      label: 'Transaction ID',
      render: (row) => (
        <span className="mono text-xs" style={{ color: 'var(--color-silver)' }}>
          {truncate(row.transaction_id, 18) || '—'}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="h-3.5 w-3.5" style={{ color: 'var(--color-mercury-blue)' }} />
          <span className="text-sm" style={{ color: 'var(--color-starlight)' }}>
            {row.type ?? '—'}
          </span>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => {
        const isCredit =
          (row.type ?? '').toLowerCase() === 'deposit' ||
          (row.type ?? '').toLowerCase() === 'internal'
        return (
          <span
            className="text-sm font-semibold"
            style={{ color: isCredit ? '#22c55e' : 'var(--color-starlight)' }}
          >
            {isCredit ? '+' : ''}
            {formatCurrency(row.amount ?? 0, row.currency ?? 'USD')}
          </span>
        )
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <TransactionStatusBadge status={row.status} />,
    },
    {
      key: 'description',
      label: 'Description',
      render: (row) => (
        <span className="text-sm" style={{ color: 'var(--color-silver)' }}>
          {truncate(row.description, 32) || '—'}
        </span>
      ),
    },
    {
      key: 'counterparty',
      label: 'Counterparty',
      render: (row) => (
        <span className="text-sm" style={{ color: 'var(--color-starlight)' }}>
          {row.counterparty ?? '—'}
        </span>
      ),
    },
    {
      key: 'channel',
      label: 'Channel',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <ChannelIcon channel={row.channel} />
          <span className="text-xs" style={{ color: 'var(--color-silver)' }}>
            {row.channel ?? '—'}
          </span>
        </div>
      ),
    },
    {
      key: 'transaction_date',
      label: 'Date',
      render: (row) => (
        <span className="text-xs" style={{ color: 'var(--color-silver)' }}>
          {formatDate(row.transaction_date)}
        </span>
      ),
    },
    {
      key: 'fee',
      label: 'Fee',
      render: (row) => (
        <span className="text-xs" style={{ color: 'var(--color-silver)' }}>
          {formatCurrency(row.fee ?? 0, row.currency ?? 'USD')}
        </span>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <PageHeader
        title="Transactions"
        subtitle="Real-time transaction monitoring and processing"
        action="Export"
        actionIcon={<Download className="h-4 w-4" />}
      />

      {/* Stat Pills */}
      <TransactionStatPills transactions={transactions} isLoading={isLoading} />

      {/* Filters */}
      <TransactionFilters
        values={filters}
        onChange={setFilters}
        onApply={applyFilters}
        onClear={clearFilters}
      />

      {/* Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-medium" style={{ color: 'var(--color-starlight)' }}>
              Transaction Ledger
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-silver)' }}>
              {isLoading ? 'Loading...' : `${filtered.length} transaction${filtered.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-midnight-slate)',
            border: '1px solid rgba(112,112,125,0.15)',
            borderRadius: 0,
          }}
        >
          <DataTable<Transaction>
            columns={columns}
            data={filtered}
            isLoading={isLoading}
            emptyMessage="No transactions match your filters."
            onRowClick={(row) => setSelectedTx(row)}
          />
        </div>

        {/* Pagination hint */}
        {!isLoading && filtered.length > 0 && (
          <div
            className="flex items-center justify-between px-4 py-3 border-t"
            style={{ borderColor: 'rgba(112,112,125,0.15)' }}
          >
            <p className="text-xs" style={{ color: 'var(--color-silver)' }}>
              Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <TransactionDetailModal
        open={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
        accounts={accounts}
      />
    </div>
  )
}
