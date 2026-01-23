
-- Documents Table
create table if not exists public.documents (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  tenant_id uuid references public.tenants(id) not null,
  type text not null,
  code text not null,
  subject text not null,
  department text,
  deadline date,
  status text default 'pending',
  signed boolean default false,
  file_url text,
  reminder_days integer default 3
);

-- Propositions Table
create table if not exists public.propositions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  tenant_id uuid references public.tenants(id) not null,
  title text not null,
  category text not null,
  author text not null,
  status text default 'Rascunho',
  description text,
  type text
);

-- Social Media Posts (Planner)
create table if not exists public.social_posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  tenant_id uuid references public.tenants(id) not null,
  title text not null,
  platform text not null,
  scheduled_for timestamp with time zone,
  status text default 'draft',
  content text,
  image_url text
);

-- Team Performance / Tasks (Extended)
-- Already has team_tasks, maybe add performance logs?
create table if not exists public.team_logs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  tenant_id uuid references public.tenants(id) not null,
  user_id uuid,
  action text not null,
  details jsonb
);

-- Enable RLS
alter table public.documents enable row level security;
alter table public.propositions enable row level security;
alter table public.social_posts enable row level security;
alter table public.team_logs enable row level security;

-- RLS Policies
create policy "Tenant Isolation for documents" on public.documents for all using ( tenant_id = public.get_my_tenant_id() ) with check ( tenant_id = public.get_my_tenant_id() );
create policy "Tenant Isolation for propositions" on public.propositions for all using ( tenant_id = public.get_my_tenant_id() ) with check ( tenant_id = public.get_my_tenant_id() );
create policy "Tenant Isolation for social_posts" on public.social_posts for all using ( tenant_id = public.get_my_tenant_id() ) with check ( tenant_id = public.get_my_tenant_id() );
create policy "Tenant Isolation for team_logs" on public.team_logs for all using ( tenant_id = public.get_my_tenant_id() ) with check ( tenant_id = public.get_my_tenant_id() );
