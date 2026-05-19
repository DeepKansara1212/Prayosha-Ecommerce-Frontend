import type { FC } from 'react'
import { FOOTER_COLUMNS } from '@/data'

const SOCIALS = ['In', 'Ig', 'Yt', 'Pi'] as const

const Footer: FC = () => (
  <footer aria-label="Site footer">
    <div className="bg-deep section-p grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10">
      {/* Brand */}
      <div>
        <a
          href="#"
          className="font-display font-light text-[1.7rem] tracking-[0.15em] text-cream block mb-4 no-underline"
        >
          LUMINAE
        </a>
        <p className="font-body font-extralight text-[0.76rem] leading-relaxed text-cream/40 max-w-[240px] mb-5">
          Sacred stones for conscious living. Ethically sourced crystals and healing gems from around the world.
        </p>
        <div className="flex gap-3">
          {SOCIALS.map(s => (
            <a
              key={s}
              href="#"
              aria-label={`Follow on ${s}`}
              className="w-[30px] h-[30px] border border-cream/15 flex items-center justify-center text-cream/50 text-[0.72rem] no-underline transition-[border-color,color] duration-300 hover:border-gold hover:text-gold"
            >
              {s}
            </a>
          ))}
        </div>
      </div>

      {/* Link columns */}
      {FOOTER_COLUMNS.map(col => (
        <div key={col.heading}>
          <h5 className="font-body text-label uppercase tracking-[0.3em] text-gold-light mb-4">
            {col.heading}
          </h5>
          <ul className="list-none space-y-[0.55rem]">
            {col.links.map(link => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="font-body font-extralight text-[0.78rem] text-cream/45 no-underline transition-colors duration-300 hover:text-cream"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Bottom bar */}
    <div className="bg-deep border-t border-cream/[0.06] px-[clamp(1.25rem,5vw,4rem)] py-5 flex flex-col sm:flex-row justify-between items-center gap-2 flex-wrap">
      <p className="font-body text-[0.68rem] tracking-[0.04em] text-cream/25">
        © {new Date().getFullYear()} Luminae Crystals. All rights reserved.
      </p>
      <p className="font-body text-[0.68rem] text-cream/25">Made with love &amp; moonlight ✦</p>
    </div>
  </footer>
)

export default Footer
