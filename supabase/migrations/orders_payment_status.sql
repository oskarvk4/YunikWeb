-- Payment status domain for orders.
--
-- `status` tracks the Stripe *payment* state, on its own axis from
-- `fulfillment_status` (see orders_fulfillment.sql):
--
--   pending    -- checkout finished but the money isn't in yet. Delayed
--                 notification methods report payment_status "unpaid" on
--                 checkout.session.completed and settle minutes later.
--   completed  -- Stripe confirmed the payment. The only state that may send a
--                 confirmation email or move inventory.
--   failed     -- checkout.session.async_payment_failed: the delayed payment
--                 was declined. Never becomes completed.
--   expired    -- the session timed out unpaid (abandoned cart).
--
-- The constraint is added NOT VALID so rows written before this migration are
-- left alone; every insert and update from here on is checked.

do $$
begin
  if exists (
    select 1 from pg_constraint where conname = 'orders_status_check'
  ) then
    alter table public.orders drop constraint orders_status_check;
  end if;

  alter table public.orders
    add constraint orders_status_check
    check (status in ('pending', 'completed', 'failed', 'expired'))
    not valid;
end $$;

-- The admin dashboard sums revenue over completed orders and the order list
-- groups by status.
create index if not exists orders_status_idx on public.orders (status);
