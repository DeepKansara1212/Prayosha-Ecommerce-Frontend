import { useState, useEffect, type FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProductReviews, type Review } from '@/api/reviews.api'
import RatingBar from './RatingBar'

// ─── Partial-fill star ────────────────────────────────────────────────────────

function StarFill({ n, rating, size }: { n: number; rating: number; size: number }) {
  const fill = Math.min(1, Math.max(0, rating - (n - 1)))
  const pct = Math.round(fill * 100)
  const uid = `sfill-${n}-${pct}`
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} style={{ flexShrink: 0 }}>
      <defs>
        <clipPath id={uid}>
          <rect x="0" y="0" width={12 * fill} height="12" />
        </clipPath>
      </defs>
      <path d="M6 1l1.2 3.7H11L8.1 6.6l1.2 3.7L6 8.3 2.7 10.3l1.2-3.7L1 4.7h3.8z" fill="#E2DAC8" />
      <path d="M6 1l1.2 3.7H11L8.1 6.6l1.2 3.7L6 8.3 2.7 10.3l1.2-3.7L1 4.7h3.8z" fill="#C49A3C" clipPath={`url(#${uid})`} />
    </svg>
  )
}

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <StarFill key={n} n={n} rating={rating} size={size} />
      ))}
    </div>
  )
}

// ─── Date format ──────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Review card ──────────────────────────────────────────────────────────────

const ReviewCard: FC<{ review: Review }> = ({ review }) => (
  <div style={{ paddingBottom: 24, borderBottom: '1px solid #E2DAC8' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 12 }}>
      <div>
        <p style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: 14, fontWeight: 500, color: '#1C1A17', margin: 0 }}>
          {review.user.name}
        </p>
        {review.verified && (
          <span style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: 10, color: '#5A8A6A', fontWeight: 500, display: 'inline-block', marginTop: 3 }}>
            Verified Purchase
          </span>
        )}
      </div>
      <p style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: 11, color: '#9E9590', flexShrink: 0, margin: 0 }}>
        {formatDate(review.createdAt)}
      </p>
    </div>

    <div style={{ marginBottom: 8 }}>
      <StarRow rating={review.rating} size={14} />
    </div>

    {review.title && (
      <p style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: 14, fontWeight: 500, color: '#1C1A17', margin: '0 0 6px' }}>
        {review.title}
      </p>
    )}

    <p style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: 14, fontWeight: 300, color: '#3A3530', lineHeight: 1.65, margin: 0 }}>
      {review.body}
    </p>
  </div>
)

// ─── Main component ───────────────────────────────────────────────────────────

interface ReviewsListProps {
  slug: string
}

const ReviewsList: FC<ReviewsListProps> = ({ slug }) => {
  const [page, setPage] = useState(1)
  const [allReviews, setAllReviews] = useState<Review[]>([])

  const { data, isFetching } = useQuery({
    queryKey: ['reviews', slug, page],
    queryFn: () => getProductReviews(slug, page),
  })

  useEffect(() => {
    if (data?.reviews) {
      setAllReviews(prev => page === 1 ? data.reviews : [...prev, ...data.reviews])
    }
  }, [data, page])

  // Reset when navigating to a different product
  useEffect(() => {
    setPage(1)
    setAllReviews([])
  }, [slug])

  const avg = data?.averageRating ?? 0
  const total = data?.total ?? 0
  const breakdown = data?.ratingBreakdown
  const hasMore = data ? page < data.totalPages : false

  if (isFetching && allReviews.length === 0) {
    return (
      <p style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: 13, color: '#9E9590', padding: '32px 0' }}>
        Loading reviews…
      </p>
    )
  }

  if (!isFetching && total === 0 && allReviews.length === 0) {
    return (
      <p style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: 14, color: '#9E9590', padding: '32px 0' }}>
        No reviews yet. Be the first to share your experience.
      </p>
    )
  }

  return (
    <div>
      {/* Aggregate header */}
      {data && total > 0 && (
        <div style={{ display: 'flex', gap: 40, marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid #E2DAC8', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Average + star row */}
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 52, color: '#1C1A17', lineHeight: 1, margin: 0 }}>
              {avg.toFixed(1)}
            </p>
            <div style={{ marginTop: 10, marginBottom: 8 }}>
              <StarRow rating={avg} size={16} />
            </div>
            <p style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: 12, color: '#6B6057', margin: 0 }}>
              {total} {total === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Distribution bars */}
          {breakdown && (
            <div style={{ flex: 1, minWidth: 160, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {([5, 4, 3, 2, 1] as const).map(star => (
                <RatingBar key={star} star={star} count={breakdown[star]} total={total} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Review cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {allReviews.map(r => (
          <ReviewCard key={r._id} review={r} />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={isFetching}
          style={{
            marginTop: 32,
            width: '100%',
            padding: '12px 0',
            fontFamily: "'Jost', system-ui, sans-serif",
            fontSize: '0.68rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            background: 'transparent',
            border: '1px solid #E2DAC8',
            color: '#6B6057',
            cursor: isFetching ? 'not-allowed' : 'pointer',
            opacity: isFetching ? 0.6 : 1,
            transition: 'border-color 0.2s, color 0.2s',
          }}
        >
          {isFetching ? 'Loading…' : 'Load more reviews'}
        </button>
      )}
    </div>
  )
}

export default ReviewsList
