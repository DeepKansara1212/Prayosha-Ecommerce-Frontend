import type { FC } from 'react'
import SectionLabel from '@/components/ui/SectionLabel'
import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const RitualBanner: FC = () => {
  const textRef = useScrollReveal<HTMLDivElement>()

  return (
    <div
      id="ritual"
      className="bg-deep flex flex-col md:flex-row min-h-[420px]"
      aria-labelledby="ritual-title"
    >
      {/* Text side */}
      <div
        ref={textRef}
        className="reveal flex-1 flex flex-col justify-center section-p"
      >
        <SectionLabel light>The Luminae Way</SectionLabel>
        <SectionTitle id="ritual-title" className="text-cream">
          Crystal care &amp;<br />
          <em className="italic text-rose">ritual guides</em>
        </SectionTitle>
        <p className="font-body font-extralight text-[0.83rem] leading-[1.9] text-cream/55 max-w-[400px] mt-5 mb-8">
          Crystals are living tools. Our ritual guides teach you how to cleanse, charge, programme and work with your stones — so their energy can truly serve your intentions.
        </p>
        <Button href="#">Download Free Guide</Button>
      </div>

      {/* Visual side — hidden on mobile */}
      <div
        className="hidden md:flex w-[40%] items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2A1A2E 0%, #1C100E 100%)' }}
        aria-hidden="true"
      >
        <span
          className="text-[clamp(6rem,12vw,12rem)] opacity-15 animate-spin-slow"
          style={{ display: 'inline-block' }}
        >
          ✦
        </span>
      </div>
    </div>
  )
}

export default RitualBanner
