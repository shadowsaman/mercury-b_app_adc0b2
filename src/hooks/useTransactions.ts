import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { extractList, extractCount, extractSingle } from '@/lib/apiUtils'
import type { Transaction } from '@/types'

export function useTransactions() {
  return useApiQuery<unknown>(['transactions'], '/v2/items/transactions')
}

export function useTransaction(id: string) {
  return useApiQuery<unknown>(
    ['transactions', id],
    '/v2/items/transactions/' + id,
    undefined,
    { enabled: !!id }
  )
}

export function useCreateTransaction() {
  return useApiMutation<Transaction, Partial<Transaction>>({
    url: '/v2/items/transactions',
    method: 'POST',
    successMessage: 'Transaction created successfully',
    invalidateKeys: [['transactions']],
  })
}

export function useUpdateTransaction() {
  return useApiMutation<Transaction, Partial<Transaction>>({
    url: '/v2/items/transactions',
    method: 'PUT',
    successMessage: 'Transaction updated successfully',
    invalidateKeys: [['transactions']],
  })
}

export function useDeleteTransaction() {
  return useApiMutation<void, string>({
    url: (id) => '/v2/items/transactions/' + id,
    method: 'DELETE',
    successMessage: 'Transaction deleted',
    invalidateKeys: [['transactions']],
  })
}

export { extractList, extractCount, extractSingle }
