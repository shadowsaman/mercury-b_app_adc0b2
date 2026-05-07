import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { extractList, extractCount } from '@/lib/apiUtils'
import type { AuditLog } from '@/types'

export function useAuditLogs() {
  return useApiQuery<unknown>(['audit_logs'], '/v2/items/audit_logs')
}

export function useCreateAuditLog() {
  return useApiMutation<AuditLog, Partial<AuditLog>>({
    url: '/v2/items/audit_logs',
    method: 'POST',
    successMessage: 'Audit log created',
    invalidateKeys: [['audit_logs']],
  })
}

export function useDeleteAuditLog() {
  return useApiMutation<void, string>({
    url: (id) => '/v2/items/audit_logs/' + id,
    method: 'DELETE',
    successMessage: 'Audit log deleted',
    invalidateKeys: [['audit_logs']],
  })
}
