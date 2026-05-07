import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { extractList, extractCount } from '@/lib/apiUtils'
import type { PaymentGateway } from '@/types'

export function usePaymentGateways() {
  return useApiQuery<unknown>(['payment_gateways'], '/v2/items/payment_gateways')
}

export function useCreatePaymentGateway() {
  return useApiMutation<PaymentGateway, Partial<PaymentGateway>>({
    url: '/v2/items/payment_gateways',
    method: 'POST',
    successMessage: 'Payment gateway created successfully',
    invalidateKeys: [['payment_gateways']],
  })
}

export function useUpdatePaymentGateway() {
  return useApiMutation<PaymentGateway, Partial<PaymentGateway>>({
    url: '/v2/items/payment_gateways',
    method: 'PUT',
    successMessage: 'Payment gateway updated successfully',
    invalidateKeys: [['payment_gateways']],
  })
}

export function useDeletePaymentGateway() {
  return useApiMutation<void, string>({
    url: (id) => '/v2/items/payment_gateways/' + id,
    method: 'DELETE',
    successMessage: 'Payment gateway deleted',
    invalidateKeys: [['payment_gateways']],
  })
}

export { extractList, extractCount }
