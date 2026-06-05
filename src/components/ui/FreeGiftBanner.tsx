import type { FC } from 'react'

const FreeGiftBanner: FC = () => (
  <>
    <style>{`
      @keyframes fg-fade-up {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .fg-banner { animation: fg-fade-up 0.5s ease both; }
    `}</style>

    <div
      className="fg-banner"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        padding: '20px 24px',
        background: 'linear-gradient(135deg, #FDF6E3 0%, #FAF0C8 100%)',
        border: '1px solid #C49A3C',
        borderRadius: 8,
      }}
    >
      <span style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>🎁</span>

      <div>
        <p style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontWeight: 400,
          fontSize: 'clamp(17px, 2.5vw, 20px)',
          color: '#1C1A17',
          margin: '0 0 5px',
          lineHeight: 1.3,
        }}>
          You will receive a free gift with this purchase!
        </p>
        <p style={{
          fontFamily: 'Jost, system-ui, sans-serif',
          fontSize: 13,
          color: '#6B6057',
          margin: 0,
          lineHeight: 1.5,
        }}>
          Your surprise gift will be included in your delivery package.
        </p>
      </div>
    </div>
  </>
)

export default FreeGiftBanner
