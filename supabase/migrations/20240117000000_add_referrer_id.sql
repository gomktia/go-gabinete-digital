
alter table public.voters add column if not exists referrer_id uuid references public.voters(id);
create index if not exists idx_voters_referrer on public.voters(referrer_id);
