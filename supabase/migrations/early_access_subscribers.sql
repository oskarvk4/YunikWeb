-- Early-access signups from the /coming-soon holding page.
-- Writes only ever come from the server (service role, via /api/early-access),
-- so there is no public insert policy — RLS denies everything the service role
-- key doesn't bypass. Admins can read the list for export.

create table if not exists public.early_access_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'coming-soon',
  -- Kept so a later "we're open" mailing can skip anyone already contacted.
  notified_at timestamptz,
  created_at timestamptz not null default now()
);

-- Case-insensitive uniqueness; the API lowercases before writing, this is the
-- backstop so a stray mixed-case insert can't create a duplicate subscriber.
create unique index if not exists early_access_subscribers_email_key
  on public.early_access_subscribers (lower(email));

create index if not exists early_access_subscribers_created_at_idx
  on public.early_access_subscribers (created_at desc);

alter table public.early_access_subscribers enable row level security;

drop policy if exists "early_access_admin_read" on public.early_access_subscribers;
create policy "early_access_admin_read"
  on public.early_access_subscribers for select
  using (
    exists (
      select 1 from public.user_profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
