-- Editable site copy overrides.
-- Rows here override the code defaults in src/content/copy.ts.
-- Public reads are allowed so server-rendered pages can fetch overrides
-- with the anon key; only admins can insert/update/delete.

create table if not exists public.site_copy (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.site_copy enable row level security;

drop policy if exists "site_copy_public_read" on public.site_copy;
create policy "site_copy_public_read"
  on public.site_copy for select
  using (true);

drop policy if exists "site_copy_admin_write" on public.site_copy;
create policy "site_copy_admin_write"
  on public.site_copy for all
  using (
    exists (
      select 1 from public.user_profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.user_profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create or replace function public.site_copy_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end
$$;

drop trigger if exists site_copy_touch on public.site_copy;
create trigger site_copy_touch
  before update on public.site_copy
  for each row execute function public.site_copy_touch();
