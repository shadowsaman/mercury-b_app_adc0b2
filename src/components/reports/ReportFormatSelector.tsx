import React from 'react'
import { cn } from '@/lib/utils'
import { FileText, Download, File } from 'lucide-react'

export type ReportFormat = 'PDF' | 'CSV' | 'Excel'

interface ReportFormatSelectorProps {
  value: ReportFormat
  onChange: (format: ReportFormat) => void
}

const formats: { value: ReportFormat; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'PDF', label: 'PDF', icon: FileText },
  { value: 'CSV', label: 'CSV', icon: File },
  { value: 'Excel', label: 'Excel', icon: Download },
]

export function ReportFormatSelector({ value, onChange }: ReportFormatSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      {formats.map((fmt) => {
        const Icon = fmt.icon
        const isActive = value === fmt.value
        return (
          <button
            key={fmt.value}
            type="button"
            onClick={() => onChange(fmt.value)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-150',
              isActive
                ? 'text-white'
                : 'hover:opacity-90'
            )}
            style={{
              borderRadius: '32px',
              backgroundColor: isActive
                ? 'var(--color-mercury-blue)'
                : 'rgba(205, 221, 255, 0.12)',
              color: isActive ? 'var(--color-pure-white)' : 'var(--color-starlight)',
              border: isActive
                ? '1px solid var(--color-mercury-blue)'
                : '1px solid rgba(112, 112, 125, 0.3)',
            }}
          >
            <Icon className="h-3.5 w-3.5" />
            {fmt.label}
          </button>
        )
      })}
    </div>
  )
}
