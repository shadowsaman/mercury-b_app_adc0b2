import React, { useState, useEffect } from 'react'
import { FormModal } from '@/components/shared/FormModal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useApiQuery } from '@/hooks/useApi'
import { useCreateDeposit, useUpdateDeposit } from '@/hooks/useDeposits'
import { extractList } from '@/lib/apiUtils'
import type { Deposit, Customer, Account } from '@/types'

interface DepositFormModalProps {
  open: boolean
  onClose: () => void
  deposit?: Deposit | null
}

export function DepositFormModal({ open, onClose, deposit }: DepositFormModalProps) {
  const isEdit = !!deposit

  const [depositId, setDepositId] = useState('')
  const [depositType, setDepositType] = useState('')
  const [principalAmount, setPrincipalAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [termMonths, setTermMonths] = useState('')
  const [startDate, setStartDate] = useState('')
  const [maturityDate, setMaturityDate] = useState('')
  const [status, setStatus] = useState('')
  const [payoutMethod, setPayoutMethod] = useState('')
  const [autoRenew, setAutoRenew] = useState(false)
  const [customersId, setCustomersId] = useState('')
  const [accountsId, setAccountsId] = useState('')

  const { data: customersData } = useApiQuery<unknown>(['customers'], '/v2/items/customers')
  const customers = extractList<Customer>(customersData)

  const { data: accountsData } = useApiQuery<unknown>(['accounts'], '/v2/items/accounts')
  const accounts = extractList<Account>(accountsData)

  const createMutation = useCreateDeposit()
  const updateMutation = useUpdateDeposit()

  useEffect(() => {
    if (deposit) {
      setDepositId(deposit.deposit_id ?? '')
      setDepositType(deposit.deposit_type ?? '')
      setPrincipalAmount(String(deposit.principal_amount ?? ''))
      setInterestRate(String(deposit.interest_rate ?? ''))
      setTermMonths(String(deposit.term_months ?? ''))
      setStartDate(deposit.start_date ?? '')
      setMaturityDate(deposit.maturity_date ?? '')
      setStatus(deposit.status ?? '')
      setPayoutMethod(deposit.payout_method ?? '')
      setAutoRenew(deposit.auto_renew ?? false)
      setCustomersId(deposit.customers_id ?? '')
      setAccountsId(deposit.accounts_id ?? '')
    } else {
      setDepositId('')
      setDepositType('')
      setPrincipalAmount('')
      setInterestRate('')
      setTermMonths('')
      setStartDate('')
      setMaturityDate('')
      setStatus('')
      setPayoutMethod('')
      setAutoRenew(false)
      setCustomersId('')
      setAccountsId('')
    }
  }, [deposit, open])

  function handleSubmit() {
    const payload: Partial<Deposit> = {
      deposit_id: depositId || undefined,
      deposit_type: depositType || undefined,
      principal_amount: principalAmount ? parseFloat(principalAmount) : undefined,
      interest_rate: interestRate ? parseFloat(interestRate) : undefined,
      term_months: termMonths ? parseInt(termMonths, 10) : undefined,
      start_date: startDate || undefined,
      maturity_date: maturityDate || undefined,
      status: status || undefined,
      payout_method: payoutMethod || undefined,
      auto_renew: autoRenew,
      ...(customersId ? { customers_id: customersId } : {}),
      ...(accountsId ? { accounts_id: accountsId } : {}),
    }

    if (isEdit && deposit) {
      updateMutation.mutate({ ...payload, guid: deposit.guid }, { onSuccess: onClose })
    } else {
      createMutation.mutate(payload, { onSuccess: onClose })
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <FormModal
      open={open}
      title={isEdit ? 'Edit Deposit' : 'New Deposit'}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      submitLabel={isEdit ? 'Update Deposit' : 'Create Deposit'}
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deposit_id">Deposit ID</Label>
            <Input
              id="deposit_id"
              placeholder="DEP-001"
              value={depositId}
              onChange={(e) => setDepositId(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deposit_type">Deposit Type</Label>
            <Select value={depositType} onValueChange={setDepositType}>
              <SelectTrigger id="deposit_type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Term Deposit">Term Deposit</SelectItem>
                <SelectItem value="Fixed Deposit">Fixed Deposit</SelectItem>
                <SelectItem value="CD">Certificate of Deposit</SelectItem>
                <SelectItem value="Savings">Savings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="principal_amount">Principal Amount</Label>
            <Input
              id="principal_amount"
              type="number"
              placeholder="10000"
              value={principalAmount}
              onChange={(e) => setPrincipalAmount(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="interest_rate">Interest Rate (%)</Label>
            <Input
              id="interest_rate"
              type="number"
              step="0.01"
              placeholder="3.50"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="term_months">Term (Months)</Label>
            <Input
              id="term_months"
              type="number"
              placeholder="12"
              value={termMonths}
              onChange={(e) => setTermMonths(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Matured">Matured</SelectItem>
                <SelectItem value="Frozen">Frozen</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="maturity_date">Maturity Date</Label>
            <Input
              id="maturity_date"
              type="date"
              value={maturityDate}
              onChange={(e) => setMaturityDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="payout_method">Payout Method</Label>
          <Select value={payoutMethod} onValueChange={setPayoutMethod}>
            <SelectTrigger id="payout_method">
              <SelectValue placeholder="Select payout method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Transfer to Account">Transfer to Account</SelectItem>
              <SelectItem value="Reinvest">Reinvest</SelectItem>
              <SelectItem value="Cheque">Cheque</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="customers_id">Customer</Label>
          <Select value={customersId} onValueChange={setCustomersId}>
            <SelectTrigger id="customers_id">
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
          <Label htmlFor="accounts_id">Account</Label>
          <Select value={accountsId} onValueChange={setAccountsId}>
            <SelectTrigger id="accounts_id">
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
            id="auto_renew"
            checked={autoRenew}
            onCheckedChange={setAutoRenew}
          />
          <Label htmlFor="auto_renew">Auto Renew</Label>
        </div>
      </div>
    </FormModal>
  )
}
