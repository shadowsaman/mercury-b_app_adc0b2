import React, { useState, useMemo } from 'react'
import { Plus, Download, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useCustomers } from '@/hooks/useCustomers'
import { extractList, extractCount } from '@/lib/apiUtils'
import { formatDate, getInitials, truncate } from '@/lib/utils'
import type { Customer } from '@/types'
import { CustomerFiltersBar } from '@/components/customers/CustomerFiltersBar'
import type { CustomerFilters } from '@/components/customers/CustomerFiltersBar'
import { CustomerDetailDrawer } from '@/components/customers/CustomerDetailDrawer'
import { CustomerFormModal } from '@/components/customers/CustomerFormModal'
import { CustomerStatusBadge } from '@/components/customers/CustomerStatusBadge'
import { useDeleteCustomer } from '@/hooks/useCustomers'
import type { Column } from '@/components/shared/DataTable'

const thumbPool = [
  'https://images.unsplash.com/photo-1710981855156-1dd4b48e668d?ixid=M3w5Mzk5NTF8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBiYW5rJTIwdmF1bHR8ZW58MXwwfHx8MTc3ODE0Nzk4OXww&ixlib=rb-4.1.0&w=400&h=300&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1756936724444-ecf9f7236c10?ixid=M3w5Mzk5NTF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmaW5hbmNpYWwlMjBkaXN0cmljdCUyMHNreWxpbmV8ZW58MXwwfHx8MTc3ODEzMTc5MHww&ixlib=rb-4.1.0&w=400&h=300&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1640545232493-9a9b5c88ede4?ixid=M3w5Mzk5NTF8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY3JlZGl0JTIwY2FyZCUyMGNsb3NldXB8ZW58MXwwfHx8MTc3ODE0Nzk5MHww&ixlib=rb-4.1.0&w=400&h=300&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1561382781-76dd6a2ce0b6?ixid=M3w5Mzk5NTF8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbW9kZXJuJTIwb2ZmaWNlJTIwaW50ZXJpb3J8ZW58MXwwfHx8MTc3ODE0Nzk5MHww&ixlib=rb-4.1.0&w=400&h=300&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1566254488277-aebfe9ebb6a8?ixid=M3w5Mzk5NTF8MHwxfHNlYXJjaHwyfHxjaW5lbWF0aWMlMjBiYW5rJTIwdmF1bHR8ZW58MXwwfHx8MTc3ODE0Nzk4OXww&ixlib=rb-4.1.0&w=400&h=300&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1740595198785-e3d0f90442e3?ixid=M3w5Mzk5NTF8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBmaW5hbmNpYWwlMjBkaXN0cmljdCUyMHNreWxpbmV8ZW58MXwwfHx8MTc3ODEzMTc5MHww&ixlib=rb-4.1.0&w=400&h=300&fit=crop&auto=format&q=80',
]

export function CustomersPage() {
  const { data, isLoading } = useCustomers()
  const customers = extractList<Customer>(data)
  const total = extractCount(data)

  const deleteMutation = useDeleteCustomer()

  const [filters, setFilters] = useState<CustomerFilters>({
    search: '',
    customerType: 'All',
    kycStatus: 'All',
    amlRisk: 'All',
    status: 'All',
  })

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const search = filters.search.toLowerCase()
      if (search) {
        const nameMatch = (c.full_name ?? '').toLowerCase().includes(search)
        const emailMatch = (c.email ?? '').toLowerCase().includes(search)
        const phoneMatch = (c.phone ?? '').toLowerCase().includes(search)
        if (!nameMatch && !emailMatch && !phoneMatch) return false
      }
      if (filters.customerType !== 'All' && (c.customer_type ?? '') !== filters.customerType) return false
      if (filters.kycStatus !== 'All' && (c.kyc_status ?? '') !== filters.kycStatus) return false
      if (filters.amlRisk !== 'All' && (c.aml_risk_score ?? '') !== filters.amlRisk) return false
      if (filters.status !== 'All' && (c.status ?? '') !== filters.status) return false
      return true
    })
  }, [customers, filters])

  function handleRowClick(row: Record<string, unknown>) {
    const customer = row as unknown as Customer
    setSelectedCustomer(customer)
    setDrawerOpen(true)
  }

  function handleEdit(customer: Customer) {
    setEditingCustomer(customer)
    setDrawerOpen(false)
    setFormOpen(true)
  }

  function handleAddNew() {
    setEditingCustomer(null)
    setFormOpen(true)
  }

  function handleDelete(e: React.MouseEvent, customer: Customer) {
    e.stopPropagation()
    if (confirm(`Delete customer "${customer.full_name ?? customer.guid}"?`)) {
      deleteMutation.mutate(customer.guid)
    }
  }

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: 'photo',
      label: 'Customer',
      render: (row) => {
        const c = row as unknown as Customer
        const idx = customers.indexOf(c as Customer)
        const src = c.photo ?? thumbPool[idx % thumbPool.length]
        return (
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9 flex-shrink-0">
              <AvatarImage
                src={src}
                alt={c.full_name ?? ''}
                loading="lazy"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none' }}
              />
              <AvatarFallback
                className="text-xs font-semibold"
                style={{ backgroundColor: 'rgba(82,102,235,0.2)', color: 'var(--color-mercury-blue)' }}
              >
                {getInitials(c.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p
                className="text-sm font-medium truncate hover:text-[#5266eb] transition-colors cursor-pointer"
                style={{ color: 'var(--color-starlight)' }}
              >
                {c.full_name ?? '—'}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--color-lead)' }}>
                {c.email ?? '—'}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (row) => {
        const c = row as unknown as Customer
        return <span className="text-sm" style={{ color: 'var(--color-silver)' }}>{c.phone ?? '—'}</span>
      },
    },
    {
      key: 'customer_type',
      label: 'Type',
      render: (row) => {
        const c = row as unknown as Customer
        return <CustomerStatusBadge status={c.customer_type} variant="type" />
      },
    },
    {
      key: 'kyc_status',
      label: 'KYC Status',
      render: (row) => {
        const c = row as unknown as Customer
        return <CustomerStatusBadge status={c.kyc_status} variant="kyc" />
      },
    },
    {
      key: 'aml_risk_score',
      label: 'AML Risk',
      render: (row) => {
        const c = row as unknown as Customer
        return <CustomerStatusBadge status={c.aml_risk_score} variant="aml" />
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const c = row as unknown as Customer
        return <CustomerStatusBadge status={c.status} />
      },
    },
    {
      key: 'onboarding_date',
      label: 'Onboarded',
      render: (row) => {
        const c = row as unknown as Customer
        return (
          <span className="text-sm" style={{ color: 'var(--color-silver)' }}>
            {formatDate(c.onboarding_date ?? '')}
          </span>
        )
      },
    },
    {
      key: 'actions',
      label: '',
      render: (row) => {
        const c = row as unknown as Customer
        return (
          <div className="flex items-center gap-1 justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 hover:bg-red-500/10 hover:text-red-400"
              onClick={(e) => handleDelete(e, c)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-[32px] font-light tracking-tight"
            style={{ color: 'var(--color-starlight)', fontFamily: 'var(--font-arcadiadisplay)' }}
          >
            Customers
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-silver)' }}>
            Manage customer profiles and verification status
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            className="ghost-btn flex items-center gap-2 text-sm"
            style={{ color: 'var(--color-starlight)' }}
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <Button
            onClick={handleAddNew}
            className="gap-2 text-sm"
            style={{
              backgroundColor: 'var(--color-mercury-blue)',
              color: 'white',
              borderRadius: '32px',
              padding: '8px 20px',
            }}
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <CustomerFiltersBar filters={filters} onFiltersChange={setFilters} />

      {/* Stats row */}
      <div className="flex items-center gap-4">
        <span className="text-sm" style={{ color: 'var(--color-silver)' }}>
          Showing{' '}
          <span style={{ color: 'var(--color-starlight)' }} className="font-medium">
            {filtered.length}
          </span>
          {' '}of{' '}
          <span style={{ color: 'var(--color-starlight)' }} className="font-medium">
            {isLoading ? '...' : total || customers.length}
          </span>
          {' '}customers
        </span>
      </div>

      {/* Data Table */}
      <div
        className="overflow-hidden"
        style={{
          backgroundColor: 'var(--color-midnight-slate)',
          border: '1px solid rgba(112,112,125,0.15)',
          borderRadius: '0px',
        }}
      >
        <div
          className="px-6 py-4"
          style={{ borderBottom: '1px solid rgba(112,112,125,0.1)' }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-medium" style={{ color: 'var(--color-starlight)' }}>
              Customer Directory
            </h2>
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(82,102,235,0.15)', color: 'var(--color-mercury-blue)' }}
            >
              {isLoading ? '...' : filtered.length} records
            </span>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filtered as unknown as Record<string, unknown>[]}
          isLoading={isLoading}
          emptyMessage="No customers found. Try adjusting your filters."
          onRowClick={handleRowClick}
          className="border-0 rounded-none"
        />
      </div>

      {/* Detail Drawer */}
      <CustomerDetailDrawer
        customer={selectedCustomer}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={handleEdit}
      />

      {/* Form Modal */}
      <CustomerFormModal
        open={formOpen}
        customer={editingCustomer}
        onClose={() => {
          setFormOpen(false)
          setEditingCustomer(null)
        }}
      />
    </div>
  )
}
