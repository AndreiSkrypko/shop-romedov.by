-- Выполните в Supabase: SQL Editor → New query → Run

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
  stock text not null default 'in' check (stock in ('in', 'order')),
  popular boolean not null default false,
  article text,
  card_title text,
  image text,
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Каталог: чтение опубликованных" on public.products;
create policy "Каталог: чтение опубликованных"
  on public.products for select
  to anon, authenticated
  using (is_published = true);

insert into public.products (
  slug, category_id, name, size, dimension, steel, gost, length_m, sale_unit,
  weight_kg, price_per_unit, price_per_meter, meters_per_sale_unit,
  stock, popular, article, card_title, image
) values (
  'sterzhen-stekloplastikovyy-ssp-8-50-buhta-50m',
  'fiberglass-rebar',
  'Стержень стеклопластиковый ССП-8-50 ТУ BY 291411223.001-2019',
  'Ø8 мм',
  8,
  'ССП-8-50',
  'ТУ BY 291411223.001-2019',
  50,
  'боб',
  3.6,
  59.5,
  1.19,
  50,
  'in',
  true,
  '15191',
  'Арматура стеклопластиковая ф. 8 бухта 50 м',
  '/products/fiberglass-rebar.webp'
)
on conflict (slug) do nothing;
