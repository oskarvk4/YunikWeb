# Yunik webshop: notes for Claude

Next.js 16 App Router storefront for Yunik, a Danish handmade jewelry brand. It uses Supabase (products, orders, the early-access list), Stripe (checkout) and Resend (email). The public site is behind the coming-soon gate (`NEXT_PUBLIC_COMING_SOON`).

## Email list

- Early-access signups are stored in the Supabase table `early_access_subscribers` by `/api/early-access`. `notified_at` stays empty until that person has been emailed.
- The list had 27 unique, valid addresses on 2026-10-17, from signups between 6 Sep and 17 Oct 2026.
- The confirmation email (`src/emails/EarlyAccessConfirmation.tsx`) promises one message when the shop opens, "ikke en nyhedsstrøm". Keep the launch email to that: one message, no newsletter.
- Don't email the list, or any customer, without explicit approval of the recipients, the content and the send time.
- After a mailing, set `notified_at` for the people it went to.
- While the coming-soon gate is on, only people with a personal link get in. The launch email links to `/early-access/<token>`, which sets a signed 30-day cookie that the middleware accepts (`src/lib/early-access.ts`). Links and cookies are signed with `EARLY_ACCESS_SECRET`, which must be the same in `.env.local` and in production. Removing someone from `early_access_subscribers` stops their link working. Cookies they already hold stay valid until they expire.
- `RESEND_API_KEY` in `.env.local` is send-only. It can't list domains or read verification status, so check those in the Resend dashboard.
- The homepage newsletter (`src/components/home/Newsletter.tsx`) shows a thank-you without saving anything when `NEXT_PUBLIC_MAILCHIMP_URL` is unset.

## Email design

- The only logo in emails is the YUNIK wordmark (`public/yunik-wordmark.png`), rendered by `src/emails/Logo.tsx`. Show it once at the top of every email, with the tagline under it. Don't add the old "Y" mark, a "YUNIK" text heading, or a second logo in the footer.
- Every email uses the same layout from `src/emails/styles.ts`: the logo header on beige, white cards, and a short footer line.

## Products and copy

- Products live in the Supabase `products` table. `src/data/products.json` only supplies the category list.
- `src/data/SÅDAN-TILFØJER-DU-PRODUKTER.md` describes the old JSON way of adding products. It's out of date.
- Show proposed changes to prices, names or descriptions before saving them.
- Measurements, materials and care details come from the user. Don't invent them.
- Categories, filter chips and homepage tiles only appear with at least 3 published pieces (`MIN_PIECES_TO_SHOW` in `src/lib/storefront.ts`).
- UI copy is Danish.

## Local development

- Local TLS interception breaks Supabase and Resend calls from Node. For local development and builds only, set `NODE_TLS_REJECT_UNAUTHORIZED=0`.
- `.claude/launch.json` has the `yunik-dev` preview config, which sets that variable.

## Open items (as of 2026-10-17)

- Guld Twisted Øreringe is priced at 3 DKK in Supabase and is the first product in the homepage row. The correct price is still needed.
- One product is named "p" (slug `Pearls`), and two products are both named "Circles".
- Register yunik.dk for Apple Pay and Google Pay in live Stripe.
- The launch date isn't set. It decides when the launch email goes out.
- `old.yunik.dk` still has an A record (194.255.46.81). Remove it if the old site is gone.
