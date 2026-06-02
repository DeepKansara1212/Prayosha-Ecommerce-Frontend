import { type FC } from 'react'
import BannerManagementPanel from '@/components/admin/BannerManagementPanel'

const HeroBannersPage: FC = () => (
  <div className="p-8">
    <div className="mb-8">
      <h1 className="font-display text-2xl text-cream tracking-wide">Hero Banners</h1>
      <p className="font-body text-xs text-cream/35 mt-1 tracking-wide">
        Manage the homepage carousel — upload, reorder, and toggle banners live.
      </p>
    </div>
    <BannerManagementPanel />
  </div>
)

export default HeroBannersPage
