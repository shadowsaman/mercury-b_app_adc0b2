import React from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface CustomerFilters {
  search: string
  customerType: string
  kycStatus: string
  amlRisk: string
  status: string
}

interface CustomerFiltersBarProps {
  filters: CustomerFilters
  onFiltersChange: (filters: CustomerFilters) => void
}

const CUSTOMER_TYPES = ['All', 'Individual', 'Corporate', 'SME', 'VIP']
const KYC_STATUSES = ['All', 'Verified', 'Pending', 'Failed', 'Under Review']
const AML_RISKS = ['All', 'Low', 'Medium', 'High', 'Critical']
const STATUSES = ['All', 'Active', 'Suspended', 'Under Review', 'Inactive']

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border whitespace-nowrap',
        active
          ? 'border-[#5266eb] text-[#5266eb] bg-[rgba(82,102,235,0.15)]'
          : 'border-[rgba(112,112,125,0.3)] text-[#c3c3cc] bg-[#272735] hover:bg-[rgba(82,102,235,0.08)] hover:border-[rgba(82,102,235,0.4)]'
      )}
    >
      {label}
    </button>
  )
}

export function CustomerFiltersBar({ filters, onFiltersChange }: CustomerFiltersBarProps) {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.customerType !== 'All' ||
    filters.kycStatus !== 'All' ||
    filters.amlRisk !== 'All' ||
    filters.status !== 'All'

  function clearAll() {
    onFiltersChange({ search: '', customerType: 'All', kycStatus: 'All', amlRisk: 'All', status: 'All' })
  }

  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-sm"
      style={{ backgroundColor: 'var(--color-graphite)', border: '1px solid rgba(112,112,125,0.15)' }}
    >
      {/* Search row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
            style={{ color: 'var(--color-lead)' }}
          />
          <Input
            placeholder="Search by name, email, phone..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9 h-8 text-sm bg-[#1e1e2a] border-[rgba(112,112,125,0.3)] focus-visible:ring-[#5266eb]/40"
            style={{ color: 'var(--color-starlight)', borderRadius: '32px' }}
          />
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-xs gap-1 text-[#c3c3cc] hover:text-[#ededf3]"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-4">
        {/* Customer Type */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--color-lead)' }}>Type:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {CUSTOMER_TYPES.map((t) => (
              <FilterChip
                key={t}
                label={t}
                active={filters.customerType === t}
                onClick={() => onFiltersChange({ ...filters, customerType: t })}
              />
            ))}
          </div>
        </div>

        {/* KYC Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--color-lead)' }}>KYC:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {KYC_STATUSES.map((s) => (
              <FilterChip
                key={s}
                label={s}
                active={filters.kycStatus === s}
                onClick={() => onFiltersChange({ ...filters, kycStatus: s })}
              />
            ))}
          </div>
        </div>

        {/* AML Risk */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--color-lead)' }}>AML:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {AML_RISKS.map((r) => (
              <FilterChip
                key={r}
                label={r}
                active={filters.amlRisk === r}
                onClick={() => onFiltersChange({ ...filters, amlRisk: r })}
              />
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--color-lead)' }}>Status:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {STATUSES.map((s) => (
              <FilterChip
                key={s}
                label={s}
                active={filters.status === s}
                onClick={() => onFiltersChange({ ...filters, status: s })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
