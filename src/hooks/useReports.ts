import { useApiQuery } from '@/hooks/useApi'
import { extractList, extractCount } from '@/lib/apiUtils'
import type { GeneratedReport, Customer, Transaction, Account } from '@/types'

export function useReports() {
  return useApiQuery<unknown>(['reports'], '/v2/items/reports')
}

export function useCustomersReport() {
  return useApiQuery<unknown>(['customers-report'], '/v2/items/customers')
}

export function useTransactionsReport() {
  return useApiQuery<unknown>(['transactions-report'], '/v2/items/transactions')
}

export function useAccountsReport() {
  return useApiQuery<unknown>(['accounts-report'], '/v2/items/accounts')
}

export function extractReports(data: unknown): GeneratedReport[] {
  return extractList<GeneratedReport>(data)
}

export function extractReportsCount(data: unknown): number {
  return extractCount(data)
}
