import { useMemo, useState, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SectionLabel from '@/components/ui/SectionLabel'
import SectionTitle from '@/components/ui/SectionTitle'
import ProductGrid from '@/components/collection/ProductGrid'
import EmptyState from '@/components/ui/EmptyState'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { toast } from '@/store/toastStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { adapt } from '@/hooks/useProducts'
import { submitBraceletCalculator, type CalculatorResult, type SelectedLocation } from '@/api/calculators.api'
import { FormField, LocationSearchField, DOB_PATTERN, TOB_PATTERN, MOBILE_PATTERN } from './_CalculatorShared'

// ─── Schema (mirrors Backend src/validations/calculator.validation.ts) ────────
// birthLocation is managed as separate component state below — it's a picked
// object, not a native input, so it's validated manually rather than via RHF.

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  dob: z.string().regex(DOB_PATTERN, 'Enter your date of birth'),
  tob: z.string().regex(TOB_PATTERN, 'Enter a valid time').optional().or(z.literal('')),
  mobile: z.string().regex(MOBILE_PATTERN, 'Enter a valid mobile number'),
})

type FormValues = z.infer<typeof schema>

// ─── Page ─────────────────────────────────────────────────────────────────────

const BraceletCalculatorPage: FC = () => {
  const navigate = useNavigate()
  const wishlistProductIds = useWishlistStore(s => s.productIds)
  const wishlistIds = useMemo(() => new Set(wishlistProductIds), [wishlistProductIds])
  const toggleWishlist = useWishlistStore(s => s.toggle)

  const [birthLocation, setBirthLocation] = useState<SelectedLocation | null>(null)
  const [locationError, setLocationError] = useState<string | undefined>(undefined)

  const {
    register, handleSubmit, setError, formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', dob: '', tob: '', mobile: '' },
  })

  const mutation = useMutation<CalculatorResult, Error, FormValues & { birthLocation: SelectedLocation }>({
    mutationFn: payload => submitBraceletCalculator({ ...payload, tob: payload.tob || undefined }),
    onSuccess: result => {
      if (result.requiresBirthTime) {
        toast.info('Birth time is required for an accurate recommendation.')
      }
    },
    onError: () => toast.error('Something went wrong. Please try again.'),
  })

  const onSubmit = (data: FormValues) => {
    if (!birthLocation) {
      setLocationError('Please select your place of birth')
      return
    }
    setLocationError(undefined)

    if (mutation.data?.requiresBirthTime && !data.tob) {
      setError('tob', { message: 'Time of birth is required to continue' })
      return
    }
    mutation.mutate({ ...data, birthLocation })
  }

  const needsBirthTime = mutation.data?.requiresBirthTime === true
  const products = mutation.data?.recommendedProducts?.map(adapt) ?? null

  const handleWishlist = (id: string) => {
    void toggleWishlist(id)
    toast.info(wishlistIds.has(id) ? 'Removed from wishlist' : 'Saved to wishlist')
  }

  return (
    <>
      <Navbar />
      <main id="main-content">
        <div style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,5vw,4rem) clamp(2rem,4vw,3rem)' }} className="max-w-3xl mx-auto text-center">
          <SectionLabel className="justify-center">Bracelet Calculator</SectionLabel>
          <SectionTitle as="h1" className="text-bark">
            Find your <em className="italic text-amethyst">perfect bracelet</em>
          </SectionTitle>
          <p className="font-body font-extralight text-[0.9rem] text-muted max-w-lg mx-auto mt-4 leading-relaxed">
            Share your birth details and we'll recommend crystal bracelets aligned to you — no astrology
            report, just a curated pick from our collection.
          </p>
        </div>

        <div className="max-w-xl mx-auto" style={{ padding: '0 clamp(1.25rem,5vw,4rem) clamp(3rem,6vw,5rem)' }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            <FormField label="Full Name" placeholder="Your full name" autoComplete="name" error={errors.name?.message} {...register('name')} />
            <FormField label="Date of Birth" type="date" error={errors.dob?.message} {...register('dob')} />
            <LocationSearchField label="Place of Birth" value={birthLocation} onChange={setBirthLocation} error={locationError} />
            <FormField label="Mobile Number" type="tel" placeholder="10-digit mobile number" autoComplete="tel" error={errors.mobile?.message} {...register('mobile')} />

            {needsBirthTime && (
              <div>
                <p className="font-body text-[0.78rem] text-amethyst mb-3">
                  Birth time is required for an accurate recommendation.
                </p>
                <FormField label="Time of Birth" type="time" error={errors.tob?.message} {...register('tob')} />
              </div>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="mt-2 font-body text-[0.72rem] uppercase tracking-[0.2em] bg-deep text-cream px-8 py-4 hover:bg-gold hover:text-deep transition-colors duration-200 disabled:opacity-60"
            >
              {mutation.isPending ? 'Calculating…' : needsBirthTime ? 'Get My Recommendation' : 'Find My Bracelet'}
            </button>
          </form>
        </div>

        {(mutation.isPending || products) && (
          <div className="border-t border-warm" style={{ padding: 'clamp(2.5rem,5vw,4rem) clamp(1.25rem,5vw,4rem)' }}>
            {mutation.isPending ? (
              <div className="grid gap-5 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products && products.length === 0 ? (
              <EmptyState
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" /></svg>}
                title="No bracelets mapped yet"
                description="We're still curating recommendations for your profile — check back soon."
              />
            ) : products ? (
              <ProductGrid
                products={products}
                onSelect={p => navigate(`/product/${p.id}`)}
                wishlist={wishlistIds}
                onWishlist={handleWishlist}
              />
            ) : null}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

export default BraceletCalculatorPage
