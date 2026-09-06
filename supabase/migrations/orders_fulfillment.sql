-- Fulfillment tracking for orders.
--
-- `status` holds the Stripe *payment* state (pending / completed / expired) and
-- is written by the checkout webhook. Fulfillment is a separate axis — an order
-- can be paid but not yet packed — so it gets its own column instead of
-- overloading `status`.

alter table public.orders
  add column if not exists fulfillment_status text not null default 'unfulfilled',
  add column if not exists carrier text,
  add column if not exists tracking_number text,
  add column if not exists tracking_url text,
  add column if not exists shipped_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'orders_fulfillment_status_check'
  ) then
    alter table public.orders
      add constraint orders_fulfillment_status_check
      check (fulfillment_status in ('unfulfilled', 'shipped', 'delivered'));
  end if;
end $$;

-- The admin order list groups unshipped orders first.
create index if not exists orders_fulfillment_status_idx
  on public.orders (fulfillment_status);
