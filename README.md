# Prayosha Frontend

A polished React + TypeScript storefront built with Vite and Tailwind CSS.
This frontend is the public-facing application for the Prayosha experience, showcasing a curated crystal collection with product discovery, wishlist, cart, and product details.

## Project highlights

- React 19 with functional components and hooks
- Vite for fast development builds and production output
- Tailwind CSS with custom theme extensions and animation utilities
- ESLint for code quality and consistency
- Hash-based routing for a lightweight single-page experience
- Client-side cart and wishlist state using React state
- Rich product pages with categories, sorting, related products, and promo simulation

## Getting started

Install dependencies:

```bash
cd Frontend
npm install
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

The app uses a custom hash-based router defined in `src/App.tsx`:

- `#/collection` — Collection page
- `#/product/:id` — Product detail page
- `#/auth` — Auth page
- `#/about` — About page
- `#/contact` — Contact page
- `#/wishlist` — Wishlist page
- `#/cart` — Cart page
- default / home — Landing page

### State management

The frontend maintains state inside `App.tsx`:

- `wishlistIds` — Set of saved product IDs
- `cartItems` — Array of cart line items with quantity
- Local interactions are shared with child pages through callbacks

### Data

Static product and marketing data live under `src/data/`:

- `src/data/index.ts` — homepage content, featured cards, testimonials, footer links
- `src/data/collection.ts` — product catalog used by collection and detail pages

### Type definitions

Shared model types are declared in `src/types/index.ts`, including:

- `ProductDetail`
- `ProductCategory`
- `SortOption`
- `Benefit`
- `FooterColumn`

### Styling

Tailwind configuration is defined in `tailwind.config.js` with:

- custom color palette for the brand theme
- bespoke font families
- responsive breakpoints
- custom utilities for animation, gradients, and background images
- a `pointer-fine` variant plugin for cursor-sensitive styles

### Custom utilities and hooks

- `src/lib/utils.ts` — utility helpers such as `cn()` for class names
- `src/hooks/useNavScroll.ts` — navbar scroll behavior
- `src/hooks/useScrollReveal.ts` — reveal animations on scroll
- `src/hooks/useCustomCursor.ts` — custom cursor support
- `src/hooks/useLockBodyScroll.ts` — body scroll locking for overlays

## Key pages and components

### Home page

Assembled from section components:

- `Hero`
- `Marquee`
- `Collections`
- `Benefits`
- `FeaturedProducts`
- `RitualBanner`
- `Testimonials`
- `Newsletter`

### Collection page

Implemented in `src/pages/CollectionPage.tsx` with:

- category filtering
- sort options (`featured`, `price-asc`, `price-desc`, `newest`, `name-asc`)
- product grid and wishlist buttons

### Product detail page

Implemented in `src/pages/ProductDetailPage.tsx` with:

- image gallery mockup
- product metadata and chakra tag
- quantity selector, add-to-cart, and wishlist actions
- tabbed content for description, details, and reviews
- related products row

### Cart page

Implemented in `src/pages/CartPage.tsx` with:

- cart item list and quantity controls
- move-to-wishlist support
- promo code simulation and order summary
- shipping threshold / tax calculations
- an empty cart state with browse CTA

### Wishlist page

- displays product cards saved by the user
- supports removal and moving saved items into the cart

## Folder structure

```text
Frontend/
  public/           # static assets
  src/
    assets/         # images and static media
    components/     # reusable UI pieces
      layout/        # Navbar, Footer
      sections/      # page sections for the homepage
      collection/    # collection page components
      ui/            # buttons, cursor, section labels
    data/           # app content and collections
    hooks/          # reusable React hooks
    lib/            # utility functions
    pages/          # route pages
    types/          # shared TypeScript interfaces
    App.tsx         # main routing and state orchestration
    main.tsx        # app bootstrap
  package.json
  tsconfig.app.json
  tsconfig.node.json
  tailwind.config.js
  vite.config.ts
  eslint.config.js
```

## Development notes

- The app currently uses static data and client-side state.
- Product routing is handled via hash fragments instead of a dedicated router library.
- The backend integration is expected to be added separately in `Backend/`.
- Use `npm run lint` regularly to catch style and TypeScript issues.

## Recommended contribution workflow

1. Pull the latest branch
2. Install dependencies
3. Run `npm run dev`
4. Develop against the `Frontend/src/` source tree
5. Validate changes with `npm run build` and `npm run lint`

## Useful references

- Vite docs: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com
- React docs: https://react.dev
- ESLint docs: https://eslint.org
