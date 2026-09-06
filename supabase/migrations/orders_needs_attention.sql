-- Orders that need a human before they can be packed.
--
-- Set by the checkout webhook when an order takes more stock than existed —
-- stock is checked when the Stripe session is created but not reserved until
-- payment lands, so two buyers can pay for the same last piece. The money is
-- already taken at that point, so the order is accepted and flagged rather than
-- rejected: someone has to decide between remaking the piece and refunding.
--
-- Deliberately separate from both `status` (payment state) and
-- `fulfillment_status` (packing state) — an order can be paid, unfulfilled and
-- perfectly fine, or paid, unfulfilled and unshippable, and the admin list
-- needs to tell those apart at a glance.

alter table public.orders
  add column if not exists needs_attention boolean not null default false;

-- The admin order list surfaces these first; a partial index keeps it small,
-- since the overwhelming majority of orders are false.
create index if not exists orders_needs_attention_idx
  on public.orders (created_at desc)
  where needs_attention;
