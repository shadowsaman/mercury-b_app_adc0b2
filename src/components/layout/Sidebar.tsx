import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types/common';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ArrowUpDown,
  CreditCard,
  FileText,
  ShieldCheck,
  ClipboardList,
  Zap,
  Network,
  BarChart3,
  ChevronDown,
  Building2,
} from 'lucide-react';

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'MAIN',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Customers', href: '/customers', icon: Users },
      { label: 'Accounts', href: '/accounts', icon: Briefcase },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { label: 'Transactions', href: '/transactions', icon: ArrowUpDown },
      { label: 'Deposits', href: '/deposits', icon: Building2 },
      { label: 'Cards', href: '/cards', icon: CreditCard },
    ],
  },
  {
    label: 'COMPLIANCE',
    items: [
      { label: 'KYC / AML', href: '/kyc-verifications', icon: ShieldCheck },
      { label: 'Audit Logs', href: '/audit-logs', icon: ClipboardList },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { label: 'Payment Gateways', href: '/payment-gateways', icon: Zap },
      { label: 'API Integrations', href: '/api-integrations', icon: Network },
      { label: 'Reports', href: '/reports', icon: BarChart3 },
    ],
  },
];

interface SidebarProps {
  onNavClick?: () => void;
}

export function Sidebar({ onNavClick }: SidebarProps) {
  const location = useLocation();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  function toggleGroup(label: string) {
    setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  function isActive(href: string) {
    return location.pathname.startsWith(href);
  }

  return (
    <aside
      className="flex flex-col h-full w-[260px] flex-shrink-0 select-none"
      style={{ backgroundColor: 'var(--color-deep-space)' }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-6 h-16 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(112,112,125,0.2)' }}
      >
        <div
          className="flex items-center justify-center w-8 h-8 rounded-sm flex-shrink-0"
          style={{ backgroundColor: '#eab308' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 13L5.5 6L8 10L10.5 6L14 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="8" cy="3.5" r="1.5" fill="white" />
          </svg>
        </div>
        <div>
          <span
            className="block text-base font-light tracking-wide"
            style={{ color: 'var(--color-starlight)', fontFamily: 'var(--font-arcadiadisplay)', fontWeight: 300 }}
          >
            Mercury
          </span>
          <span
            className="block text-[10px] uppercase tracking-widest"
            style={{ color: 'var(--color-lead)', letterSpacing: '0.12em' }}
          >
            Bank Admin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => {
          const isCollapsed = collapsedGroups[group.label];
          return (
            <div key={group.label} className="mb-5">
              <button
                className="flex items-center justify-between w-full px-3 mb-1 group"
                onClick={() => toggleGroup(group.label)}
              >
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: 'rgba(112,112,125,0.7)', letterSpacing: '0.12em' }}
                >
                  {group.label}
                </span>
                <ChevronDown
                  className={cn(
                    'h-3 w-3 transition-transform duration-200 opacity-0 group-hover:opacity-60',
                    isCollapsed ? '-rotate-90' : ''
                  )}
                  style={{ color: 'var(--color-lead)' }}
                />
              </button>

              {!isCollapsed && (
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon as React.ComponentType<{ className?: string }> | undefined;
                    return (
                      <li key={item.href}>
                        <NavLink
                          to={item.href}
                          onClick={onNavClick}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-150 relative group/item',
                            active
                              ? 'nav-active font-medium'
                              : 'hover:bg-[rgba(82,102,235,0.06)]'
                          )}
                          style={{
                            color: active ? 'var(--color-mercury-blue)' : 'var(--color-starlight)',
                            fontWeight: active ? 500 : 400,
                          }}
                        >
                          {active && (
                            <span
                              className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r"
                              style={{ backgroundColor: 'var(--color-mercury-blue)' }}
                            />
                          )}
                          {Icon && (
                            <Icon
                              className={cn('h-4 w-4 flex-shrink-0 transition-colors duration-150')}
                            />
                          )}
                          <span className="truncate text-[13.5px]">{item.label}</span>
                          {item.badge && (
                            <span
                              className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                              style={{
                                backgroundColor: 'rgba(82,102,235,0.2)',
                                color: 'var(--color-mercury-blue)',
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Card */}
      <div
        className="px-3 py-4 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(112,112,125,0.15)' }}
      >
        <div
          className="flex items-center gap-3 px-3 py-3 rounded-sm cursor-pointer transition-colors duration-150"
          style={{ backgroundColor: 'var(--color-graphite)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
            style={{ backgroundColor: 'var(--color-mercury-blue)', color: 'var(--color-pure-white)' }}
          >
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium truncate" style={{ color: 'var(--color-starlight)' }}>
              Admin User
            </p>
            <p className="text-[11px] truncate" style={{ color: 'var(--color-silver)' }}>
              System Administrator
            </p>
          </div>
          <div
            className="w-2 h-2 rounded-full flex-shrink-0 status-pulse"
            style={{ backgroundColor: '#22c55e' }}
          />
        </div>
      </div>
    </aside>
  );
}
