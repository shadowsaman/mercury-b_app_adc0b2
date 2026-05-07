import React from 'react'
import { CheckCircle2, Clock, XCircle, RotateCcw, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import type { Transaction } from '@/types'

interface TimelineStep {
  key: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
}

const STEPS: TimelineStep[] = [
  {
    key: 'initiated',
    label: 'Initiated',
    description: 'Transaction request submitted',
    icon: Clock,
    color: '#5266eb',
    bgColor: 'rgba(82,102,235,0.12)',
  },
  {
    key: 'processing',
    label: 'Processing',
    description: 'Under review and verification',
    icon: Loader2,
    color: '#f59e0b',
    bgColor: 'rgba(251,191,36,0.12)',
  },
  {
    key: 'completed',
    label: 'Completed',
    description: 'Transaction successfully settled',
    icon: CheckCircle2,
    color: '#22c55e',
    bgColor: 'rgba(34,197,94,0.12)',
  },
]

const FAILED_STEP: TimelineStep = {
  key: 'failed',
  label: 'Failed',
  description: 'Transaction could not be processed',
  icon: XCircle,
  color: '#ef4444',
  bgColor: 'rgba(239,68,68,0.12)',
}

const REVERSED_STEP: TimelineStep = {
  key: 'reversed',
  label: 'Reversed',
  description: 'Transaction has been reversed',
  icon: RotateCcw,
  color: '#a855f7',
  bgColor: 'rgba(168,85,247,0.12)',
}

interface TransactionStatusTimelineProps {
  transaction: Transaction
}

export function TransactionStatusTimeline({ transaction }: TransactionStatusTimelineProps) {
  const status = (transaction.status ?? '').toLowerCase()

  let steps: TimelineStep[]
  let activeIndex: number

  if (status === 'failed') {
    steps = [...STEPS.slice(0, 2), FAILED_STEP]
    activeIndex = 2
  } else if (status === 'reversed') {
    steps = [...STEPS, REVERSED_STEP]
    activeIndex = 3
  } else {
    steps = STEPS
    if (status === 'completed') activeIndex = 2
    else if (status === 'processing') activeIndex = 1
    else activeIndex = 0
  }

  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => {
        const isDone = i < activeIndex
        const isActive = i === activeIndex
        const Icon = step.icon

        return (
          <div key={step.key} className="flex gap-4">
            {/* Icon + connector line */}
            <div className="flex flex-col items-center">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: isActive || isDone ? step.bgColor : 'rgba(112,112,125,0.1)',
                  border: `1.5px solid ${
                    isActive || isDone ? step.color : 'rgba(112,112,125,0.2)'
                  }`,
                }}
              >
                <Icon
                  className={cn(
                    'h-4 w-4',
                    isActive && step.key === 'processing' && 'animate-spin'
                  )}
                  style={{ color: isActive || isDone ? step.color : '#70707d' }}
                />
              </div>
              {i < steps.length - 1 && (
                <div
                  className="w-0.5 flex-1 my-1"
                  style={{
                    backgroundColor: isDone ? step.color : 'rgba(112,112,125,0.2)',
                    minHeight: 20,
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-4 pt-1">
              <p
                className="text-sm font-semibold"
                style={{ color: isActive || isDone ? '#ededf3' : '#70707d' }}
              >
                {step.label}
              </p>
              <p className="text-xs" style={{ color: isActive ? '#c3c3cc' : '#70707d' }}>
                {isActive && step.key === 'completed'
                  ? formatDate(transaction.transaction_date)
                  : step.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
