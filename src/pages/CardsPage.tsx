import React, { useState } from 'react'
import { Plus, Pencil, Trash2, Eye, Wifi } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { CardVisualPreview } from '@/components/cards/CardVisualPreview'
import { CardDetailPanel } from '@/components/cards/CardDetailPanel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FormModal } from '@/components/shared/FormModal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useCards, useCreateCard, useUpdateCard, useDeleteCard } from '@/hooks/useCards'
import { useApiQuery } from '@/hooks/useApi'
import { extractList } from '@/lib/apiUtils'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import type { Card, Customer, Account } from '@/types'
import type { Column } from '@/components/shared/DataTable'

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

function isExpiryNear(expiry: string | undefined) {
  if (!expiry) return false
  const now = new Date()
  const threeMonths = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate())
  const exp = new Date(expiry)
  return !isNaN(exp.getTime()) && exp >= now && exp <= threeMonths
}

interface CardFormState {
  card_number_masked: string
  card_type: string
  card_brand: string
  credit_limit: string
  current_balance: string
  available_credit: string
  expiry_date: string
  status: string
  daily_limit: string
  contactless_enabled: boolean
  customers_id: string
  accounts_id: string
}

const defaultFormState: CardFormState = {
  card_number_masked: '',
  card_type: '',
  card_brand: '',
  credit_limit: '',
  current_balance: '',
  available_credit: '',
  expiry_date: '',
  status: '',
  daily_limit: '',
  contactless_enabled: false,
  customers_id: '',
  accounts_id: '',
}

export function CardsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editCard, setEditCard] = useState<Card | null>(null)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [formState, setFormState] = useState<CardFormState>(defaultFormState)

  const { data: cardsData, isLoading } = useCards()
  const cards = extractList<Card>(cardsData)

  const { data: customersData } = useApiQuery<unknown>(['customers'], '/v2/items/customers')
  const customers = extractList<Customer>(customersData)

  const { data: accountsData } = useApiQuery<unknown>(['accounts'], '/v2/items/accounts')
  const accounts = extractList<Account>(accountsData)

  const createMutation = useCreateCard()
  const updateMutation = useUpdateCard()
  const deleteMutation = useDeleteCard()

  function getCustomerName(customersId: string | undefined) {
    if (!customersId) return '—'
    return customers.find((c) => c.guid === customersId)?.full_name ?? '—'
  }

  function handleOpenCreate() {
    setEditCard(null)
    setFormState(defaultFormState)
    setModalOpen(true)
  }

  function handleOpenEdit(card: Card) {
    setEditCard(card)
    setFormState({
      card_number_masked: card.card_number_masked ?? '',
      card_type: card.card_type ?? '',
      card_brand: card.card_brand ?? '',
      credit_limit: String(card.credit_limit ?? ''),
      current_balance: String(card.current_balance ?? ''),
      available_credit: String(card.available_credit ?? ''),
      expiry_date: card.expiry_date ?? '',
      status: card.status ?? '',
      daily_limit: String(card.daily_limit ?? ''),
      contactless_enabled: card.contactless_enabled ?? false,
      customers_id: card.customers_id ?? '',
      accounts_id: card.accounts_id ?? '',
    })
    setModalOpen(true)
  }

  function handleDelete(card: Card) {
    if (window.confirm('Delete this card?')) {
      deleteMutation.mutate(card.guid)
      if (selectedCard?.guid === card.guid) setSelectedCard(null)
    }
  }

  function updateField<K extends keyof CardFormState>(key: K, value: CardFormState[K]) {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit() {
    const payload: Partial<Card> = {
      card_number_masked: formState.card_number_masked || undefined,
      card_type: formState.card_type || undefined,
      card_brand: formState.card_brand || undefined,
      credit_limit: formState.credit_limit ? parseFloat(formState.credit_limit) : undefined,
      current_balance: formState.current_balance ? parseFloat(formState.current_balance) : undefined,
      available_credit: formState.available_credit ? parseFloat(formState.available_credit) : undefined,
      expiry_date: formState.expiry_date || undefined,
      status: formState.status || undefined,
      daily_limit: formState.daily_limit ? parseFloat(formState.daily_limit) : undefined,
      contactless_enabled: formState.contactless_enabled,
      ...(formState.customers_id ? { customers_id: formState.customers_id } : {}),
      ...(formState.accounts_id ? { accounts_id: formState.accounts_id } : {}),
    }

    if (editCard) {
      updateMutation.mutate(
        { ...payload, guid: editCard.guid },
        { onSuccess: () => { setModalOpen(false); setEditCard(null) } }
      )
    } else {
      createMutation.mutate(
        payload,
        { onSuccess: () => { setModalOpen(false) } }
      )
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  const columns: Column<Card>[] = [
    {
      key: 'card_number_masked',
      label: 'Card Number',
      render: (row) => (
        <span className="mono" style={{ color: 'var(--color-starlight)' }}>
          {row.card_number_masked ?? '—'}
        </span>
      ),
    },
    {
      key: 'card_type',
      label: 'Type',
      render: (row) => (
        <Badge variant="info" className="text-xs">
          {row.card_type ?? '—'}
        </Badge>
      ),
    },
    {
      key: 'card_brand',
      label: 'Brand',
      render: (row) => (
        <span style={{ color: 'var(--color-silver)' }}>{row.card_brand ?? '—'}</span>
      ),
    },
    {
      key: 'customers_id',
      label: 'Customer',
      render: (row) => (
        <span style={{ color: 'var(--color-starlight)' }}>
          {getCustomerName(row.customers_id)}
        </span>
      ),
    },
    {
      key: 'credit_limit',
      label: 'Credit Limit',
      render: (row) => (
        <span style={{ color: 'var(--color-silver)' }}>
          {row.credit_limit != null ? formatCurrency(row.credit_limit, 'USD') : '—'}
        </span>
      ),
    },
    {
      key: 'current_balance',
      label: 'Balance',
      render: (row) => (
        <span style={{ color: 'var(--color-starlight)' }}>
          {row.current_balance != null ? formatCurrency(row.current_balance, 'USD') : '—'}
        </span>
      ),
    },
    {
      key: 'available_credit',
      label: 'Available',
      render: (row) => (
        <span style={{ color: '#22c55e' }}>
          {row.available_credit != null ? formatCurrency(row.available_credit, 'USD') : '—'}
        </span>
      ),
    },
    {
      key: 'expiry_date',
      label: 'Expiry',
      render: (row) => (
        <span
          style={{
            color: isExpiryNear(row.expiry_date) ? '#f59e0b' : 'var(--color-silver)',
            fontWeight: isExpiryNear(row.expiry_date) ? 600 : 400,
          }}
        >
          {row.expiry_date ?? '—'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={getStatusBadgeVariant(row.status)}>
          {row.status ?? '—'}
        </Badge>
      ),
    },
    {
      key: 'contactless_enabled',
      label: 'Contactless',
      render: (row) => (
        <div className="flex items-center justify-center">
          {row.contactless_enabled ? (
            <Wifi className="h-4 w-4" style={{ color: 'var(--color-mercury-blue)' }} />
          ) : (
            <span style={{ color: 'var(--color-lead)' }}>—</span>
          )}
        </div>
      ),
    },
    {
      key: 'guid',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); setSelectedCard(row) }}
          >
            <Eye className="h-4 w-4" style={{ color: 'var(--color-silver)' }} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); handleOpenEdit(row) }}
          >
            <Pencil className="h-4 w-4" style={{ color: 'var(--color-silver)' }} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); handleDelete(row) }}
          >
            <Trash2 className="h-4 w-4" style={{ color: '#ef4444' }} />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Cards"
        subtitle="Card issuance, management, and monitoring"
        action="Issue Card"
        onAction={handleOpenCreate}
        actionIcon={<Plus className="h-4 w-4" />}
      />

      {/* Card Visual Preview */}
      {isLoading ? (
        <Skeleton className="h-64 skeleton-shimmer" />
      ) : (
        <CardVisualPreview cards={cards} />
      )}

      {/* Main layout: table + detail panel */}
      <div className={cn('grid gap-6', selectedCard ? 'grid-cols-1 xl:grid-cols-3' : 'grid-cols-1')}>
        {/* Table */}
        <div
          className={cn(
            'flex flex-col gap-4',
            selectedCard ? 'xl:col-span-2' : 'col-span-1'
          )}
          style={{
            backgroundColor: 'var(--color-midnight-slate)',
            border: '1px solid rgba(112,112,125,0.15)',
            padding: '24px',
          }}
        >
          <div className="flex items-center justify-between">
            <h2
              className="text-lg font-light"
              style={{ color: 'var(--color-starlight)' }}
            >
              Card Management
            </h2>
            <span
              className="text-sm"
              style={{ color: 'var(--color-silver)' }}
            >
              {cards.length} cards
            </span>
          </div>
          <DataTable<Card>
            columns={columns}
            data={cards}
            isLoading={isLoading}
            emptyMessage="No cards found. Issue your first card."
            onRowClick={(row) => setSelectedCard(row)}
          />
        </div>

        {/* Detail Panel */}
        {selectedCard && (
          <div className="xl:col-span-1">
            <CardDetailPanel
              card={selectedCard}
              customers={customers}
              onClose={() => setSelectedCard(null)}
              onEdit={handleOpenEdit}
              onBlock={(card) => {
                if (window.confirm(`Block card ${card.card_number_masked ?? card.guid}?`)) {
                  updateMutation.mutate(
                    { guid: card.guid, status: 'Blocked' },
                    {
                      onSuccess: () => setSelectedCard(null),
                    }
                  )
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Card Form Modal */}
      <FormModal
        open={modalOpen}
        title={editCard ? 'Edit Card' : 'Issue New Card'}
        onClose={() => { setModalOpen(false); setEditCard(null) }}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        submitLabel={editCard ? 'Update Card' : 'Issue Card'}
      >
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="card_number_masked">Card Number (masked)</Label>
              <Input
                id="card_number_masked"
                placeholder="**** **** **** 1234"
                value={formState.card_number_masked}
                onChange={(e) => updateField('card_number_masked', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="card_brand">Brand</Label>
              <Select value={formState.card_brand} onValueChange={(v) => updateField('card_brand', v)}>
                <SelectTrigger id="card_brand">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Visa">Visa</SelectItem>
                  <SelectItem value="Mastercard">Mastercard</SelectItem>
                  <SelectItem value="Amex">American Express</SelectItem>
                  <SelectItem value="Discover">Discover</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="card_type">Card Type</Label>
              <Select value={formState.card_type} onValueChange={(v) => updateField('card_type', v)}>
                <SelectTrigger id="card_type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Credit">Credit</SelectItem>
                  <SelectItem value="Debit">Debit</SelectItem>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                  <SelectItem value="Platinum">Platinum</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status">Status</Label>
              <Select value={formState.status} onValueChange={(v) => updateField('status', v)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Pending Activation">Pending Activation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="credit_limit">Credit Limit</Label>
              <Input
                id="credit_limit"
                type="number"
                placeholder="5000"
                value={formState.credit_limit}
                onChange={(e) => updateField('credit_limit', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="daily_limit">Daily Limit</Label>
              <Input
                id="daily_limit"
                type="number"
                placeholder="1000"
                value={formState.daily_limit}
                onChange={(e) => updateField('daily_limit', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="current_balance">Current Balance</Label>
              <Input
                id="current_balance"
                type="number"
                placeholder="0"
                value={formState.current_balance}
                onChange={(e) => updateField('current_balance', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="available_credit">Available Credit</Label>
              <Input
                id="available_credit"
                type="number"
                placeholder="0"
                value={formState.available_credit}
                onChange={(e) => updateField('available_credit', e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="expiry_date">Expiry Date</Label>
            <Input
              id="expiry_date"
              placeholder="MM/YY"
              value={formState.expiry_date}
              onChange={(e) => updateField('expiry_date', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="card_customers_id">Customer</Label>
            <Select value={formState.customers_id} onValueChange={(v) => updateField('customers_id', v)}>
              <SelectTrigger id="card_customers_id">
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.guid} value={c.guid || 'fallback'}>
                    {c.full_name ?? c.email ?? '—'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="card_accounts_id">Account</Label>
            <Select value={formState.accounts_id} onValueChange={(v) => updateField('accounts_id', v)}>
              <SelectTrigger id="card_accounts_id">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((a) => (
                  <SelectItem key={a.guid} value={a.guid || 'fallback'}>
                    {a.account_number ?? a.guid}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="contactless_enabled"
              checked={formState.contactless_enabled}
              onCheckedChange={(v) => updateField('contactless_enabled', v)}
            />
            <Label htmlFor="contactless_enabled">Contactless Enabled</Label>
          </div>
        </div>
      </FormModal>
    </div>
  )
}
