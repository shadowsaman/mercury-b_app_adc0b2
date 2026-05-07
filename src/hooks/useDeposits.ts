import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { extractList, extractCount } from '@/lib/apiUtils'
import type { Deposit } from '@/types'

export function useDeposits() {
  return useApiQuery<unknown>(['deposits'], '/v2/items/deposits')
}

export function useCreateDeposit() {
  return useApiMutation<Deposit, Partial<Deposit>>(
    {
      url: '/v2/items/deposits',
      method: 'POST',
      successMessage: 'Deposit created successfully',
      invalidateKeys: [['deposits']],
    }
  )
}

export function useUpdateDeposit() {
  return useApiMutation<Deposit, Partial<Deposit>>(
    {
      url: '/v2/items/deposits',
      method: 'PUT',
      successMessage: 'Deposit updated successfully',
      invalidateKeys: [['deposits']],
    }
  )
}

export function useDeleteDeposit() {
  return useApiMutation<void, string>(
    {
      url: (id) => '/v2/items/deposits/' + id,
      method: 'DELETE',
      successMessage: 'Deposit deleted',
      invalidateKeys: [['deposits']],
    }
  )
}

export { extractList, extractCount }
