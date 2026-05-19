import type { FC } from 'react'

const CollectionHero: FC = () => (
  <div
    className="relative overflow-hidden flex flex-col items-center justify-center text-center"
    style={{
      paddingTop: 'clamp(6rem,14vw,10rem)',
      paddingBottom: 'clamp(3.5rem,7vw,5.5rem)',
      paddingLeft: 'clamp(1.25rem,5vw,4rem)',
      paddingRight: 'clamp(1.25rem,5vw,4rem)',
      background: 'radial-gradient(ellipse at 50% 0%, #3D1E4A 0%, #2A1520 50%, #1C1410 100%)',
    }}
  >
    {/* Geometric accent */}
    <svg
      className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
      viewBox="0 0 800 400"
      fill="none"
      aria-hidden="true"
    >
      <polygon points="400,20 780,200 780,360 400,380 20,360 20,200" stroke="#B8956A" strokeWidth="0.8" fill="none" />
      <polygon points="400,60 740,220 740,330 400,345 60,330 60,220" stroke="#B8956A" strokeWidth="0.4" fill="none" opacity="0.6" />
      <circle cx="400" cy="200" r="120" stroke="#B8956A" strokeWidth="0.4" fill="none" opacity="0.4" />
      <circle cx="400" cy="200" r="200" stroke="#B8956A" strokeWidth="0.3" fill="none" opacity="0.25" />
      <line x1="400" y1="20" x2="400" y2="380" stroke="#B8956A" strokeWidth="0.3" opacity="0.3" />
      <line x1="20" y1="200" x2="780" y2="200" stroke="#B8956A" strokeWidth="0.3" opacity="0.3" />
    </svg>

    {/* Ambient orbs */}
    <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: '#7C5C8A', opacity: 0.15, filter: 'blur(80px)' }} aria-hidden="true" />
    <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full pointer-events-none" style={{ background: '#C9837A', opacity: 0.12, filter: 'blur(60px)' }} aria-hidden="true" />

    <div className="relative z-10 max-w-2xl mx-auto">
      <p className="inline-flex items-center gap-3 font-body text-[0.65rem] uppercase tracking-[0.35em] text-gold-light mb-5">
        <span className="w-8 h-px bg-gold-light" aria-hidden="true" />
        Luminae · Sacred Collection
        <span className="w-8 h-px bg-gold-light" aria-hidden="true" />
      </p>
      <h1 className="font-display font-light text-[clamp(2.5rem,7vw,5rem)] leading-[1.05] text-cream mb-5">
        Every stone tells<br />
        <em className="italic text-gold-light">its own story</em>
      </h1>
      <p className="font-body font-extralight text-[clamp(0.82rem,2vw,0.92rem)] leading-[1.9] text-cream/60 max-w-lg mx-auto">
        Ethically sourced from mines across India, Brazil, Madagascar, Finland, and Morocco. Each piece arrives moon-cleansed and certified authentic.
      </p>
    </div>
  </div>
)

export default CollectionHero
