-- Public bucket for CMS images. Run after creating the bucket in Dashboard, or rely on this insert.
-- Site files: bucket root (e.g. nav-logo.png). Products: product-images/...

insert into storage.buckets (id, name, public)
values ('website-images', 'website-images', true)
on conflict (id) do update set public = excluded.public;

-- Anyone can read (public bucket URLs).
drop policy if exists "Public read website-images" on storage.objects;
create policy "Public read website-images"
  on storage.objects for select
  using (bucket_id = 'website-images');

-- Logged-in admins (Supabase Auth) can upload / replace / delete.
drop policy if exists "Auth upload website-images" on storage.objects;
create policy "Auth upload website-images"
  on storage.objects for insert
  with check (bucket_id = 'website-images' and auth.uid() is not null);

drop policy if exists "Auth update website-images" on storage.objects;
create policy "Auth update website-images"
  on storage.objects for update
  using (bucket_id = 'website-images' and auth.uid() is not null)
  with check (bucket_id = 'website-images' and auth.uid() is not null);

drop policy if exists "Auth delete website-images" on storage.objects;
create policy "Auth delete website-images"
  on storage.objects for delete
  using (bucket_id = 'website-images' and auth.uid() is not null);
