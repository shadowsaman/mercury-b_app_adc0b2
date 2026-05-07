import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface CustomerStatusBadgeProps {
  status?: string | null
  variant?: 'status' | 'kyc' | 'aml' | 'type'
}

export function CustomerStatusBadge({ status, variant = 'status' }: CustomerStatusBadgeProps) {
  const val = (status ?? '').toLowerCase()

  if (variant === 'kyc') {
    const kycMap: Record<string, { label: string; className: string }> = {
      verified: { label: 'Verified', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
      pending: { label: 'Pending', className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
      failed: { label: 'Failed', className: 'bg-red-500/15 text-red-400 border-red-500/20' },
      'under review': { label: 'Under Review', className: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
      'not started': { label: 'Not Started', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' },
    }
    const config = kycMap[val] ?? { label: status ?? '—', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' }
    return (
      <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold', config.className)}>
        {config.label}
      </span>
    )
  }

  if (variant === 'aml') {
    const amlMap: Record<string, { label: string; className: string }> = {
      low: { label: 'Low', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
      medium: { label: 'Medium', className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
      high: { label: 'High', className: 'bg-red-500/15 text-red-400 border-red-500/20' },
      critical: { label: 'Critical', className: 'bg-red-700/20 text-red-300 border-red-700/30' },
    }
    const config = amlMap[val] ?? { label: status ?? '—', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' }
    return (
      <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold', config.className)}>
        {config.label}
      </span>
    )
  }

  if (variant === 'type') {
    const typeMap: Record<string, { label: string; className: string }> = {
      individual: { label: 'Individual', className: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
      corporate: { label: 'Corporate', className: 'bg-purple-500/15 text-purple-400 border-purple-500/20' },
      sme: { label: 'SME', className: 'bg-teal-500/15 text-teal-400 border-teal-500/20' },
      vip: { label: 'VIP', className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' },
    }
    const config = typeMap[val] ?? { label: status ?? '—', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' }
    return (
      <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold', config.className)}>
        {config.label}
      </span>
    )
  }

  // default: status
  const statusMap: Record<string, { label: string; className: string; dot: string }> = {
    active: { label: 'Active', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
    suspended: { label: 'Suspended', className: 'bg-red-500/15 text-red-400 border-red-500/20', dot: 'bg-red-400' },
    'under review': { label: 'Under Review', className: 'bg-amber-500/15 text-amber-400 border-amber-500/20', dot: 'bg-amber-400' },
    inactive: { label: 'Inactive', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20', dot: 'bg-zinc-400' },
  }
  const config = statusMap[val] ?? { label: status ?? '—', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20', dot: 'bg-zinc-400' }
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold', config.className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full status-pulse', config.dot)} />
      {config.label}
    </span>
  )
}
