import type { FC } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StatusEntry {
  status: string
  note?: string
  timestamp: string
}

interface StatusTimelineProps {
  statusHistory: StatusEntry[]
  currentStatus: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NORMAL_FLOW = ['placed', 'confirmed', 'processing', 'shipped', 'delivered']

const STATUS_LABELS: Record<string, string> = {
  placed:     'Placed',
  confirmed:  'Confirmed',
  processing: 'Processing',
  shipped:    'Shipped',
  delivered:  'Delivered',
  cancelled:  'Cancelled',
  refunded:   'Refunded',
}

const GOLD    = '#C49A3C'
const PURPLE  = '#7B5EA7'
const GREY    = '#9E9590'
const BORDER_INACTIVE = '#E2DAC8'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtTimestamp(iso: string): string {
  const d = new Date(iso)
  const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${date}, ${time}`
}

type StepState = 'completed' | 'current' | 'future'

interface Step {
  status: string
  entry: StatusEntry | undefined
  state: StepState
}

function buildSteps(statusHistory: StatusEntry[], currentStatus: string): Step[] {
  const historyMap = new Map(statusHistory.map(e => [e.status, e]))
  const isTerminal = currentStatus === 'cancelled' || currentStatus === 'refunded'

  const stepsOrder = isTerminal
    ? [...NORMAL_FLOW.filter(s => historyMap.has(s)), currentStatus]
    : NORMAL_FLOW

  return stepsOrder.map(status => ({
    status,
    entry: historyMap.get(status),
    state: status === currentStatus ? 'current'
         : historyMap.has(status)   ? 'completed'
         : 'future',
  }))
}

function stepColor(state: StepState): string {
  if (state === 'completed') return GOLD
  if (state === 'current')   return PURPLE
  return GREY
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  width: 16,
  height: 16,
}

const StatusIcon: FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'placed':
      return (
        <svg {...IconProps}>
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      )
    case 'confirmed':
      return (
        <svg {...IconProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
    case 'processing':
      return (
        <svg {...IconProps}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="M3.27 6.96 12 12.01l8.73-5.05" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      )
    case 'shipped':
      return (
        <svg {...IconProps}>
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <path d="M15 18H9" />
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
          <circle cx="17" cy="18" r="2" />
          <circle cx="7" cy="18" r="2" />
        </svg>
      )
    case 'delivered':
      return (
        <svg {...IconProps}>
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    case 'cancelled':
      return (
        <svg {...IconProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6M9 9l6 6" />
        </svg>
      )
    case 'refunded':
      return (
        <svg {...IconProps}>
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M8 16H3v5" />
        </svg>
      )
    default:
      return <svg {...IconProps}><circle cx="12" cy="12" r="4" /></svg>
  }
}

// ─── StatusTimeline ────────────────────────────────────────────────────────────

const StatusTimeline: FC<StatusTimelineProps> = ({ statusHistory, currentStatus }) => {
  const steps = buildSteps(statusHistory, currentStatus)

  return (
    <ol aria-label="Order status timeline" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {steps.map(({ status, entry, state }, idx) => {
        const isLast = idx === steps.length - 1
        const color = stepColor(state)
        // The connector line below this icon is gold if this step is done, grey otherwise
        const lineColor = state === 'future' ? BORDER_INACTIVE : GOLD

        return (
          <li key={status} style={{ display: 'flex', gap: 14 }}>
            {/* Left column: icon + connector */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 32 }}>
              {/* Icon circle */}
              <div
                aria-hidden="true"
                style={{
                  width: 32, height: 32,
                  borderRadius: '50%',
                  border: `2px solid ${state === 'future' ? BORDER_INACTIVE : color}`,
                  background: state === 'future' ? '#F7F3EE' : `${color}1A`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  color,
                  // subtle ring on current step
                  boxShadow: state === 'current' ? `0 0 0 3px ${PURPLE}22` : 'none',
                }}
              >
                <StatusIcon status={status} />
              </div>

              {/* Connector line to next step */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  style={{
                    width: 2,
                    flex: 1,
                    minHeight: 24,
                    background: lineColor,
                    margin: '2px 0',
                  }}
                />
              )}
            </div>

            {/* Right column: text content */}
            <div style={{ flex: 1, minWidth: 0, paddingBottom: isLast ? 0 : 20, paddingTop: 4 }}>
              {/* Status label */}
              <p style={{
                fontFamily: 'Jost',
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: state === 'current' ? 600 : 400,
                color: state === 'completed' ? '#3D2B1F'
                     : state === 'current'   ? PURPLE
                     : GREY,
                margin: 0,
                lineHeight: 1,
              }}>
                {STATUS_LABELS[status] ?? status}
              </p>

              {/* Timestamp */}
              {entry && (
                <p style={{ fontFamily: 'Jost', fontSize: 11, color: '#9A8F85', margin: '5px 0 0' }}>
                  {fmtTimestamp(entry.timestamp)}
                </p>
              )}

              {/* Future placeholder */}
              {!entry && state === 'future' && (
                <p style={{ fontFamily: 'Jost', fontSize: 11, color: BORDER_INACTIVE, margin: '5px 0 0' }}>
                  Pending
                </p>
              )}

              {/* Optional note */}
              {entry?.note && (
                <p style={{ fontFamily: 'Jost', fontSize: 11, color: '#6B6057', margin: '4px 0 0', lineHeight: 1.5 }}>
                  {entry.note}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default StatusTimeline

// ─── Loading skeleton ─────────────────────────────────────────────────────────

export const StatusTimelineSkeleton: FC = () => (
  <ol aria-hidden="true" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
    {[100, 72, 88, 64].map((labelWidth, idx) => {
      const isLast = idx === 3
      return (
        <li key={idx} style={{ display: 'flex', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 32 }}>
            <div className="skeleton-pulse" style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
            {!isLast && (
              <div className="skeleton-pulse" style={{ width: 2, flex: 1, minHeight: 24, margin: '2px 0' }} />
            )}
          </div>
          <div style={{ flex: 1, paddingBottom: isLast ? 0 : 20, paddingTop: 6 }}>
            <div className="skeleton-pulse" style={{ height: 10, borderRadius: 2, width: labelWidth }} />
            <div className="skeleton-pulse" style={{ height: 8, borderRadius: 2, width: 140, marginTop: 8 }} />
          </div>
        </li>
      )
    })}
  </ol>
)
