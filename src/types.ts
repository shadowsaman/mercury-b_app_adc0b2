// ============================================================
// MERCURY BANKING ADMIN — ENTITY INTERFACES
// Single source of truth for all entity types.
// Import entity types from '@/types' across all feature files.
// ============================================================

// ─── Utility / Shared ───────────────────────────────────────
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface FormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
}

// ─── Enum-like String Unions ─────────────────────────────────
export type KycStatus = 'Verified' | 'Pending' | 'Failed' | 'Under Review' | 'Not Started';
export type AmlRisk = 'Low' | 'Medium' | 'High' | 'Critical';
export type CustomerType = 'Individual' | 'Corporate' | 'SME' | 'VIP';
export type AccountType = 'Checking' | 'Savings' | 'Business' | 'Corporate' | 'Investment';
export type TransactionType = 'Wire' | 'ACH' | 'Card' | 'Internal' | 'International' | 'Deposit' | 'Withdrawal';
export type TransactionStatus = 'Completed' | 'Pending' | 'Failed' | 'Reversed' | 'Processing';
export type CardStatus = 'Active' | 'Blocked' | 'Expired' | 'Cancelled' | 'Pending Activation';
export type DepositStatus = 'Active' | 'Matured' | 'Frozen' | 'Closed' | 'Pending';
export type GatewayStatus = 'Online' | 'Degraded' | 'Offline' | 'Maintenance';
export type IntegrationStatus = 'Active' | 'Inactive' | 'Maintenance' | 'Error';
export type Severity = 'Critical' | 'Warning' | 'Info' | 'Debug';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type VerificationStatus = 'Submitted' | 'In Progress' | 'Under Review' | 'Approved' | 'Failed' | 'Expired';
export type ReportCategory = 'Financial Summary' | 'Transaction Report' | 'Customer Report' | 'Compliance Report' | 'Card Activity' | 'Deposit Maturity';

// ─── Users (Login Table) ─────────────────────────────────────
export interface User {
  guid: string;
  login?: string;
  email?: string;
  phone?: string;
  full_name?: string;
  avatar?: string;
  position?: string;
  department?: string;
  status?: string;
  last_login?: string;
  role_id?: string;
  client_type_id?: string;
  created_at?: string;
}

// ─── Customers ───────────────────────────────────────────────
export interface Customer {
  guid: string;
  full_name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  id_number?: string;
  id_type?: string;
  kyc_status?: string;
  aml_risk_score?: string;
  customer_type?: string;
  status?: string;
  onboarding_date?: string;
  photo?: string;
  created_at?: string;
}

// ─── Accounts ────────────────────────────────────────────────
export interface Account {
  guid: string;
  account_number?: string;
  account_type?: string;
  currency?: string;
  balance?: number;
  available_balance?: number;
  interest_rate?: number;
  status?: string;
  opened_date?: string;
  branch?: string;
  iban?: string;
  customers_id?: string;
  created_at?: string;
}

// ─── Transactions ────────────────────────────────────────────
export interface Transaction {
  guid: string;
  transaction_id?: string;
  type?: string;
  amount?: number;
  currency?: string;
  status?: string;
  description?: string;
  counterparty?: string;
  reference_number?: string;
  channel?: string;
  transaction_date?: string;
  fee?: number;
  accounts_id?: string;
  created_at?: string;
}

// ─── Deposits ────────────────────────────────────────────────
export interface Deposit {
  guid: string;
  deposit_id?: string;
  deposit_type?: string;
  principal_amount?: number;
  interest_rate?: number;
  term_months?: number;
  maturity_date?: string;
  start_date?: string;
  accrued_interest?: number;
  status?: string;
  auto_renew?: boolean;
  payout_method?: string;
  customers_id?: string;
  accounts_id?: string;
  created_at?: string;
}

// ─── Cards ───────────────────────────────────────────────────
export interface Card {
  guid: string;
  card_number_masked?: string;
  card_type?: string;
  card_brand?: string;
  credit_limit?: number;
  current_balance?: number;
  available_credit?: number;
  expiry_date?: string;
  status?: string;
  issued_date?: string;
  daily_limit?: number;
  contactless_enabled?: boolean;
  customers_id?: string;
  accounts_id?: string;
  created_at?: string;
}

// ─── Documents ───────────────────────────────────────────────
export interface Document {
  guid: string;
  document_name?: string;
  document_type?: string;
  file?: string;
  file_size?: string;
  status?: string;
  upload_date?: string;
  expiry_date?: string;
  verified_by?: string;
  notes?: string;
  customers_id?: string;
  created_at?: string;
}

// ─── Audit Logs ──────────────────────────────────────────────
export interface AuditLog {
  guid: string;
  action?: string;
  module?: string;
  entity_type?: string;
  entity_id?: string;
  performed_by?: string;
  ip_address?: string;
  details?: string;
  severity?: string;
  timestamp?: string;
  users_id?: string;
  created_at?: string;
}

// ─── KYC / AML Verifications ─────────────────────────────────
export interface KycVerification {
  guid: string;
  verification_id?: string;
  verification_type?: string;
  status?: string;
  risk_level?: string;
  submitted_date?: string;
  completed_date?: string;
  reviewed_by?: string;
  screening_results?: string;
  sanctions_check?: string;
  pep_check?: string;
  adverse_media?: string;
  customers_id?: string;
  created_at?: string;
}

// ─── Payment Gateways ────────────────────────────────────────
export interface PaymentGateway {
  guid: string;
  gateway_name?: string;
  provider?: string;
  gateway_type?: string;
  api_endpoint?: string;
  status?: string;
  supported_currencies?: string;
  transaction_fee_percent?: number;
  daily_volume_limit?: number;
  last_health_check?: string;
  uptime_percent?: number;
  created_at?: string;
}

// ─── API Integrations ────────────────────────────────────────
export interface ApiIntegration {
  guid: string;
  integration_name?: string;
  api_type?: string;
  base_url?: string;
  auth_method?: string;
  status?: string;
  rate_limit?: number;
  last_sync?: string;
  version?: string;
  description?: string;
  created_at?: string;
}

// ─── Dashboard / Analytics ───────────────────────────────────
export interface DashboardKpi {
  totalAssets: number;
  totalAssetsChange: number;
  activeAccounts: number;
  activeAccountsChange: number;
  todayVolume: number;
  todayTransactionCount: number;
  pendingKyc: number;
  pendingKycUrgency: 'low' | 'medium' | 'high';
}

export interface GatewayHealth {
  guid: string;
  name: string;
  provider: string;
  status: GatewayStatus;
  uptime: number;
  lastCheck: string;
}

// ─── Reports ─────────────────────────────────────────────────
export interface GeneratedReport {
  guid: string;
  report_name?: string;
  report_type?: string;
  date_range_start?: string;
  date_range_end?: string;
  generated_by?: string;
  generated_at?: string;
  file_size?: string;
  format?: 'PDF' | 'CSV' | 'Excel';
  download_url?: string;
  created_at?: string;
}
