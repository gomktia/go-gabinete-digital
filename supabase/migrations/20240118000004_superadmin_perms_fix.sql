
-- 1. Ensure Storage bucket 'avatars' exists and is public
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- 2. Fix Storage RLS for avatars
-- Allow anyone to read (public)
drop policy if exists "Avatar Public Access" on storage.objects;
create policy "Avatar Public Access" on storage.objects
  for select using (bucket_id = 'avatars');

-- Allow authenticated users to upload to their own files OR if they are Admin
drop policy if exists "Avatar Upload Policy" on storage.objects;
create policy "Avatar Upload Policy" on storage.objects
  for insert with check (
    bucket_id = 'avatars' AND (
      (select role from public.profiles where id = auth.uid()) = 'admin'
      OR 
      (auth.uid()::text = (storage.foldername(name))[1])
    )
  );

-- Allow update and delete for owners or admin
drop policy if exists "Avatar Update Policy" on storage.objects;
create policy "Avatar Update Policy" on storage.objects
  for update using (
    bucket_id = 'avatars' AND (
      (select role from public.profiles where id = auth.uid()) = 'admin'
      OR 
      (auth.uid()::text = (storage.foldername(name))[1])
    )
  );

drop policy if exists "Avatar Delete Policy" on storage.objects;
create policy "Avatar Delete Policy" on storage.objects
  for delete using (
    bucket_id = 'avatars' AND (
      (select role from public.profiles where id = auth.uid()) = 'admin'
      OR 
      (auth.uid()::text = (storage.foldername(name))[1])
    )
  );

-- 3. Global Bypass for Admin on critical tables
-- Profiles: Admin can update any profile
drop policy if exists "Admin can update any profile" on public.profiles;
create policy "Admin can update any profile"
    on public.profiles for update
    using ( (select role from public.profiles where id = auth.uid()) = 'admin' );

-- Tenants: Admin can view and update any tenant
drop policy if exists "Admin can view any tenant" on public.tenants;
create policy "Admin can view any tenant"
    on public.tenants for select
    using ( (select role from public.profiles where id = auth.uid()) = 'admin' );

drop policy if exists "Admin can update any tenant" on public.tenants;
create policy "Admin can update any tenant"
    on public.tenants for update
    using ( (select role from public.profiles where id = auth.uid()) = 'admin' );

-- Voters/Demands/etc: Admin can view everything for support
drop policy if exists "Admin can view all voters" on public.voters;
create policy "Admin can view all voters"
    on public.voters for select
    using ( (select role from public.profiles where id = auth.uid()) = 'admin' );

drop policy if exists "Admin can view all demands" on public.demands;
create policy "Admin can view all demands"
    on public.demands for select
    using ( (select role from public.profiles where id = auth.uid()) = 'admin' );
