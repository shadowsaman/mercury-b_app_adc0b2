import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: string
  subValue?: string
  badge?: string
  badgeColor?: 'blue' | 'green' | 'amber' | 'red'
  icon?: React.ReactNode
  isLoading?: boolean
  urgencyDot?: 'amber' | 'red' | 'green'
  className?: string
}

export function KpiCard({
  title,
  value,
  subValue,
  badge,
  badgeColor = 'blue',
  icon,
  isLoading,
  urgencyDot,
  className,
}: KpiCardProps) {
  const badgeColorMap: Record<string, string> = {
    blue: 'rgba(82,102,235,0.2)',
    green: 'rgba(34,197,94,0.2)',
    amber: 'rgba(245,158,11,0.2)',
    red: 'rgba(239,68,68,0.2)',
  }
  const badgeTextMap: Record<string, string> = {
    blue: '#5266eb',
    green: '#22c55e',
    amber: '#f59e0b',
    red: '#ef4444',
  }
  const dotColorMap: Record<string, string> = {
    amber: '#f59e0b',
    red: '#ef4444',
    green: '#22c55e',
  }

  return (
    <div
      className={cn('kpi-glow relative mercury-card p-6 flex flex-col gap-3 transition-colors duration-150', className)}
      style={{ backgroundColor: 'var(--color-midnight-slate)' }}
    >
      {/* Top row: icon + badge */}
      <div className="flex items-start justify-between">
        {icon && (
          <div
            className="flex items-center justify-center w-10 h-10 rounded-sm"
            style={{ backgroundColor: 'rgba(82,102,235,0.12)' }}
          >
            <span style={{ color: 'var(--color-mercury-blue)' }}>{icon}</span>
          </div>
        )}
        {badge && (
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full ml-auto"
            style={{
              backgroundColor: badgeColorMap[badgeColor],
              color: badgeTextMap[badgeColor],
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Value */}
      {isLoading ? (
        <div className="space-y-2">
          <div className="h-8 w-3/4 rounded skeleton-shimmer" />
          <div className="h-4 w-1/2 rounded skeleton-shimmer" />
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className="text-[32px] font-light count-animate leading-none"
              style={{ color: 'var(--color-starlight)', fontFamily: 'var(--font-arcadiadisplay)' }}
            >
              {value}
            </span>
            {urgencyDot && (
              <span
                className="w-2.5 h-2.5 rounded-full status-pulse flex-shrink-0"
                style={{ backgroundColor: dotColorMap[urgencyDot] }}
              />
            )}
          </div>
          {subValue && (
            <span className="text-sm" style={{ color: 'var(--color-silver)' }}>
              {subValue}
            </span>
          )}
        </div>
      )}

      {/* Title */}
      <span
        className="text-[13px] uppercase tracking-widest"
        style={{ color: 'var(--color-lead)', letterSpacing: '0.08em' }}
      >
        {title}
      </span>
    </div>
  )
}
