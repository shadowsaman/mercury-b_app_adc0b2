import React from 'react';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from '@/components/shared/AppProviders';
import { Layout } from '@/components/layout/Layout';

// Lazy-loaded feature pages
const DashboardPage = React.lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const CustomersPage = React.lazy(() =>
  import('@/pages/CustomersPage').then((m) => ({ default: m.CustomersPage }))
);
const AccountsPage = React.lazy(() =>
  import('@/pages/AccountsPage').then((m) => ({ default: m.AccountsPage }))
);
const TransactionsPage = React.lazy(() =>
  import('@/pages/TransactionsPage').then((m) => ({ default: m.TransactionsPage }))
);
const DepositsPage = React.lazy(() =>
  import('@/pages/DepositsPage').then((m) => ({ default: m.DepositsPage }))
);
const CardsPage = React.lazy(() =>
  import('@/pages/CardsPage').then((m) => ({ default: m.CardsPage }))
);
const KycVerificationsPage = React.lazy(() =>
  import('@/pages/KycVerificationsPage').then((m) => ({ default: m.KycVerificationsPage }))
);
const AuditLogsPage = React.lazy(() =>
  import('@/pages/AuditLogsPage').then((m) => ({ default: m.AuditLogsPage }))
);
const PaymentGatewaysPage = React.lazy(() =>
  import('@/pages/PaymentGatewaysPage').then((m) => ({ default: m.PaymentGatewaysPage }))
);
const ApiIntegrationsPage = React.lazy(() =>
  import('@/pages/ApiIntegrationsPage').then((m) => ({ default: m.ApiIntegrationsPage }))
);
const ReportsPage = React.lazy(() =>
  import('@/pages/ReportsPage').then((m) => ({ default: m.ReportsPage }))
);

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--color-deep-space)' }}>
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--color-mercury-blue)', borderTopColor: 'transparent' }}
        />
        <p className="text-sm" style={{ color: 'var(--color-silver)' }}>Loading module...</p>
      </div>
    </div>
  );
}

export function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <React.Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="accounts" element={<AccountsPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="deposits" element={<DepositsPage />} />
              <Route path="cards" element={<CardsPage />} />
              <Route path="kyc-verifications" element={<KycVerificationsPage />} />
              <Route path="audit-logs" element={<AuditLogsPage />} />
              <Route path="payment-gateways" element={<PaymentGatewaysPage />} />
              <Route path="api-integrations" element={<ApiIntegrationsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
