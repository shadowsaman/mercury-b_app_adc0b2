import React from 'react'
import { X, CreditCard, DollarSign, Calendar, Wifi, Shield, Activity } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Card, Customer } from '@/types'

interface CardDetailPanelProps {
  card: Card | null
  customers: Customer[]
  onClose: () => void
  onEdit: (card: Card) => void
  onBlock: (card: Card) => void
}

function getStatusBadgeVariant(status: string | undefined) {
  switch (status?.toLowerCase()) {
    case 'active': return 'success'
    case 'blocked': return 'destructive'
    case 'expired': return 'secondary'
    case 'cancelled': return 'destructive'
    case 'pending activation': return 'warning'
    default: return 'outline'
  }
}

function getCardGradient(card: Card) {
  const type = (card.card_type ?? '').toLowerCase()
  const brand = (card.card_brand ?? '').toLowerCase()
  if (type.includes('platinum') || brand.includes('amex')) {
    return 'linear-gradient(135deg, #1a1a2e, #0f3460)'
  }
  if (type.includes('corporate') || brand.includes('mastercard')) {
    return 'linear-gradient(135deg, #0d0d1a, #2d1b69)'
  }
  return 'linear-gradient(135deg, #171721, #272755)'
}

export function CardDetailPanel({ card, customers, onClose, onEdit, onBlock }: CardDetailPanelProps) {
  if (!card) return null

  const customer = customers.find((c) => c.guid === card.customers_id)

  const utilizationPct =
    card.credit_limit && card.credit_limit > 0
      ? Math.min(100, Math.round(((card.current_balance ?? 0) / card.credit_limit) * 100))
      : 0

  return (
    <div
      className="flex flex-col gap-0"
      style={{
        backgroundColor: 'var(--color-midnight-slate)',
        border: '1px solid rgba(112,112,125,0.15)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(112,112,125,0.15)' }}
      >
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" style={{ color: 'var(--color-mercury-blue)' }} />
          <h3 className="text-base font-medium" style={{ color: 'var(--color-starlight)' }}>
            Card Details
          </h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" style={{ color: 'var(--color-silver)' }} />
        </Button>
      </div>

      <div className="p-6 flex flex-col gap-6">
        {/* Card visual mini */}
        <div
          className="relative flex flex-col justify-between p-5 overflow-hidden"
          style={{
            background: getCardGradient(card),
            border: '1px solid rgba(82,102,235,0.25)',
            borderRadius: '10px',
            minHeight: '160px',
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: '#5266eb' }}
            >
              {card.card_brand ?? 'VISA'}
            </span>
            {card.contactless_enabled && (
              <Wifi className="h-4 w-4" style={{ color: '#5266eb', opacity: 0.8 }} />
            )}
          </div>
          <p
            className="font-mono text-base tracking-[0.2em]"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            {card.card_number_masked ?? '**** **** **** ****'}
          </p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Cardholder</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {customer?.full_name ?? '—'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Expires</p>
              <p className="text-sm font-mono" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {card.expiry_date ?? '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Status + Type */}
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant={getStatusBadgeVariant(card.status)}>
            {card.status ?? '—'}
          </Badge>
          <Badge variant="info">{card.card_type ?? '—'}</Badge>
          {card.contactless_enabled && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              Contactless
            </Badge>
          )}
        </div>

        <Separator style={{ backgroundColor: 'rgba(112,112,125,0.15)' }} />

        {/* Balance & Limits */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-lead)' }}>Credit Limit</span>
            <span className="text-base font-medium" style={{ color: 'var(--color-starlight)' }}>
              {card.credit_limit != null ? formatCurrency(card.credit_limit, 'USD') : '—'}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-lead)' }}>Current Balance</span>
            <span className="text-base font-medium" style={{ color: 'var(--color-starlight)' }}>
              {card.current_balance != null ? formatCurrency(card.current_balance, 'USD') : '—'}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-lead)' }}>Available Credit</span>
            <span className="text-base font-medium" style={{ color: '#22c55e' }}>
              {card.available_credit != null ? formatCurrency(card.available_credit, 'USD') : '—'}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-lead)' }}>Daily Limit</span>
            <span className="text-base font-medium" style={{ color: 'var(--color-starlight)' }}>
              {card.daily_limit != null ? formatCurrency(card.daily_limit, 'USD') : '—'}
            </span>
          </div>
        </div>

        {/* Utilization bar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--color-silver)' }}>Credit Utilization</span>
            <span
              className="text-xs font-semibold"
              style={{ color: utilizationPct > 80 ? '#ef4444' : utilizationPct > 50 ? '#f59e0b' : '#22c55e' }}
            >
              {utilizationPct}%
            </span>
          </div>
          <div
            className="h-2 w-full rounded-full"
            style={{ backgroundColor: 'var(--color-graphite)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${utilizationPct}%`,
                backgroundColor:
                  utilizationPct > 80 ? '#ef4444' :
                  utilizationPct > 50 ? '#f59e0b' : '#5266eb',
              }}
            />
          </div>
        </div>

        <Separator style={{ backgroundColor: 'rgba(112,112,125,0.15)' }} />

        {/* Card Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs" style={{ color: 'var(--color-lead)' }}>Issued Date</span>
            <span className="text-sm" style={{ color: 'var(--color-silver)' }}>
              {formatDate(card.issued_date ?? '')}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs" style={{ color: 'var(--color-lead)' }}>Customer</span>
            <span className="text-sm" style={{ color: 'var(--color-silver)' }}>
              {customer?.full_name ?? '—'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            className="flex-1"
            onClick={() => onEdit(card)}
            style={{
              backgroundColor: 'var(--color-mercury-blue)',
              color: 'white',
              borderRadius: '32px',
            }}
          >
            <Shield className="h-4 w-4 mr-2" />
            Set Limits
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onBlock(card)}
            style={{ borderRadius: '32px', borderColor: '#ef444460', color: '#ef4444' }}
          >
            Block Card
          </Button>
        </div>
      </div>
    </div>
  )
}
