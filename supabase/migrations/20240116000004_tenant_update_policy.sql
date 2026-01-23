
-- Enable users to update their own tenant (name, settings, etc.)
create policy "Users can update their own tenant"
    on public.tenants for update
    using ( id = public.get_my_tenant_id() )
    with check ( id = public.get_my_tenant_id() );
