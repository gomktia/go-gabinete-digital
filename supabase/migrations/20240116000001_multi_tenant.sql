
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. TENANTS TABLE
create table if not exists public.tenants (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  slug text unique,
  plan text default 'free',
  settings jsonb default '{}'::jsonb
);

-- 2. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key, -- id IS the user_id linked to Auth
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  tenant_id uuid references public.tenants(id),
  full_name text,
  role text check (role in ('admin', 'vereador', 'assessor', 'support')) default 'assessor',
  avatar_url text
);

-- 3. ENABLE RLS AND CREATE POLICIES

-- 3. HELPER FUNCTION & RLS POLICIES

-- Helper to get tenant_id without recursion (SECURITY DEFINER)
create or replace function public.get_my_tenant_id()
returns uuid
language sql
security definer
stable
as $$
  select tenant_id from public.profiles where id = auth.uid();
$$;

-- Tenants Policies
alter table public.tenants enable row level security;

drop policy if exists "Users can view their own tenant" on public.tenants;
create policy "Users can view their own tenant"
    on public.tenants for select
    using ( id = public.get_my_tenant_id() );

-- Profiles Policies
alter table public.profiles enable row level security;

drop policy if exists "Users can view members of their own tenant" on public.profiles;
create policy "Users can view members of their own tenant"
    on public.profiles for select
    using ( tenant_id = public.get_my_tenant_id() );

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
    on public.profiles for update
    using ( id = auth.uid() );


-- 4. UPDATE EXISTING TABLES FOR MULTI-TENANCY
alter table public.voters add column if not exists tenant_id uuid references public.tenants(id);
alter table public.demands add column if not exists tenant_id uuid references public.tenants(id);
alter table public.demand_visits add column if not exists tenant_id uuid references public.tenants(id);


-- 5. UPDATE RLS POLICIES FOR TENANT ISOLATION

-- Voters Policies
drop policy if exists "Allow all access to voters" on public.voters;
drop policy if exists "Tenant Isolation for voters" on public.voters;
create policy "Tenant Isolation for voters"
    on public.voters for all
    using ( tenant_id = public.get_my_tenant_id() )
    with check ( tenant_id = public.get_my_tenant_id() );

-- Demands Policies
drop policy if exists "Allow all access to demands" on public.demands;
drop policy if exists "Tenant Isolation for demands" on public.demands;
create policy "Tenant Isolation for demands"
    on public.demands for all
    using ( tenant_id = public.get_my_tenant_id() )
    with check ( tenant_id = public.get_my_tenant_id() );

-- Demand Visits Policies
drop policy if exists "Allow all access to demand_visits" on public.demand_visits;
drop policy if exists "Tenant Isolation for visits" on public.demand_visits;
create policy "Tenant Isolation for visits"
    on public.demand_visits for all
    using ( tenant_id = public.get_my_tenant_id() )
    with check ( tenant_id = public.get_my_tenant_id() );


-- 6. FUNCTION TO HANDLE NEW USER SIGNUP
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_tenant_id uuid;
begin
  -- 1. Create a new Tenant
  insert into public.tenants (name)
  values ('Gabinete ' || new.email)
  returning id into new_tenant_id;

  -- 2. Create Profile linking User to new Tenant
  insert into public.profiles (id, tenant_id, full_name, role)
  values (new.id, new_tenant_id, new.raw_user_meta_data->>'full_name', 'vereador');

  return new;
end;
$$ language plpgsql security definer;

-- Trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
