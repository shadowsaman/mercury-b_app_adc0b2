import React, { useState } from 'react'
import type { Account, Transaction, Card, Deposit, Customer } from '@/types'
import { useApiQuery } from '@/hooks/useApi'
import { extractList } from '@/lib/apiUtils'
import { formatDate, formatCurrency, truncate } from '@/lib/utils'
import { AccountTypeBadge } from './AccountTypeBadge'
import { BalanceTrendChart } from './BalanceTrendChart'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Copy, X, CreditCard, Building2, ArrowUpDown } from 'lucide-react'
import { toast } from 'sonner'

interface AccountDetailViewProps {
  account: Account
  customers: Customer[]
  onClose: () => void
  onEdit: () => void
}

function StatusDot({ status }: { status: string | undefined }) {
  const s = (status ?? '').toLowerCase()
  const active = s === 'active'
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={active ? 'status-pulse' : ''}
        style={{
          display: 'inline-block',
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: active ? '#22c55e' : s === 'frozen' ? '#ef4444' : 'var(--color-lead)',
        }}
      />
      <span style={{ color: active ? '#22c55e' : s === 'frozen' ? '#ef4444' : 'var(--color-silver)' }}>
        {status ?? '—'}
      </span>
    </span>
  )
}

export function AccountDetailView({ account, customers, onClose, onEdit }: AccountDetailViewProps) {
  const [period, setPeriod] = useState<30 | 60 | 90>(30)

  const { data: txData, isLoading: txLoading } = useApiQuery<unknown>(
    ['transactions', 'account', account.guid],
    '/v2/items/transactions'
  )
  const transactions = extractList<Transaction>(txData).filter(
    (t) => t.accounts_id === account.guid
  )

  const { data: cardsData, isLoading: cardsLoading } = useApiQuery<unknown>(
    ['cards', 'account', account.guid],
    '/v2/items/cards'
  )
  const cards = extractList<Card>(cardsData).filter(
    (c) => c.accounts_id === account.guid
  )

  const { data: depositsData, isLoading: depositsLoading } = useApiQuery<unknown>(
    ['deposits', 'account', account.guid],
    '/v2/items/deposits'
  )
  const deposits = extractList<Deposit>(depositsData).filter(
    (d) => d.accounts_id === account.guid
  )

  const customer = customers.find((c) => c.guid === account.customers_id)

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => toast.success(label + ' copied'))
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: 'var(--color-midnight-slate)' }}
    >
      {/* Header */}
      <div
        className="flex items-start justify-between p-6"
        style={{ borderBottom: '1px solid rgba(112,112,125,0.15)' }}
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-lg font-medium"
              style={{ color: 'var(--color-starlight)' }}
            >
              {account.account_number ?? '—'}
            </span>
            <AccountTypeBadge type={account.account_type} />
          </div>
          <StatusDot status={account.status} />
          {customer && (
            <span className="text-sm" style={{ color: 'var(--color-silver)' }}>
              {customer.full_name ?? '—'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={onEdit}>
            Edit
          </Button>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key stats */}
      <div
        className="grid grid-cols-3 divide-x"
        style={{ borderBottom: '1px solid rgba(112,112,125,0.15)', divideColor: 'rgba(112,112,125,0.15)' }}
      >
        {[
          { label: 'Balance', value: formatCurrency(account.balance ?? 0, account.currency ?? 'USD') },
          { label: 'Available', value: formatCurrency(account.available_balance ?? 0, account.currency ?? 'USD') },
          { label: 'Interest Rate', value: (account.interest_rate ?? 0).toFixed(2) + '%' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 flex flex-col gap-1">
            <span className="text-xs" style={{ color: 'var(--color-lead)' }}>{stat.label}</span>
            <span className="text-base font-medium" style={{ color: 'var(--color-starlight)' }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="p-6 flex flex-col gap-3" style={{ borderBottom: '1px solid rgba(112,112,125,0.15)' }}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <span style={{ color: 'var(--color-lead)' }}>Currency</span>
            <p style={{ color: 'var(--color-starlight)' }}>{account.currency ?? '—'}</p>
          </div>
          <div>
            <span style={{ color: 'var(--color-lead)' }}>Branch</span>
            <p style={{ color: 'var(--color-starlight)' }}>{account.branch ?? '—'}</p>
          </div>
          <div>
            <span style={{ color: 'var(--color-lead)' }}>Opened Date</span>
            <p style={{ color: 'var(--color-starlight)' }}>{formatDate(account.opened_date)}</p>
          </div>
          <div>
            <span style={{ color: 'var(--color-lead)' }}>IBAN</span>
            <div className="flex items-center gap-1">
              <p className="font-mono text-xs truncate" style={{ color: 'var(--color-starlight)' }}>
                {truncate(account.iban, 22) || '—'}
              </p>
              {account.iban && (
                <button
                  onClick={() => copyToClipboard(account.iban!, 'IBAN')}
                  className="flex-shrink-0"
                  style={{ color: 'var(--color-mercury-blue)' }}
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="px-6 pt-4">
        <div className="flex items-center gap-2 mb-3">
          {([30, 60, 90] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-3 py-1 text-xs rounded-full transition-all"
              style={{
                backgroundColor: period === p ? 'var(--color-mercury-blue)' : 'rgba(112,112,125,0.15)',
                color: period === p ? '#fff' : 'var(--color-silver)',
              }}
            >
              {p}d
            </button>
          ))}
        </div>
        <BalanceTrendChart account={account} period={period} />
      </div>

      {/* Sub-tables */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 mt-4">
        <Tabs defaultValue="transactions">
          <TabsList
            style={{ backgroundColor: 'var(--color-graphite)' }}
            className="mb-4"
          >
            <TabsTrigger value="transactions">
              <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
              Transactions ({transactions.length})
            </TabsTrigger>
            <TabsTrigger value="cards">
              <CreditCard className="h-3.5 w-3.5 mr-1.5" />
              Cards ({cards.length})
            </TabsTrigger>
            <TabsTrigger value="deposits">
              <Building2 className="h-3.5 w-3.5 mr-1.5" />
              Deposits ({deposits.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            {txLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <div style={{ border: '1px solid rgba(112,112,125,0.15)' }}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6" style={{ color: 'var(--color-lead)' }}>
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.slice(0, 10).map((t) => (
                        <TableRow key={t.guid}>
                          <TableCell className="font-mono text-xs">{truncate(t.transaction_id, 12) || '—'}</TableCell>
                          <TableCell>{t.type ?? '—'}</TableCell>
                          <TableCell style={{ color: 'var(--color-starlight)' }}>
                            {formatCurrency(t.amount ?? 0, t.currency ?? 'USD')}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                t.status === 'Completed' ? 'success'
                                : t.status === 'Failed' ? 'destructive'
                                : 'warning'
                              }
                            >
                              {t.status ?? '—'}
                            </Badge>
                          </TableCell>
                          <TableCell style={{ color: 'var(--color-silver)' }}>
                            {formatDate(t.transaction_date)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cards">
            {cardsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <div style={{ border: '1px solid rgba(112,112,125,0.15)' }}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Card Number</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expiry</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cards.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6" style={{ color: 'var(--color-lead)' }}>
                          No cards linked
                        </TableCell>
                      </TableRow>
                    ) : (
                      cards.map((c) => (
                        <TableRow key={c.guid}>
                          <TableCell className="font-mono text-xs">{c.card_number_masked ?? '—'}</TableCell>
                          <TableCell>{c.card_type ?? '—'}</TableCell>
                          <TableCell>{c.card_brand ?? '—'}</TableCell>
                          <TableCell>
                            <Badge variant={c.status === 'Active' ? 'success' : 'secondary'}>
                              {c.status ?? '—'}
                            </Badge>
                          </TableCell>
                          <TableCell style={{ color: 'var(--color-silver)' }}>
                            {formatDate(c.expiry_date)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="deposits">
            {depositsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <div style={{ border: '1px solid rgba(112,112,125,0.15)' }}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deposit ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Maturity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deposits.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6" style={{ color: 'var(--color-lead)' }}>
                          No deposits linked
                        </TableCell>
                      </TableRow>
                    ) : (
                      deposits.map((d) => (
                        <TableRow key={d.guid}>
                          <TableCell className="font-mono text-xs">{truncate(d.deposit_id, 12) || '—'}</TableCell>
                          <TableCell>{d.deposit_type ?? '—'}</TableCell>
                          <TableCell style={{ color: 'var(--color-starlight)' }}>
                            {formatCurrency(d.principal_amount ?? 0, 'USD')}
                          </TableCell>
                          <TableCell>
                            <Badge variant={d.status === 'Active' ? 'success' : 'secondary'}>
                              {d.status ?? '—'}
                            </Badge>
                          </TableCell>
                          <TableCell style={{ color: 'var(--color-silver)' }}>
                            {formatDate(d.maturity_date)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
