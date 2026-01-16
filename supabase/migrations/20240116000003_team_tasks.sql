
-- 1. Create team_tasks table
create table if not exists public.team_tasks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  tenant_id uuid references public.tenants(id) not null,
  title text not null,
  description text,
  status text check (status in ('pending', 'in_progress', 'completed', 'blocked')) default 'pending',
  priority text check (priority in ('low', 'medium', 'high', 'urgent')) default 'medium',
  assigned_to uuid references public.profiles(id),
  due_date timestamp with time zone
);

-- 2. Enable RLS
alter table public.team_tasks enable row level security;

-- 3. RLS Policies
create policy "Tenant Isolation for team_tasks"
    on public.team_tasks for all
    using ( tenant_id = public.get_my_tenant_id() )
    with check ( tenant_id = public.get_my_tenant_id() );

-- 4. Allow reading profiles for team list (already covered by existing policy "Users can view members of their own tenant" but good to double check)
-- The existing policy in 20240116000001_multi_tenant.sql is:
-- create policy "Users can view members of their own tenant" on public.profiles for select using ( tenant_id = public.get_my_tenant_id() );
