import { useRef, type FC } from 'react'
import { CRYSTAL_CARDS } from '@/data'
import SectionLabel from '@/components/ui/SectionLabel'
import SectionTitle from '@/components/ui/SectionTitle'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'
import type { CrystalCard } from '@/types'

interface CrystalCardProps {
  card: CrystalCard
}

const CrystalCardItem: FC<CrystalCardProps> = ({ card }) => {
  const isLarge = card.large === true

  return (
    <article
      className={cn(
        'crystal-card relative overflow-hidden cursor-pointer group',
        isLarge && 'sm:row-span-2',
      )}
      aria-label={card.name}
    >
      {/* Gem background */}
      <div
        className={cn(
          card.gemClass,
          'w-full flex items-center justify-center transition-transform duration-[600ms] group-hover:scale-105',
          isLarge
            ? 'aspect-[3/4] text-[clamp(4rem,8vw,8rem)]'
            : 'aspect-square text-[clamp(3rem,6vw,5rem)]',
        )}
        aria-hidden="true"
      >
        {card.emoji}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 card-overlay group-hover:card-overlay-hover transition-all duration-400">
        <p className="font-body text-tag uppercase tracking-[0.22em] text-gold-light mb-1">
          {card.tag}
        </p>
        <h3
          className={cn(
            'font-display font-light text-cream mb-1',
            isLarge
              ? 'text-[clamp(1.4rem,3vw,2.2rem)]'
              : 'text-[clamp(1.1rem,2.5vw,1.5rem)]',
          )}
        >
          {card.name}
        </h3>
        <p className="font-body text-[0.78rem] text-cream/70">{card.price}</p>
      </div>

      {/* Add button — appears on hover */}
      <button
        className="absolute top-3 right-3 w-8 h-8 bg-gold text-deep flex items-center justify-center text-lg opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 font-light leading-none"
        aria-label={`Add ${card.name} to cart`}
      >
        +
      </button>
    </article>
  )
}

const Collections: FC = () => {
  const headerRef = useScrollReveal<HTMLDivElement>()
  const gridRef   = useScrollReveal<HTMLDivElement>()

  return (
    <section
      id="collections"
      className="section-p bg-cream"
      aria-labelledby="collections-title"
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="reveal flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8"
      >
        <div>
          <SectionLabel>Our Collections</SectionLabel>
          <SectionTitle id="collections-title" className="text-deep">
            Gems of the<br />
            <em className="italic text-amethyst">Ancient Earth</em>
          </SectionTitle>
        </div>
        <p className="font-body text-[0.78rem] text-muted leading-relaxed max-w-[220px] sm:text-right">
          Each crystal is hand-selected for clarity, energy, and beauty — arriving cleansed and ready for your ritual.
        </p>
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        className="reveal grid gap-4
          grid-cols-1
          xs:grid-cols-2
          sm:grid-cols-2
          md:grid-cols-[2fr_1fr_1fr]
          md:[grid-template-rows:auto_auto]
        "
      >
        {CRYSTAL_CARDS.map(card => (
          <CrystalCardItem key={card.id} card={card} />
        ))}
      </div>
    </section>
  )
}

export default Collections
