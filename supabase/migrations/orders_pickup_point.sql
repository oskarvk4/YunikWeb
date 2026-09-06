-- Parcel-shop (pakkeshop) selection for orders.
--
-- Stripe Checkout has no pickup-point picker, so the customer chooses a shop
-- after payment on /checkout/success. `pickup_point_id` is Shipmondo's
-- service point `number`, which is what a label request needs; `pickup_point`
-- keeps the human-readable snapshot so the admin and the customer's order
-- history stay readable even if the shop later closes or is renamed.

alter table public.orders
  add column if not exists pickup_point_id text,
  add column if not exists pickup_point jsonb;

-- `shipping_option` now holds 'pickup' | 'home' | 'express'.
-- Rows created before this migration used 'free' for home delivery; that value
-- is still read correctly by the UI, so no backfill is required.
