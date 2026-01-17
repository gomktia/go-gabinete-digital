
-- 1. Campaign Finance Table
create table if not exists public.campaign_finance (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  tenant_id uuid references public.tenants(id) not null,
  type text check (type in ('income', 'expense')) not null,
  description text not null,
  value decimal(12,2) not null,
  category text not null,
  date date default current_date,
  status text check (status in ('pending', 'verified', 'rejected')) default 'pending',
  receipt_url text
);

-- 2. Calendar Events Table
create table if not exists public.calendar_events (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  tenant_id uuid references public.tenants(id) not null,
  title text not null,
  description text,
  date date not null,
  time time,
  location text,
  category text check (category in ('Eleitoral', 'Legislativo', 'Comunicação', 'Outros')) default 'Outros'
);

-- 3. Enable RLS
alter table public.campaign_finance enable row level security;
alter table public.calendar_events enable row level security;

-- 4. RLS Policies
create policy "Tenant Isolation for campaign_finance"
    on public.campaign_finance for all
    using ( tenant_id = public.get_my_tenant_id() )
    with check ( tenant_id = public.get_my_tenant_id() );

create policy "Tenant Isolation for calendar_events"
    on public.calendar_events for all
    using ( tenant_id = public.get_my_tenant_id() )
    with check ( tenant_id = public.get_my_tenant_id() );
