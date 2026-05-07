import React, { useState } from 'react'
import { cn, formatDate, truncate } from '@/lib/utils'
import { X, Check, AlertTriangle, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useApiQuery } from '@/hooks/useApi'
import { extractList } from '@/lib/apiUtils'
import { useUpdateKycVerification } from '@/hooks/useKycVerifications'
import type { KycVerification, Customer } from '@/types'

interface KycReviewPanelProps {
  verification: KycVerification
  onClose: () => void
}

function getStatusColor(status: string | undefined) {
  const s = (status ?? '').toLowerCase()
  if (s === 'approved') return '#22c55e'
  if (s === 'failed') return '#ef4444'
  if (s === 'in progress') return '#5266eb'
  if (s === 'under review') return '#f59e0b'
  return '#c3c3cc'
}

function getRiskColor(risk: string | undefined) {
  const r = (risk ?? '').toLowerCase()
  if (r === 'low') return '#22c55e'
  if (r === 'medium') return '#f59e0b'
  if (r === 'high') return '#ef4444'
  if (r === 'critical') return '#7c3aed'
  return '#c3c3cc'
}

function CheckBadge({ value }: { value: string | undefined }) {
  const v = (value ?? '').toLowerCase()
  const isPass = v === 'clear' || v === 'pass' || v === 'no'
  const isFail = v === 'found' || v === 'fail' || v === 'yes' || v === 'match'
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: isPass ? 'rgba(34,197,94,0.15)' : isFail ? 'rgba(239,68,68,0.15)' : 'rgba(112,112,125,0.15)',
        color: isPass ? '#22c55e' : isFail ? '#ef4444' : '#c3c3cc',
      }}
    >
      {isPass ? <Check className="h-3 w-3" /> : isFail ? <X className="h-3 w-3" /> : null}
      {value ?? '—'}
    </span>
  )
}

export function KycReviewPanel({ verification, onClose }: KycReviewPanelProps) {
  const [notes, setNotes] = useState('')
  const [riskOverride, setRiskOverride] = useState(verification.risk_level ?? '')

  const { data: customersData } = useApiQuery<unknown>(['customers'], '/v2/items/customers')
  const customers = extractList<Customer>(customersData)
  const customer = customers.find((c) => c.guid === verification.customers_id)

  const updateMutation = useUpdateKycVerification()

  function handleApprove() {
    updateMutation.mutate({
      guid: verification.guid,
      status: 'Approved',
      risk_level: riskOverride || verification.risk_level,
      screening_results: notes || verification.screening_results,
    })
    onClose()
  }

  function handleReject() {
    if (!notes.trim()) return
    updateMutation.mutate({
      guid: verification.guid,
      status: 'Failed',
      risk_level: riskOverride || verification.risk_level,
      screening_results: notes,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl flex flex-col overflow-hidden"
      style={{
        backgroundColor: 'var(--color-midnight-slate)',
        borderLeft: '1px solid rgba(112,112,125,0.2)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(112,112,125,0.15)' }}
      >
        <div>
          <h2 className="text-lg font-light" style={{ color: 'var(--color-starlight)' }}>
            KYC Review
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-silver)' }}>
            {verification.verification_id ?? verification.guid}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 rounded-sm hover:bg-[var(--color-graphite)] transition-colors"
        >
          <X className="h-4 w-4" style={{ color: 'var(--color-silver)' }} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Customer Info */}
        <div
          className="p-4"
          style={{ backgroundColor: 'var(--color-graphite)', border: '1px solid rgba(112,112,125,0.15)' }}
        >
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--color-lead)' }}>Customer</p>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
              style={{ backgroundColor: 'rgba(82,102,235,0.2)', color: 'var(--color-mercury-blue)' }}
            >
              {(customer?.full_name ?? '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-starlight)' }}>
                {customer?.full_name ?? '—'}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-silver)' }}>
                {customer?.email ?? '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Verification Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--color-lead)' }}>Type</p>
            <p className="text-sm" style={{ color: 'var(--color-starlight)' }}>{verification.verification_type ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--color-lead)' }}>Status</p>
            <span
              className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${getStatusColor(verification.status)}20`,
                color: getStatusColor(verification.status),
              }}
            >
              {verification.status ?? '—'}
            </span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--color-lead)' }}>Submitted</p>
            <p className="text-sm" style={{ color: 'var(--color-starlight)' }}>{formatDate(verification.submitted_date)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--color-lead)' }}>Reviewed By</p>
            <p className="text-sm" style={{ color: 'var(--color-starlight)' }}>{verification.reviewed_by ?? '—'}</p>
          </div>
        </div>

        {/* Screening Results */}
        <div>
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--color-lead)' }}>Screening Results</p>
          <div
            className="p-4 space-y-3"
            style={{ backgroundColor: 'var(--color-graphite)', border: '1px solid rgba(112,112,125,0.15)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--color-silver)' }}>Sanctions Check</span>
              <CheckBadge value={verification.sanctions_check} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--color-silver)' }}>PEP Check</span>
              <CheckBadge value={verification.pep_check} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--color-silver)' }}>Adverse Media</span>
              <CheckBadge value={verification.adverse_media} />
            </div>
            {verification.screening_results && (
              <div className="pt-2" style={{ borderTop: '1px solid rgba(112,112,125,0.15)' }}>
                <p className="text-xs" style={{ color: 'var(--color-silver)' }}>
                  {verification.screening_results}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Risk Override */}
        <div>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--color-lead)' }}>Risk Level Override</p>
          <Select value={riskOverride || 'placeholder'} onValueChange={(v) => setRiskOverride(v === 'placeholder' ? '' : v)}>
            <SelectTrigger style={{ backgroundColor: 'var(--color-graphite)', border: '1px solid rgba(112,112,125,0.2)' }}>
              <SelectValue placeholder="Select risk level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--color-lead)' }}>
            Review Notes <span style={{ color: '#ef4444' }}>*required for rejection</span>
          </p>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add review notes..."
            rows={4}
            style={{ backgroundColor: 'var(--color-graphite)', border: '1px solid rgba(112,112,125,0.2)', color: 'var(--color-starlight)' }}
          />
        </div>
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-3 px-6 py-4 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(112,112,125,0.15)' }}
      >
        <Button
          onClick={handleApprove}
          disabled={updateMutation.isPending}
          className="flex-1"
          style={{ backgroundColor: '#22c55e', color: '#fff', borderRadius: 32 }}
        >
          <Check className="h-4 w-4 mr-2" />
          Approve
        </Button>
        <Button
          onClick={handleReject}
          disabled={updateMutation.isPending || !notes.trim()}
          variant="destructive"
          className="flex-1"
          style={{ borderRadius: 32 }}
        >
          <X className="h-4 w-4 mr-2" />
          Reject
        </Button>
        <Button
          onClick={onClose}
          variant="ghost"
          className="ghost-btn"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
