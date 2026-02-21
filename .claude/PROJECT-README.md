# YunikWeb - Jewelry E-Commerce Store

A Next.js 16 e-commerce website for Yunik.dk, a Danish handmade jewelry brand selling rings, necklaces, earrings, and bracelets.

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **React**: 19.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand 5
- **Database**: Supabase
- **Payments**: Stripe
- **Analytics**: Google Analytics, Meta Pixel
- **Animations**: Framer Motion
- **Carousel**: Swiper

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── account/           # User account dashboard
│   ├── admin/             # Admin panel (products, orders)
│   ├── api/               # API routes
│   │   ├── checkout/      # Stripe checkout session
│   │   ├── newsletter/    # Newsletter signup
│   │   ├── orders/        # Order management
│   │   └── webhooks/      # Stripe webhooks
│   ├── auth/              # Login/signup pages
│   ├── care/              # Jewelry care instructions
│   ├── checkout/          # Checkout page
│   ├── contact/           # Contact form
│   ├── faq/               # FAQ page
│   ├── privacy/           # Privacy policy
│   ├── product/[slug]/    # Product detail pages
│   ├── returns/           # Returns policy
│   ├── shipping/          # Shipping info
│   ├── shop/              # Product listing page
│   ├── terms/             # Terms and conditions
│   ├── globals.css        # Global styles & CSS variables
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── admin/             # Admin panel components
│   │   ├── AdminSidebar.tsx
│   │   ├── ProductForm.tsx
│   │   └── ProductTable.tsx
│   ├── analytics/         # Tracking scripts
│   │   ├── GoogleAnalytics.tsx
│   │   └── MetaPixel.tsx
│   ├── auth/              # Auth components
│   │   └── AuthProvider.tsx
│   ├── home/              # Homepage sections
│   │   ├── AboutSection.tsx
│   │   ├── Categories.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── Hero.tsx
│   │   └── Newsletter.tsx
│   ├── layout/            # Layout components
│   │   ├── CartDrawer.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileMenu.tsx
│   │   └── Navbar.tsx
│   ├── product/           # Product components
│   │   ├── ImageGallery.tsx
│   │   ├── ProductInfo.tsx
│   │   ├── RelatedProducts.tsx
│   │   ├── SizeGuide.tsx
│   │   ├── StickyAddToCart.tsx
│   │   └── TrustBadges.tsx
│   ├── shop/              # Shop page components
│   │   ├── FilterBar.tsx
│   │   ├── ProductCard.tsx
│   │   └── ProductGrid.tsx
│   └── ui/                # Reusable UI components
│       ├── Button.tsx
│       ├── Container.tsx
│       └── LoadingSpinner.tsx
├── data/
│   ├── products.json      # Static product data
│   └── products.ts        # Product exports & utilities
├── lib/
│   ├── analytics.ts       # Analytics event tracking
│   ├── cart.ts            # Zustand cart store
│   ├── email.ts           # Email/newsletter functions
│   ├── stripe.ts          # Stripe client initialization
│   └── supabase/          # Supabase clients
│       ├── client.ts      # Browser client
│       ├── middleware.ts  # Auth middleware helpers
│       └── server.ts      # Server-side client
├── types/
│   ├── index.ts           # Core type definitions
│   └── supabase.ts        # Generated Supabase types
└── middleware.ts          # Auth middleware
```

## Key Features

### Customer-Facing
- **Homepage**: Hero section, category navigation, featured products, newsletter signup
- **Shop**: Product grid with category filtering, sorting options
- **Product Pages**: Image gallery, size selection, add to cart, related products
- **Cart**: Slide-out drawer cart with quantity adjustment
- **Checkout**: Stripe-powered checkout flow
- **User Accounts**: Login, signup, order history
- **Information Pages**: About, FAQ, shipping, returns, privacy, terms, jewelry care

### Admin Panel
- **Dashboard**: Overview with recent orders, revenue stats
- **Product Management**: Add/edit/delete products
- **Order Management**: View and update order status

### Technical Features
- **SEO**: Full metadata, OpenGraph, JSON-LD schemas
- **Analytics**: Google Analytics 4, Meta Pixel integration
- **Responsive**: Mobile-first design with mobile menu
- **Performance**: Image optimization, font preloading, preconnect hints

## Environment Variables

Create a `.env.local` file with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=your_pixel_id

# App URL
NEXT_PUBLIC_APP_URL=https://yunik.dk
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Database Schema (Supabase)

### Tables
- **profiles**: User profiles linked to auth.users
- **products**: Product catalog (synced with static JSON)
- **orders**: Customer orders
- **order_items**: Line items for orders
- **newsletter_subscribers**: Email list

## Cart System

The cart uses Zustand with localStorage persistence. Key functions:
- `addItem(product, size?, quantity?)`: Add item to cart
- `removeItem(productId, size?)`: Remove item from cart
- `updateQuantity(productId, quantity, size?)`: Update quantity
- `clearCart()`: Empty the cart
- `getTotal()`: Calculate cart total

## Product Categories

- **rings** (Ringe)
- **necklaces** (Halskæder)
- **earrings** (Øreringe)
- **bracelets** (Armbånd)

## Fonts

- **Cormorant Garamond**: Headings, elegant serif
- **DM Sans**: Body text, clean sans-serif

## Brand Colors

```css
--brand-black: #1A1A1A
--brand-beige: #F5F0EB
--brand-accent: #8D6553 (copper/bronze)
--brand-light-accent: #A67C52
```

## Adding Products

Products are stored in `/src/data/products.json`. Each product needs:
- `id`: Unique identifier
- `name`: Product name
- `slug`: URL-friendly name
- `description`: Product description
- `price`: Price in DKK (integer)
- `category`: rings | necklaces | earrings | bracelets
- `images`: Array of image paths
- `sizes` (optional): Available sizes for rings
- `inStock`: Boolean
- `featured` (optional): Show on homepage
- `isNew` (optional): Display "Ny" badge

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/checkout` | POST | Create Stripe checkout session |
| `/api/newsletter` | POST | Subscribe to newsletter |
| `/api/orders` | GET | Get user orders |
| `/api/orders` | POST | Create new order |
| `/api/webhooks/stripe` | POST | Handle Stripe webhooks |

## Known Technical Debt

See `.claude/restructuring-plan.md` for a detailed analysis of code improvements needed, including:
- Category name mapping duplicated across 10+ files
- Missing centralized constants
- Inline SVG icons (should be components)
- Mixed color reference patterns
- Type definitions mixed with utility functions

## Deployment

The site is designed for deployment on Vercel or similar Next.js hosting platforms.

## Language

The site is in Danish (da_DK locale). All UI text, metadata, and content are in Danish.
