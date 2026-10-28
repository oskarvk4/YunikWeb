# Plan: header, hero, shop categories, Christmas gifts, one-page checkout, sign-up discount

Written 2026-10-24 for an agent to execute. Work through the phases in order. Each phase is
self-contained and should leave the site working, so it can be reviewed and committed on its own.

## Ground rules (read first)

- Read `CLAUDE.md` before starting. All UI copy is Danish; use the exact strings given here.
- Local dev: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run dev` (port 3000). The `.claude/launch.json`
  config `yunik-dev` does this. Supabase and Resend calls fail locally without that variable.
- Never run `npm run build` while the dev server is running (it fails with a Turbopack font
  error). Stop dev, build, then start dev again.
- Do **not** commit or push unless the user says so. Do **not** change product rows in Supabase.
  Do **not** email the early-access list or any customer. Stripe work is **test mode only**;
  creating anything in live Stripe needs the user's explicit OK.
- After each phase: `npx tsc --noEmit -p .`, `npx eslint <changed files>`, and check the pages
  in a browser at **1440×900, 1280×720, 768×1024, 390×844 and 360×740**. Check there is no
  sideways scroll (`document.documentElement.scrollWidth === innerWidth`).
- Brand colours (see `src/app/globals.css`): ink `#1A1A1A`, beige `#F5F0EB`, brown accent
  `#8D6553`, blush `#D4A9A5`. Fonts: `font-serif` (Cormorant Garamond), `font-sans` (DM Sans).

## Current state (what the agent will find)

- Fixed header = `src/components/layout/Navbar.tsx`: a 32px black announcement strip
  (`AnnouncementBar.tsx`, `h-8`) above an 80px menu row (`h-20`). Navbar renders an `h-8`
  spacer after the header so pages (which use `pt-20`) clear the strip. Strip and spacer are
  hidden on `/coming-soon`; the whole Navbar is hidden on `/admin`.
- Homepage: `HeroCarousel` → `TrustBar` (white icon bar, `h-[5.25rem]` phones / `h-16` desktop)
  → FeaturedProducts → CategoryGrid → ShopWindow → BrandStory → Newsletter.
- Hero height is computed so hero + trust bar fill the first screen:
  phones `h-[calc(100svh-12.25rem-1px)]` with `mt-20`; desktop `md:h-[calc(100svh-6rem-1px)]`
  with `md:mt-0` (so on desktop the photo starts **behind** the menu).
- Published products: earrings 27, rings 2, bracelets 1, necklaces 0. 10 of 30 cost ≤ 700 kr.

---

## Phase 1 — Logo in the header

**Problems found**
1. The "YUNIK" logo sits 16px above the vertical centre of the menu row (logo centre y=56,
   menu centre y=72). Cause: the logo link is `absolute top-1/2 -translate-y-1/2`, and its
   positioned ancestor is the whole fixed `<header>` (strip + menu = 112px), not the menu row.
2. The logo is typed text (`<h1>` in Cormorant, tracking 0.25em), not the real wordmark
   (`public/yunik-wordmark.png`, 383×62, transparent, a different, higher-contrast serif).
   It is also a second `<h1>` on every page.

**Steps** (`src/components/layout/Navbar.tsx`)
1. Give the menu row a positioning context: change
   `<div className="flex h-20 items-center justify-between">` to
   `<div className="relative flex h-20 items-center justify-between">`.
2. Replace the `<h1 …>YUNIK</h1>` inside the logo `<Link>` with the wordmark image:
   ```tsx
   <Image
     src="/yunik-wordmark.png"
     alt="Yunik"
     width={383}
     height={62}
     priority
     className="h-[22px] w-auto md:h-[26px] lg:h-[30px]"
   />
   ```
   (`import Image from "next/image"`). Keep the Link's `aria-label="Yunik – forside"`.
   No `<h1>` in the header.
3. The PNG is only 383px wide, so it is slightly soft on retina screens at 30px height. Tell
   the user in your summary: an SVG (or a PNG at least 1200px wide) of the wordmark would make
   it crisp; swap the file in when they provide one.

**Done when** the wordmark's vertical centre is within 1px of the menu row's centre (y=72 when
the strip shows) at all five sizes, nothing overlaps the menu links or icons at 768px and
360px, and the header has no `<h1>`.

---

## Phase 2 — Powder-pink trust bar above the menu, hero fixes, cookie banner

### Decision (already made, explain it in the summary)
Merge the black announcement strip and the white icon bar under the hero into **one
powder-pink trust bar at the very top, above the menu**, on every page. Reasons: one bar instead
of two, the trust points then show on every page (shop, product, checkout), and the hero gets
the whole first screen back. Above the menu (not under it) because a bar between menu and
photo reads like a second menu and pushes the photo down.

### 2a. Trust bar
1. Rewrite `src/components/layout/AnnouncementBar.tsx` (keep the file name and the `h-8`
   2rem height, so the Navbar spacer and all offsets stay valid):
   - Background `bg-[#EFDCD8]` (a light tint of the brand blush), bottom border
     `border-b border-[#D4A9A5]/40`, text `text-[#1A1A1A]`, icons `text-[#8D6553]`.
   - Reuse the four outline icons and texts from `src/components/home/TrustBar.tsx`
     (shop, heart, diamond, truck). Icon size 15px, `font-sans text-[12px] tracking-[0.04em]`.
   - **≥ 1024px (`lg`)**: all four points in one row, evenly spaced (`grid grid-cols-4`, each
     centred), separated by thin dividers `border-l border-[#1A1A1A]/10` (not on the first).
     Texts: `Over 30 år i Aarhus og på Bornholm`, `+20.000 glade kunder`,
     `Håndlavet i 925 sterlingsølv`, `Gratis fragt og 14 dages retur`.
   - **< 1024px**: one point at a time, centred, crossfading every 4 s (same mechanism as the
     current AnnouncementBar: absolute stacked `<p>`s, opacity transition 700ms, interval in a
     `useEffect`, no rotation when `prefers-reduced-motion: reduce`). Short texts:
     `Gratis fragt og 14 dages retur`, `Over 30 år i fysiske butikker`,
     `+20.000 glade kunder`, `Håndlavet i 925 sterlingsølv`. Shipping first.
   - Non-visible rotating items get `aria-hidden`. Whole bar: `aria-label="Fordele ved Yunik"`
     on the wrapper.
2. Delete `src/components/home/TrustBar.tsx` and remove it from `src/app/page.tsx`.
3. Leave the Navbar spacer and the `/coming-soon` exception as they are.

### 2b. Hero (`src/components/home/HeroCarousel.tsx`)
Problems found: (1) on desktop the photo starts behind the opaque white menu, so the top 80px
of every slide is hidden (the first slide loses the top of the face); (2) slides 2–4 (ring on a
light background, tanzanite bracelet, hand on stone) have light/busy areas behind the white
text, so the kicker "Formet gennem mere end 30 år" and the "Shop øreringe" text button are hard
to read.
1. Start the photo below the menu on all sizes: replace `mt-20 md:mt-0` with `mt-20`.
2. With the icon bar gone, the hero fills the rest of the first screen. Height classes become:
   `h-[calc(100svh-7rem)] min-h-[360px] max-h-[760px] md:h-[calc(100svh-7rem)] md:min-h-[520px] md:max-h-[820px]`
   (7rem = 2rem strip spacer + 5rem menu; the spacer is in normal flow above the hero, the
   `mt-20` covers the menu). Update the comment above the section to match.
3. Readability: strengthen the overlay. Phones:
   `bg-gradient-to-t from-[#1A1A1A]/75 via-[#1A1A1A]/25 to-transparent`.
   Desktop: `md:bg-gradient-to-r md:from-[#1A1A1A]/65 md:via-[#1A1A1A]/30 md:to-transparent`.
   Also add `[text-shadow:0_1px_12px_rgba(0,0,0,0.35)]` to the kicker `<h1>` and to the
   "Shop øreringe" link. Check each of the four slides at 1280×720 and 390×844 and confirm the
   kicker and both buttons are clearly readable on every slide. If one slide is still weak,
   add an optional `overlay?: string` field to that slide in `SLIDES` and apply it to an extra
   overlay div for that slide only.
4. Keep everything else (preload of slide 1 only, `restReady`, swipe, autoplay, text position
   with `md:top-[12.5%]`).

### 2c. Cookie banner (`src/components/layout/CookieConsent.tsx`)
Problem found: on a 390×844 phone the banner is 162px tall and covers the hero buttons and the
slide dots for every first-time visitor.
1. Phones: make it a compact card: `inset-x-3 bottom-3 rounded-sm` (not full-bleed), padding
   `p-4`, text `text-[13px] leading-snug`, buttons side by side, each `flex-1` and the **same
   size and visual weight class** except colour (Danish cookie rules: rejecting must be as
   easy as accepting). Target height ≤ 120px at 390px wide.
2. Shorten the text to: `Vi bruger cookies til statistik og markedsføring. Læs mere i vores
   <privatlivspolitik>.` Keep the link and the existing consent logic untouched.
3. Desktop can stay a full-width bar but with `py-3`.

**Done when** at all five sizes: the pink bar is 32px, the hero fills the screen below the menu
with nothing hidden behind the menu, the kicker and buttons are readable on all 4 slides, no
page content is hidden under the header (check `/`, `/shop`, a product page, `/checkout`,
`/about`), and on 390×844 the cookie banner leaves the hero buttons visible.

---

## Phase 3 — All categories in the shop filter

The user wants Ringe, Halskæder, Øreringe and Armbånd visible in the shop even when a category
has few or no pieces.

1. `src/components/shop/FilterBar.tsx`: show **all** entries of `categories` (remove the
   `shownCategories` filtering by `availableCategories`). Remove the now-unused
   `availableCategories` prop from FilterBar and from `ShopContent.tsx`.
2. Order the chips: `Alle`, `Øreringe`, `Ringe`, `Halskæder`, `Armbånd` (most pieces first).
3. `src/components/shop/ProductGrid.tsx` empty state: when a **category** is selected and has
   no pieces, show instead of "Ingen smykker matcher dine valg.":
   - Heading (serif): `{Kategori} er på vej`, e.g. `Halskæder er på vej`.
   - Text: `Vi lægger nye smykker op løbende. Se vores øreringe imens.`
   - Link button to `/shop?category=earrings`: `Se øreringe`.
   Pass the active category label into ProductGrid so it can tell the two cases apart. Keep
   the old message for other filter combinations (e.g. metal filters that match nothing).
4. Do **not** change `MIN_PIECES_TO_SHOW` or the homepage tiles; the rule still applies there.
5. The mobile menu (Navbar `CATEGORY_LINKS` filtered by `visibleCategories`) stays as it is.

**Done when** `/shop` shows all five chips at every size (chips wrap on phones, no sideways
scroll), `/shop?category=necklaces` shows the "Halskæder er på vej" state, and rings (2) and
bracelets (1) list their pieces.

---

## Phase 4 — Christmas gift selection instead of "under 700 kr"

Keep the same filter (price ≤ 700 kr, URL `maxPrice=700`, 10 pieces today) but present it as a
Christmas selection until Christmas Eve, then fall back automatically.

1. Add to `src/lib/storefront.ts`:
   ```ts
   /** Seasonal name for the "under 700 kr" gift filter. Ends after Christmas Eve. */
   export const GIFT_PRICE_LIMIT = 700;
   export function giftLabels(now = new Date()) {
     const christmas = now < new Date("2026-12-25T00:00:00+01:00");
     return christmas
       ? { tile: "Julegaver under 700 kr", chip: "Julegaver", heading: "Julegaver under 700 kr" }
       : { tile: "Gaver under 700 kr", chip: "Under 700 kr", heading: "Gaver under 700 kr" };
   }
   ```
   Replace the hard-coded `700` in `HOME_TILES` and `UNDER_PRICE_LIMIT` in `ShopContent.tsx`
   with `GIFT_PRICE_LIMIT`.
2. Homepage tile (`HOME_TILES` in `storefront.ts`): the label comes from `giftLabels().tile`.
   Because `buildHomeTiles` runs at build/revalidate time (the homepage is static with a 1h
   revalidate), the label switches within an hour of the date passing; that is fine.
3. Shop chip (`FilterBar.tsx`, currently `Under 700 kr`): use `giftLabels().chip`, and give the
   chip a small gift icon (outline, 14px) while the Christmas label is active.
4. Shop heading (`src/app/shop/page.tsx` / `ShopContent.tsx`): when `maxPrice=700` is active,
   show `giftLabels().heading` instead of "Alle Smykker".

**Done when** the homepage tile reads "Julegaver under 700 kr", the shop chip reads "Julegaver",
clicking either shows the 10 pieces ≤ 700 kr with the heading "Julegaver under 700 kr", and
`giftLabels(new Date("2026-12-26"))` returns the plain labels.

---

## Phase 5 — One-page checkout

**Today** `/checkout` (`src/app/checkout/page.tsx`) has two steps on the same URL: step 1 shows
the cart lines, `DeliveryPicker` and the button "Gå til Betaling"; that button POSTs to
`/api/checkout`, gets a Stripe Checkout Session (`ui_mode: "custom"`) `clientSecret`, and only
then step 2 renders `StripePayment` (contact e-mail, shipping address, billing address, payment
method, "Betal X kr"). The user wants this as **one page, no extra click**.

**Target layout** (one page):
- Left column (`lg:col-span-2`): cart lines (as today, slightly more compact: image `w-20 h-20`)
  → `DeliveryPicker` → the payment form (contact, address, billing, payment method, pay button).
- Right column: order summary (sticky `lg:top-32`, as today) without the "Gå til Betaling"
  button.

**Steps** (`src/app/checkout/page.tsx`)
1. Remove the step state: no `session ? … : …` branches for layout; always render cart lines,
   delivery picker and payment area.
2. Create the session automatically: a `useEffect` keyed on `cartSignature` that (a) does
   nothing if the cart is empty or `needsPickupPoint`, (b) waits 400ms (debounce, clear the
   timer on change), (c) POSTs to `/api/checkout` exactly as `handleCheckout` does today and
   stores `{ clientSecret, signature }`. Ignore responses whose signature is no longer current
   (race). Keep the existing "drop stale session" effect.
3. Call `trackBeginCheckout(...)` once per page visit (a `useRef` flag), not on every session.
4. Payment area states:
   - `needsPickupPoint`: show `Vælg en pakkeshop ovenfor for at fortsætte til betaling.`
   - creating a session: the existing 4-row skeleton from `StripePayment` (pulse blocks).
   - error: the existing red error box with the message, plus a `Prøv igen` button that
     re-runs the request.
   - session ready: `<StripePayment …>` as today.
5. Keep the e-mail across session re-creation: lift `email` state out of `PaymentForm` in
   `StripePayment.tsx` into the checkout page (props `email`, `onEmailChange`). Address fields
   inside Stripe Elements reset when the delivery option changes; that is acceptable because
   the delivery choice sits above the address fields.
6. Remove the "Rediger ordre" button and the summary's "Gå til Betaling" button and the
   `Udfyld dine oplysninger…` text. Keep "Sikker betaling med Stripe".
7. Hosted mode (`NEXT_PUBLIC_STRIPE_HOSTED_CHECKOUT === "true"`): keep it working. In that
   mode do **not** auto-create sessions; show a `Gå til betaling` button in the payment area
   that runs today's `handleCheckout` and redirects. (Production uses embedded/custom mode.)
8. `/api/checkout/route.ts` needs no change for this phase.

**Done when** in Stripe test mode: adding an item and opening `/checkout` shows cart, delivery
and the card form without any click; switching "Til døren" ↔ "Pakkeshop" ↔ express updates the
total and the form (pakkeshop asks for a shop first); a test payment with `4242 4242 4242 4242`
reaches `/checkout/success` and the order appears in Supabase `orders` via the webhook (use the
Stripe CLI `stripe listen --forward-to localhost:3000/api/webhook` if needed). Check the page at
390×844: one column, pay button reachable, nothing hidden under the header.

---

## Phase 6 — Sign-up discount (10% on the first order)

**Decision:** 10%, not 15%. With pieces at 500–1,700 kr and free shipping already
offered, 10% (50–170 kr) is the usual level for jewelry shops and enough to get the e-mail;
15% mostly adds cost on orders that would have happened anyway. If the user prefers 15%, only
the coupon percentage and the copy change.

**How it works:** visitor enters their e-mail → we save them as a newsletter subscriber → we
create a **unique, single-use** Stripe promotion code for them → we e-mail the code → they type
it at checkout.

### 6a. Database (new migration `supabase/migrations/newsletter_subscribers.sql`)
```sql
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  discount_code text,
  stripe_promotion_code_id text,
  source text not null default 'homepage',
  consent_text text not null,
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);
alter table public.newsletter_subscribers enable row level security;
-- No public policies: only the service role (API route) reads/writes.
```
Write the file only; the **user runs it** in the Supabase SQL editor (tell them). Store e-mails
lowercased and trimmed.

### 6b. Stripe (test mode)
1. Add `scripts/create-welcome-coupon.ts` that creates (idempotently, look up by id first) a
   coupon `id: "VELKOMMEN10"`, `percent_off: 10`, `duration: "once"`, `name: "10% velkomstrabat"`.
   Run it against the **test** key only. Print that live needs the same coupon and that the
   user must approve running it with the live key.
2. Per subscriber, create a promotion code on that coupon:
   `code: "VELKOMMEN-" + 6 random uppercase letters/digits`, `max_redemptions: 1`,
   `restrictions: { first_time_transaction: true }`, `expires_at`: 60 days from now.

### 6c. API route `src/app/api/newsletter/route.ts` (POST `{ email }`)
1. Validate with zod (reuse `src/lib/email.ts` schema). Rate-limit the same way
   `src/app/api/early-access/route.ts` does (copy its approach).
2. If the e-mail already exists and has a code, **re-send the same code** (never mint a second
   code for the same e-mail). Otherwise insert the row, create the promotion code, store
   `discount_code` and `stripe_promotion_code_id`.
3. Send the welcome e-mail (6d) with Resend. Respond `{ ok: true }`; on failure respond with a
   Danish error message (`Noget gik galt. Prøv igen om lidt.`).

### 6d. Welcome e-mail `src/emails/WelcomeDiscount.tsx`
- Same layout as the other emails (`src/emails/styles.ts`, `Logo.tsx` wordmark once at the top,
  site colours, no dark-mode inversion). Subject: `Din velkomstrabat hos Yunik`.
- Body: `Tak fordi du vil høre fra os. Her er 10% på din første ordre:` then the code in large serif type
  inside a bordered box, then `Skriv koden ved betaling. Koden gælder én gang og udløber
  {dato}.` and a button `Gå til shoppen` → `https://www.yunik.dk/shop`.
- Footer must include an unsubscribe link (marketing e-mail):
  `https://www.yunik.dk/api/newsletter/unsubscribe?token=…`. Build the token like the
  early-access tokens (HMAC with `EARLY_ACCESS_SECRET`, see `src/lib/early-access.ts`; add a
  `newsletter:` prefix to the signed message). Add the GET route that sets `unsubscribed_at`
  and shows a short Danish confirmation page.
- Send a test only to the user's own address and only when they ask.

### 6e. Sign-up form (`src/components/home/Newsletter.tsx`)
1. Replace the Mailchimp JSONP logic with a POST to `/api/newsletter`.
2. Copy: heading `Få 10% på din første ordre`; text `Tilmeld dig vores nyhedsbrev og få en
   velkomstrabat. Vi skriver kun, når der er nyt.`; button `Få min rabat`; under the form
   (this is the consent text, also save it to `consent_text`):
   `Ved tilmelding accepterer du at modtage nyheder og tilbud fra Yunik på e-mail. Du kan
   altid afmelde dig.` Success state: `Tjek din indbakke – din rabatkode er på vej.`
3. Add the same compact form to the footer (`src/components/layout/Footer.tsx`), source
   `footer`.
4. Add `10% på din første ordre – tilmeld dig` as a fifth rotating message in the phone
   version of the trust bar (Phase 2), linking to `/#nyhedsbrev` (give the Newsletter section
   `id="nyhedsbrev"`).

### 6f. Discount at checkout
1. `/api/checkout/route.ts`: add `allow_promotion_codes: true` to `sessions.create`. If Stripe
   rejects that parameter for `ui_mode: "custom"`, remove it; `applyPromotionCode` from the
   client is what matters. Verify in test mode.
2. `StripePayment.tsx`: add a `Rabatkode` field with an `Anvend` button above the payment
   method. Call `checkout.applyPromotionCode(code)` (from `useCheckoutElements()`); show the
   error message from Stripe in Danish context (`Koden kunne ikke bruges: …`) or, on success,
   `Rabat anvendt` with a `Fjern` link (`checkout.removePromotionCode()`).
3. Keep the applied code in checkout-page state and re-apply it after a session is re-created
   (Phase 5 recreates sessions when delivery changes).
4. Order summary and the pay button amount: when a session exists, show the totals from the
   Stripe session (`checkout.total`, incl. a `Rabat` line from the discount amounts) instead of
   the local cart sum. Simplest: let `StripePayment` report the session totals up via a
   callback.
5. Order confirmation e-mail (`src/emails/OrderConfirmation.tsx` and where it is sent in
   `src/app/api/webhook/route.ts`): if `session.total_details.amount_discount > 0`, add a
   `Rabat` line. The stored `orders.total_amount` already uses `amount_total`, so it is correct.

**Done when** (test mode): signing up on the homepage creates a row, a single-use promotion
code in Stripe test, and (to the user's own address only) the welcome e-mail; signing up again
with the same e-mail re-sends the same code; applying the code at checkout shows `Rabat` and a
10% lower total; paying stores the discounted total and the confirmation e-mail shows the
discount; using the code a second time is rejected; the unsubscribe link sets
`unsubscribed_at`.

---

## Open questions for the user (do not block on them; use the defaults above)

1. Can they provide the wordmark as SVG (or a PNG ≥ 1200px wide)? Default: current PNG.
2. 10% or 15%? Default: 10%.
3. Christmas label ends at midnight on 24 Dec. Default as written.
4. "+20.000 glade kunder": confirm it is customers, not purchases (Danish marketing law requires
   documentation). If purchases, use `+20.000 solgte smykker`.
5. Live Stripe coupon `VELKOMMEN10` and running `newsletter_subscribers.sql` in Supabase both
   need the user's go-ahead.
