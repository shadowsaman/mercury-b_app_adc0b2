import React, { useState } from 'react'
import { Loader2, Calendar, Filter, RefreshCw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { ReportFormatSelector } from './ReportFormatSelector'
import type { ReportFormat } from './ReportFormatSelector'
import { useApiQuery } from '@/hooks/useApi'
import { extractList } from '@/lib/apiUtils'
import type { Customer } from '@/types'
import { cn } from '@/lib/utils'

interface ReportBuilderProps {
  selectedCategory: string
  onGenerate: (params: ReportBuildParams) => void
  isGenerating?: boolean
}

export interface ReportBuildParams {
  category: string
  dateFrom: string
  dateTo: string
  format: ReportFormat
  customerId?: string
  status?: string
}

export function ReportBuilder({ selectedCategory, onGenerate, isGenerating = false }: ReportBuilderProps) {
  const today = new Date().toISOString().slice(0, 10)
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)

  const [dateFrom, setDateFrom] = useState<string>(firstOfMonth)
  const [dateTo, setDateTo] = useState<string>(today)
  const [format, setFormat] = useState<ReportFormat>('PDF')
  const [customerId, setCustomerId] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  const { data: customersData } = useApiQuery<unknown>(['customers-for-report'], '/v2/items/customers')
  const customers = extractList<{ guid: string; full_name?: string }>(customersData)

  function handleGenerate() {
    onGenerate({
      category: selectedCategory,
      dateFrom,
      dateTo,
      format,
      customerId: customerId || undefined,
      status: status || undefined,
    })
  }

  return (
    <div
      className="p-6"
      style={{
        backgroundColor: 'var(--color-midnight-slate)',
        border: '1px solid rgba(112, 112, 125, 0.15)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="flex items-center justify-center w-8 h-8"
          style={{ backgroundColor: 'rgba(82, 102, 235, 0.15)', borderRadius: '6px' }}
        >
          <Filter className="h-4 w-4" style={{ color: 'var(--color-mercury-blue)' }} />
        </div>
        <div>
          <h2 className="text-base font-medium" style={{ color: 'var(--color-starlight)' }}>Report Builder</h2>
          <p className="text-xs" style={{ color: 'var(--color-silver)' }}>Configure your report parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Date From */}
        <div className="flex flex-col gap-2">
          <Label style={{ color: 'var(--color-silver)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Date From
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: 'var(--color-lead)' }} />
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="pl-9"
              style={{
                backgroundColor: 'var(--color-graphite)',
                borderColor: 'rgba(112, 112, 125, 0.3)',
                color: 'var(--color-starlight)',
                borderRadius: '8px',
              }}
            />
          </div>
        </div>

        {/* Date To */}
        <div className="flex flex-col gap-2">
          <Label style={{ color: 'var(--color-silver)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Date To
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: 'var(--color-lead)' }} />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="pl-9"
              style={{
                backgroundColor: 'var(--color-graphite)',
                borderColor: 'rgba(112, 112, 125, 0.3)',
                color: 'var(--color-starlight)',
                borderRadius: '8px',
              }}
            />
          </div>
        </div>

        {/* Customer Filter */}
        <div className="flex flex-col gap-2">
          <Label style={{ color: 'var(--color-silver)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Customer (optional)
          </Label>
          <Select value={customerId} onValueChange={setCustomerId}>
            <SelectTrigger
              style={{
                backgroundColor: 'var(--color-graphite)',
                borderColor: 'rgba(112, 112, 125, 0.3)',
                color: 'var(--color-starlight)',
                borderRadius: '8px',
              }}
            >
              <SelectValue placeholder="All customers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              {customers.map((c) => (
                <SelectItem key={c.guid} value={c.guid || 'fallback'}>
                  {c.full_name ?? '—'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-2">
          <Label style={{ color: 'var(--color-silver)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Status (optional)
          </Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger
              style={{
                backgroundColor: 'var(--color-graphite)',
                borderColor: 'rgba(112, 112, 125, 0.3)',
                color: 'var(--color-starlight)',
                borderRadius: '8px',
              }}
            >
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Format Selector */}
      <div className="mt-5">
        <Label className="block mb-3" style={{ color: 'var(--color-silver)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Export Format
        </Label>
        <ReportFormatSelector value={format} onChange={setFormat} />
      </div>

      {/* Preview Banner */}
      <div
        className="mt-5 p-4 flex items-center gap-3"
        style={{
          backgroundColor: 'rgba(82, 102, 235, 0.06)',
          border: '1px solid rgba(82, 102, 235, 0.2)',
          borderRadius: '4px',
        }}
      >
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: 'var(--color-mercury-blue)' }}
        />
        <p className="text-sm" style={{ color: 'var(--color-silver)' }}>
          Report: <span style={{ color: 'var(--color-starlight)' }}>{selectedCategory || 'Select a category'}</span>
          {dateFrom && dateTo && (
            <span> · {dateFrom} → {dateTo}</span>
          )}
          <span> · Format: <span style={{ color: 'var(--color-starlight)' }}>{format}</span></span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-5">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || !selectedCategory}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium disabled:opacity-50 transition-all duration-150"
          style={{
            borderRadius: '32px',
            backgroundColor: 'var(--color-mercury-blue)',
            color: 'var(--color-pure-white)',
          }}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium transition-all duration-150"
          style={{
            borderRadius: '32px',
            backgroundColor: 'rgba(205, 221, 255, 0.12)',
            color: 'var(--color-starlight)',
          }}
        >
          <Calendar className="h-4 w-4" />
          Schedule Report
        </button>
      </div>
    </div>
  )
}
