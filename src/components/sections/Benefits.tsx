import type { FC } from 'react'
import { BENEFITS } from '@/data'
import SectionLabel from '@/components/ui/SectionLabel'
import SectionTitle from '@/components/ui/SectionTitle'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const Benefits: FC = () => {
  const leftRef  = useScrollReveal<HTMLDivElement>()
  const rightRef = useScrollReveal<HTMLDivElement>()

  return (
    <div
      className="bg-bark grid grid-cols-1 md:grid-cols-2"
      aria-labelledby="benefits-title"
    >
      {/* Left — copy */}
      <div
        ref={leftRef}
        className="reveal flex flex-col justify-center section-p"
      >
        <SectionLabel light>Why Luminae</SectionLabel>
        <SectionTitle id="benefits-title" className="text-cream">
          The purest<br />
          stones, the<br />
          <em className="italic text-gold-light">purest intent</em>
        </SectionTitle>
        <p className="font-body font-extralight text-[0.83rem] leading-[1.9] text-cream/55 mt-5 max-w-[380px] md:max-w-none">
          Every crystal in our collection is traceable to its source. We work directly with ethical miners across India, Brazil, Madagascar, and Morocco — ensuring fair trade practices and genuine stones every time.
        </p>
      </div>

      {/* Right — benefit grid */}
      <div
        ref={rightRef}
        className="reveal grid grid-cols-1 sm:grid-cols-2 border-t border-cream/[0.08] md:border-t-0 md:border-l md:border-cream/[0.08]"
      >
        {BENEFITS.map((b, i) => (
          <article
            key={b.id}
            className="
              p-8 border-cream/[0.08] transition-colors duration-300 hover:bg-cream/[0.04]
              border-b last:border-b-0
              sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:border-cream/[0.08]
              sm:[&:nth-last-child(-n+2)]:border-b-0
            "
          >
            <p className="text-[1.5rem] mb-3" aria-hidden="true">{b.icon}</p>
            <h3 className="font-display text-[1.1rem] font-normal text-cream mb-2">
              {b.title}
            </h3>
            <p className="font-body font-extralight text-[0.76rem] leading-[1.8] text-cream/50">
              {b.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Benefits
