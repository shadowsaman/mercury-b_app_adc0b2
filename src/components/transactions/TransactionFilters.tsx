import React from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

export interface TransactionFilterValues {
  search: string
  type: string
  status: string
  channel: string
  currency: string
  dateFrom: string
  dateTo: string
}

interface TransactionFiltersProps {
  values: TransactionFilterValues
  onChange: (values: TransactionFilterValues) => void
  onApply: () => void
  onClear: () => void
}

const TYPES = ['All', 'Wire', 'ACH', 'Card', 'Internal', 'International', 'Deposit', 'Withdrawal']
const STATUSES = ['All', 'Completed', 'Pending', 'Failed', 'Reversed', 'Processing']
const CHANNELS = ['All', 'Online', 'Mobile', 'Branch', 'ATM', 'API']
const CURRENCIES = ['All', 'USD', 'EUR', 'GBP', 'JPY', 'CHF']

export function TransactionFilters({ values, onChange, onApply, onClear }: TransactionFiltersProps) {
  function set<K extends keyof TransactionFilterValues>(key: K, value: TransactionFilterValues[K]) {
    onChange({ ...values, [key]: value })
  }

  const hasActive =
    values.search !== '' ||
    values.type !== 'All' ||
    values.status !== 'All' ||
    values.channel !== 'All' ||
    values.currency !== 'All' ||
    values.dateFrom !== '' ||
    values.dateTo !== ''

  return (
    <div
      className="p-4 rounded-lg border"
      style={{
        backgroundColor: 'var(--color-midnight-slate)',
        borderColor: 'rgba(112,112,125,0.15)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Filter className="h-4 w-4" style={{ color: 'var(--color-mercury-blue)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--color-starlight)' }}>
          Advanced Filters
        </span>
        {hasActive && (
          <span
            className="ml-auto text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: 'rgba(82,102,235,0.15)',
              color: 'var(--color-mercury-blue)',
            }}
          >
            Active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative sm:col-span-2 xl:col-span-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: 'var(--color-lead)' }}
          />
          <Input
            placeholder="Search ID, counterparty..."
            value={values.search}
            onChange={(e) => set('search', e.target.value)}
            className="pl-9"
            style={{
              backgroundColor: 'var(--color-graphite)',
              borderColor: 'rgba(112,112,125,0.3)',
              color: 'var(--color-starlight)',
            }}
          />
        </div>

        {/* Type */}
        <Select value={values.type} onValueChange={(v) => set('type', v)}>
          <SelectTrigger
            style={{
              backgroundColor: 'var(--color-graphite)',
              borderColor: 'rgba(112,112,125,0.3)',
              color: 'var(--color-starlight)',
            }}
          >
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select value={values.status} onValueChange={(v) => set('status', v)}>
          <SelectTrigger
            style={{
              backgroundColor: 'var(--color-graphite)',
              borderColor: 'rgba(112,112,125,0.3)',
              color: 'var(--color-starlight)',
            }}
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Channel */}
        <Select value={values.channel} onValueChange={(v) => set('channel', v)}>
          <SelectTrigger
            style={{
              backgroundColor: 'var(--color-graphite)',
              borderColor: 'rgba(112,112,125,0.3)',
              color: 'var(--color-starlight)',
            }}
          >
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            {CHANNELS.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Currency */}
        <Select value={values.currency} onValueChange={(v) => set('currency', v)}>
          <SelectTrigger
            style={{
              backgroundColor: 'var(--color-graphite)',
              borderColor: 'rgba(112,112,125,0.3)',
              color: 'var(--color-starlight)',
            }}
          >
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date From */}
        <Input
          type="date"
          value={values.dateFrom}
          onChange={(e) => set('dateFrom', e.target.value)}
          placeholder="From date"
          style={{
            backgroundColor: 'var(--color-graphite)',
            borderColor: 'rgba(112,112,125,0.3)',
            color: 'var(--color-starlight)',
          }}
        />

        {/* Date To */}
        <Input
          type="date"
          value={values.dateTo}
          onChange={(e) => set('dateTo', e.target.value)}
          placeholder="To date"
          style={{
            backgroundColor: 'var(--color-graphite)',
            borderColor: 'rgba(112,112,125,0.3)',
            color: 'var(--color-starlight)',
          }}
        />
      </div>

      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={onApply}
          className="pill-btn text-sm"
          style={{
            backgroundColor: 'var(--color-mercury-blue)',
            color: '#fff',
            padding: '8px 20px',
            borderRadius: 32,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Apply Filters
        </button>
        {hasActive && (
          <button
            onClick={onClear}
            className="ghost-btn flex items-center gap-1.5 text-sm"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
