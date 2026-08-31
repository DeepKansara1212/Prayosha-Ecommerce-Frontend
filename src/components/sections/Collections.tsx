import { type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCategoryShowcase, type CategoryShowcase } from '@/hooks/useProducts'
import SectionLabel from '@/components/ui/SectionLabel'
import SectionTitle from '@/components/ui/SectionTitle'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'

interface CrystalCardProps {
  showcase: CategoryShowcase
  onNavigate: (slug: string) => void
}

const CrystalCardItem: FC<CrystalCardProps> = ({ showcase, onNavigate }) => {
  const hasImage = !!showcase.image

  return (
    <article
      className="crystal-card relative overflow-hidden cursor-pointer group"
      aria-label={showcase.name}
      onClick={() => onNavigate(showcase.slug)}
    >
      {/* Gem background / image */}
      <div
        className={cn(
          !hasImage && showcase.bgClass,
          'w-full aspect-square flex items-center justify-center overflow-hidden text-[clamp(3rem,6vw,5rem)]',
          'transition-transform duration-[600ms] group-hover:scale-105',
        )}
        aria-hidden="true"
      >
        {hasImage
          ? <img src={showcase.image} alt="" className="w-full h-full object-cover" />
          : showcase.emoji
        }
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 card-overlay group-hover:card-overlay-hover transition-all duration-400">
        <p className="font-body text-tag uppercase tracking-[0.22em] text-gold-light mb-1">
          {showcase.count} {showcase.count === 1 ? 'piece' : 'pieces'}
        </p>
        <h3 className="font-display font-light text-cream mb-1 text-[clamp(1.1rem,2.5vw,1.5rem)]">
          {showcase.name}
        </h3>
        <p className="font-body text-[0.78rem] text-cream/70">Shop the collection</p>
      </div>

      {/* Arrow — appears on hover */}
      <button
        onClick={e => { e.stopPropagation(); onNavigate(showcase.slug) }}
        className="absolute top-3 right-3 w-8 h-8 bg-gold text-deep flex items-center justify-center text-lg opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 font-light leading-none"
        aria-label={`Shop ${showcase.name}`}
      >
        +
      </button>
    </article>
  )
}

const SkeletonCard: FC = () => (
  <div className="animate-pulse bg-warm">
    <div className="w-full aspect-square" />
  </div>
)

const Collections: FC = () => {
  const navigate  = useNavigate()
  const headerRef = useScrollReveal<HTMLDivElement>()
  const gridRef   = useScrollReveal<HTMLDivElement>()

  const { showcase, isLoading } = useCategoryShowcase()

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
          md:grid-cols-3
        "
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : showcase.map(item => (
              <CrystalCardItem
                key={item.slug}
                showcase={item}
                onNavigate={slug => navigate(`/collection?category=${encodeURIComponent(slug)}`)}
              />
            ))
        }
      </div>
    </section>
  )
}

export default Collections
