import React from 'react'
import { Wifi, CheckCircle2 } from 'lucide-react'
import type { Card } from '@/types'

interface CardVisualPreviewProps {
  cards: Card[]
}

interface CardDesign {
  gradient: string
  accentColor: string
  label: string
}

function getCardDesign(card: Card): CardDesign {
  const brand = (card.card_brand ?? '').toLowerCase()
  const type = (card.card_type ?? '').toLowerCase()

  if (type.includes('platinum') || type.includes('premium') || brand.includes('amex')) {
    return {
      gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      accentColor: '#c8992a',
      label: 'Premium',
    }
  }
  if (type.includes('corporate') || brand.includes('mastercard')) {
    return {
      gradient: 'linear-gradient(135deg, #0d0d1a 0%, #1a0533 50%, #2d1b69 100%)',
      accentColor: '#cdddff',
      label: 'Corporate',
    }
  }
  return {
    gradient: 'linear-gradient(135deg, #171721 0%, #1e1e2a 50%, #272755 100%)',
    accentColor: '#5266eb',
    label: 'Classic',
  }
}

function CardVisual({ card }: { card: Card }) {
  const design = getCardDesign(card)

  return (
    <div
      className="relative flex flex-col justify-between p-6 overflow-hidden"
      style={{
        background: design.gradient,
        border: `1px solid ${design.accentColor}30`,
        borderRadius: '12px',
        minHeight: '200px',
        width: '100%',
        maxWidth: '340px',
        boxShadow: `0 8px 32px ${design.accentColor}20`,
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10"
        style={{ background: design.accentColor }}
      />
      <div
        className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-5"
        style={{ background: design.accentColor }}
      />

      {/* Top row: Brand + Contactless */}
      <div className="relative flex items-center justify-between">
        <div className="flex flex-col">
          <span
            className="text-xs uppercase tracking-widest font-semibold"
            style={{ color: design.accentColor, opacity: 0.9 }}
          >
            {design.label}
          </span>
          <span
            className="text-[10px] uppercase tracking-widest mt-0.5"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            {card.card_brand ?? 'VISA'}
          </span>
        </div>
        {card.contactless_enabled && (
          <Wifi
            className="h-5 w-5"
            style={{ color: design.accentColor, opacity: 0.8 }}
          />
        )}
      </div>

      {/* Chip */}
      <div
        className="relative w-10 h-8 rounded-sm"
        style={{
          background: `linear-gradient(135deg, ${design.accentColor}60, ${design.accentColor}30)`,
          border: `1px solid ${design.accentColor}40`,
        }}
      />

      {/* Card Number */}
      <div className="relative">
        <p
          className="font-mono text-lg tracking-[0.25em] font-light"
          style={{ color: 'rgba(255,255,255,0.9)' }}
        >
          {card.card_number_masked ?? '**** **** **** ****'}
        </p>
      </div>

      {/* Bottom row */}
      <div className="relative flex items-end justify-between">
        <div className="flex flex-col gap-0.5">
          <span
            className="text-[9px] uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            Expires
          </span>
          <span
            className="text-sm font-light font-mono"
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            {card.expiry_date ?? '—'}
          </span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span
            className="text-[9px] uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            Status
          </span>
          <div className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full status-pulse"
              style={{
                backgroundColor:
                  card.status === 'Active' ? '#22c55e' : '#ef4444',
              }}
            />
            <span
              className="text-xs"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              {card.status ?? '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CardVisualPreview({ cards }: CardVisualPreviewProps) {
  const featured = cards.slice(0, 3)

  if (featured.length === 0) {
    return (
      <div
        className="flex flex-col gap-4 p-8 items-center justify-center"
        style={{
          backgroundColor: 'var(--color-midnight-slate)',
          border: '1px solid rgba(112,112,125,0.15)',
        }}
      >
        <div
          className="relative flex items-center justify-center p-6 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #171721 0%, #1e1e2a 50%, #272755 100%)',
            border: '1px solid rgba(82,102,235,0.2)',
            borderRadius: '12px',
            width: 340,
            height: 200,
          }}
        >
          <span style={{ color: 'var(--color-lead)' }}>No card data available</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="p-6"
      style={{
        backgroundColor: 'var(--color-midnight-slate)',
        border: '1px solid rgba(112,112,125,0.15)',
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2
            className="text-lg font-light"
            style={{ color: 'var(--color-starlight)' }}
          >
            Featured Cards
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-silver)' }}>
            Visual preview of active card designs
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1640545232493-9a9b5c88ede4?ixid=M3w5Mzk5NTF8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY3JlZGl0JTIwY2FyZCUyMGNsb3NldXB8ZW58MXwwfHx8MTc3ODE0Nzk5MHww&ixlib=rb-4.1.0&w=400&h=300&fit=crop&auto=format&q=80"
          alt="Premium credit card closeup"
          loading="lazy"
          className="w-24 h-16 object-cover opacity-40"
          style={{ borderRadius: '4px' }}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
      <div className="flex flex-wrap gap-5">
        {featured.map((card) => (
          <CardVisual key={card.guid} card={card} />
        ))}
      </div>
    </div>
  )
}
