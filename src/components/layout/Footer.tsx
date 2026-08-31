import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaYoutube, FaPinterestP } from 'react-icons/fa'
import { FOOTER_COLUMNS } from '@/data'

const SOCIALS = [
  { label: 'Facebook', Icon: FaFacebookF, href: 'https://www.facebook.com/prayoshacrystals' },
  { label: 'Instagram', Icon: FaInstagram, href: 'https://www.instagram.com/prayoshacrystals/' },
  { label: 'YouTube', Icon: FaYoutube, href: 'https://www.youtube.com/@PRAYOSHACRYSTALS' },
  { label: 'Pinterest', Icon: FaPinterestP, href: 'https://www.pinterest.com/prayoshacrystals/' },
] as const

const Footer: FC = () => (
  <footer aria-label="Site footer">
    <div className="bg-deep section-p grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10">
      {/* Brand */}
      <div>
        <Link
          to="/"
          className="inline-block mb-4 no-underline opacity-100 hover:opacity-80 transition-opacity duration-200"
        >
          <img src="/prayosha-logo.png" alt="Prayosha Crystals" className="h-11 w-auto object-contain" />
        </Link>
        <p className="font-body font-extralight text-[0.76rem] leading-relaxed text-cream/40 max-w-[240px] mb-5">
          Sacred stones for conscious living. Ethically sourced crystals and healing gems from around the world.
        </p>
        <div className="flex flex-col gap-1.5 mb-5">
          <a
            href="mailto:prayoshacrytals@gmail.com"
            className="font-body font-extralight text-[0.78rem] text-cream/45 no-underline transition-colors duration-300 hover:text-cream"
          >
            prayoshacrytals@gmail.com
          </a>
          <a
            href="tel:+919429415057"
            className="font-body font-extralight text-[0.78rem] text-cream/45 no-underline transition-colors duration-300 hover:text-cream"
          >
            +91 94294 15057
          </a>
          <p className="font-body font-extralight text-[0.78rem] leading-relaxed text-cream/45 max-w-[240px]">
            SHOP NO.7, OPPO. BAPS SWAMINARAYAN TEMPLE, Khambhat, 388620
          </p>
        </div>
        <div className="flex gap-3">
          {SOCIALS.map(({ label, Icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow us on ${label}`}
              className="w-[44px] h-[44px] border border-cream/15 flex items-center justify-center text-cream/50 no-underline transition-[border-color,color] duration-300 hover:border-gold hover:text-gold"
            >
              <Icon size={16} />
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
                <Link
                  to={link.href}
                  className="font-body font-extralight text-[0.78rem] text-cream/45 no-underline transition-colors duration-300 hover:text-cream"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Bottom bar */}
    <div className="bg-deep border-t border-cream/[0.06] px-[clamp(1.25rem,5vw,4rem)] py-5 flex flex-col sm:flex-row justify-between items-center gap-2 flex-wrap">
      <p className="font-body text-[0.68rem] tracking-[0.04em] text-cream/25">
        © {new Date().getFullYear()} Prayosha Crystal. All rights reserved.
      </p>
      <p className="font-body text-[0.68rem] text-cream/25">Made with love &amp; moonlight ✦</p>
    </div>
  </footer>
)

export default Footer
