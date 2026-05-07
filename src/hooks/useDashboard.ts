import { useApiQuery } from '@/hooks/useApi'
import { extractList, extractCount } from '@/lib/apiUtils'
import type { Account, Transaction, AuditLog, Customer, PaymentGateway, KycVerification } from '@/types'

export function useDashboard() {
  const accounts = useApiQuery<unknown>(['dashboard-accounts'], '/v2/items/accounts')
  const transactions = useApiQuery<unknown>(['dashboard-transactions'], '/v2/items/transactions')
  const auditLogs = useApiQuery<unknown>(['dashboard-audit-logs'], '/v2/items/audit_logs')
  const customers = useApiQuery<unknown>(['dashboard-customers'], '/v2/items/customers')
  const gateways = useApiQuery<unknown>(['dashboard-gateways'], '/v2/items/payment_gateways')
  const kycVerifications = useApiQuery<unknown>(['dashboard-kyc'], '/v2/items/kyc_verifications')

  const accountList = extractList<Account>(accounts.data)
  const transactionList = extractList<Transaction>(transactions.data)
  const auditLogList = extractList<AuditLog>(auditLogs.data)
  const customerList = extractList<Customer>(customers.data)
  const gatewayList = extractList<PaymentGateway>(gateways.data)
  const kycList = extractList<KycVerification>(kycVerifications.data)

  const totalBalance = accountList.reduce((sum, a) => sum + (a.balance ?? 0), 0)
  const activeAccounts = accountList.filter(a => (a.status ?? '').toLowerCase() === 'active').length
  const todayVolume = transactionList.reduce((sum, t) => sum + (t.amount ?? 0), 0)
  const todayTxCount = transactionList.length
  const pendingKyc = kycList.filter(k => (k.status ?? '').toLowerCase() === 'pending' || (k.status ?? '').toLowerCase() === 'submitted').length

  const isLoading =
    accounts.isLoading ||
    transactions.isLoading ||
    auditLogs.isLoading ||
    customers.isLoading ||
    gateways.isLoading ||
    kycVerifications.isLoading

  return {
    isLoading,
    accountList,
    transactionList,
    auditLogList,
    customerList,
    gatewayList,
    kycList,
    kpis: {
      totalBalance,
      activeAccounts,
      totalAccounts: accountList.length,
      todayVolume,
      todayTxCount,
      pendingKyc,
    },
  }
}
