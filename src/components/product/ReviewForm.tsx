import { useState, type FC } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { submitReview } from '@/api/reviews.api'
import { useAuthStore } from '@/store/authStore'
import { toast } from '@/store/toastStore'
import type { AxiosError } from 'axios'

// ─── Interactive star selector ────────────────────────────────────────────────

function StarSelector({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || value

  return (
    <div
      style={{ display: 'flex', gap: 4 }}
      onMouseLeave={() => setHovered(0)}
      role="group"
      aria-label="Star rating"
    >
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          style={{ background: 'none', border: 'none', padding: 2, cursor: 'pointer', lineHeight: 0 }}
        >
          <svg viewBox="0 0 12 12" width={24} height={24}>
            <path
              d="M6 1l1.2 3.7H11L8.1 6.6l1.2 3.7L6 8.3 2.7 10.3l1.2-3.7L1 4.7h3.8z"
              fill={n <= active ? '#C49A3C' : '#E2DAC8'}
              style={{ transition: 'fill 0.12s' }}
            />
          </svg>
        </button>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ReviewFormProps {
  slug: string
  onSignIn?: () => void
}

const ReviewForm: FC<ReviewFormProps> = ({ slug, onSignIn }) => {
  const user = useAuthStore(s => s.user)
  const queryClient = useQueryClient()

  const [rating, setRating] = useState(0)
  const [title, setTitle]   = useState('')
  const [body, setBody]     = useState('')

  const mutation = useMutation({
    mutationFn: () => submitReview(slug, { rating, title, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', slug] })
      queryClient.invalidateQueries({ queryKey: ['product', slug] })
      setRating(0)
      setTitle('')
      setBody('')
      toast.success('Review submitted! It will appear after approval.')
    },
    onError: (err: AxiosError) => {
      if (err.response?.status === 409) {
        toast.error("You've already reviewed this product.")
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    },
  })

  // ── Not logged in ──
  if (!user) {
    return (
      <div style={{ paddingTop: 28, borderTop: '1px solid #E2DAC8', marginTop: 32 }}>
        <p style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: 14, color: '#6B6057', margin: 0 }}>
          <button
            onClick={onSignIn}
            style={{
              fontFamily: "'Jost', system-ui, sans-serif",
              fontSize: 14,
              color: '#C49A3C',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            Sign in
          </button>
          {' '}to write a review
        </p>
      </div>
    )
  }

  const isValid = rating > 0 && body.trim().length >= 20

  // ── Form ──
  return (
    <div style={{ paddingTop: 32, borderTop: '1px solid #E2DAC8', marginTop: 16 }}>
      <p style={{
        fontFamily: "'Jost', system-ui, sans-serif",
        fontSize: '0.62rem',
        letterSpacing: '0.25em',
        textTransform: 'uppercase' as const,
        color: '#C49A3C',
        margin: '0 0 20px',
      }}>
        Write a Review
      </p>

      <form
        onSubmit={e => { e.preventDefault(); if (isValid && !mutation.isPending) mutation.mutate() }}
        style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
      >
        {/* Star rating */}
        <div>
          <label style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: 12, color: '#6B6057', display: 'block', marginBottom: 8 }}>
            Your Rating <span style={{ color: '#C49A3C' }}>*</span>
          </label>
          <StarSelector value={rating} onChange={setRating} />
        </div>

        {/* Title */}
        <div>
          <label style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: 12, color: '#6B6057', display: 'block', marginBottom: 6 }}>
            Review Title
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Summarise your experience"
            maxLength={100}
            style={{
              width: '100%',
              padding: '10px 14px',
              fontFamily: "'Jost', system-ui, sans-serif",
              fontSize: 14,
              color: '#1C1A17',
              background: '#FDFAF6',
              border: '1px solid #E2DAC8',
              outline: 'none',
              boxSizing: 'border-box' as const,
            }}
          />
        </div>

        {/* Body */}
        <div>
          <label style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: 12, color: '#6B6057', display: 'block', marginBottom: 6 }}>
            Your Review <span style={{ color: '#C49A3C' }}>*</span>
          </label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Share your experience with this crystal (min. 20 characters)"
            rows={4}
            style={{
              width: '100%',
              padding: '10px 14px',
              fontFamily: "'Jost', system-ui, sans-serif",
              fontSize: 14,
              color: '#1C1A17',
              background: '#FDFAF6',
              border: '1px solid #E2DAC8',
              outline: 'none',
              resize: 'vertical' as const,
              boxSizing: 'border-box' as const,
              lineHeight: 1.65,
            }}
          />
          <p style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: 11, color: '#9E9590', margin: '4px 0 0' }}>
            {body.trim().length} / 20 characters minimum
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValid || mutation.isPending}
          style={{
            padding: '14px 0',
            fontFamily: "'Jost', system-ui, sans-serif",
            fontSize: '0.72rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase' as const,
            background: isValid && !mutation.isPending ? '#C49A3C' : '#E2DAC8',
            color: isValid && !mutation.isPending ? '#1C1A17' : '#9E9590',
            border: 'none',
            cursor: isValid && !mutation.isPending ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          {mutation.isPending ? 'Submitting…' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}

export default ReviewForm
