import React, { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { FormModal } from '@/components/shared/FormModal'
import { GatewayHealthDashboard } from '@/components/gateways/GatewayHealthDashboard'
import { usePaymentGateways, useCreatePaymentGateway, useUpdatePaymentGateway, useDeletePaymentGateway } from '@/hooks/usePaymentGateways'
import { extractList } from '@/lib/apiUtils'
import { formatCurrency, truncate } from '@/lib/utils'
import type { PaymentGateway } from '@/types'
import type { Column } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Plus, RefreshCw, Settings, Trash2, Zap } from 'lucide-react'
import { toast } from 'sonner'

function getStatusDot(status: string | undefined) {
  switch ((status ?? '').toLowerCase()) {
    case 'online': return <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full status-pulse" style={{ backgroundColor: '#22c55e' }} /><span style={{ color: '#22c55e' }}>Online</span></span>
    case 'degraded': return <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f59e0b' }} /><span style={{ color: '#f59e0b' }}>Degraded</span></span>
    case 'offline': return <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ef4444' }} /><span style={{ color: '#ef4444' }}>Offline</span></span>
    case 'maintenance': return <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#8b5cf6' }} /><span style={{ color: '#8b5cf6' }}>Maintenance</span></span>
    default: return <span style={{ color: 'var(--color-silver)' }}>{status ?? '—'}</span>
  }
}

const EMPTY_FORM: Partial<PaymentGateway> = {
  gateway_name: '',
  provider: '',
  gateway_type: '',
  api_endpoint: '',
  status: 'Online',
  supported_currencies: '',
  transaction_fee_percent: 0,
  daily_volume_limit: 0,
}

export function PaymentGatewaysPage() {
  const { data, isLoading } = usePaymentGateways()
  const gateways = extractList<PaymentGateway>(data)

  const createMutation = useCreatePaymentGateway()
  const updateMutation = useUpdatePaymentGateway()
  const deleteMutation = useDeletePaymentGateway()

  const [modalOpen, setModalOpen] = useState(false)
  const [editGateway, setEditGateway] = useState<PaymentGateway | null>(null)
  const [form, setForm] = useState<Partial<PaymentGateway>>(EMPTY_FORM)

  function openCreate() {
    setEditGateway(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  function openEdit(gateway: PaymentGateway) {
    setEditGateway(gateway)
    setForm({
      gateway_name: gateway.gateway_name ?? '',
      provider: gateway.provider ?? '',
      gateway_type: gateway.gateway_type ?? '',
      api_endpoint: gateway.api_endpoint ?? '',
      status: gateway.status ?? 'Online',
      supported_currencies: gateway.supported_currencies ?? '',
      transaction_fee_percent: gateway.transaction_fee_percent ?? 0,
      daily_volume_limit: gateway.daily_volume_limit ?? 0,
    })
    setModalOpen(true)
  }

  function handleDelete(guid: string) {
    deleteMutation.mutate(guid)
  }

  function handleTest(gateway: PaymentGateway) {
    toast.info(`Testing connection to ${gateway.gateway_name ?? 'gateway'}...`)
  }

  async function handleSubmit() {
    if (!form.gateway_name?.trim()) {
      toast.error('Gateway name is required')
      return
    }
    if (editGateway) {
      updateMutation.mutate({ ...form, guid: editGateway.guid })
    } else {
      createMutation.mutate(form)
    }
    setModalOpen(false)
  }

  const columns: Column<PaymentGateway>[] = [
    {
      key: 'gateway_name',
      label: 'Name',
      render: (row) => (
        <span className="font-medium" style={{ color: 'var(--color-starlight)' }}>
          {row.gateway_name ?? '—'}
        </span>
      ),
    },
    { key: 'provider', label: 'Provider', render: (row) => <span style={{ color: 'var(--color-silver)' }}>{row.provider ?? '—'}</span> },
    { key: 'gateway_type', label: 'Type', render: (row) => <span style={{ color: 'var(--color-silver)' }}>{row.gateway_type ?? '—'}</span> },
    {
      key: 'api_endpoint',
      label: 'API Endpoint',
      render: (row) => (
        <span className="mono" style={{ color: 'var(--color-silver)', fontSize: 12 }}>
          {truncate(row.api_endpoint, 32)}
        </span>
      ),
    },
    { key: 'status', label: 'Status', render: (row) => getStatusDot(row.status) },
    {
      key: 'supported_currencies',
      label: 'Currencies',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {(row.supported_currencies ?? '').split(',').filter(Boolean).slice(0, 3).map((c) => (
            <span
              key={c.trim()}
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(82,102,235,0.15)', color: 'var(--color-mercury-blue)', border: '1px solid rgba(82,102,235,0.2)' }}
            >
              {c.trim()}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'transaction_fee_percent',
      label: 'Fee %',
      render: (row) => <span style={{ color: 'var(--color-silver)' }}>{row.transaction_fee_percent != null ? `${row.transaction_fee_percent}%` : '—'}</span>,
    },
    {
      key: 'daily_volume_limit',
      label: 'Daily Limit',
      render: (row) => <span style={{ color: 'var(--color-silver)' }}>{row.daily_volume_limit != null ? formatCurrency(row.daily_volume_limit, 'USD') : '—'}</span>,
    },
    {
      key: 'uptime_percent',
      label: 'Uptime',
      render: (row) => (
        <span style={{ color: (row.uptime_percent ?? 0) >= 99 ? 'var(--color-mercury-blue)' : '#f59e0b' }}>
          {row.uptime_percent != null ? `${row.uptime_percent}%` : '—'}
        </span>
      ),
    },
    {
      key: 'guid',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); handleTest(row) }}>
            <RefreshCw className="h-3.5 w-3.5" style={{ color: 'var(--color-mercury-blue)' }} />
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); openEdit(row) }}>
            <Settings className="h-3.5 w-3.5" style={{ color: 'var(--color-silver)' }} />
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); handleDelete(row.guid) }}>
            <Trash2 className="h-3.5 w-3.5" style={{ color: '#ef4444' }} />
          </Button>
        </div>
      ),
    },
  ]

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-8">
      <PageHeader
        title="Payment Gateways"
        subtitle="Monitor gateway health and manage payment provider configurations"
        action="Add Gateway"
        onAction={openCreate}
        actionIcon={<Plus className="h-4 w-4" />}
      />

      <Tabs defaultValue="health">
        <TabsList
          className="mb-6"
          style={{ backgroundColor: 'var(--color-graphite)', border: '1px solid rgba(112,112,125,0.2)' }}
        >
          <TabsTrigger value="health">Health Dashboard</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="health">
          <GatewayHealthDashboard
            gateways={gateways}
            isLoading={isLoading}
            onConfigure={openEdit}
            onDelete={handleDelete}
            onTest={handleTest}
          />
        </TabsContent>

        <TabsContent value="table">
          <DataTable<PaymentGateway>
            columns={columns}
            data={gateways}
            isLoading={isLoading}
            emptyMessage="No payment gateways found."
            onRowClick={openEdit}
          />
        </TabsContent>
      </Tabs>

      <FormModal
        open={modalOpen}
        title={editGateway ? 'Configure Gateway' : 'Add Payment Gateway'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel={editGateway ? 'Update' : 'Create'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Gateway Name <span className="text-red-400">*</span></Label>
              <Input
                value={form.gateway_name ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, gateway_name: e.target.value }))}
                placeholder="e.g. Stripe Primary"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Provider</Label>
              <Input
                value={form.provider ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value }))}
                placeholder="e.g. Stripe, PayPal"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Gateway Type</Label>
              <Input
                value={form.gateway_type ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, gateway_type: e.target.value }))}
                placeholder="e.g. Card, Bank Transfer"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Input
                value={form.status ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                placeholder="Online / Offline / Degraded"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>API Endpoint</Label>
            <Input
              value={form.api_endpoint ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, api_endpoint: e.target.value }))}
              placeholder="https://api.provider.com/v1"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Supported Currencies</Label>
            <Input
              value={form.supported_currencies ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, supported_currencies: e.target.value }))}
              placeholder="USD, EUR, GBP"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Transaction Fee (%)</Label>
              <Input
                type="number"
                value={form.transaction_fee_percent ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, transaction_fee_percent: parseFloat(e.target.value) || 0 }))}
                placeholder="2.5"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Daily Volume Limit</Label>
              <Input
                type="number"
                value={form.daily_volume_limit ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, daily_volume_limit: parseFloat(e.target.value) || 0 }))}
                placeholder="1000000"
              />
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  )
}
