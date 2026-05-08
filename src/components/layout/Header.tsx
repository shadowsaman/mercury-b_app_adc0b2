import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, ChevronRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggleButton } from '@/components/layout/ThemeToggleButton';

const routeLabels: Record<string, string[]> = {
  '/dashboard': ['Dashboard'],
  '/customers': ['Customers'],
  '/accounts': ['Accounts'],
  '/transactions': ['Operations', 'Transactions'],
  '/deposits': ['Operations', 'Deposits'],
  '/cards': ['Operations', 'Cards'],
  '/kyc-verifications': ['Compliance', 'KYC / AML'],
  '/audit-logs': ['Compliance', 'Audit Logs'],
  '/payment-gateways': ['System', 'Payment Gateways'],
  '/api-integrations': ['System', 'API Integrations'],
  '/reports': ['System', 'Reports'],
};

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [notifCount] = useState(3);

  const breadcrumbs =
    routeLabels[
      Object.keys(routeLabels).find((k) => location.pathname.startsWith(k)) ?? ''
    ] ?? ['Dashboard'];

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 flex-shrink-0"
      style={{
        backgroundColor: 'var(--color-midnight-slate)',
        borderBottom: '1px solid rgba(112,112,125,0.2)',
      }}
    >
      {/* Left: Mobile menu + Breadcrumbs */}
      <div className="flex items-center gap-4">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-sm transition-colors duration-150 hover:bg-[var(--color-graphite)]"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" style={{ color: 'var(--color-silver)' }} />
        </button>

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={crumb}>
                {i > 0 && (
                  <li>
                    <ChevronRight className="h-3.5 w-3.5" style={{ color: 'var(--color-lead)' }} />
                  </li>
                )}
                <li>
                  <span
                    className={cn(
                      'text-sm',
                      i === breadcrumbs.length - 1
                        ? 'font-medium'
                        : 'font-normal'
                    )}
                    style={{
                      color:
                        i === breadcrumbs.length - 1
                          ? 'var(--color-starlight)'
                          : 'var(--color-silver)',
                    }}
                  >
                    {crumb}
                  </span>
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>
      </div>

      {/* Right: Search + Theme Toggle + Notifications + User */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:flex items-center">
          <Search
            className="absolute left-3 h-4 w-4 pointer-events-none"
            style={{ color: 'var(--color-lead)' }}
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm outline-none transition-all duration-150 w-48 focus:w-64"
            style={{
              backgroundColor: 'var(--color-graphite)',
              color: 'var(--color-starlight)',
              border: '1px solid rgba(112,112,125,0.3)',
              borderRadius: '32px',
            }}
          />
        </div>

        {/* Theme Toggle */}
        <ThemeToggleButton />

        {/* Notifications */}
        <button
          className="relative flex items-center justify-center w-9 h-9 rounded-sm transition-colors duration-150"
          style={{ backgroundColor: 'transparent' }}
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" style={{ color: 'var(--color-silver)' }} />
          {notifCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full"
              style={{
                backgroundColor: 'var(--color-mercury-blue)',
                color: 'var(--color-pure-white)',
              }}
            >
              {notifCount}
            </span>
          )}
        </button>

        {/* User Avatar */}
        <button
          className="flex items-center gap-2 px-2 py-1.5 rounded-sm transition-colors duration-150"
          style={{
            backgroundColor: 'rgba(82,102,235,0.08)',
            border: '1px solid rgba(82,102,235,0.2)',
          }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold"
            style={{
              backgroundColor: 'var(--color-mercury-blue)',
              color: 'var(--color-pure-white)',
            }}
          >
            AD
          </div>
          <span
            className="text-[13px] font-medium hidden md:block"
            style={{ color: 'var(--color-starlight)' }}
          >
            Admin
          </span>
        </button>
      </div>
    </header>
  );
}
