
-- Update Roles to support the complete Ecosystem
-- We are expanding the simple 'vereador/assessor' model to a full hierarchy

-- Add new roles to the existing check constraint logic (Note: modifying check constraints usually requires dropping and recreating)
-- For simplicity in this migration script, we will just document the intended roles which are enforced at application level mostly
-- but let's add a column to profiles to store "detailed_role" if we want more granularity than the main ENUM

alter table public.profiles add column if not exists JobTitle text; -- Ex: "Secretário de Obras", "Chefe de Gabinete"
alter table public.profiles add column if not exists HierarchyLevel int default 1; -- 1=Agent, 2=Regional Leader, 3=Manager, 4=Admin, 5=Owner

-- Add Region/Territory control for big teams (Governors/Mayors)
alter table public.profiles add column if not exists TerritoryRegion text; -- Ex: "Zona Norte", "Município X"

-- Add Parent Tenant for "Sub-tenants" (Political Alliances)
alter table public.tenants add column if not exists parent_tenant_id uuid references public.tenants(id);

-- Add 'office_size' to help categorizing pricing tiers automatically
alter table public.tenants add column if not exists population_size int; -- Size of the city/state governed
