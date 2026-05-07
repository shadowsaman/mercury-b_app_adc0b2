import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Edit, ShieldCheck, Lock, FileText } from 'lucide-react'
import { getInitials, formatDate } from '@/lib/utils'
import type { Customer } from '@/types'
import { CustomerStatusBadge } from './CustomerStatusBadge'
import { CustomerDetailTabs } from './CustomerDetailTabs'

const thumbPool = [
  'https://images.unsplash.com/photo-1710981855156-1dd4b48e668d?ixid=M3w5Mzk5NTF8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBiYW5rJTIwdmF1bHR8ZW58MXwwfHx8MTc3ODE0Nzk4OXww&ixlib=rb-4.1.0&w=400&h=300&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1756936724444-ecf9f7236c10?ixid=M3w5Mzk5NTF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmaW5hbmNpYWwlMjBkaXN0cmljdCUyMHNreWxpbmV8ZW58MXwwfHx8MTc3ODEzMTc5MHww&ixlib=rb-4.1.0&w=400&h=300&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1640545232493-9a9b5c88ede4?ixid=M3w5Mzk5NTF8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY3JlZGl0JTIwY2FyZCUyMGNsb3NldXB8ZW58MXwwfHx8MTc3ODE0Nzk5MHww&ixlib=rb-4.1.0&w=400&h=300&fit=crop&auto=format&q=80',
]

interface CustomerDetailDrawerProps {
  customer: Customer | null
  open: boolean
  onClose: () => void
  onEdit: (customer: Customer) => void
}

export function CustomerDetailDrawer({ customer, open, onClose, onEdit }: CustomerDetailDrawerProps) {
  if (!customer) return null

  const photoSrc = customer.photo ?? thumbPool[0]

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <SheetContent
        side="right"
        className="w-[480px] max-w-full p-0 flex flex-col overflow-hidden"
        style={{
          backgroundColor: 'var(--color-midnight-slate)',
          borderLeft: '1px solid rgba(112,112,125,0.2)',
        }}
      >
        {/* Header banner */}
        <div
          className="relative h-24 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, rgba(82,102,235,0.3), rgba(82,102,235,0.05))' }}
        >
          <div className="absolute inset-0 opacity-20">
            <img
              src={photoSrc}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          {/* Top bar with close is handled by SheetContent's built-in X button */}
        </div>

        {/* Customer identity */}
        <div className="px-6 pb-4 flex-shrink-0" style={{ marginTop: '-28px' }}>
          <div className="flex items-end justify-between">
            <Avatar className="w-14 h-14 border-2" style={{ borderColor: 'var(--color-midnight-slate)' }}>
              <AvatarImage
                src={photoSrc}
                alt={customer.full_name ?? ''}
                loading="lazy"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none' }}
              />
              <AvatarFallback
                className="text-base font-semibold"
                style={{ backgroundColor: 'var(--color-mercury-blue)', color: 'white' }}
              >
                {getInitials(customer.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 mb-1">
              <CustomerStatusBadge status={customer.customer_type} variant="type" />
              <CustomerStatusBadge status={customer.status} />
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-xl font-light" style={{ color: 'var(--color-starlight)' }}>
              {customer.full_name ?? '—'}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-silver)' }}>
              {customer.email ?? '—'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-lead)' }}>
              Onboarded {formatDate(customer.onboarding_date ?? '')}
            </p>
          </div>
        </div>

        <Separator style={{ backgroundColor: 'rgba(112,112,125,0.15)' }} />

        {/* Action buttons */}
        <div className="flex items-center gap-2 px-6 py-3 flex-shrink-0">
          <Button
            size="sm"
            onClick={() => onEdit(customer)}
            className="gap-1.5 text-xs"
            style={{ backgroundColor: 'var(--color-mercury-blue)', color: 'white', borderRadius: '32px' }}
          >
            <Edit className="h-3.5 w-3.5" />
            Edit Profile
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs ghost-btn border-0"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            KYC Review
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs ghost-btn border-0"
          >
            <Lock className="h-3.5 w-3.5" />
            Freeze
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs ghost-btn border-0"
          >
            <FileText className="h-3.5 w-3.5" />
            Docs
          </Button>
        </div>

        <Separator style={{ backgroundColor: 'rgba(112,112,125,0.15)' }} />

        {/* Tabs */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <CustomerDetailTabs customer={customer} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
