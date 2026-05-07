import React, { useState, useEffect } from 'react'
import { FormModal } from '@/components/shared/FormModal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useApiQuery } from '@/hooks/useApi'
import { useCreateAccount, useUpdateAccount } from '@/hooks/useAccounts'
import { extractList } from '@/lib/apiUtils'
import type { Account, Customer } from '@/types'

interface AccountFormModalProps {
  open: boolean
  onClose: () => void
  editingAccount?: Account | null
}

const ACCOUNT_TYPES = ['Checking', 'Savings', 'Business', 'Corporate', 'Investment']
const CURRENCIES = ['USD', 'EUR', 'GBP', 'AED', 'JPY', 'CHF']
const STATUSES = ['Active', 'Frozen', 'Closed', 'Pending']

export function AccountFormModal({ open, onClose, editingAccount }: AccountFormModalProps) {
  const isEditing = !!editingAccount

  const [accountNumber, setAccountNumber] = useState('')
  const [accountType, setAccountType] = useState('')
  const [currency, setCurrency] = useState('')
  const [balance, setBalance] = useState('')
  const [availableBalance, setAvailableBalance] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [status, setStatus] = useState('')
  const [openedDate, setOpenedDate] = useState('')
  const [branch, setBranch] = useState('')
  const [iban, setIban] = useState('')
  const [customersId, setCustomersId] = useState('')

  const { data: custData } = useApiQuery<unknown>(['customers'], '/v2/items/customers')
  const customers = extractList<Customer>(custData)

  const createMutation = useCreateAccount()
  const updateMutation = useUpdateAccount()

  useEffect(() => {
    if (editingAccount) {
      setAccountNumber(editingAccount.account_number ?? '')
      setAccountType(editingAccount.account_type ?? '')
      setCurrency(editingAccount.currency ?? '')
      setBalance(String(editingAccount.balance ?? ''))
      setAvailableBalance(String(editingAccount.available_balance ?? ''))
      setInterestRate(String(editingAccount.interest_rate ?? ''))
      setStatus(editingAccount.status ?? '')
      setOpenedDate(editingAccount.opened_date ?? '')
      setBranch(editingAccount.branch ?? '')
      setIban(editingAccount.iban ?? '')
      setCustomersId(editingAccount.customers_id ?? '')
    } else {
      setAccountNumber('')
      setAccountType('')
      setCurrency('')
      setBalance('')
      setAvailableBalance('')
      setInterestRate('')
      setStatus('')
      setOpenedDate('')
      setBranch('')
      setIban('')
      setCustomersId('')
    }
  }, [editingAccount, open])

  function handleSubmit() {
    const payload: Partial<Account> = {
      account_number: accountNumber || undefined,
      account_type: accountType || undefined,
      currency: currency || undefined,
      balance: balance !== '' ? Number(balance) : undefined,
      available_balance: availableBalance !== '' ? Number(availableBalance) : undefined,
      interest_rate: interestRate !== '' ? Number(interestRate) : undefined,
      status: status || undefined,
      opened_date: openedDate || undefined,
      branch: branch || undefined,
      iban: iban || undefined,
      ...(customersId ? { customers_id: customersId } : {}),
    }

    if (isEditing && editingAccount) {
      updateMutation.mutate({ ...payload, guid: editingAccount.guid }, {
        onSuccess: () => onClose(),
      })
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => onClose(),
      })
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <FormModal
      open={open}
      title={isEditing ? 'Edit Account' : 'New Account'}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      submitLabel={isEditing ? 'Update Account' : 'Create Account'}
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Account Number */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <Label htmlFor="account_number">Account Number</Label>
          <Input
            id="account_number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="e.g. ACC-001234"
          />
        </div>

        {/* Customer */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <Label>Customer</Label>
          <Select value={customersId} onValueChange={setCustomersId}>
            <SelectTrigger>
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

        {/* Account Type */}
        <div className="flex flex-col gap-1.5">
          <Label>Account Type</Label>
          <Select value={accountType} onValueChange={setAccountType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {ACCOUNT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Currency */}
        <div className="flex flex-col gap-1.5">
          <Label>Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Balance */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="balance">Balance</Label>
          <Input
            id="balance"
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="0.00"
          />
        </div>

        {/* Available Balance */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="available_balance">Available Balance</Label>
          <Input
            id="available_balance"
            type="number"
            value={availableBalance}
            onChange={(e) => setAvailableBalance(e.target.value)}
            placeholder="0.00"
          />
        </div>

        {/* Interest Rate */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="interest_rate">Interest Rate (%)</Label>
          <Input
            id="interest_rate"
            type="number"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="e.g. 2.50"
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Opened Date */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="opened_date">Opened Date</Label>
          <Input
            id="opened_date"
            type="date"
            value={openedDate}
            onChange={(e) => setOpenedDate(e.target.value)}
          />
        </div>

        {/* Branch */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="branch">Branch</Label>
          <Input
            id="branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="Branch name"
          />
        </div>

        {/* IBAN */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <Label htmlFor="iban">IBAN</Label>
          <Input
            id="iban"
            className="font-mono"
            value={iban}
            onChange={(e) => setIban(e.target.value)}
            placeholder="e.g. GB29NWBK60161331926819"
          />
        </div>
      </div>
    </FormModal>
  )
}
