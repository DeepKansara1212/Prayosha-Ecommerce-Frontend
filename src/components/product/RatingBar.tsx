import type { FC } from 'react'

interface RatingBarProps {
  star: number
  count: number
  total: number
}

const RatingBar: FC<RatingBarProps> = ({ star, count, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: 11, color: '#6B6057', width: 8, flexShrink: 0 }}>
        {star}
      </span>
      <div style={{ flex: 1, height: 6, background: '#E2DAC8', borderRadius: 3, overflow: 'hidden' }}>
        <div
          style={{ height: '100%', width: `${pct}%`, background: '#C49A3C', borderRadius: 3, transition: 'width 0.4s ease' }}
        />
      </div>
      <span style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: 11, color: '#6B6057', width: 24, textAlign: 'right', flexShrink: 0 }}>
        {count}
      </span>
    </div>
  )
}

export default RatingBar
