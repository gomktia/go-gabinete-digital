
-- Add office_type to tenants table to support Mayors/Governors
alter table public.tenants add column if not exists office_type text check (office_type in ('city_councilor', 'mayor', 'state_deputy', 'governor', 'federal_deputy', 'senator')) default 'city_councilor';

-- Add campaign_number distinct from candidate_number (optional, but semantic)
alter table public.tenants add column if not exists party_name text; 
