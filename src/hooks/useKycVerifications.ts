import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { extractList, extractCount, extractSingle } from '@/lib/apiUtils'
import type { KycVerification } from '@/types'

export function useKycVerifications() {
  return useApiQuery<unknown>(['kyc_verifications'], '/v2/items/kyc_verifications')
}

export function useKycVerification(id: string) {
  return useApiQuery<unknown>(
    ['kyc_verifications', id],
    '/v2/items/kyc_verifications/' + id,
    {},
    { enabled: !!id }
  )
}

export function useCreateKycVerification() {
  return useApiMutation<KycVerification, Partial<KycVerification>>({
    url: '/v2/items/kyc_verifications',
    method: 'POST',
    successMessage: 'KYC verification created',
    invalidateKeys: [['kyc_verifications']],
  })
}

export function useUpdateKycVerification() {
  return useApiMutation<KycVerification, Partial<KycVerification>>({
    url: '/v2/items/kyc_verifications',
    method: 'PUT',
    successMessage: 'KYC verification updated',
    invalidateKeys: [['kyc_verifications']],
  })
}

export function useDeleteKycVerification() {
  return useApiMutation<void, string>({
    url: (id) => '/v2/items/kyc_verifications/' + id,
    method: 'DELETE',
    successMessage: 'KYC verification deleted',
    invalidateKeys: [['kyc_verifications']],
  })
}
