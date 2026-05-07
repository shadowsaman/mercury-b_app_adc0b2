import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { extractList, extractCount, extractSingle } from '@/lib/apiUtils'
import type { Customer } from '@/types'

export function useCustomers() {
  return useApiQuery<unknown>(['customers'], '/v2/items/customers')
}

export function useCustomerById(id: string) {
  return useApiQuery<unknown>(
    ['customers', id],
    '/v2/items/customers/' + id,
    undefined,
    { enabled: !!id }
  )
}

export function useCreateCustomer() {
  return useApiMutation<Customer, Partial<Customer>>({
    url: '/v2/items/customers',
    method: 'POST',
    successMessage: 'Customer created successfully',
    invalidateKeys: [['customers']],
  })
}

export function useUpdateCustomer() {
  return useApiMutation<Customer, Partial<Customer>>({
    url: '/v2/items/customers',
    method: 'PUT',
    successMessage: 'Customer updated successfully',
    invalidateKeys: [['customers']],
  })
}

export function useDeleteCustomer() {
  return useApiMutation<void, string>({
    url: (id) => '/v2/items/customers/' + id,
    method: 'DELETE',
    successMessage: 'Customer deleted successfully',
    invalidateKeys: [['customers']],
  })
}

export { extractList, extractCount, extractSingle }
