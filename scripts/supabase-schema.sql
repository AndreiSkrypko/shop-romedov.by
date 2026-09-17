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

-- RPC для админки (секрет совпадает с паролем admin в коде: romedov2026)
create or replace function public.admin_list_products(admin_secret text)
returns setof public.products
language plpgsql
security definer
set search_path = public
as $$
begin
  if admin_secret is distinct from 'romedov2026' then
    raise exception 'forbidden';
  end if;
  return query
    select *
    from public.products
    order by updated_at desc
    limit 200;
end;
$$;

create or replace function public.admin_insert_product(
  admin_secret text,
  p_slug text,
  p_category_id text,
  p_name text,
  p_size text,
  p_dimension numeric,
  p_steel text,
  p_gost text,
  p_length_m numeric,
  p_sale_unit text,
  p_weight_kg numeric,
  p_price_per_ton numeric,
  p_price_per_unit numeric,
  p_price_per_meter numeric,
  p_meters_per_sale_unit numeric,
  p_stock text,
  p_popular boolean,
  p_article text,
  p_card_title text,
  p_image text,
  p_is_published boolean
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id bigint;
begin
  if admin_secret is distinct from 'romedov2026' then
    raise exception 'forbidden';
  end if;

  insert into public.products (
    slug, category_id, name, size, dimension, steel, gost, length_m, sale_unit,
    weight_kg, price_per_ton, price_per_unit, price_per_meter, meters_per_sale_unit,
    stock, popular, article, card_title, image, is_published, updated_at
  ) values (
    p_slug, p_category_id, p_name, p_size, p_dimension, p_steel, p_gost, p_length_m, p_sale_unit,
    p_weight_kg, p_price_per_ton, p_price_per_unit, p_price_per_meter, p_meters_per_sale_unit,
    p_stock, p_popular, p_article, p_card_title, p_image, coalesce(p_is_published, true), now()
  )
  returning id into new_id;

  return new_id;
end;
$$;

grant execute on function public.admin_list_products(text) to anon, authenticated;
grant execute on function public.admin_insert_product(
  text, text, text, text, text, numeric, text, text, numeric, text, numeric,
  numeric, numeric, numeric, numeric, text, boolean, text, text, text, boolean
) to anon, authenticated;
