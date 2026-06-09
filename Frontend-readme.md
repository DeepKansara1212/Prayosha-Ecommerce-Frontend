# Prayosha Frontend

The public-facing **Prayosha Crystal** storefront: product discovery, cart, checkout (COD + Razorpay), accounts, blog, and a lightweight in-app admin area for hero banners. Built with React 19, TypeScript, Vite 8, and Tailwind CSS 3.

> A separate full admin dashboard lives in the repo’s `Admin/` app (`/admin/*` on port 5174). This frontend includes a **minimal embedded admin** at `/admin` and `/admin/hero-banners` for banner management when logged in as `role: "admin"`.

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Getting started](#getting-started)
3. [Scripts](#scripts)
4. [Environment](#environment)
5. [Architecture](#architecture)
6. [Routing](#routing)
7. [State management](#state-management)
8. [API layer](#api-layer)
9. [Data & static content](#data--static-content)
10. [Pages & features](#pages--features)
11. [Components](#components)
12. [Hooks & utilities](#hooks--utilities)
13. [Styling](#styling)
14. [Folder structure](#folder-structure)
15. [Development notes](#development-notes)
16. [Feature checklist](#feature-checklist)
17. [Useful references](#useful-references)

---

## Tech stack

| Layer | Technology |
|---|---|
| UI | React 19 (functional components, hooks) |
| Build | Vite 8 (`@/` path alias → `src/`) |
| Language | TypeScript 6 |
| Styling | Tailwind CSS 3 + PostCSS + Autoprefixer |
| Routing | React Router DOM 7 (`BrowserRouter`, History API) |
| Client state | Zustand 5 (`auth` persisted; cart/wishlist/toasts ephemeral) |
| Server state | TanStack React Query 5 (`staleTime`: 5 minutes) |
| HTTP | Axios (`apiClient` with token refresh queue) |
| Forms | React Hook Form 7 + Zod (via `@hookform/resolvers`) |
| Payments | Razorpay Checkout (dynamic script load) |
| Lint | ESLint 10 + typescript-eslint + react-hooks |

---

## Getting started

```bash
cd Frontend
npm install
```

Create `.env.local` at the project root:

```text
VITE_API_URL=http://localhost:8000/api/v1
VITE_RAZORPAY_KEY_ID=<your_razorpay_test_key>
```

Run development:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

Production:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

---

## Scripts

| Script | Description |
|---|---|
| `dev` | Vite dev server |
| `build` | `tsc -b` + production bundle |
| `preview` | Serve production build |
| `lint` | ESLint |

---

## Environment

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Recommended | API base including `/api/v1`. Default in code: `http://localhost:8000/api/v1` |
| `VITE_RAZORPAY_KEY_ID` | For online pay | Razorpay key passed to checkout |

Declared in `src/env.d.ts`.

---

## Architecture

### Bootstrap (`src/main.tsx`)

- `StrictMode`
- `BrowserRouter`
- `QueryClientProvider` (5 min `staleTime`)
- `App` (all routes + global UI)

### App shell (`src/App.tsx`)

- Global `CustomCursor` + `ToastContainer`
- Session bootstrap: if `accessToken` exists, calls `fetchMe`, `fetchCart`, `fetchWishlist`
- Re-syncs cart/wishlist when `accessToken` changes (post-login)
- Wires cart/wishlist actions into page props (collection, product, cart, wishlist)

### Request flow (authenticated)

```text
User action → Zustand store / page
           → api/*.ts → apiClient
           → Bearer accessToken (localStorage)
           → on 401: POST /auth/refresh-token → retry queue
           → on refresh fail: clear tokens (see dev notes)
```

---

## Routing

Defined in `src/App.tsx`. Product URLs use **slug** as `:id` (e.g. `/product/amethyst-cathedral`).

| Path | Page | Auth |
|---|---|---|
| `/` | Home (8 sections) | Public |
| `/collection` | Product catalog (API) | Public |
| `/product/:id` | Product detail (slug) | Public |
| `/about` | About | Public |
| `/contact` | Contact | Public |
| `/terms` | Terms of service | Public |
| `/privacy` | Privacy policy | Public |
| `/blog` | Blog listing (API) | Public |
| `/blog/:slug` | Blog article (API) | Public |
| `/auth/login` | OTP login | Public |
| `/auth/register` | Register | Public |
| `/auth/forgot` | Forgot password (OTP) | Public |
| `/auth/reset` | Reset password | Public |
| `/cart` | Shopping cart | Public (checkout needs login) |
| `/account/wishlist` | Wishlist | JWT |
| `/wishlist` | Redirect → `/account/wishlist` | — |
| `/checkout` | 3-step checkout | JWT |
| `/checkout/success` | Order confirmation | JWT |
| `/checkout/failed` | Payment failed | JWT |
| `/account` | Redirect → `/account/orders` | — |
| `/account/orders` | Order history | JWT |
| `/account/orders/:num` | Order detail | JWT |
| `/account/rewards` | Rewards balance + history | JWT |
| `/account/addresses` | Saved addresses | JWT |
| `/account/profile` | Profile edit | JWT |
| `/admin` | Admin dashboard | Admin |
| `/admin/hero-banners` | Hero banner manager | Admin |
| `*` | `NotFoundPage` | Public |

**Embedded admin:** `AdminLayout` requires `user.role === 'admin'`; otherwise redirects to `/auth/login`.

---

## State management

### `authStore` (`src/store/authStore.ts`)

| Field | Description |
|---|---|
| `user` | Profile from API |
| `accessToken` | JWT (also in `localStorage` for Axios) |
| `isLoading` | Auth operations |

**Persisted** via Zustand `persist`. **Actions:** `login` (OTP verify), `register`, `logout`, `fetchMe`, `setToken`.

Stores `accessToken` + `refreshToken` in `localStorage` for the interceptor.

### `cartStore` (`src/store/cartStore.ts`)

| Field | Description |
|---|---|
| `items[]` | `productId` (slug), `quantity`, `priceAtAdd`, optional name/images/stock snapshot |
| `coupon` | Applied code + `discountAmount` from backend |
| `isOpen` | Mini-cart drawer flag |

**Not persisted.** Synced from API: `fetchCart`, `addItem`, `updateItem`, `removeItem`, `clearCart`, `applyCoupon`, `removeCoupon`, `syncOnLogin`.

**Shipping constants:** free over **₹999**, else **₹149** (`SHIPPING_THRESHOLD`, `SHIPPING_COST`).

### `wishlistStore` (`src/store/wishlistStore.ts`)

| Field | Description |
|---|---|
| `productIds[]` | Product slugs |
| `isLoading` | Fetch/toggle state |

**Actions:** `fetchWishlist`, `toggle`, `syncOnLogin`. Optimistic toggle with revert on error.

### `toastStore` (`src/store/toastStore.ts`)

Ephemeral toasts; auto-dismiss ~4s. Helpers:

```ts
toast.success('Added to cart')
toast.error('Something went wrong')
toast.info('Saved to wishlist')
toast.warning('Only 2 left in stock')
```

---

## API layer

Shared client: `src/api/client.ts` (`apiClient`).

| Module | Functions |
|---|---|
| `auth.api.ts` | `register`, `sendOtp`, `verifyOtpAndLogin`, `logout`, `refreshToken`, `getMe`, `updateMe`, `forgotPassword`, `resetPassword`, `addAddress`, `updateAddress`, `deleteAddress` |
| `products.api.ts` | `getProducts`, `getFeaturedProducts`, `getProductBySlug`, `getRelatedProducts`, `searchProducts` |
| `cart.api.ts` | `getCart`, `addItem`, `updateItem`, `removeItem`, `clearCart`, `applyCoupon`, `removeCoupon`, `validateCoupon` |
| `wishlist.api.ts` | `getWishlist`, `addToWishlist`, `removeFromWishlist` |
| `orders.api.ts` | `createCODOrder`, `createRazorpayOrder`, `verifyRazorpayPayment`, `getUserOrders`, `getOrderByNumber` |
| `reviews.api.ts` | `getProductReviews`, `submitReview` |
| `blog.api.ts` | `fetchBlogs`, `fetchBlogBySlug` |
| `heroBanner.api.ts` | `getActiveBanners`, `getAllBannersAdmin`, `createBanner`, `updateBanner`, `toggleBanner`, `reorderBanners`, `deleteBanner` |
| `rewards.api.ts` | `getRewardsBalance`, `getRewardsHistory(page, limit)` → `/rewards/*` |
| `settings.api.ts` | `getPublicSettings` → `/settings` (returns `freeGiftEnabled`) |
| `search.api.ts` | `searchProducts(q, limit)` → `/search` |
| `addresses.api.ts` | Thin wrappers around auth address endpoints |

### Product adapter (`src/hooks/useProducts.ts`)

Maps `ApiProduct` → `ProductDetail` for UI: slug as `id`, price formatting, badge labels, chakra, images, ratings, stock, etc. Used by collection, detail, featured, and search hooks.

---

## Data & static content

### `src/data/index.ts` (marketing only)

Homepage content: `NAV_LINKS`, `MARQUEE_ITEMS`, `CRYSTAL_CARDS`, `BENEFITS`, featured product teasers, `TESTIMONIALS`, footer columns. **Not** the live product catalog or blog.

### `src/data/collection.ts` (legacy / fallback)

- `CATEGORIES` — filter pill labels on collection page
- `COLLECTION_PRODUCTS` — 18-item static catalog used to **enrich** cart, checkout, and wishlist UI when a slug matches (name, emoji, image fallback)

**Live catalog** comes from `GET /products` via `useProducts`. **Live blog** from `GET /blogs`.

---

## Pages & features

### Home (`/`)

| Section | Source | Notes |
|---|---|---|
| `Hero` | **API** `getActiveBanners()` | Carousel; auto-advance 6s; optional title/subtitle/CTA from API |
| `Marquee` | Static | Scrolling taglines |
| `Collections` | Static | Crystal collection cards |
| `Benefits` | Static | 4 benefit cards |
| `FeaturedProducts` | **API** `getFeaturedProducts()` | Up to 8 products |
| `RitualBanner` | Static | Lifestyle CTA |
| `Testimonials` | Static | Testimonials |
| `Newsletter` | **Client-only** | Email validation UI; not wired to `/newsletter/subscribe` yet |

### Collection (`/collection`)

- `useProducts` with category (from static `CATEGORIES` names), sort, pagination (12 per page)
- `FilterBar` — category pills + sort (featured, newest, price asc/desc, name A–Z)
- `ProductGrid` + `Pagination`
- Skeletons + `EmptyState` on error
- Wishlist toggle with toast feedback
- **Note:** Chakra/price filters from older designs are not in the current UI; API supports `chakra`, `minPrice`, `maxPrice` if added later

### Product detail (`/product/:slug`)

- `useProduct(slug)` + `useRelatedProducts(slug)`
- Image gallery (Cloudinary URLs or emoji fallback)
- Chakra colour tag, stock, quantity, add to cart, wishlist
- Tabs: Description, Details, Reviews
- `ReviewsList` (paginated API) + `ReviewForm` (JWT)
- Related products row

### Cart (`/cart`)

- Backend cart items + static `COLLECTION_PRODUCTS` lookup for display
- Quantity +/- , remove, move to wishlist
- Coupon: validate + apply via API
- Summary: subtotal, discount, shipping rule, total
- `EmptyState` with browse CTA

### Checkout (`/checkout`)

Three steps inside `CheckoutPage`:

1. **Address** — `AddressStep`: saved addresses or new (Zod + RHF)
2. **Payment** — `PaymentStep`: COD or Razorpay (`useRazorpay`)
3. **Review** — `ReviewStep`: order summary

- Requires login (`useAuthStore`)
- Razorpay: `createRazorpayOrder` → checkout modal → `verifyRazorpayPayment`
- COD: `createCODOrder`
- Outcomes: `/checkout/success` (order number) or `/checkout/failed`

### Wishlist (`/account/wishlist`)

- Resolves products from `wishlistStore` + static catalog fallback
- Remove, move to cart

### Auth (`/auth/*`)

Shared `_AuthShell` layout:

| Page | Flow |
|---|---|
| Login | Phone → OTP + password → `verifyOtpAndLogin` |
| Register | Name, phone, password, optional email → register → OTP login |
| Forgot | Phone → OTP |
| Reset | OTP + new password |

### Account (`/account/*`)

`AccountLayout`: sidebar (Orders, Addresses, Profile), auth guard, shared `acct-*` form styles.

| Page | Features |
|---|---|
| Orders | Paginated API list, status badges |
| Order detail | Line items, `StatusTimeline`, payment info |
| Rewards | Balance card (current points), paginated earn history, "How it works" steps (earn 20 pts/₹100) |
| Addresses | CRUD with Zod forms |
| Profile | Update name via `updateMe` |

### Blog (`/blog`, `/blog/:slug`)

- **API-driven** published posts
- Listing: category filter, featured hero card, grid
- Post: multi-section renderer (paragraph, heading, subheading, quote, list)
- Related posts from same fetch

### Legal

- `TermsPage`, `PrivacyPage` — static content pages

### Embedded admin

| Route | Features |
|---|---|
| `/admin` | Dashboard: banner stats, quick link to hero banners |
| `/admin/hero-banners` | `BannerManagementPanel`: upload, edit title/subtitle/CTA, reorder, toggle, delete |

Uses `heroBanner.api.ts` admin endpoints. Full catalog/order admin is in the separate **Admin** Vite app.

### 404

- `NotFoundPage` for unknown routes

### Search

- `SearchOverlay` in navbar — debounced `search.api.ts`, keyboard navigation, suggested categories
- `useSearchOverlay` hook for open/close + `/` shortcut

---

## Components

### Layout

- `Navbar` — mega menu, search, wishlist, cart count, account, mobile drawer
- `Footer` — columns from static data + links

### Collection

- `CollectionHero`, `FilterBar`, `ProductGrid`, `ProductCard`, `ProductDrawer` (mobile quick view; static product lookup)

### Product

- `ReviewsList`, `ReviewForm`, `RatingBar`

### Checkout

- `AddressStep`, `PaymentStep`, `ReviewStep`

### Sections (home)

- `Hero`, `Marquee`, `Collections`, `Benefits`, `FeaturedProducts`, `RitualBanner`, `Testimonials`, `Newsletter`

### UI

- `Button`, `CustomCursor`, `EmptyState`, `FreeGiftBanner` (shown on checkout success when `order.hasFreeGift`), `Skeleton` (+ product/order variants), `SectionLabel`, `SectionTitle`, `Toast`, `Pagination`, `StatusTimeline`

### Admin

- `BannerManagementPanel` — full CRUD UI for hero banners

---

## Hooks & utilities

| Hook / util | Purpose |
|---|---|
| `useProducts` | List + pagination query |
| `useFeaturedProducts` | Home featured grid |
| `useProduct` / `useRelatedProducts` | PDP |
| `useProductSearch` | Debounced search (used in overlay via `search.api`) |
| `useRazorpay` | Load script, open checkout, verify payment |
| `useNavScroll` | Hide/show navbar on scroll |
| `useScrollReveal` | Intersection-based fade-up |
| `useCustomCursor` | Custom cursor (respects reduced motion) |
| `useLockBodyScroll` | Lock body when overlay open |
| `useSearchOverlay` | Search modal state + shortcut |
| `cn`, `scrollTo` | `src/lib/utils.ts` |

---

## Styling

### Tailwind (`tailwind.config.js`)

- **Colors:** `cream`, `warm`, `gold`, `gold-light`, `deep`, `bark`, `muted`, `amethyst`, `rose`, `aqua`, `sage`
- **Fonts:** Cormorant Garamond (`font-display`), Jost (`font-body`)
- **Sizes:** `eyebrow`, `label`, `tag`, `price`
- **Breakpoints:** `xs` 380px, `sm` 600px, `md` 900px, `lg` 1100px, `xl` 1400px
- **Animations:** `marquee`, `fadeUp`, `scrollPulse`, `spin-slow`
- **Gradients:** `hero`, `amethyst`, `rose`, `aqua`, `citrine`, `sage`, `tourmaline`, `lapis`
- **`pointer-fine` variant** for hover-only cursor styles

### Global CSS (`src/index.css`)

Base styles, skeleton pulse, `prefers-reduced-motion` overrides, section spacing utilities.

### Accessibility

- 44×44 px minimum tap targets on primary controls
- Focus styles on form inputs (`acct-input`, checkout)
- `aria-*` on carousel, filters, ratings
- Reduced-motion: cursor and scroll animations disabled

---

## Folder structure

```text
Frontend/
  public/
  src/
    api/
      client.ts
      auth.api.ts
      products.api.ts
      cart.api.ts
      wishlist.api.ts
      orders.api.ts
      reviews.api.ts
      blog.api.ts
      heroBanner.api.ts
      rewards.api.ts
      settings.api.ts
      search.api.ts
      addresses.api.ts
    components/
      admin/
        BannerManagementPanel.tsx
      checkout/
      collection/
      layout/
      product/
      search/
      sections/
      ui/
    data/
      index.ts              # homepage marketing copy
      collection.ts         # category labels + static product fallback
    hooks/
    lib/
      utils.ts
    pages/
      admin/
        AdminLayout.tsx
        AdminDashboardPage.tsx
        HeroBannersPage.tsx
      account/
        AccountLayout.tsx
        AddressesPage.tsx
        OrderDetailPage.tsx
        OrdersPage.tsx
        ProfilePage.tsx
        RewardsPage.tsx
      auth/
      checkout/
      AboutPage.tsx
      BlogPage.tsx
      BlogPostPage.tsx
      CartPage.tsx
      CollectionPage.tsx
      ContactPage.tsx
      NotFoundPage.tsx
      PrivacyPage.tsx
      ProductDetailPage.tsx
      TermsPage.tsx
      WishlistPage.tsx
    store/
      authStore.ts
      cartStore.ts
      wishlistStore.ts
      toastStore.ts
    types/
      index.ts
    App.tsx
    main.tsx
    index.css
    env.d.ts
  .env.local
  Frontend-readme.md
  eslint.config.js
  package.json
  postcss.config.js
  tailwind.config.js
  tsconfig.app.json
  tsconfig.node.json
  vite.config.ts
```

---

## Development notes

- **Backend required** for products, blog, hero, cart, orders, auth. Start API at `http://localhost:8000`.
- **Token refresh:** On 401, client refreshes via `/auth/refresh-token` and retries queued requests. If refresh fails, tokens are cleared; `clearAuth()` currently sets `window.location.hash = '#/auth'` (legacy) — prefer navigating to `/auth/login` if you change this.
- **Product slugs** in URLs must match MongoDB `slug` fields from the backend seed/catalog.
- **Sort query params** are sent as `featured`, `price-asc`, etc.; backend expects `price_asc` with underscores — align or map in `useProducts` if sort appears broken.
- **Category filter** sends category **name** string; backend filters by category **slug** — ensure DB category names/slugs match `CATEGORIES` in `collection.ts` or switch to slug-based filters.
- **Cart display** merges API line items with `COLLECTION_PRODUCTS` for thumbnails; products only in DB may show minimal info until enriched from API snapshots on add-to-cart.
- **Newsletter** on homepage is UI-only; wire to `POST /newsletter/subscribe` when ready.
- **Two admin surfaces:** lightweight `/admin` in this app vs full `Admin/` project for products, orders, blogs, etc.
- Run `npm run build` and `npm run lint` before pushing.

### Recommended workflow

1. Pull latest
2. Set `.env.local` (`VITE_API_URL`, `VITE_RAZORPAY_KEY_ID`)
3. `npm install`
4. `npm run dev` (storefront on 5173)
5. Develop under `Frontend/src/`
6. Validate with `npm run build` && `npm run lint`

---

## Feature checklist

| Feature | Status | Data source |
|---|---|---|
| Home hero carousel | ✓ | API hero banners |
| Featured products | ✓ | API |
| Product collection + pagination | ✓ | API |
| Product detail + related | ✓ | API |
| Reviews read + submit | ✓ | API |
| Search overlay | ✓ | API `/search` |
| Auth (OTP, register, reset) | ✓ | API |
| Cart + coupons | ✓ | API |
| Wishlist | ✓ | API |
| Checkout COD | ✓ | API |
| Checkout Razorpay | ✓ | API + Razorpay.js |
| Account orders / detail | ✓ | API |
| Account rewards | ✓ | API |
| Account addresses / profile | ✓ | API |
| Blog list + post | ✓ | API |
| Embedded admin (banners) | ✓ | API |
| Newsletter signup | UI only | — |
| Terms / Privacy / 404 | ✓ | Static |
| Custom cursor + toasts | ✓ | Client |

---

## Useful references

- [Vite](https://vitejs.dev)
- [React](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://zustand-demo.pmnd.rs)
- [TanStack Query](https://tanstack.com/query)
- [React Hook Form](https://react-hook-form.com)
- [Razorpay Docs](https://razorpay.com/docs)
- [ESLint](https://eslint.org)
