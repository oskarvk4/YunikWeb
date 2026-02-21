# YunikWeb Codebase Restructuring Plan

## Executive Summary

After thorough analysis of the YunikWeb Next.js jewelry e-commerce codebase, I have identified several areas for improvement in code organization, patterns, and maintainability. This plan outlines current issues, proposed solutions, and prioritized implementation steps.

---

## 1. Current Directory Structure Analysis

### Current Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── about/
│   ├── account/
│   ├── admin/
│   ├── api/
│   ├── auth/
│   ├── care/
│   ├── checkout/
│   ├── contact/
│   ├── faq/
│   ├── privacy/
│   ├── product/[slug]/
│   ├── returns/
│   ├── shipping/
│   ├── shop/
│   ├── terms/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── admin/              # 3 components
│   ├── analytics/          # 2 components
│   ├── auth/               # 1 component
│   ├── home/               # 5 components
│   ├── layout/             # 4 components
│   ├── product/            # 7 components
│   ├── shop/               # 3 components
│   └── ui/                 # 3 components
├── data/
│   ├── products.json
│   └── products.ts
├── lib/
│   ├── analytics.ts
│   ├── cart.ts
│   ├── email.ts
│   ├── stripe.ts
│   └── supabase/
│       ├── client.ts
│       ├── middleware.ts
│       └── server.ts
├── types/
│   ├── index.ts
│   └── supabase.ts
└── middleware.ts
```

---

## 2. Issues Identified

### 2.1 Code Duplication

**Issue 1: Category Name Mapping Duplicated in 10+ Files**

The category name translations (rings -> "Ringe", etc.) are duplicated across multiple files:
- `/src/app/product/[slug]/page.tsx` (lines 33-38 and 137-142)
- `/src/components/product/ProductInfo.tsx` (lines 17-22)
- `/src/components/layout/CartDrawer.tsx` (lines 112-116)
- `/src/app/checkout/page.tsx` (lines 161-166)
- `/src/app/admin/products/page.tsx`
- `/src/components/shop/FilterBar.tsx` (lines 6-12)
- `/src/components/admin/ProductForm.tsx` (lines 13-18)
- `/src/components/layout/Navbar.tsx` (lines 51-58)
- `/src/components/layout/Footer.tsx` (lines 8-14)

**Issue 2: Product Card Rendering Logic Duplicated**

The product card with image, hover effect, badges, and quick-add functionality is nearly identical in:
- `/src/components/shop/ProductCard.tsx` (full component)
- `/src/components/home/FeaturedProducts.tsx` (inline implementation, lines 35-103)

**Issue 3: Quantity Selector UI Duplicated**

The +/- quantity selector pattern appears in:
- `/src/components/layout/CartDrawer.tsx` (lines 122-140)
- `/src/app/checkout/page.tsx` (lines 190-208)
- `/src/components/product/ProductInfo.tsx` (lines 92-115)

**Issue 4: Order Status Badge Logic Duplicated**

The status-to-color mapping for order badges is repeated in:
- `/src/app/admin/page.tsx` (lines 145-159)
- `/src/app/account/page.tsx` (lines 188-202)
- `/src/app/admin/orders/page.tsx`

### 2.2 Missing Abstractions

**Issue 5: No Centralized Constants File**

- Colors are hardcoded throughout (e.g., `#1A1A1A`, `#8D6553`, `#F5F0EB`)
- No single source of truth for brand colors despite CSS variables existing
- Category definitions scattered across codebase

**Issue 6: No Icon Component Library**

SVG icons are inline everywhere:
- Shopping bag icon appears in 10+ locations
- Close (X) icon appears in 5+ locations
- Arrow icons repeated throughout
- All are hardcoded SVG paths, not reusable components

**Issue 7: No Form Input Components**

Form inputs have repeated styling patterns in:
- `/src/app/auth/login/page.tsx`
- `/src/app/auth/signup/page.tsx`
- `/src/components/admin/ProductForm.tsx`
- `/src/components/home/Newsletter.tsx`

### 2.3 Inconsistent Patterns

**Issue 8: Mixed Color References**

Colors are referenced inconsistently:
- Direct hex: `text-[#1A1A1A]`, `bg-[#F5F0EB]`
- CSS variables via theme: `text-dark`, `bg-light`, `text-accent`
- Tailwind theme: `text-brand-black`, `bg-brand-beige`

**Issue 9: Data Layer Confusion**

Two separate data sources for products:
- `/src/data/products.json` - Static JSON data
- `/src/data/products.ts` - Exports from JSON + utility functions
- Supabase database also has products table (via `DbProduct` type)

No clear strategy for which source to use when.

**Issue 10: Authentication Provider is Simplified/Stubbed**

The `AuthProvider` at `/src/components/auth/AuthProvider.tsx` is currently a stub that always returns `null` user. The actual auth logic is in the Supabase middleware. This creates confusion about where auth state lives.

**Issue 11: Type Definitions Mixed with Utilities**

`/src/types/index.ts` contains both:
- Type definitions (Product, CartItem, etc.)
- Utility function (`formatPrice`)

This violates separation of concerns.

### 2.4 Component Organization Issues

**Issue 12: Large Page Components**

Several page components are too large and could be broken down:
- `/src/app/checkout/page.tsx` - 330 lines
- `/src/app/admin/page.tsx` - 250 lines
- `/src/app/product/[slug]/page.tsx` - 210 lines

**Issue 13: No Shared Loading/Error States**

Each page implements its own loading and error states inline rather than using shared components.

**Issue 14: API Route Type Safety**

API routes use loose typing with `eslint-disable-next-line @typescript-eslint/no-explicit-any` in multiple places.

---

## 3. Proposed New Structure

```
src/
├── app/                        # Next.js App Router (unchanged)
├── components/
│   ├── admin/
│   ├── analytics/
│   ├── auth/
│   ├── cart/                   # NEW: Cart-specific components
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx        # NEW: Extracted
│   │   └── QuantitySelector.tsx # NEW: Shared component
│   ├── common/                 # NEW: Shared cross-feature components
│   │   ├── EmptyState.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── StatusBadge.tsx     # NEW: Order/Product status badges
│   │   └── CategoryBadge.tsx   # NEW: Category display
│   ├── forms/                  # NEW: Form components
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   └── Checkbox.tsx
│   ├── home/
│   ├── icons/                  # NEW: SVG icon components
│   │   ├── index.ts            # Barrel export
│   │   ├── ShoppingBagIcon.tsx
│   │   ├── CloseIcon.tsx
│   │   ├── ChevronIcon.tsx
│   │   ├── UserIcon.tsx
│   │   └── ...
│   ├── layout/
│   ├── product/
│   │   ├── ProductCard.tsx     # Single source of truth
│   │   └── ...
│   ├── shop/
│   └── ui/
├── constants/                  # NEW: Centralized constants
│   ├── index.ts                # Barrel export
│   ├── categories.ts           # Category definitions & translations
│   ├── colors.ts               # Brand colors
│   ├── navigation.ts           # Nav links
│   └── shipping.ts             # Shipping options
├── data/
│   ├── products.json           # Static product data
│   └── README.md               # Documentation for data management
├── hooks/                      # NEW: Custom React hooks
│   ├── useClickOutside.ts
│   ├── useScrollPosition.ts
│   └── useMounted.ts
├── lib/
│   ├── analytics/              # RESTRUCTURED: Analytics module
│   │   ├── index.ts
│   │   ├── events.ts
│   │   └── types.ts
│   ├── auth/                   # NEW: Auth utilities
│   │   ├── index.ts
│   │   └── guards.ts
│   ├── cart/                   # MOVED from cart.ts
│   │   ├── index.ts
│   │   ├── store.ts
│   │   └── types.ts
│   ├── email/                  # RESTRUCTURED
│   │   ├── index.ts
│   │   └── newsletter.ts
│   ├── products/               # NEW: Product utilities
│   │   ├── index.ts
│   │   ├── queries.ts          # Product data functions
│   │   └── transformers.ts     # Data transformation
│   ├── stripe/                 # RESTRUCTURED
│   │   ├── index.ts
│   │   └── client.ts
│   └── supabase/               # (unchanged)
├── services/                   # NEW: API service layer
│   ├── checkout.ts
│   ├── orders.ts
│   └── products.ts
├── types/
│   ├── index.ts                # Re-exports only
│   ├── product.ts              # Product types
│   ├── cart.ts                 # Cart types
│   ├── order.ts                # Order types
│   ├── user.ts                 # User types
│   └── supabase.ts             # Generated Supabase types
├── utils/                      # NEW: Pure utility functions
│   ├── formatters.ts           # formatPrice, formatDate, etc.
│   ├── validators.ts           # Email validation, etc.
│   └── slug.ts                 # Slug generation
└── middleware.ts
```

---

## 4. Specific Changes to Make

### Phase 1: Foundation (Priority: High)

#### 4.1 Create Constants Module
Create `/src/constants/categories.ts`:
```typescript
export const PRODUCT_CATEGORIES = {
  rings: { label: "Ringe", slug: "rings" },
  necklaces: { label: "Halskæder", slug: "necklaces" },
  earrings: { label: "Øreringe", slug: "earrings" },
  bracelets: { label: "Armbånd", slug: "bracelets" },
} as const;

export type ProductCategory = keyof typeof PRODUCT_CATEGORIES;

export const getCategoryLabel = (category: ProductCategory): string =>
  PRODUCT_CATEGORIES[category]?.label || category;

export const CATEGORY_OPTIONS = Object.entries(PRODUCT_CATEGORIES).map(
  ([value, { label }]) => ({ value, label })
);
```

#### 4.2 Move Utility Functions to Utils
Create `/src/utils/formatters.ts`:
```typescript
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("da-DK", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + " DKK";
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("da-DK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
```

#### 4.3 Create Icon Components
Create `/src/components/icons/` directory with commonly used icons:
- `ShoppingBagIcon.tsx`
- `CloseIcon.tsx`
- `ChevronDownIcon.tsx`
- `UserIcon.tsx`
- `PlusIcon.tsx`
- `MinusIcon.tsx`

### Phase 2: Component Consolidation (Priority: High)

#### 4.4 Create Shared QuantitySelector Component
Create `/src/components/common/QuantitySelector.tsx`:
```typescript
interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}
```

#### 4.5 Create StatusBadge Component
Create `/src/components/common/StatusBadge.tsx` for order status display.

#### 4.6 Consolidate ProductCard
Remove inline product card from `FeaturedProducts.tsx` and import from `ProductCard.tsx`.

### Phase 3: Form Components (Priority: Medium)

#### 4.7 Create Form Input Components
Create `/src/components/forms/Input.tsx`:
```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
```

Similar components for `Select.tsx`, `Textarea.tsx`, `Checkbox.tsx`.

### Phase 4: Type System Cleanup (Priority: Medium)

#### 4.8 Reorganize Types
Split `/src/types/index.ts` into:
- `/src/types/product.ts`
- `/src/types/cart.ts`
- `/src/types/order.ts`
- `/src/types/user.ts`

Keep `index.ts` as barrel export only.

### Phase 5: Data Layer Clarification (Priority: Medium)

#### 4.9 Create Products Service
Create `/src/lib/products/queries.ts` to centralize all product data access:
```typescript
// For static builds
export const getStaticProducts = () => { /* from JSON */ };

// For dynamic/admin
export const getDatabaseProducts = async () => { /* from Supabase */ };
```

#### 4.10 Document Data Strategy
Create `/src/data/README.md` explaining:
- When to use static JSON vs database
- How to add products
- Migration strategy

### Phase 6: Authentication Cleanup (Priority: Low)

#### 4.11 Implement Proper AuthProvider
Either fully implement the AuthProvider with Supabase integration or remove it and use server-side auth exclusively.

### Phase 7: API Type Safety (Priority: Low)

#### 4.12 Create API Types
Add proper typing for API request/response bodies to remove `@typescript-eslint/no-explicit-any` suppressions.

---

## 5. Priority Order Summary

| Priority | Task | Impact | Effort |
|----------|------|--------|--------|
| 1 | Create constants/categories.ts | High | Low |
| 2 | Move formatters to utils/ | High | Low |
| 3 | Create Icon components | High | Medium |
| 4 | Create QuantitySelector component | High | Low |
| 5 | Create StatusBadge component | Medium | Low |
| 6 | Consolidate ProductCard usage | Medium | Low |
| 7 | Create Form components | Medium | Medium |
| 8 | Reorganize types | Medium | Medium |
| 9 | Create products service layer | Medium | Medium |
| 10 | Fix AuthProvider | Low | High |
| 11 | Add API type safety | Low | Medium |

---

## 6. Benefits of Restructuring

1. **Reduced Code Duplication**: Category mappings defined once, icons reusable
2. **Better Maintainability**: Changes in one place propagate everywhere
3. **Improved Developer Experience**: Clear file organization and naming
4. **Type Safety**: Proper types throughout the application
5. **Easier Testing**: Smaller, focused components are easier to test
6. **Consistent UI**: Shared components ensure visual consistency
7. **Scalability**: Clear patterns for adding new features

---

## Critical Files for Implementation

- `/src/types/index.ts` - Contains mixed types and utilities that need separation
- `/src/components/shop/ProductCard.tsx` - Primary product card to be single source of truth
- `/src/components/layout/CartDrawer.tsx` - Contains category mapping duplication and quantity selector to extract
- `/src/data/products.ts` - Product data access layer needing documentation
- `/src/lib/cart.ts` - Well-structured Zustand store to follow as pattern
