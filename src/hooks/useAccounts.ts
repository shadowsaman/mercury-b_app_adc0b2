import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { extractList, extractCount, extractSingle } from '@/lib/apiUtils'
import type { Account, Customer } from '@/types'

export function useAccounts() {
  return useApiQuery<unknown>(['accounts'], '/v2/items/accounts')
}

export function useAccountById(id: string) {
  return useApiQuery<unknown>(
    ['accounts', id],
    '/v2/items/accounts/' + id,
    undefined,
    { enabled: !!id }
  )
}

export function useCreateAccount() {
  return useApiMutation<Account, Partial<Account>>({
    url: '/v2/items/accounts',
    method: 'POST',
    successMessage: 'Account created successfully',
    invalidateKeys: [['accounts']],
  })
}

export function useUpdateAccount() {
  return useApiMutation<Account, Partial<Account>>({
    url: '/v2/items/accounts',
    method: 'PUT',
    successMessage: 'Account updated successfully',
    invalidateKeys: [['accounts']],
  })
}

export function useDeleteAccount() {
  return useApiMutation<void, string>({
    url: (id) => '/v2/items/accounts/' + id,
    method: 'DELETE',
    successMessage: 'Account deleted',
    invalidateKeys: [['accounts']],
  })
}

export function useCustomersForAccounts() {
  return useApiQuery<unknown>(['customers'], '/v2/items/customers')
}

export { extractList, extractCount, extractSingle }
