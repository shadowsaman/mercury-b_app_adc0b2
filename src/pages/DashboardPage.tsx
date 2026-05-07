import React from 'react'
import { useDashboard } from '@/hooks/useDashboard'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { TransactionVolumeChart } from '@/components/dashboard/TransactionVolumeChart'
import { RecentAlertsPanel } from '@/components/dashboard/RecentAlertsPanel'
import { AccountDistributionChart } from '@/components/dashboard/AccountDistributionChart'
import { TopCustomersChart } from '@/components/dashboard/TopCustomersChart'
import { GatewayHealthStatus } from '@/components/dashboard/GatewayHealthStatus'
import { formatCurrency, formatNumber } from '@/lib/utils'
import {
  DollarSign,
  Briefcase,
  ArrowUpDown,
  ShieldCheck,
} from 'lucide-react'

export function DashboardPage() {
  const {
    isLoading,
    accountList,
    transactionList,
    auditLogList,
    customerList,
    gatewayList,
    kpis,
  } = useDashboard()

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1
          className="text-[32px] font-light leading-tight"
          style={{ color: 'var(--color-starlight)', fontFamily: 'var(--font-arcadiadisplay)' }}
        >
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-silver)' }}>
          Command center overview — real-time banking metrics
        </p>
      </div>

      {/* Hero banner image */}
      <div
        className="relative w-full h-32 overflow-hidden rounded-sm"
        style={{ backgroundColor: 'var(--color-graphite)' }}
      >
        <img
          src="https://images.unsplash.com/photo-1756936724444-ecf9f7236c10?ixid=M3w5Mzk5NTF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmaW5hbmNpYWwlMjBkaXN0cmljdCUyMHNreWxpbmV8ZW58MXwwfHx8MTc3ODEzMTc5MHww&ixlib=rb-4.1.0&w=1600&h=900&fit=crop&auto=format&q=80"
          alt="Financial district skyline"
          loading="lazy"
          className="w-full h-full object-cover opacity-30"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.style.display = 'none'
            if (e.currentTarget.parentElement) {
              e.currentTarget.parentElement.style.background =
                'linear-gradient(135deg,hsl(var(--muted)),hsl(var(--accent)/0.2))'
            }
          }}
        />
        <div
          className="absolute inset-0 flex items-center px-8"
          style={{
            background:
              'linear-gradient(to right, rgba(23,23,33,0.9) 0%, rgba(23,23,33,0.4) 60%, transparent 100%)',
          }}
        >
          <div>
            <p
              className="text-xs uppercase tracking-widest mb-1"
              style={{ color: 'var(--color-mercury-blue)', letterSpacing: '0.15em' }}
            >
              Mercury Banking
            </p>
            <p className="text-lg font-light" style={{ color: 'var(--color-starlight)' }}>
              Welcome back, Administrator
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard
          title="Total Assets Under Management"
          value={isLoading ? '...' : formatCurrency(kpis.totalBalance, 'USD')}
          badge="+2.4%"
          badgeColor="blue"
          icon={<DollarSign className="h-5 w-5" />}
          isLoading={isLoading}
          subValue={`Across ${formatNumber(kpis.totalAccounts)} accounts`}
        />
        <KpiCard
          title="Active Accounts"
          value={isLoading ? '...' : formatNumber(kpis.activeAccounts)}
          badge="Live"
          badgeColor="green"
          icon={<Briefcase className="h-5 w-5" />}
          isLoading={isLoading}
          subValue={`of ${formatNumber(kpis.totalAccounts)} total`}
        />
        <KpiCard
          title="Today's Transaction Volume"
          value={isLoading ? '...' : formatCurrency(kpis.todayVolume, 'USD')}
          subValue={`${formatNumber(kpis.todayTxCount)} transactions`}
          icon={<ArrowUpDown className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <KpiCard
          title="Pending KYC Reviews"
          value={isLoading ? '...' : formatNumber(kpis.pendingKyc)}
          subValue="Requires attention"
          icon={<ShieldCheck className="h-5 w-5" />}
          isLoading={isLoading}
          urgencyDot={kpis.pendingKyc > 5 ? 'red' : kpis.pendingKyc > 0 ? 'amber' : undefined}
          badge={kpis.pendingKyc > 0 ? 'Action needed' : undefined}
          badgeColor={kpis.pendingKyc > 5 ? 'red' : 'amber'}
        />
      </div>

      {/* Mid Section: Transaction Chart + Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3" style={{ minHeight: 340 }}>
          <TransactionVolumeChart transactions={transactionList} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-2" style={{ minHeight: 340 }}>
          <RecentAlertsPanel logs={auditLogList} isLoading={isLoading} />
        </div>
      </div>

      {/* Bottom Section: Account Distribution + Top Customers + Gateway Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div style={{ minHeight: 320 }}>
          <AccountDistributionChart accounts={accountList} isLoading={isLoading} />
        </div>
        <div style={{ minHeight: 320 }}>
          <TopCustomersChart
            customers={customerList}
            accounts={accountList}
            isLoading={isLoading}
          />
        </div>
        <div style={{ minHeight: 320 }}>
          <GatewayHealthStatus gateways={gatewayList} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
