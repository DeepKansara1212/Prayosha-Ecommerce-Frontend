import type { FC } from 'react'
import { cn } from '@/lib/utils'

// ─── Base skeleton ────────────────────────────────────────────────────────────

interface SkeletonProps {
  width?: string
  height?: string
  className?: string
}

const Skeleton: FC<SkeletonProps> = ({ width, height, className }) => (
  <div
    className={cn('skeleton-pulse', className)}
    style={{ width, height, borderRadius: 2 }}
    aria-hidden="true"
  />
)

export default Skeleton

// ─── Product card skeleton ────────────────────────────────────────────────────

export const ProductCardSkeleton: FC = () => (
  <div className="bg-cream" aria-hidden="true">
    <div className="w-full aspect-square skeleton-pulse" />
    <div className="p-4 border-t border-warm space-y-2.5">
      <div className="h-2 skeleton-pulse rounded w-2/3" />
      <div className="h-4 skeleton-pulse rounded w-3/4" />
      <div className="h-2.5 skeleton-pulse rounded w-1/2" />
      <div className="h-2 skeleton-pulse rounded w-1/3 mt-3" />
    </div>
  </div>
)

// ─── Product detail skeleton ──────────────────────────────────────────────────

export const ProductDetailSkeleton: FC = () => (
  <div
    className="animate-pulse"
    style={{ padding: 'clamp(2rem,5vw,3.5rem) clamp(1.25rem,5vw,4rem)' }}
    aria-hidden="true"
  >
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] gap-10 xl:gap-16">
      <div className="w-full aspect-square skeleton-pulse" />
      <div className="space-y-4 pt-2">
        <div className="h-3 skeleton-pulse rounded w-1/3" />
        <div className="h-8 skeleton-pulse rounded w-3/4" />
        <div className="h-3 skeleton-pulse rounded w-1/2" />
        <div className="h-px bg-warm my-5" />
        <div className="h-10 skeleton-pulse rounded w-1/3" />
        <div className="h-3 skeleton-pulse rounded w-2/5" />
        <div className="flex gap-2 mt-2">
          {[1, 2, 3].map(i => <div key={i} className="h-7 skeleton-pulse rounded w-20" />)}
        </div>
        <div className="h-12 skeleton-pulse rounded mt-6" />
        <div className="h-12 skeleton-pulse rounded" />
        <div className="h-10 skeleton-pulse rounded" />
      </div>
    </div>
  </div>
)

// ─── Order card skeleton ──────────────────────────────────────────────────────

export const OrderCardSkeleton: FC = () => (
  <div
    className="rounded-md border border-[#E2DAC8] p-5"
    aria-hidden="true"
    style={{ background: '#fff' }}
  >
    <div className="flex items-center gap-5 flex-wrap">
      <div className="w-11 h-11 skeleton-pulse rounded" />
      <div className="flex-1 min-w-[140px] space-y-2">
        <div className="h-3 skeleton-pulse rounded w-24" />
        <div className="h-3 skeleton-pulse rounded w-32" />
        <div className="h-5 skeleton-pulse rounded w-20 mt-2" />
      </div>
      <div className="flex flex-col items-end gap-3">
        <div className="h-4 skeleton-pulse rounded w-20" />
        <div className="h-3 skeleton-pulse rounded w-16" />
      </div>
    </div>
  </div>
)
