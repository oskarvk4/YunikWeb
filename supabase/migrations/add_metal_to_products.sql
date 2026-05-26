-- Add metal categorization to products
-- Values: 'gold' (gold-plated, vermeil, or solid gold) | 'silver' (pure silver / sterling silver)
-- Used by the shop filter to let customers narrow by finish.

-- 1. Add nullable column first so existing rows don't violate NOT NULL
alter table public.products
  add column if not exists metal text;

-- 2. Backfill existing rows based on the materials text.
--    Anything mentioning gold plating, vermeil, or "guld" in Danish counts as gold.
--    Everything else defaults to silver.
update public.products
set metal = case
  when lower(coalesce(materials, '')) like '%guldbelagt%' then 'gold'
  when lower(coalesce(materials, '')) like '%vermeil%' then 'gold'
  when lower(coalesce(materials, '')) like '%guld%' then 'gold'
  else 'silver'
end
where metal is null;

-- 3. Lock it down: NOT NULL + check constraint + default for future inserts
alter table public.products
  alter column metal set not null,
  alter column metal set default 'silver';

alter table public.products
  drop constraint if exists products_metal_check;

alter table public.products
  add constraint products_metal_check check (metal in ('gold', 'silver'));

-- 4. Index for filter queries
create index if not exists products_metal_idx on public.products (metal);
