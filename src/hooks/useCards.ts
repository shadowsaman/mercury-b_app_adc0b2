import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { extractList, extractCount } from '@/lib/apiUtils'
import type { Card } from '@/types'

export function useCards() {
  return useApiQuery<unknown>(['cards'], '/v2/items/cards')
}

export function useCreateCard() {
  return useApiMutation<Card, Partial<Card>>(
    {
      url: '/v2/items/cards',
      method: 'POST',
      successMessage: 'Card created successfully',
      invalidateKeys: [['cards']],
    }
  )
}

export function useUpdateCard() {
  return useApiMutation<Card, Partial<Card>>(
    {
      url: '/v2/items/cards',
      method: 'PUT',
      successMessage: 'Card updated successfully',
      invalidateKeys: [['cards']],
    }
  )
}

export function useDeleteCard() {
  return useApiMutation<void, string>(
    {
      url: (id) => '/v2/items/cards/' + id,
      method: 'DELETE',
      successMessage: 'Card deleted',
      invalidateKeys: [['cards']],
    }
  )
}

export { extractList, extractCount }
