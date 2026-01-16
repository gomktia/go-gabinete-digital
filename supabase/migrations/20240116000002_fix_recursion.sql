-- Fix infinite recursion in RLS policies by introducing a helper function

-- 1. Create a helper function to get the current user's tenant_id
-- This function runs with SECURITY DEFINER to bypass RLS checks on the profiles table
create or replace function public.get_my_tenant_id()
returns uuid
language sql
security definer
stable
as $$
  select tenant_id from public.profiles where id = auth.uid();
$$;

-- 2. Fix 'profiles' policies to eliminate recursion
drop policy if exists "Users can view members of their own tenant" on public.profiles;

create policy "Users can view members of their own tenant"
    on public.profiles for select
    using ( tenant_id = public.get_my_tenant_id() );

-- 3. Update other policies to use the efficient helper function
-- Tenants
drop policy if exists "Users can view their own tenant" on public.tenants;
create policy "Users can view their own tenant"
    on public.tenants for select
    using ( id = public.get_my_tenant_id() );

-- Voters
drop policy if exists "Tenant Isolation for voters" on public.voters;
create policy "Tenant Isolation for voters"
    on public.voters for all
    using ( tenant_id = public.get_my_tenant_id() )
    with check ( tenant_id = public.get_my_tenant_id() );

-- Demands
drop policy if exists "Tenant Isolation for demands" on public.demands;
create policy "Tenant Isolation for demands"
    on public.demands for all
    using ( tenant_id = public.get_my_tenant_id() )
    with check ( tenant_id = public.get_my_tenant_id() );

-- Demand Visits
drop policy if exists "Tenant Isolation for visits" on public.demand_visits;
create policy "Tenant Isolation for visits"
    on public.demand_visits for all
    using ( tenant_id = public.get_my_tenant_id() )
    with check ( tenant_id = public.get_my_tenant_id() );
