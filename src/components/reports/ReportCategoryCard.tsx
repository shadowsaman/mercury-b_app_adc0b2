import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface ReportCategoryCardProps {
  title: string
  description: string
  icon: LucideIcon
  onGenerate: () => void
  onSchedule?: () => void
  accentColor?: string
  isSelected?: boolean
}

export function ReportCategoryCard({
  title,
  description,
  icon: Icon,
  onGenerate,
  onSchedule,
  accentColor = 'var(--color-mercury-blue)',
  isSelected = false,
}: ReportCategoryCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col gap-4 p-6 transition-all duration-150 cursor-pointer group',
        isSelected && 'ring-1 ring-[var(--color-mercury-blue)]'
      )}
      style={{
        backgroundColor: isSelected ? 'rgba(82, 102, 235, 0.08)' : 'var(--color-midnight-slate)',
        border: '1px solid rgba(112, 112, 125, 0.15)',
        borderRadius: '0px',
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />

      {/* Icon */}
      <div
        className="flex items-center justify-center w-12 h-12 flex-shrink-0"
        style={{
          backgroundColor: `${accentColor}20`,
          borderRadius: '8px',
        }}
      >
        <Icon className="h-6 w-6" style={{ color: accentColor }} />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3
          className="text-base font-medium mb-1"
          style={{ color: 'var(--color-starlight)' }}
        >
          {title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--color-silver)' }}
        >
          {description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto pt-2">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onGenerate() }}
          className="flex-1 py-2 text-sm font-medium transition-all duration-150"
          style={{
            borderRadius: '32px',
            backgroundColor: 'var(--color-mercury-blue)',
            color: 'var(--color-pure-white)',
          }}
        >
          Generate
        </button>
        {onSchedule && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSchedule() }}
            className="flex-1 py-2 text-sm font-medium transition-all duration-150"
            style={{
              borderRadius: '32px',
              backgroundColor: 'rgba(205, 221, 255, 0.12)',
              color: 'var(--color-starlight)',
            }}
          >
            Schedule
          </button>
        )}
      </div>
    </div>
  )
}
