import type { FC } from 'react'
import { TESTIMONIALS } from '@/data'
import SectionLabel from '@/components/ui/SectionLabel'
import SectionTitle from '@/components/ui/SectionTitle'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import type { Testimonial } from '@/types'

const TestimonialCard: FC<{ item: Testimonial }> = ({ item }) => (
  <blockquote
    className="bg-warm p-7"
    aria-label={`Review by ${item.author}`}
  >
    <p className="font-display text-[2.8rem] text-gold leading-[0.5] mb-4" aria-hidden="true">&ldquo;</p>
    <p className="font-body text-[0.72rem] tracking-[0.1em] text-gold mb-3" aria-hidden="true">
      ★ ★ ★ ★ ★
    </p>
    <p className="font-display italic font-light text-[1rem] leading-[1.7] text-bark mb-5">
      {item.quote}
    </p>
    <footer className="font-body text-[0.7rem] tracking-[0.15em] uppercase text-muted">
      — {item.author}, {item.location}
    </footer>
  </blockquote>
)

const Testimonials: FC = () => {
  const headRef = useScrollReveal<HTMLDivElement>()
  const gridRef = useScrollReveal<HTMLDivElement>()

  return (
    <section
      className="section-p bg-cream"
      aria-labelledby="testimonials-title"
    >
      <div ref={headRef} className="reveal">
        <SectionLabel>What They Say</SectionLabel>
        <SectionTitle id="testimonials-title" className="text-deep">
          Love from our<br />
          <em className="italic text-amethyst">community</em>
        </SectionTitle>
      </div>

      <div
        ref={gridRef}
        className="reveal mt-10 grid gap-5
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
        "
      >
        {TESTIMONIALS.map(t => (
          <TestimonialCard key={t.id} item={t} />
        ))}
      </div>
    </section>
  )
}

export default Testimonials
