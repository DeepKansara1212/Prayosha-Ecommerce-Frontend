import type { FC } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const NotFoundPage: FC = () => (
  <>
    <Navbar />
    <main id="main-content">
      <div
        className="relative overflow-hidden flex flex-col items-center justify-center text-center min-h-screen bg-hero-gradient"
        style={{
          paddingTop:    'clamp(6rem,14vw,10rem)',
          paddingBottom: 'clamp(4rem,8vw,6rem)',
          paddingLeft:   'clamp(1.25rem,5vw,4rem)',
          paddingRight:  'clamp(1.25rem,5vw,4rem)',
        }}
      >
        {/* Geometric line decoration */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
          viewBox="0 0 800 600"
          fill="none"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid slice"
        >
          <polygon
            points="400,40 740,190 740,410 400,560 60,410 60,190"
            stroke="#B8956A"
            strokeWidth="0.8"
            fill="none"
          />
          <circle cx="400" cy="300" r="155" stroke="#B8956A" strokeWidth="0.4" fill="none" opacity="0.5" />
          <circle cx="400" cy="300" r="82"  stroke="#B8956A" strokeWidth="0.3" fill="none" opacity="0.3" />
        </svg>

        {/* Ambient glow blobs */}
        <div
          className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: '#7C5C8A', opacity: 0.13, filter: 'blur(90px)' }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: '#B8956A', opacity: 0.1, filter: 'blur(70px)' }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">

          {/* Large 404 numeral */}
          <p
            className="font-display font-light leading-none select-none"
            style={{ fontSize: 'clamp(8rem,22vw,15rem)', color: '#C49A3C', opacity: 0.85 }}
            aria-hidden="true"
          >
            404
          </p>

          {/* Eyebrow rule */}
          <p className="inline-flex items-center gap-3 font-body text-[0.62rem] uppercase tracking-[0.35em] text-gold-light mb-5 -mt-2">
            <span className="w-7 h-px bg-gold-light" aria-hidden="true" />
            Not Found
            <span className="w-7 h-px bg-gold-light" aria-hidden="true" />
          </p>

          {/* Heading */}
          <h1
            className="font-display font-light text-cream leading-[1.05] mb-4"
            style={{ fontSize: 'clamp(2rem,6vw,3.5rem)' }}
          >
            Page not found
          </h1>

          {/* Subtext */}
          <p
            className="font-body font-extralight text-cream/55 max-w-xs leading-relaxed mb-10"
            style={{ fontSize: 'clamp(0.8rem,2vw,0.9rem)' }}
          >
            The crystal you're looking for may have found a new home.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <Link
              to="/collection"
              className="font-body text-[0.72rem] uppercase tracking-[0.22em] px-10 py-4 bg-gold text-cream hover:bg-gold-light transition-colors duration-200 text-center"
            >
              Browse Collection
            </Link>
            <Link
              to="/"
              className="font-body text-[0.72rem] uppercase tracking-[0.22em] px-10 py-4 border border-cream/30 text-cream hover:bg-cream/10 transition-colors duration-200 text-center"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </>
)

export default NotFoundPage
