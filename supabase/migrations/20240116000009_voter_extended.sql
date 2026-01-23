
-- Add birth_date and is_leader to voters
alter table public.voters add column if not exists birth_date date;
alter table public.voters add column if not exists is_leader boolean default false;
