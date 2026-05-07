import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { extractList, extractCount } from '@/lib/apiUtils'
import type { ApiIntegration } from '@/types'

export function useApiIntegrations() {
  return useApiQuery<unknown>(['api_integrations'], '/v2/items/api_integrations')
}

export function useCreateApiIntegration() {
  return useApiMutation<ApiIntegration, Partial<ApiIntegration>>({
    url: '/v2/items/api_integrations',
    method: 'POST',
    successMessage: 'Integration created successfully',
    invalidateKeys: [['api_integrations']],
  })
}

export function useUpdateApiIntegration() {
  return useApiMutation<ApiIntegration, Partial<ApiIntegration>>({
    url: '/v2/items/api_integrations',
    method: 'PUT',
    successMessage: 'Integration updated successfully',
    invalidateKeys: [['api_integrations']],
  })
}

export function useDeleteApiIntegration() {
  return useApiMutation<void, string>({
    url: (id) => '/v2/items/api_integrations/' + id,
    method: 'DELETE',
    successMessage: 'Integration deleted',
    invalidateKeys: [['api_integrations']],
  })
}

export { extractList, extractCount }
