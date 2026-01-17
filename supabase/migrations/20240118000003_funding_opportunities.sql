
-- Table for storing funding opportunities (Edital, Verba, Emenda)
create table if not exists public.funding_opportunities (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    source text not null, -- 'Diário Oficial', 'Governo Federal'
    type text check (type in ('edital', 'verba', 'emenda')) not null,
    description text,
    amount text, -- Keep as text for formatting flexibility or range
    amount_value numeric, -- For sorting/filtering
    date timestamp with time zone default timezone('utc'::text, now()),
    deadline timestamp with time zone,
    status text default 'new', -- 'new', 'analyzed', 'archived'
    tags text[],
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.funding_opportunities enable row level security;

-- Policy: Everyone (authenticated) can view opportunities (Public Data)
create policy "Anyone can view opportunities"
    on public.funding_opportunities for select
    using (true);

-- Policy: Only Super Admin can insert/update (The 'Scraper' Bot or Admin)
-- For now, we allow authenticated to insert for seeding purposes, or strict to service_role
create policy "Admins can insert opportunities"
    on public.funding_opportunities for insert
    with check ( auth.role() = 'service_role' OR auth.uid() in (select id from profiles where role = 'SUPER_ADMIN') );

-- Seed some initial real-looking data
insert into public.funding_opportunities (title, source, type, description, amount, amount_value, tags, date)
values
('Edital Cultura Viva 2026', 'Ministério da Cultura', 'edital', 'Fomento a pontos de cultura em municípios de pequeno porte.', 'R$ 300.000,00', 300000, ARRAY['Cultura', 'Federal'], now()),
('Programa Pavimenta Brasil', 'Ministério das Cidades', 'verba', 'Recursos para pavimentação de vias urbanas e drenagem.', 'R$ 1.500.000,00', 1500000, ARRAY['Infraestrutura', 'Obras'], now() - interval '2 days'),
('Emenda Impositiva Regional - Saúde', 'Assembleia Legislativa', 'emenda', 'Destinação de 5 ambulâncias para consórcio regional.', 'R$ 800.000,00', 800000, ARRAY['Saúde', 'Equipamentos'], now() - interval '5 days');
