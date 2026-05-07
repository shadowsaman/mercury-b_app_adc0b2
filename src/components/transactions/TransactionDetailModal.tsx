import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TransactionStatusBadge } from './TransactionStatusBadge'
import { TransactionStatusTimeline } from './TransactionStatusTimeline'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  RotateCcw,
  Flag,
  Download,
  Hash,
  CreditCard,
  Calendar,
  DollarSign,
  Globe,
  Layers,
} from 'lucide-react'
import { formatDate, formatCurrency, truncate } from '@/lib/utils'
import type { Transaction, Account } from '@/types'

interface TransactionDetailModalProps {
  open: boolean
  onClose: () => void
  transaction: Transaction | null
  accounts?: Account[]
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div
        className="flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0 mt-0.5"
        style={{ backgroundColor: 'rgba(82,102,235,0.1)' }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs mb-0.5" style={{ color: 'var(--color-silver)' }}>
          {label}
        </p>
        <p className="text-sm font-medium" style={{ color: 'var(--color-starlight)' }}>
          {value}
        </p>
      </div>
    </div>
  )
}

export function TransactionDetailModal({
  open,
  onClose,
  transaction,
  accounts = [],
}: TransactionDetailModalProps) {
  if (!transaction) return null

  const linkedAccount = accounts.find((a) => a.guid === transaction.accounts_id)

  const isCredit =
    (transaction.type ?? '').toLowerCase() === 'deposit' ||
    (transaction.type ?? '').toLowerCase() === 'internal'

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent
        className="max-w-2xl w-full overflow-y-auto"
        style={{
          backgroundColor: 'var(--color-midnight-slate)',
          border: '1px solid rgba(112,112,125,0.15)',
          maxHeight: '90vh',
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="flex items-center gap-3"
            style={{ color: 'var(--color-starlight)' }}
          >
            <span className="mono text-base">
              {truncate(transaction.transaction_id, 20) || 'Transaction Detail'}
            </span>
            <TransactionStatusBadge status={transaction.status} />
          </DialogTitle>
        </DialogHeader>

        {/* Amount Hero */}
        <div
          className="rounded-lg p-5 text-center"
          style={{ backgroundColor: 'var(--color-graphite)' }}
        >
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--color-silver)' }}>
            Transaction Amount
          </p>
          <p
            className="text-4xl font-light"
            style={{ color: isCredit ? '#22c55e' : 'var(--color-starlight)' }}
          >
            {isCredit ? '+' : '-'}{formatCurrency(transaction.amount ?? 0, transaction.currency ?? 'USD')}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-silver)' }}>
            {transaction.type ?? '—'} · {transaction.channel ?? '—'}
          </p>
        </div>

        {/* Source → Destination */}
        <div className="flex items-center gap-3">
          <div
            className="flex-1 rounded-lg p-4 text-center"
            style={{
              backgroundColor: 'var(--color-graphite)',
              border: '1px solid rgba(82,102,235,0.2)',
            }}
          >
            <p className="text-xs mb-1" style={{ color: 'var(--color-silver)' }}>From Account</p>
            <p className="text-sm font-medium mono" style={{ color: 'var(--color-starlight)' }}>
              {linkedAccount?.account_number ?? transaction.accounts_id ?? '—'}
            </p>
            {linkedAccount && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-lead)' }}>
                {linkedAccount.account_type ?? ''}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full"
              style={{ backgroundColor: 'rgba(82,102,235,0.15)', border: '1px solid rgba(82,102,235,0.3)' }}
            >
              <ArrowRight className="h-4 w-4" style={{ color: 'var(--color-mercury-blue)' }} />
            </div>
          </div>

          <div
            className="flex-1 rounded-lg p-4 text-center"
            style={{
              backgroundColor: 'var(--color-graphite)',
              border: '1px solid rgba(82,102,235,0.2)',
            }}
          >
            <p className="text-xs mb-1" style={{ color: 'var(--color-silver)' }}>To / Counterparty</p>
            <p className="text-sm font-medium" style={{ color: 'var(--color-starlight)' }}>
              {transaction.counterparty ?? '—'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-lead)' }}>
              {transaction.currency ?? ''}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Transaction Details */}
          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: 'var(--color-graphite)',
              border: '1px solid rgba(112,112,125,0.12)',
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--color-silver)' }}
            >
              Transaction Details
            </p>

            <DetailRow
              icon={<Hash className="h-3.5 w-3.5" style={{ color: 'var(--color-mercury-blue)' }} />}
              label="Reference Number"
              value={<span className="mono text-xs">{transaction.reference_number ?? '—'}</span>}
            />
            <DetailRow
              icon={<Layers className="h-3.5 w-3.5" style={{ color: 'var(--color-mercury-blue)' }} />}
              label="Description"
              value={transaction.description ?? '—'}
            />
            <DetailRow
              icon={<Globe className="h-3.5 w-3.5" style={{ color: 'var(--color-mercury-blue)' }} />}
              label="Channel"
              value={transaction.channel ?? '—'}
            />
            <DetailRow
              icon={<Calendar className="h-3.5 w-3.5" style={{ color: 'var(--color-mercury-blue)' }} />}
              label="Transaction Date"
              value={formatDate(transaction.transaction_date)}
            />
          </div>

          {/* Fee Breakdown */}
          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: 'var(--color-graphite)',
              border: '1px solid rgba(112,112,125,0.12)',
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--color-silver)' }}
            >
              Fee Breakdown
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--color-silver)' }}>Principal Amount</span>
                <span style={{ color: 'var(--color-starlight)' }}>
                  {formatCurrency(transaction.amount ?? 0, transaction.currency ?? 'USD')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--color-silver)' }}>Transaction Fee</span>
                <span style={{ color: '#f59e0b' }}>
                  {formatCurrency(transaction.fee ?? 0, transaction.currency ?? 'USD')}
                </span>
              </div>
              <Separator className="my-2" style={{ backgroundColor: 'rgba(112,112,125,0.2)' }} />
              <div className="flex justify-between text-sm font-semibold">
                <span style={{ color: 'var(--color-starlight)' }}>Total</span>
                <span style={{ color: 'var(--color-starlight)' }}>
                  {formatCurrency(
                    (transaction.amount ?? 0) + (transaction.fee ?? 0),
                    transaction.currency ?? 'USD'
                  )}
                </span>
              </div>
            </div>

            <Separator className="my-4" style={{ backgroundColor: 'rgba(112,112,125,0.2)' }} />

            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--color-silver)' }}
            >
              Status Timeline
            </p>
            <TransactionStatusTimeline transaction={transaction} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            style={{
              backgroundColor: 'rgba(239,68,68,0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.2)',
              cursor: 'pointer',
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Reverse
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            style={{
              backgroundColor: 'rgba(245,158,11,0.1)',
              color: '#f59e0b',
              border: '1px solid rgba(245,158,11,0.2)',
              cursor: 'pointer',
            }}
          >
            <Flag className="h-4 w-4" />
            Flag for Review
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm ml-auto"
            style={{
              backgroundColor: 'rgba(82,102,235,0.1)',
              color: 'var(--color-mercury-blue)',
              border: '1px solid rgba(82,102,235,0.2)',
              cursor: 'pointer',
            }}
          >
            <Download className="h-4 w-4" />
            Print Receipt
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
