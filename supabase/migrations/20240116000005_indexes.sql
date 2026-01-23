-- Add indexes to improve RLS performance
CREATE INDEX IF NOT EXISTS idx_voters_tenant_id ON public.voters(tenant_id);
CREATE INDEX IF NOT EXISTS idx_demands_tenant_id ON public.demands(tenant_id);
CREATE INDEX IF NOT EXISTS idx_demand_visits_tenant_id ON public.demand_visits(tenant_id);
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON public.profiles(tenant_id);
