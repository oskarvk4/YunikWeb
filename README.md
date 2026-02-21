# Yunik.dk - Danish Jewelry E-commerce Store

## Quick Reference for AI Agents

**Project:** Next.js 16 e-commerce store for handcrafted jewelry
**Language:** Danish (da_DK)
**Currency:** DKK
**Status:** Production-ready

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.1.6 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | TailwindCSS 4 |
| State | Zustand 5 (cart), React Context (auth) |
| Database | Supabase (PostgreSQL) |
| Payments | Stripe (cards + MobilePay) |
| Analytics | Google Analytics 4, Meta Pixel |
| Animations | Framer Motion 12 |
| Fonts | Cormorant Garamond, DM Sans |

---

## Directory Structure

```
src/
├── app/                    # Pages & API routes
│   ├── api/
│   │   ├── checkout/      # POST: Create Stripe session
│   │   └── webhook/       # POST: Stripe webhook handler
│   ├── admin/             # Protected admin dashboard
│   │   ├── products/      # Product management
│   │   ├── orders/        # Order management
│   │   └── users/         # User management
│   ├── auth/              # Login, signup, password reset
│   ├── account/orders/    # Customer order history
│   ├── checkout/          # success/ and cancel/ pages
│   ├── shop/              # Product listing with filters
│   ├── product/[slug]/    # Dynamic product pages
│   └── [static pages]/    # about, care, contact, faq, privacy, terms, returns, shipping
│
├── components/
│   ├── layout/            # Navbar, Footer, CartDrawer, MobileMenu
│   ├── home/              # Hero, CategoryGrid, FeaturedProducts, BrandStory, Newsletter
│   ├── shop/              # FilterBar, ProductGrid, ProductCard
│   ├── product/           # ImageGallery, ProductInfo, Accordion, TrustBadges, SizeGuide
│   ├── admin/             # ProductForm, StatsCard, Sidebar
│   ├── auth/              # AuthProvider
│   ├── analytics/         # GoogleAnalytics, MetaPixel
│   └── ui/                # Button, Badge, Container
│
├── lib/
│   ├── supabase/          # client.ts, server.ts, middleware.ts
│   ├── cart.ts            # Zustand cart store
│   ├── stripe.ts          # Stripe server instance
│   ├── analytics.ts       # GA4 + Meta Pixel events
│   └── email.ts           # Newsletter (Mailchimp)
│
├── data/
│   ├── products.ts        # Product query functions
│   └── products.json      # Product catalog source
│
├── types/
│   ├── index.ts           # Core types + formatPrice()
│   └── supabase.ts        # Database types
│
├── constants/
│   └── categories.ts      # Category definitions (Danish)
│
└── middleware.ts          # Route protection (/account, /admin)
```

---

## Core Types

```typescript
// src/types/index.ts
type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;           // In DKK
  currency: "DKK";
  category: "rings" | "necklaces" | "earrings" | "bracelets";
  description: string;
  materials: string;
  images: string[];
  featured: boolean;
  newArrival: boolean;
}

type CartItem = Product & { quantity: number }

type Order = {
  id: string;
  user_id: string | null;
  stripe_session_id: string | null;
  customer_email: string;
  items: OrderItem[];
  total_amount: number;
  currency: string;
  shipping_address: Address | null;
  billing_address: Address | null;
  shipping_option: "free" | "express";
  status: "completed" | "pending" | "expired";
  created_at: string;
  updated_at: string;
}

type UserProfile = {
  id: string;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
}
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/cart.ts` | Zustand store with localStorage persistence, analytics tracking |
| `src/data/products.ts` | `getAllProducts()`, `getProductBySlug()`, `getRelatedProducts()`, `getFeaturedProducts()` |
| `src/data/products.json` | Product catalog (source of truth) |
| `src/app/api/checkout/route.ts` | Creates Stripe checkout session |
| `src/app/api/webhook/route.ts` | Handles Stripe events, saves orders to Supabase |
| `src/lib/supabase/server.ts` | `createClient()` and `createAdminClient()` |
| `src/middleware.ts` | Protects /account and /admin routes |
| `src/app/layout.tsx` | Root layout with metadata, fonts, analytics scripts, JSON-LD |

---

## State Management

### Cart (Zustand) - `src/lib/cart.ts`
```typescript
useCart() {
  items: CartItem[]
  isOpen: boolean
  addItem(product: Product)
  removeItem(id: string)
  updateQuantity(id: string, quantity: number)
  clearCart()
  getTotal(): number
  getItemCount(): number
}
```
- Persisted to localStorage key: `"yunik-cart"`
- Auto-tracks analytics on add/remove

### Auth (React Context) - `src/components/auth/AuthProvider.tsx`
```typescript
useAuth() {
  user: { id, email } | null
  isLoading: boolean
  isAdmin: boolean
  isConfigured: boolean
  signOut()
}
```
- Currently simplified (ready for full Supabase integration)

---

## API Routes

### POST `/api/checkout`
- **Input:** `{ items: CartItem[] }`
- **Output:** `{ url: string }` (Stripe checkout URL)
- Creates session with MobilePay + card options
- Stores user_id and cart in metadata

### POST `/api/webhook`
- **Events handled:**
  - `checkout.session.completed` → Save order to Supabase
  - `checkout.session.expired` → Record abandoned cart
- Uses admin Supabase client (bypasses RLS)

---

## Product Categories

| Key | Danish Label |
|-----|--------------|
| `rings` | Ringe |
| `necklaces` | Halskæder |
| `earrings` | Øreringe |
| `bracelets` | Armbånd |

---

## Styling Conventions

**CSS Variables (theme colors):**
- Primary text: `#1A1A1A`
- Accent brown: `#D4A9A5`
- Light background: `#F5F0EB`
- Secondary accent: `#8D6553`

**Responsive breakpoints:** Mobile-first (sm, md, lg)

---

## Component Patterns

1. **"use client"** for interactive components
2. **Dynamic imports** for below-fold sections (Hero loads eagerly; BrandStory, Newsletter load lazily)
3. **Framer Motion** for animations (`whileInView`, staggered children)
4. **Next.js Image** for all images (optimization, lazy loading)

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Analytics
NEXT_PUBLIC_GA_ID=

# Email
NEXT_PUBLIC_MAILCHIMP_URL=
```

---

## Database Tables (Supabase)

| Table | Purpose |
|-------|---------|
| `user_profiles` | User roles (user/admin), timestamps |
| `orders` | Order records with items, addresses, status |
| `products` | Product catalog (optional - currently using JSON) |

---

## Common Tasks

### Add a new product
Edit `src/data/products.json` - add to the `products` array with all required fields.

### Add a new page
Create `src/app/[page-name]/page.tsx` with metadata export.

### Add a new component
1. Create in appropriate `src/components/[category]/` folder
2. Use `"use client"` if interactive
3. Follow existing patterns (Tailwind, Framer Motion)

### Modify cart behavior
Edit `src/lib/cart.ts` - Zustand store with persist middleware.

### Add analytics event
Use functions from `src/lib/analytics.ts`: `trackEvent()`, `trackPurchase()`, etc.

---

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

---

## Known TODOs (in codebase)

- Order confirmation emails
- Inventory management (stock updates)
- Full Supabase auth implementation
- Admin CRUD completion

---

## Architecture Notes

- **Server Components** used by default (data fetching)
- **Client Components** for interactivity (cart, forms, animations)
- **Static Generation** for product pages (`generateStaticParams`)
- **Middleware** for route protection (session checks)
- **Path alias:** `@/*` maps to `src/*`
