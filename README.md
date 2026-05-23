# Prayosha Frontend

A polished React + TypeScript storefront built with Vite and Tailwind CSS.
This frontend is the public-facing application for the Prayosha experience, showcasing a curated crystal collection with product discovery, wishlist, cart, checkout, user accounts, and a blog.

## Project highlights

- React 19 with functional components and hooks
- Vite for fast development builds and production output
- Tailwind CSS with custom theme extensions and animation utilities
- Zustand for global state management (auth, cart, wishlist) with localStorage persistence
- TanStack React Query for server-state caching and data fetching
- Axios with request/response interceptors and automatic token refresh
- React Hook Form with resolver-based validation for all forms
- Razorpay payment gateway integration
- ESLint for code quality and consistency
- Hash-based routing for a lightweight single-page experience
- 18 product catalog entries across 6 categories with full metadata
- 6 static blog posts with rich multi-section content

## Getting started

Install dependencies:

```bash
cd Frontend
npm install
```

Copy the environment template and fill in your values:

```bash
cp .env.local.example .env.local
```

Required environment variables:

```text
VITE_API_URL=http://localhost:8000/api/v1
VITE_RAZORPAY_KEY_ID=<your_razorpay_key>
```

Run the dev server:

```bash
npm run dev
```

Open the app at:

```text
http://localhost:5173
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Lint the project:

```bash
npm run lint
```

## Scripts

- `dev` — start the Vite dev server
- `build` — compile TypeScript and bundle the app for production
- `preview` — serve the production build locally
- `lint` — run ESLint across source files

## Architecture overview

### Routing

The app uses a custom hash-based router defined in `src/App.tsx` with 20 route slots:

| Route | Page |
|---|---|
| `#/` (default) | Home / Landing |
| `#/collection` | Collection |
| `#/product/:id` | Product detail |
| `#/auth`, `#/auth/login` | Login |
| `#/auth/register` | Register |
| `#/auth/forgot` | Forgot password |
| `#/auth/reset` | Reset password |
| `#/about` | About |
| `#/contact` | Contact |
| `#/wishlist` | Wishlist |
| `#/cart` | Cart |
| `#/checkout` | Checkout (3-step) |
| `#/checkout/success` | Order confirmation |
| `#/checkout/failed` | Payment failure |
| `#/account`, `#/account/orders` | Order history |
| `#/account/orders/:id` | Order detail |
| `#/account/addresses` | Saved addresses |
| `#/account/profile` | Profile edit |
| `#/blog` | Blog listing |
| `#/blog/:slug` | Blog post reader |

### State management

The app uses three Zustand stores:

| Store | Key State | Persisted | Sync |
|---|---|---|---|
| `authStore` | `user`, `accessToken`, `isLoading` | localStorage | On mount |
| `cartStore` | `items[]`, `coupon`, `isOpen` | No | On mount + post-login |
| `wishlistStore` | `productIds[]`, `isLoading` | No | On mount + post-login |

All stores use optimistic updates with automatic revert on API errors. Cart and wishlist sync their remote state after login via `syncOnLogin()`.

### API layer

All HTTP calls go through a shared Axios instance at `src/api/client.ts` with:

- `Authorization: Bearer <token>` header injection
- Automatic token refresh on 401 with request retry
- Redirect to login when refresh fails

API modules:

- `auth.api.ts` — `sendOtp`, `verifyOtpAndLogin`, `register`, `logout`, `getMe`
- `products.api.ts` — `getProducts`, `getProductById`, `getRelatedProducts`
- `cart.api.ts` — `getCart`, `addItem`, `updateItem`, `removeItem`, `clearCart`, `applyCoupon`, `removeCoupon`
- `wishlist.api.ts` — `getWishlist`, `addToWishlist`, `removeFromWishlist`
- `orders.api.ts` — `getOrders`, `getOrderDetail`, `createOrder`
- `reviews.api.ts` — `getReviews`, `postReview`

### Data

Static product and marketing data live under `src/data/`:

- `src/data/index.ts` — homepage content (nav links, marquee items, crystal cards, benefits, featured products, testimonials, footer columns, blog posts)
- `src/data/collection.ts` — 18-product catalog used by collection and detail pages

### Type definitions

Shared model types are declared in `src/types/index.ts`, including:

- `NavLink`, `CrystalCard`, `Benefit`, `Product`, `Testimonial`, `FooterColumn`
- `BlogPost`, `BlogSection`, `BlogSectionType`, `BlogCategory`
- `ProductDetail`, `ProductCategory`, `ChakraType`, `SortOption`

### Styling

Tailwind configuration is defined in `tailwind.config.js` with:

- Custom color palette: `cream`, `warm`, `gold`, `gold-light`, `deep`, `bark`, `muted`, `amethyst`, `rose`, `aqua`, `sage`
- Bespoke font families: Cormorant Garamond (display / headings), Jost (body)
- Custom font sizes: `eyebrow`, `label`, `tag`, `price` with letter-spacing
- Responsive breakpoints: `xs` (380 px), `sm` (600 px), `md` (900 px), `lg` (1100 px), `xl` (1400 px)
- Custom keyframe animations: `marquee` (18 s), `fadeUp` (1.2 s), `scrollPulse` (2 s), `spin-slow` (30 s)
- 8 gem-inspired gradient backgrounds: `hero`, `amethyst`, `rose`, `aqua`, `citrine`, `sage`, `tourmaline`, `lapis`
- `pointer-fine` variant plugin for cursor-sensitive styles

### Custom utilities and hooks

- `src/lib/utils.ts` — `cn()` class merger, `scrollTo()` helper
- `src/hooks/useNavScroll.ts` — navbar hide/show on scroll direction
- `src/hooks/useScrollReveal.ts` — fade-up reveal animations on scroll
- `src/hooks/useCustomCursor.ts` — custom cursor tracking and visibility
- `src/hooks/useLockBodyScroll.ts` — body scroll locking for overlays
- `src/hooks/useProducts.ts` — TanStack Query wrapper for product fetching
- `src/hooks/useRazorpay.ts` — Razorpay checkout integration
- `src/hooks/useSearchOverlay.ts` — search modal open/close state

## Key pages and components

### Home page

Assembled from 8 section components:

- `Hero` — full-bleed landing banner with gem gradient and CTA buttons
- `Marquee` — infinitely scrolling benefit taglines
- `Collections` — 5 featured crystal collection cards with gem gradients
- `Benefits` — 4-column cards (ethical sourcing, certified, moon-cleansed, eco packaging)
- `FeaturedProducts` — 4-product showcase grid with emoji badges
- `RitualBanner` — ritual/wellness lifestyle banner
- `Testimonials` — 3-customer testimonial carousel
- `Newsletter` — email capture section

### Collection page (`src/pages/CollectionPage.tsx`)

- Category filter: All, Raw Clusters, Tumbled Stones, Towers & Points, Spheres, Jewellery, Gift Sets
- Chakra filter: Root, Sacral, Solar Plexus, Heart, Throat, Third Eye, Crown
- Price filter
- Sort options: featured, price ascending, price descending, newest, name A–Z
- Product grid via `ProductGrid` and `ProductCard` components
- Mobile `ProductDrawer` for quick-view on small screens

### Product detail page (`src/pages/ProductDetailPage.tsx`)

- Gem-gradient image display, subtitle, and chakra tag
- Full metadata: description, properties, usage instructions, dimensions, weight, stock, origin, intention
- Quantity selector, add-to-cart, and wishlist toggle
- Tabbed content: Description, Details, Reviews
- `ReviewsList` with pagination and `ReviewForm` for authenticated users
- `RatingBar` component
- Related products row

### Cart page (`src/pages/CartPage.tsx`)

- Cart item list with quantity controls and individual item removal
- Move-to-wishlist support
- Promo code input with simulated validation
- Order summary: subtotal, shipping threshold (₹999 for free shipping / ₹149 flat), tax, total
- Empty cart state with browse CTA

### Checkout (`src/pages/checkout/`)

Three-step flow:

1. **Address step** (`AddressStep`) — select saved address or enter a new one
2. **Payment step** (`PaymentStep`) — Razorpay payment sheet via `useRazorpay`
3. **Review step** (`ReviewStep`) — full order summary before confirmation

Outcomes: `CheckoutSuccessPage` (order confirmation with order number) or `CheckoutFailedPage` (retry/support options).

### Wishlist page

- Displays product cards for all saved product IDs
- Remove from wishlist and move to cart actions

### Auth pages (`src/pages/auth/`)

All wrapped in `_AuthShell` for consistent layout:

- `LoginPage` — OTP-based login flow
- `RegisterPage` — name, phone, password registration
- `ForgotPasswordPage` — initiate password recovery
- `ResetPasswordPage` — submit new password

### Account pages (`src/pages/account/`)

Protected section wrapped in `AccountLayout` (sidebar navigation):

- `ProfilePage` — edit name, phone, email
- `OrdersPage` — order history list with status badges
- `OrderDetailPage` — line items, tracking timeline, return options
- `AddressesPage` — add, edit, and delete saved delivery addresses

### Blog pages

- `BlogPage` — grid listing with a featured post hero and category tags
- `BlogPostPage` — renders multi-section content (paragraph, heading, subheading, quote, list) from the `BlogPost` data shape

6 built-in posts covering: choosing crystals, full-moon cleansing ritual, rose quartz guide, crystal meditation, chakras guide, amethyst guide.

### Search

- `SearchOverlay` — full-screen search modal triggered from the navbar, with keyboard shortcut support

## Folder structure

```text
Frontend/
  public/                 # static assets
  src/
    api/                  # Axios API modules
      client.ts           # shared Axios instance with interceptors
      auth.api.ts
      cart.api.ts
      orders.api.ts
      products.api.ts
      reviews.api.ts
      wishlist.api.ts
    assets/               # images and static media
    components/           # reusable UI pieces
      checkout/           # AddressStep, PaymentStep, ReviewStep
      collection/         # CollectionHero, FilterBar, ProductCard, ProductGrid, ProductDrawer
      layout/             # Navbar, Footer
      product/            # RatingBar, ReviewForm, ReviewsList
      search/             # SearchOverlay
      sections/           # Hero, Marquee, Collections, Benefits, FeaturedProducts, RitualBanner, Testimonials, Newsletter
      ui/                 # Button, CustomCursor, SectionLabel, SectionTitle
    data/                 # static app content
      index.ts            # home page data, blog posts
      collection.ts       # 18-product catalog
    hooks/                # reusable React hooks
      useCustomCursor.ts
      useLockBodyScroll.ts
      useNavScroll.ts
      useProducts.ts
      useRazorpay.ts
      useScrollReveal.ts
      useSearchOverlay.ts
    lib/
      utils.ts            # cn(), scrollTo()
    pages/
      account/            # AccountLayout, ProfilePage, OrdersPage, OrderDetailPage, AddressesPage
      auth/               # _AuthShell, LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage
      checkout/           # CheckoutPage, CheckoutSuccessPage, CheckoutFailedPage
      AboutPage.tsx
      BlogPage.tsx
      BlogPostPage.tsx
      CartPage.tsx
      CollectionPage.tsx
      ContactPage.tsx
      ProductDetailPage.tsx
      WishlistPage.tsx
    store/                # Zustand global stores
      authStore.ts
      cartStore.ts
      wishlistStore.ts
    types/
      index.ts            # all shared TypeScript interfaces and enums
    App.tsx               # hash router and state orchestration
    env.d.ts              # Vite environment type declarations
    index.css             # global styles
    main.tsx              # app bootstrap (QueryClientProvider)
  .env.local              # VITE_API_URL, VITE_RAZORPAY_KEY_ID
  eslint.config.js
  package.json
  postcss.config.js
  tailwind.config.js
  tsconfig.app.json
  tsconfig.node.json
  vite.config.ts
```

## Product catalog

18 products across 6 categories:

| Category | Count | Price range |
|---|---|---|
| Raw Clusters | 5 | ₹1,200 – ₹3,800 |
| Towers & Points | 4 | ₹900 – ₹2,400 |
| Spheres | 3 | ₹1,400 – ₹2,800 |
| Tumbled Stones | 2 | ₹680 – ₹850 |
| Jewellery | 2 | ₹950 – ₹1,100 |
| Gift Sets | 2 | ₹2,200 – ₹4,200 |

Each product carries: category, chakra association, origin country, intention, description, properties array, usage instructions, dimensions, weight, stock count, rating, review count, `isNew`, and `isBestseller` flags.

## Dependencies

### Runtime

| Package | Version | Purpose |
|---|---|---|
| react | 19.x | UI library |
| react-dom | 19.x | DOM renderer |
| zustand | 5.x | Global state (auth, cart, wishlist) |
| @tanstack/react-query | 5.x | Server state caching |
| axios | 1.x | HTTP client |
| react-hook-form | 7.x | Form state and validation |
| @hookform/resolvers | 5.x | Zod/yup resolver bridge |

### Dev

TypeScript 6, Vite 8, Tailwind CSS 3, PostCSS, Autoprefixer, ESLint 10 with typescript-eslint and react-hooks plugins.

## Development notes

- The Axios client auto-refreshes expired access tokens and retries the original request once.
- Cart and wishlist data are fetched from the backend on mount; static `src/data/collection.ts` is used for the collection and detail pages until the products API is wired end-to-end.
- Product routing uses hash fragments rather than a dedicated router library; add a `#` prefix when linking to any route.
- TanStack Query is bootstrapped in `main.tsx` with a 5-minute `staleTime`.
- Razorpay is loaded dynamically via `useRazorpay`; the test key is read from `VITE_RAZORPAY_KEY_ID`.
- Run `npm run lint` and `npm run build` before committing to catch TypeScript and style issues early.

## Recommended contribution workflow

1. Pull the latest branch
2. Copy `.env.local` and set `VITE_API_URL` and `VITE_RAZORPAY_KEY_ID`
3. Run `npm install`
4. Run `npm run dev`
5. Develop against `Frontend/src/`
6. Validate with `npm run build` and `npm run lint` before pushing

## Useful references

- Vite docs: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com
- React docs: https://react.dev
- Zustand: https://zustand-demo.pmnd.rs
- TanStack Query: https://tanstack.com/query
- React Hook Form: https://react-hook-form.com
- Razorpay docs: https://razorpay.com/docs
- ESLint docs: https://eslint.org
