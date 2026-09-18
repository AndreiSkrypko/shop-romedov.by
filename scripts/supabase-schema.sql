-- Базовая таблица товаров. Дальше: supabase-subcategories.sql → supabase-admin-rpc.sql → supabase-storage.sql → supabase-seed-data.sql

create table if not exists public.products (
  id bigint generated always as identity primary key,
  slug text not null unique,
  category_id text not null,
  name text not null,
  size text not null,
  dimension numeric not null default 0,
  steel text not null default '',
  gost text not null default '',
  length_m numeric,
  sale_unit text not null check (sale_unit in ('м', 'лист', 'шт', 'карта', 'боб')),
  weight_kg numeric not null default 0,
  price_per_ton numeric,
  price_per_unit numeric,
  price_per_meter numeric,
  meters_per_sale_unit numeric,
  stock text not null default 'in' check (stock in ('in', 'out', 'order')),
  popular boolean not null default false,
  article text,
  card_title text,
  image text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Каталог: чтение опубликованных" on public.products;
create policy "Каталог: чтение опубликованных"
  on public.products for select
  to anon, authenticated
  using (is_published = true);

alter table public.products drop constraint if exists products_stock_check;
alter table public.products
  add constraint products_stock_check
  check (stock in ('in', 'out', 'order'));
