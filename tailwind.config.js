import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream:        '#F7F3EE',
        warm:         '#EDE5D8',
        gold:         '#B8956A',
        'gold-light': '#D4AE85',
        deep:         '#1C1410',
        bark:         '#3D2B1F',
        muted:        '#7A6657',
        amethyst:     '#7C5C8A',
        rose:         '#C9837A',
        aqua:         '#5B8FA0',
        sage:         '#6A8570',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['Jost', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'eyebrow': ['0.68rem', { letterSpacing: '0.3em',  lineHeight: '1' }],
        'label':   ['0.62rem', { letterSpacing: '0.3em',  lineHeight: '1' }],
        'tag':     ['0.58rem', { letterSpacing: '0.22em', lineHeight: '1' }],
        'price':   ['0.82rem', { letterSpacing: '0.02em', lineHeight: '1' }],
      },
      screens: {
        'xs': '380px',
        'sm': '600px',
        'md': '900px',
        'lg': '1100px',
        'xl': '1400px',
      },
      transitionDuration: {
        '400': '400ms',
      },
      animation: {
        'marquee':     'marquee 18s linear infinite',
        'fadeUp':      'fadeUp 1.2s ease forwards',
        'scrollPulse': 'scrollPulse 2s ease-in-out infinite',
        'spin-slow':   'spin 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scrollPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '1' },
        },
      },
      backgroundImage: {
        // Hero
        'hero-gradient':      'radial-gradient(ellipse at 60% 50%, #5B3A52 0%, #2A1A2E 40%, #1C100E 100%)',
        // Gem gradients — used by both pages
        'gem-amethyst':       'linear-gradient(135deg, #4A2D5E 0%, #7C5C8A 50%, #A87DB5 100%)',
        'gem-rose':           'linear-gradient(135deg, #8B3A32 0%, #C9837A 50%, #E5ADA8 100%)',
        'gem-aqua':           'linear-gradient(135deg, #1E4A58 0%, #5B8FA0 50%, #92C0CE 100%)',
        'gem-citrine':        'linear-gradient(135deg, #6B4A0E 0%, #D4921A 50%, #F0C766 100%)',
        'gem-sage':           'linear-gradient(135deg, #2A3D2F 0%, #6A8570 50%, #9EB59F 100%)',
        'gem-tourmaline':     'linear-gradient(135deg, #2D1A2E 0%, #6B4060 50%, #A87090 100%)',
        'gem-lapis':          'linear-gradient(135deg, #0A1A2E 0%, #1A3A5E 50%, #2A6090 100%)',
        'ritual-bg':          'linear-gradient(135deg, #2A1A2E 0%, #1C100E 100%)',
        // Card utilities
        'card-overlay':       'linear-gradient(to top, rgba(28,20,16,0.78) 0%, transparent 60%)',
        'card-overlay-hover': 'linear-gradient(to top, rgba(28,20,16,0.88) 0%, transparent 52%)',
        'scroll-line':        'linear-gradient(to bottom, rgba(184,149,106,0.8), transparent)',
      },
    },
  },
  plugins: [
    // pointer-fine variant for custom cursor
    plugin(({ addVariant }) => {
      addVariant('pointer-fine', '@media (pointer: fine)')
    }),
  ],
}

export default config
