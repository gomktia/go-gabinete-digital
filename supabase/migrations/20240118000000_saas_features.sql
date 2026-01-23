
-- Add SaaS columns to tenants table
alter table public.tenants add column if not exists plan text check (plan in ('free', 'starter', 'pro', 'enterprise')) default 'free';
alter table public.tenants add column if not exists plan_status text check (plan_status in ('active', 'past_due', 'canceled', 'trialing')) default 'active';
alter table public.tenants add column if not exists stripe_customer_id text;
alter table public.tenants add column if not exists subscription_end_date timestamp with time zone;

-- Create payment_methods table (simulation)
create table if not exists public.integration_configs (
    id uuid default gen_random_uuid() primary key,
    tenant_id uuid references public.tenants(id),
    provider text not null, -- 'stripe', 'asaas', 'kiwify'
    api_key text,
    webhook_secret text,
    is_active boolean default true,
    created_at timestamp with time zone default now()
);

alter table public.integration_configs enable row level security;
create policy "Tenants can view their own payment configs" on public.integration_configs
    for select using (tenant_id = (select created_at from tenants where id = tenant_id limit 1) is not null); -- Simplified for dev

-- For now allow all for dev speed
create policy "Allow all payment configs dev" on public.integration_configs for all using (true) with check (true);
