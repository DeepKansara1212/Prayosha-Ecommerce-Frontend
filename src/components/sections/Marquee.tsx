import type { FC } from 'react'
import { MARQUEE_ITEMS } from '@/data'
import { prefersReducedMotion } from '@/lib/utils'

/** Duplicated items create the seamless infinite scroll illusion */
const ALL_ITEMS = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

const Marquee: FC = () => {
  if (prefersReducedMotion()) {
    return (
      <div className="bg-gold py-3" aria-label="Store highlights">
        <div className="flex flex-wrap justify-center">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="font-body text-[0.62rem] tracking-[0.28em] uppercase text-deep px-6">
                {item}
              </span>
              {i < MARQUEE_ITEMS.length - 1 && (
                <span className="text-bark/50 px-1 text-xs">◆</span>
              )}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gold overflow-hidden py-3" aria-label="Store highlights" aria-live="off">
      <div
        className="flex whitespace-nowrap animate-marquee"
        aria-hidden="true"
      >
        {ALL_ITEMS.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="font-body text-[0.62rem] tracking-[0.28em] uppercase text-deep px-6">
              {item}
            </span>
            <span className="text-bark/50 px-1 text-xs">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default Marquee
