import React, { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { IntegrationCard } from '@/components/integrations/IntegrationCard'
import { IntegrationConfigModal } from '@/components/integrations/IntegrationConfigModal'
import { useApiIntegrations, useCreateApiIntegration, useUpdateApiIntegration, useDeleteApiIntegration } from '@/hooks/useApiIntegrations'
import { extractList } from '@/lib/apiUtils'
import { truncate, formatCurrency } from '@/lib/utils'
import type { ApiIntegration } from '@/types'
import type { Column } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Settings, Trash2, RefreshCw, FileText } from 'lucide-react'
import { toast } from 'sonner'

function getStatusDot(status: string | undefined) {
  switch ((status ?? '').toLowerCase()) {
    case 'active': return (
      <span className="inline-flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full status-pulse" style={{ backgroundColor: '#22c55e' }} />
        <span style={{ color: '#22c55e' }}>Active</span>
      </span>
    )
    case 'maintenance': return (
      <span className="inline-flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
        <span style={{ color: '#f59e0b' }}>Maintenance</span>
      </span>
    )
    case 'error': return (
      <span className="inline-flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ef4444' }} />
        <span style={{ color: '#ef4444' }}>Error</span>
      </span>
    )
    default: return (
      <span className="inline-flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#70707d' }} />
        <span style={{ color: 'var(--color-silver)' }}>{status ?? '—'}</span>
      </span>
    )
  }
}

export function ApiIntegrationsPage() {
  const { data, isLoading } = useApiIntegrations()
  const integrations = extractList<ApiIntegration>(data)

  const createMutation = useCreateApiIntegration()
  const updateMutation = useUpdateApiIntegration()
  const deleteMutation = useDeleteApiIntegration()

  const [modalOpen, setModalOpen] = useState(false)
  const [editIntegration, setEditIntegration] = useState<ApiIntegration | null>(null)

  function openCreate() {
    setEditIntegration(null)
    setModalOpen(true)
  }

  function openEdit(integration: ApiIntegration) {
    setEditIntegration(integration)
    setModalOpen(true)
  }

  function handleDelete(guid: string) {
    deleteMutation.mutate(guid)
  }

  function handleSync(integration: ApiIntegration) {
    toast.info(`Syncing ${integration.integration_name ?? 'integration'}...`)
  }

  function handleSubmit(formData: Partial<ApiIntegration>) {
    if (editIntegration) {
      updateMutation.mutate(formData)
    } else {
      createMutation.mutate(formData)
    }
    setModalOpen(false)
  }

  const columns: Column<ApiIntegration>[] = [
    {
      key: 'integration_name',
      label: 'Name',
      render: (row) => (
        <span className="font-medium" style={{ color: 'var(--color-starlight)' }}>
          {row.integration_name ?? '—'}
        </span>
      ),
    },
    {
      key: 'api_type',
      label: 'Type',
      render: (row) => (
        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: 'rgba(82,102,235,0.15)', color: 'var(--color-mercury-blue)', border: '1px solid rgba(82,102,235,0.2)' }}
        >
          {row.api_type ?? '—'}
        </span>
      ),
    },
    {
      key: 'base_url',
      label: 'Base URL',
      render: (row) => (
        <span className="mono" style={{ color: 'var(--color-silver)', fontSize: 12 }}>
          {truncate(row.base_url, 36)}
        </span>
      ),
    },
    { key: 'auth_method', label: 'Auth', render: (row) => <span style={{ color: 'var(--color-silver)' }}>{row.auth_method ?? '—'}</span> },
    { key: 'status', label: 'Status', render: (row) => getStatusDot(row.status) },
    {
      key: 'rate_limit',
      label: 'Rate Limit',
      render: (row) => (
        <span style={{ color: 'var(--color-silver)' }}>
          {row.rate_limit != null ? formatCurrency(row.rate_limit, 'USD') : '—'}/min
        </span>
      ),
    },
    { key: 'last_sync', label: 'Last Sync', render: (row) => <span style={{ color: 'var(--color-silver)' }}>{row.last_sync ?? '—'}</span> },
    {
      key: 'version',
      label: 'Version',
      render: (row) => (
        <span
          className="text-[11px] px-2 py-0.5 rounded-full"
          style={{ backgroundColor: 'rgba(112,112,125,0.15)', color: 'var(--color-silver)', border: '1px solid rgba(112,112,125,0.25)' }}
        >
          {row.version ? `v${row.version}` : '—'}
        </span>
      ),
    },
    {
      key: 'guid',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); handleSync(row) }}>
            <RefreshCw className="h-3.5 w-3.5" style={{ color: 'var(--color-mercury-blue)' }} />
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); openEdit(row) }}>
            <Settings className="h-3.5 w-3.5" style={{ color: 'var(--color-silver)' }} />
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
            <FileText className="h-3.5 w-3.5" style={{ color: 'var(--color-silver)' }} />
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); handleDelete(row.guid) }}>
            <Trash2 className="h-3.5 w-3.5" style={{ color: '#ef4444' }} />
          </Button>
        </div>
      ),
    },
  ]

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  // Stats
  const activeCount = integrations.filter((i) => (i.status ?? '').toLowerCase() === 'active').length
  const errorCount = integrations.filter((i) => (i.status ?? '').toLowerCase() === 'error').length
  const maintenanceCount = integrations.filter((i) => (i.status ?? '').toLowerCase() === 'maintenance').length

  return (
    <div className="space-y-8">
      <PageHeader
        title="API Integrations"
        subtitle="Manage external service connections and monitor integration health"
        action="New Integration"
        onAction={openCreate}
        actionIcon={<Plus className="h-4 w-4" />}
      />

      {/* Summary stats */}
      {!isLoading && integrations.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="mercury-card p-4 kpi-glow">
            <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: 'var(--color-lead)' }}>Total</p>
            <p className="text-2xl font-light" style={{ color: 'var(--color-starlight)' }}>{integrations.length}</p>
          </div>
          <div className="mercury-card p-4">
            <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: 'var(--color-lead)' }}>Active</p>
            <p className="text-2xl font-light" style={{ color: '#22c55e' }}>{activeCount}</p>
          </div>
          <div className="mercury-card p-4">
            <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: 'var(--color-lead)' }}>Maintenance</p>
            <p className="text-2xl font-light" style={{ color: '#f59e0b' }}>{maintenanceCount}</p>
          </div>
          <div className="mercury-card p-4">
            <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: 'var(--color-lead)' }}>Errors</p>
            <p className="text-2xl font-light" style={{ color: '#ef4444' }}>{errorCount}</p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="mercury-card p-4">
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-7 w-10" />
            </div>
          ))}
        </div>
      )}

      <Tabs defaultValue="cards">
        <TabsList
          className="mb-6"
          style={{ backgroundColor: 'var(--color-graphite)', border: '1px solid rgba(112,112,125,0.2)' }}
        >
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="cards">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="mercury-card p-6" style={{ minHeight: 220 }}>
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="w-10 h-10 rounded-sm" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-36 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-full mb-3" />
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-8" />
                    <Skeleton className="h-8" />
                  </div>
                  <Skeleton className="h-1.5 w-full mt-4" />
                </div>
              ))}
            </div>
          ) : integrations.length === 0 ? (
            <div
              className="flex items-center justify-center py-20 mercury-card"
              style={{ color: 'var(--color-silver)' }}
            >
              <p className="text-sm">No API integrations configured.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {integrations.map((integration) => (
                <IntegrationCard
                  key={integration.guid}
                  integration={integration}
                  onConfigure={openEdit}
                  onDelete={handleDelete}
                  onSync={handleSync}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="table">
          <DataTable<ApiIntegration>
            columns={columns}
            data={integrations}
            isLoading={isLoading}
            emptyMessage="No API integrations found."
            onRowClick={openEdit}
          />
        </TabsContent>
      </Tabs>

      <IntegrationConfigModal
        open={modalOpen}
        integration={editIntegration}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
