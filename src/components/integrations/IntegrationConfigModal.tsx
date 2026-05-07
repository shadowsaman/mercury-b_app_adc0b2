import React, { useState, useEffect } from 'react'
import { FormModal } from '@/components/shared/FormModal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import type { ApiIntegration } from '@/types'

interface IntegrationConfigModalProps {
  open: boolean
  integration: ApiIntegration | null
  onClose: () => void
  onSubmit: (data: Partial<ApiIntegration>) => void
  isSubmitting?: boolean
}

const STATUS_OPTIONS = ['Active', 'Inactive', 'Maintenance', 'Error']
const AUTH_OPTIONS = ['API Key', 'OAuth2', 'Bearer Token', 'Basic Auth', 'HMAC', 'None']
const API_TYPE_OPTIONS = ['REST', 'GraphQL', 'SOAP', 'Webhook', 'gRPC']

export function IntegrationConfigModal({
  open,
  integration,
  onClose,
  onSubmit,
  isSubmitting = false,
}: IntegrationConfigModalProps) {
  const [form, setForm] = useState<Partial<ApiIntegration>>({
    integration_name: '',
    api_type: 'REST',
    base_url: '',
    auth_method: 'API Key',
    status: 'Active',
    rate_limit: 0,
    version: '',
    description: '',
  })

  useEffect(() => {
    if (integration) {
      setForm({
        integration_name: integration.integration_name ?? '',
        api_type: integration.api_type ?? 'REST',
        base_url: integration.base_url ?? '',
        auth_method: integration.auth_method ?? 'API Key',
        status: integration.status ?? 'Active',
        rate_limit: integration.rate_limit ?? 0,
        version: integration.version ?? '',
        description: integration.description ?? '',
      })
    } else {
      setForm({
        integration_name: '',
        api_type: 'REST',
        base_url: '',
        auth_method: 'API Key',
        status: 'Active',
        rate_limit: 0,
        version: '',
        description: '',
      })
    }
  }, [integration, open])

  function handleSubmit() {
    const payload: Partial<ApiIntegration> = { ...form }
    if (integration?.guid) {
      payload.guid = integration.guid
    }
    onSubmit(payload)
  }

  return (
    <FormModal
      open={open}
      title={integration ? `Configure: ${integration.integration_name ?? 'Integration'}` : 'New API Integration'}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel={integration ? 'Update' : 'Create'}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Integration Name <span className="text-red-400">*</span></Label>
            <Input
              value={form.integration_name ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, integration_name: e.target.value }))}
              placeholder="e.g. Stripe Payments"
            />
          </div>
          <div className="space-y-1.5">
            <Label>API Type</Label>
            <Select
              value={form.api_type ?? 'REST'}
              onValueChange={(v) => setForm((f) => ({ ...f, api_type: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {API_TYPE_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t || 'REST'}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Base URL</Label>
          <Input
            value={form.base_url ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, base_url: e.target.value }))}
            placeholder="https://api.example.com/v1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Auth Method</Label>
            <Select
              value={form.auth_method ?? 'API Key'}
              onValueChange={(v) => setForm((f) => ({ ...f, auth_method: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select auth" />
              </SelectTrigger>
              <SelectContent>
                {AUTH_OPTIONS.map((a) => (
                  <SelectItem key={a} value={a || 'API Key'}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={form.status ?? 'Active'}
              onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s || 'Active'}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Rate Limit (req/min)</Label>
            <Input
              type="number"
              value={form.rate_limit ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, rate_limit: parseFloat(e.target.value) || 0 }))}
              placeholder="100"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Version</Label>
            <Input
              value={form.version ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))}
              placeholder="v2.1.0"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea
            value={form.description ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Brief description of this integration..."
            rows={3}
          />
        </div>
      </div>
    </FormModal>
  )
}
