
-- Add site_config to tenants
alter table public.tenants add column if not exists site_config jsonb;

-- Ensure all tables have tenant_id and RLS
-- Already done in previous migrations, but let's double check if any were missed.
