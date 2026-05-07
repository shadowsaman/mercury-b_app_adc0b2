import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { useApiQuery } from '@/hooks/useApi'
import { extractList } from '@/lib/apiUtils'
import { formatDate, formatCurrency, getInitials, truncate } from '@/lib/utils'
import type { Customer, Account, Transaction, Document, KycVerification } from '@/types'
import { CustomerStatusBadge } from './CustomerStatusBadge'
import { FileText, CreditCard, ShieldCheck, Activity, User } from 'lucide-react'

interface CustomerDetailTabsProps {
  customer: Customer
}

function ProfileField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--color-lead)' }}>
        {label}
      </span>
      <span className="text-sm" style={{ color: 'var(--color-starlight)' }}>
        {value}
      </span>
    </div>
  )
}

function AccountsTab({ customerId }: { customerId: string }) {
  const { data, isLoading } = useApiQuery<unknown>(['accounts', 'by-customer', customerId], '/v2/items/accounts')
  const accounts = extractList<Account>(data).filter(
    (a) => !customerId || a.customers_id === customerId
  )

  if (isLoading) {
    return (
      <div className="space-y-2 pt-2">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-sm" style={{ border: '1px solid rgba(112,112,125,0.15)' }}>
      <Table>
        <TableHeader>
          <TableRow style={{ backgroundColor: 'var(--color-graphite)' }}>
            <TableHead className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--color-lead)' }}>Account #</TableHead>
            <TableHead className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--color-lead)' }}>Type</TableHead>
            <TableHead className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--color-lead)' }}>Balance</TableHead>
            <TableHead className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--color-lead)' }}>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-sm" style={{ color: 'var(--color-lead)' }}>
                No linked accounts found
              </TableCell>
            </TableRow>
          ) : (
            accounts.map((acc) => (
              <TableRow key={acc.guid} style={{ borderColor: 'rgba(112,112,125,0.15)' }}>
                <TableCell className="font-mono text-xs" style={{ color: 'var(--color-starlight)' }}>{acc.account_number ?? '—'}</TableCell>
                <TableCell>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-[rgba(82,102,235,0.15)] text-[#5266eb]">{acc.account_type ?? '—'}</span>
                </TableCell>
                <TableCell className="text-sm" style={{ color: 'var(--color-starlight)' }}>{formatCurrency(acc.balance ?? 0)}</TableCell>
                <TableCell><CustomerStatusBadge status={acc.status} /></TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function DocumentsTab({ customerId }: { customerId: string }) {
  const { data, isLoading } = useApiQuery<unknown>(['documents', 'by-customer', customerId], '/v2/items/documents')
  const docs = extractList<Document>(data).filter(
    (d) => !customerId || d.customers_id === customerId
  )

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 pt-2">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {docs.length === 0 ? (
        <div className="col-span-2 text-center py-8 text-sm" style={{ color: 'var(--color-lead)' }}>
          No documents found
        </div>
      ) : (
        docs.map((doc) => (
          <div
            key={doc.guid}
            className="p-3 rounded-sm flex items-start gap-3"
            style={{ backgroundColor: 'var(--color-graphite)', border: '1px solid rgba(112,112,125,0.15)' }}
          >
            <div className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(82,102,235,0.15)' }}>
              <FileText className="h-4 w-4" style={{ color: '#5266eb' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--color-starlight)' }}>{doc.document_name ?? '—'}</p>
              <p className="text-xs" style={{ color: 'var(--color-lead)' }}>{doc.document_type ?? '—'} · {doc.file_size ?? '—'}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs" style={{ color: 'var(--color-silver)' }}>{formatDate(doc.upload_date ?? '')}</span>
                <CustomerStatusBadge status={doc.status} />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function KycHistoryTab({ customerId }: { customerId: string }) {
  const { data, isLoading } = useApiQuery<unknown>(['kyc', 'by-customer', customerId], '/v2/items/kyc_verifications')
  const verifications = extractList<KycVerification>(data).filter(
    (v) => !customerId || v.customers_id === customerId
  )

  if (isLoading) {
    return (
      <div className="space-y-3 pt-2">
        {[1, 2].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {verifications.length === 0 ? (
        <div className="text-center py-8 text-sm" style={{ color: 'var(--color-lead)' }}>No KYC history found</div>
      ) : (
        verifications.map((v) => {
          const riskColor =
            (v.risk_level ?? '').toLowerCase() === 'high' || (v.risk_level ?? '').toLowerCase() === 'critical'
              ? 'text-red-400'
              : (v.risk_level ?? '').toLowerCase() === 'medium'
              ? 'text-amber-400'
              : 'text-emerald-400'
          return (
            <div
              key={v.guid}
              className="p-3 rounded-sm"
              style={{ backgroundColor: 'var(--color-graphite)', border: '1px solid rgba(112,112,125,0.15)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" style={{ color: '#5266eb' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--color-starlight)' }}>{v.verification_type ?? '—'}</span>
                </div>
                <CustomerStatusBadge status={v.status} variant="kyc" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span style={{ color: 'var(--color-lead)' }}>Risk: </span>
                  <span className={riskColor}>{v.risk_level ?? '—'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-lead)' }}>Sanctions: </span>
                  <span style={{ color: 'var(--color-silver)' }}>{v.sanctions_check ?? '—'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-lead)' }}>PEP: </span>
                  <span style={{ color: 'var(--color-silver)' }}>{v.pep_check ?? '—'}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: 'var(--color-lead)' }}>
                <span>Submitted: {formatDate(v.submitted_date ?? '')}</span>
                {v.completed_date && <span>Completed: {formatDate(v.completed_date)}</span>}
                {v.reviewed_by && <span>By: {v.reviewed_by}</span>}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

function ActivityTab({ customerId }: { customerId: string }) {
  const { data, isLoading } = useApiQuery<unknown>(['transactions', 'recent'], '/v2/items/transactions')
  const transactions = extractList<Transaction>(data)

  if (isLoading) {
    return (
      <div className="space-y-2 pt-2">
        {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-sm" style={{ border: '1px solid rgba(112,112,125,0.15)' }}>
      <Table>
        <TableHeader>
          <TableRow style={{ backgroundColor: 'var(--color-graphite)' }}>
            <TableHead className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--color-lead)' }}>ID</TableHead>
            <TableHead className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--color-lead)' }}>Type</TableHead>
            <TableHead className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--color-lead)' }}>Amount</TableHead>
            <TableHead className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--color-lead)' }}>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-sm" style={{ color: 'var(--color-lead)' }}>
                No recent transactions
              </TableCell>
            </TableRow>
          ) : (
            transactions.slice(0, 10).map((tx) => (
              <TableRow key={tx.guid} style={{ borderColor: 'rgba(112,112,125,0.15)' }}>
                <TableCell className="font-mono text-xs" style={{ color: 'var(--color-silver)' }}>{truncate(tx.transaction_id ?? '', 12)}</TableCell>
                <TableCell className="text-xs" style={{ color: 'var(--color-starlight)' }}>{tx.type ?? '—'}</TableCell>
                <TableCell className="text-sm font-medium" style={{ color: (tx.amount ?? 0) >= 0 ? '#4ade80' : 'var(--color-starlight)' }}>
                  {formatCurrency(tx.amount ?? 0)}
                </TableCell>
                <TableCell className="text-xs" style={{ color: 'var(--color-silver)' }}>{formatDate(tx.transaction_date ?? '')}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export function CustomerDetailTabs({ customer }: CustomerDetailTabsProps) {
  return (
    <Tabs defaultValue="profile" className="mt-4">
      <TabsList className="w-full" style={{ backgroundColor: 'var(--color-graphite)' }}>
        <TabsTrigger value="profile" className="flex-1 text-xs gap-1.5">
          <User className="h-3.5 w-3.5" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="accounts" className="flex-1 text-xs gap-1.5">
          <CreditCard className="h-3.5 w-3.5" />
          Accounts
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex-1 text-xs gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          Docs
        </TabsTrigger>
        <TabsTrigger value="kyc" className="flex-1 text-xs gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          KYC
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex-1 text-xs gap-1.5">
          <Activity className="h-3.5 w-3.5" />
          Activity
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-4">
        <div className="grid grid-cols-2 gap-4">
          <ProfileField label="Full Name" value={customer.full_name ?? '—'} />
          <ProfileField label="Email" value={customer.email ?? '—'} />
          <ProfileField label="Phone" value={customer.phone ?? '—'} />
          <ProfileField label="Date of Birth" value={formatDate(customer.date_of_birth ?? '')} />
          <ProfileField label="Customer Type" value={
            <CustomerStatusBadge status={customer.customer_type} variant="type" />
          } />
          <ProfileField label="Status" value={
            <CustomerStatusBadge status={customer.status} />
          } />
          <ProfileField label="KYC Status" value={
            <CustomerStatusBadge status={customer.kyc_status} variant="kyc" />
          } />
          <ProfileField label="AML Risk" value={
            <CustomerStatusBadge status={customer.aml_risk_score} variant="aml" />
          } />
          <ProfileField label="ID Type" value={customer.id_type ?? '—'} />
          <ProfileField label="ID Number" value={customer.id_number ?? '—'} />
          <ProfileField label="Onboarding Date" value={formatDate(customer.onboarding_date ?? '')} />
          <div className="col-span-2">
            <ProfileField label="Address" value={customer.address ?? '—'} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="accounts" className="mt-4">
        <AccountsTab customerId={customer.guid} />
      </TabsContent>

      <TabsContent value="documents" className="mt-4">
        <DocumentsTab customerId={customer.guid} />
      </TabsContent>

      <TabsContent value="kyc" className="mt-4">
        <KycHistoryTab customerId={customer.guid} />
      </TabsContent>

      <TabsContent value="activity" className="mt-4">
        <ActivityTab customerId={customer.guid} />
      </TabsContent>
    </Tabs>
  )
}
