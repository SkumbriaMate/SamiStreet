-- Sami Bistro CMS — run against your Supabase Postgres (SQL editor or psql).
-- Creates site copy + products with dynamic types, tags, and per-size prices.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.site_settings (
  id int primary key default 1,
  constraint site_settings_singleton check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  product_type text not null,
  name text not null,
  description text not null default '',
  image_url text,
  emoji text not null default '🍽️',
  tags text[] not null default '{}',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  label text not null default '',
  price numeric(12, 2) not null,
  sort_order int not null default 0
);

create index if not exists products_type_idx on public.products (product_type);
create index if not exists products_active_sort_idx on public.products (is_active, sort_order);
create index if not exists product_sizes_product_idx on public.product_sizes (product_id);

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.handle_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row
execute function public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.site_settings enable row level security;
alter table public.products enable row level security;
alter table public.product_sizes enable row level security;

drop policy if exists "site_settings_select_public" on public.site_settings;
create policy "site_settings_select_public"
  on public.site_settings for select
  using (true);

drop policy if exists "site_settings_insert_auth" on public.site_settings;
create policy "site_settings_insert_auth"
  on public.site_settings for insert
  with check (auth.uid() is not null);

drop policy if exists "site_settings_update_auth" on public.site_settings;
create policy "site_settings_update_auth"
  on public.site_settings for update
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "products_select" on public.products;
create policy "products_select"
  on public.products for select
  using (is_active = true or auth.uid() is not null);

drop policy if exists "products_insert_auth" on public.products;
create policy "products_insert_auth"
  on public.products for insert
  with check (auth.uid() is not null);

drop policy if exists "products_update_auth" on public.products;
create policy "products_update_auth"
  on public.products for update
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "products_delete_auth" on public.products;
create policy "products_delete_auth"
  on public.products for delete
  using (auth.uid() is not null);

drop policy if exists "product_sizes_select" on public.product_sizes;
create policy "product_sizes_select"
  on public.product_sizes for select
  using (
    exists (
      select 1
      from public.products p
      where p.id = product_id
        and (p.is_active = true or auth.uid() is not null)
    )
  );

drop policy if exists "product_sizes_insert_auth" on public.product_sizes;
create policy "product_sizes_insert_auth"
  on public.product_sizes for insert
  with check (auth.uid() is not null);

drop policy if exists "product_sizes_update_auth" on public.product_sizes;
create policy "product_sizes_update_auth"
  on public.product_sizes for update
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "product_sizes_delete_auth" on public.product_sizes;
create policy "product_sizes_delete_auth"
  on public.product_sizes for delete
  using (auth.uid() is not null);

insert into public.site_settings (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;
