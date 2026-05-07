import React, { useState } from 'react'
import type { Account, Customer } from '@/types'
import { useAccounts, useDeleteAccount, useCustomersForAccounts } from '@/hooks/useAccounts'
import { extractList, extractCount } from '@/lib/apiUtils'
import { formatDate, formatCurrency, truncate, cn } from '@/lib/utils'
import { PageHeader } from '@/components/shared/PageHeader'
import { AccountSummaryCards } from '@/components/accounts/AccountSummaryCards'
import { AccountTypeBadge } from '@/components/accounts/AccountTypeBadge'
import { AccountFormModal } from '@/components/accounts/AccountFormModal'
import { AccountDetailView } from '@/components/accounts/AccountDetailView'
import { DataTable } from '@/components/shared/DataTable'
import type { Column } from '@/components/shared/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Plus, Search, MoreVertical, Pencil, Trash2, Eye, Copy, Download } from 'lucide-react'
import { toast } from 'sonner'

function StatusIndicator({ status }: { status: string | undefined }) {
  const s = (status ?? '').toLowerCase()
  const isActive = s === 'active'
  const isFrozen = s === 'frozen'
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span
        className={isActive ? 'status-pulse' : ''}
        style={{
          display: 'inline-block',
          width: 7,
          height: 7,
          borderRadius: '50%',
          backgroundColor: isActive
            ? '#22c55e'
            : isFrozen
            ? '#ef4444'
            : 'var(--color-lead)',
        }}
      />
      <span
        style={{
          color: isActive
            ? '#22c55e'
            : isFrozen
            ? '#ef4444'
            : 'var(--color-silver)',
        }}
      >
        {status ?? '—'}
      </span>
    </span>
  )
}

export function AccountsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const { data: accountsData, isLoading } = useAccounts()
  const { data: customersData } = useCustomersForAccounts()
  const deleteMutation = useDeleteAccount()

  const accounts = extractList<Account>(accountsData)
  const customers = extractList<Customer>(customersData)

  const filtered = accounts.filter((a) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      (a.account_number ?? '').toLowerCase().includes(q) ||
      (a.iban ?? '').toLowerCase().includes(q) ||
      (a.branch ?? '').toLowerCase().includes(q)
    const matchesType =
      typeFilter === 'all' || (a.account_type ?? '').toLowerCase() === typeFilter.toLowerCase()
    const matchesStatus =
      statusFilter === 'all' || (a.status ?? '').toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesType && matchesStatus
  })

  function handleDelete(account: Account) {
    if (window.confirm(`Delete account ${account.account_number ?? account.guid}?`)) {
      deleteMutation.mutate(account.guid)
    }
  }

  function handleEdit(account: Account) {
    setEditingAccount(account)
    setModalOpen(true)
  }

  function handleView(account: Account) {
    setSelectedAccount(account)
    setDetailOpen(true)
  }

  function copyIban(account: Account) {
    if (account.iban) {
      navigator.clipboard.writeText(account.iban)
      toast.success('IBAN copied to clipboard')
    }
  }

  const columns: Column<Account>[] = [
    {
      key: 'account_number',
      label: 'Account Number',
      render: (row) => (
        <span
          className="font-mono text-sm"
          style={{ color: 'var(--color-starlight)' }}
        >
          {row.account_number ?? '—'}
        </span>
      ),
    },
    {
      key: 'account_type',
      label: 'Type',
      render: (row) => <AccountTypeBadge type={row.account_type} />,
    },
    {
      key: 'customers_id',
      label: 'Customer',
      render: (row) => {
        const customer = customers.find((c) => c.guid === row.customers_id)
        return (
          <span style={{ color: 'var(--color-silver)' }}>
            {customer?.full_name ?? '—'}
          </span>
        )
      },
    },
    {
      key: 'currency',
      label: 'Currency',
      render: (row) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{
          backgroundColor: 'rgba(82,102,235,0.12)',
          color: 'var(--color-mercury-blue)',
        }}>
          {row.currency ?? '—'}
        </span>
      ),
    },
    {
      key: 'balance',
      label: 'Balance',
      render: (row) => (
        <span className="font-medium" style={{ color: 'var(--color-starlight)' }}>
          {formatCurrency(row.balance ?? 0, row.currency ?? 'USD')}
        </span>
      ),
    },
    {
      key: 'available_balance',
      label: 'Available',
      render: (row) => (
        <span style={{ color: 'var(--color-silver)' }}>
          {formatCurrency(row.available_balance ?? 0, row.currency ?? 'USD')}
        </span>
      ),
    },
    {
      key: 'interest_rate',
      label: 'Rate',
      render: (row) => (
        <span style={{ color: 'var(--color-silver)' }}>
          {(row.interest_rate ?? 0).toFixed(2)}%
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusIndicator status={row.status} />,
    },
    {
      key: 'iban',
      label: 'IBAN',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs" style={{ color: 'var(--color-silver)' }}>
            {row.iban ? truncate(row.iban, 18) : '—'}
          </span>
          {row.iban && (
            <button
              onClick={(e) => { e.stopPropagation(); copyIban(row) }}
              style={{ color: 'var(--color-mercury-blue)' }}
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ),
    },
    {
      key: 'opened_date',
      label: 'Opened',
      render: (row) => (
        <span style={{ color: 'var(--color-silver)' }}>
          {formatDate(row.opened_date)}
        </span>
      ),
    },
    {
      key: 'guid',
      label: 'Actions',
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(row)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(row)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            {row.iban && (
              <DropdownMenuItem onClick={() => copyIban(row)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy IBAN
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-400"
              onClick={() => handleDelete(row)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <PageHeader
        title="Accounts"
        subtitle="Manage all bank accounts and monitor balances"
        action="New Account"
        onAction={() => { setEditingAccount(null); setModalOpen(true) }}
        actionIcon={<Plus className="h-4 w-4" />}
      />

      {/* Summary Cards */}
      <AccountSummaryCards accounts={accounts} isLoading={isLoading} />

      {/* Filters */}
      <div
        className="flex flex-wrap items-center gap-3 p-4"
        style={{
          backgroundColor: 'var(--color-midnight-slate)',
          border: '1px solid rgba(112,112,125,0.15)',
        }}
      >
        <div className="relative flex items-center flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 h-4 w-4 pointer-events-none"
            style={{ color: 'var(--color-lead)' }}
          />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search account number, IBAN, branch..."
            className="pl-9"
            style={{
              backgroundColor: 'var(--color-graphite)',
              border: '1px solid rgba(112,112,125,0.25)',
              color: 'var(--color-starlight)',
            }}
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger
            className="w-[150px]"
            style={{
              backgroundColor: 'var(--color-graphite)',
              border: '1px solid rgba(112,112,125,0.25)',
              color: 'var(--color-starlight)',
            }}
          >
            <SelectValue placeholder="Account Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Checking">Checking</SelectItem>
            <SelectItem value="Savings">Savings</SelectItem>
            <SelectItem value="Business">Business</SelectItem>
            <SelectItem value="Corporate">Corporate</SelectItem>
            <SelectItem value="Investment">Investment</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            className="w-[140px]"
            style={{
              backgroundColor: 'var(--color-graphite)',
              border: '1px solid rgba(112,112,125,0.25)',
              color: 'var(--color-starlight)',
            }}
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Frozen">Frozen</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          className="ghost-btn"
          onClick={() => {
            setSearchQuery('')
            setTypeFilter('all')
            setStatusFilter('all')
          }}
        >
          Clear
        </Button>

        <Button
          variant="ghost"
          className="ghost-btn ml-auto"
          onClick={() => toast.info('Export started')}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: 'var(--color-midnight-slate)',
          border: '1px solid rgba(112,112,125,0.15)',
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: '1px solid rgba(112,112,125,0.15)' }}
        >
          <span className="text-sm" style={{ color: 'var(--color-silver)' }}>
            {filtered.length} account{filtered.length !== 1 ? 's' : ''} found
          </span>
        </div>
        <DataTable<Account>
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          emptyMessage="No accounts found. Try adjusting filters."
          onRowClick={handleView}
        />
      </div>

      {/* Create / Edit Modal */}
      <AccountFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingAccount(null)
        }}
        editingAccount={editingAccount}
      />

      {/* Detail Side Sheet */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent
          side="right"
          className="w-[520px] max-w-full p-0 overflow-y-auto"
          style={{
            backgroundColor: 'var(--color-midnight-slate)',
            borderLeft: '1px solid rgba(112,112,125,0.2)',
          }}
        >
          {selectedAccount && (
            <AccountDetailView
              account={selectedAccount}
              customers={customers}
              onClose={() => setDetailOpen(false)}
              onEdit={() => {
                setDetailOpen(false)
                handleEdit(selectedAccount)
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
