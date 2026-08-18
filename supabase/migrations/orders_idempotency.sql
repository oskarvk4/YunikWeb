-- Enforce idempotency on the Stripe checkout webhook.
-- Duplicates can arrive when multiple webhook endpoints receive the same
-- event (e.g. a local `stripe listen` session running alongside the
-- persistent production endpoint), or from Stripe's normal retry policy
-- on transient 5xx / network errors.

-- 1. Remove any existing duplicate rows, keeping the earliest per session.
delete from public.orders o1
using public.orders o2
where o1.stripe_session_id is not null
  and o1.stripe_session_id = o2.stripe_session_id
  and o1.created_at > o2.created_at;

-- 2. Add the unique constraint if it doesn't already exist.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'orders_stripe_session_id_key'
  ) then
    alter table public.orders
      add constraint orders_stripe_session_id_key unique (stripe_session_id);
  end if;
end $$;
