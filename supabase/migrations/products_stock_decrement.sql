-- Atomic inventory decrement, with oversell detection.
--
-- The Stripe webhook used to read `stock_quantity` from the cached product
-- query and write back an absolute value. Two orders landing together both read
-- the same number and one decrement was lost; and because the read came from a
-- query cached for up to an hour, a webhook could also write back a figure that
-- silently undid a restock made in the admin.
--
-- `select ... for update` takes a row lock, so a concurrent call waits there
-- rather than racing. In READ COMMITTED each statement inside the function gets
-- a fresh snapshot, so once the lock is granted `v_before` is the value the
-- other transaction committed — not a stale one.
--
-- Stock is checked when the checkout session is created but nothing reserves it
-- until payment lands, so two buyers can still pay for the same last piece. By
-- the time this runs the money is taken, so the decrement clamps at zero rather
-- than failing — and reports the `shortfall` so the caller can flag the order
-- for manual handling instead of it surfacing at packing time.
--
-- Returns null when no product matched, otherwise:
--   { "remaining": <stock after>, "shortfall": <units sold beyond stock> }

-- Return type changed from integer, which `create or replace` cannot do.
drop function if exists public.decrement_product_stock(uuid, integer);

create function public.decrement_product_stock(
  p_product_id uuid,
  p_quantity integer
)
returns jsonb
language plpgsql
volatile
security invoker
set search_path = public
as $$
declare
  v_qty integer := greatest(0, p_quantity);
  v_before integer;
  v_remaining integer;
begin
  select stock_quantity into v_before
    from public.products
   where id = p_product_id
     for update;

  if not found then
    return null;
  end if;

  update public.products
     set stock_quantity = greatest(0, v_before - v_qty),
         updated_at = now()
   where id = p_product_id
  returning stock_quantity into v_remaining;

  return jsonb_build_object(
    'remaining', v_remaining,
    'shortfall', greatest(0, v_qty - v_before)
  );
end
$$;

-- Only the webhook (service role) may move inventory. Postgres grants EXECUTE
-- to PUBLIC on new functions by default, which would let any anon caller
-- decrement stock.
revoke all on function public.decrement_product_stock(uuid, integer) from public;
revoke all on function public.decrement_product_stock(uuid, integer) from anon;
revoke all on function public.decrement_product_stock(uuid, integer) from authenticated;
grant execute on function public.decrement_product_stock(uuid, integer) to service_role;
