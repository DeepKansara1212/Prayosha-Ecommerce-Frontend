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
  <footer className="site-footer" aria-label="Site footer">
    <div className="footer-main">
      {/* Brand */}
      <div className="footer-brand">
        <Link
          to="/"
          className="footer-logo"
        >
          <img src="/prayosha-logo.png" alt="prayosha crystals" />
        </Link>
        <p className="footer-description">
          Sacred stones for conscious living. Ethically sourced crystals and healing gems from around the world.
        </p>
        <div className="footer-contact">
          <a
            href="mailto:prayoshacrytals@gmail.com"
            className="footer-contact-link"
          >
            prayoshacrytals@gmail.com
          </a>
          <a
            href="tel:+919429415057"
            className="footer-contact-link"
          >
            +91 94294 15057
          </a>
          <p className="footer-address">
            Shop-1, Prayosha Complex, Opp. BAPS Swaminarayan Temple, Pramukh Swami Marg, Near Chakdol Ground, Khambhat, 388620, Gujarat
          </p>
        </div>
        <div className="footer-socials">
          {SOCIALS.map(({ label, Icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow us on ${label}`}
              className="footer-social-link"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>

      {/* Link columns */}
      <div className="footer-link-groups">
        {FOOTER_COLUMNS.map(col => (
          <div key={col.heading} className={`footer-column${col.heading === 'Help' ? ' footer-column-help' : ''}`}>
            <h5>{col.heading}</h5>
            <ul className="footer-links">
              {col.links.map(link => (
                <li key={link.label}>
                  <Link to={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom bar */}
    <div className="footer-bottom">
      <p>
        © {new Date().getFullYear()} prayosha crystals. All rights reserved.
      </p>
      <p>Made with love &amp; moonlight ✦</p>
    </div>
  </footer>
)

export default Footer
