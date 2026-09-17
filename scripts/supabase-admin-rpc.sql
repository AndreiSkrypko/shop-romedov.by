-- Админка: категории + полный CRUD товаров. Выполните в SQL Editor Supabase.

-- ---------- Категории ----------

create table if not exists public.categories (
  id text primary key,
  slug text not null unique,
  name text not null,
  menu_name text not null,
  tagline text not null default '',
  description text not null default '',
  image text not null default '/products/supplies.webp',
  sort_order integer not null default 100,
  dimension_label text not null default 'Размер',
  seo_title text not null default '',
  seo_description text not null default '',
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists "Каталог: чтение категорий" on public.categories;
create policy "Каталог: чтение категорий"
  on public.categories for select
  to anon, authenticated
  using (is_published = true);

-- ---------- RPC: товары (список / создание / обновление / удаление) ----------

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
  return query select * from public.products order by updated_at desc limit 500;
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

create or replace function public.admin_update_product(
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
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if admin_secret is distinct from 'romedov2026' then
    raise exception 'forbidden';
  end if;

  update public.products set
    category_id = p_category_id,
    name = p_name,
    size = p_size,
    dimension = p_dimension,
    steel = p_steel,
    gost = p_gost,
    length_m = p_length_m,
    sale_unit = p_sale_unit,
    weight_kg = p_weight_kg,
    price_per_ton = p_price_per_ton,
    price_per_unit = p_price_per_unit,
    price_per_meter = p_price_per_meter,
    meters_per_sale_unit = p_meters_per_sale_unit,
    stock = p_stock,
    popular = p_popular,
    article = p_article,
    card_title = p_card_title,
    image = p_image,
    is_published = coalesce(p_is_published, true),
    updated_at = now()
  where slug = p_slug;

  if not found then
    raise exception 'not_found';
  end if;

  return true;
end;
$$;

create or replace function public.admin_delete_product(admin_secret text, p_slug text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if admin_secret is distinct from 'romedov2026' then
    raise exception 'forbidden';
  end if;

  delete from public.products where slug = p_slug;
  if not found then
    raise exception 'not_found';
  end if;

  return true;
end;
$$;

-- ---------- RPC: категории ----------

create or replace function public.admin_list_categories(admin_secret text)
returns setof public.categories
language plpgsql
security definer
set search_path = public
as $$
begin
  if admin_secret is distinct from 'romedov2026' then
    raise exception 'forbidden';
  end if;
  return query select * from public.categories order by sort_order asc, name asc;
end;
$$;

create or replace function public.admin_insert_category(
  admin_secret text,
  p_id text,
  p_slug text,
  p_name text,
  p_menu_name text,
  p_tagline text,
  p_description text,
  p_image text,
  p_sort_order integer,
  p_dimension_label text,
  p_seo_title text,
  p_seo_description text,
  p_is_published boolean
)
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  if admin_secret is distinct from 'romedov2026' then
    raise exception 'forbidden';
  end if;

  insert into public.categories (
    id, slug, name, menu_name, tagline, description, image, sort_order,
    dimension_label, seo_title, seo_description, is_published, updated_at
  ) values (
    p_id, p_slug, p_name, p_menu_name, coalesce(p_tagline, ''), coalesce(p_description, ''),
    coalesce(p_image, '/products/supplies.webp'), coalesce(p_sort_order, 100),
    coalesce(p_dimension_label, 'Размер'), coalesce(p_seo_title, p_name),
    coalesce(p_seo_description, p_description), coalesce(p_is_published, true), now()
  );

  return p_id;
end;
$$;

create or replace function public.admin_update_category(
  admin_secret text,
  p_id text,
  p_slug text,
  p_name text,
  p_menu_name text,
  p_tagline text,
  p_description text,
  p_image text,
  p_sort_order integer,
  p_dimension_label text,
  p_seo_title text,
  p_seo_description text,
  p_is_published boolean
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if admin_secret is distinct from 'romedov2026' then
    raise exception 'forbidden';
  end if;

  update public.categories set
    slug = p_slug,
    name = p_name,
    menu_name = p_menu_name,
    tagline = coalesce(p_tagline, ''),
    description = coalesce(p_description, ''),
    image = coalesce(p_image, image),
    sort_order = coalesce(p_sort_order, sort_order),
    dimension_label = coalesce(p_dimension_label, dimension_label),
    seo_title = coalesce(p_seo_title, seo_title),
    seo_description = coalesce(p_seo_description, seo_description),
    is_published = coalesce(p_is_published, is_published),
    updated_at = now()
  where id = p_id;

  if not found then
    raise exception 'not_found';
  end if;

  return true;
end;
$$;

create or replace function public.admin_delete_category(admin_secret text, p_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  cnt integer;
begin
  if admin_secret is distinct from 'romedov2026' then
    raise exception 'forbidden';
  end if;

  select count(*) into cnt from public.products where category_id = p_id;
  if cnt > 0 then
    raise exception 'category_has_products';
  end if;

  delete from public.categories where id = p_id;
  if not found then
    raise exception 'not_found';
  end if;

  return true;
end;
$$;

grant execute on function public.admin_list_products(text) to anon, authenticated;
grant execute on function public.admin_insert_product(
  text, text, text, text, text, numeric, text, text, numeric, text, numeric,
  numeric, numeric, numeric, numeric, text, boolean, text, text, text, boolean
) to anon, authenticated;
grant execute on function public.admin_update_product(
  text, text, text, text, text, numeric, text, text, numeric, text, numeric,
  numeric, numeric, numeric, numeric, text, boolean, text, text, text, boolean
) to anon, authenticated;
grant execute on function public.admin_delete_product(text, text) to anon, authenticated;

grant execute on function public.admin_list_categories(text) to anon, authenticated;
grant execute on function public.admin_insert_category(
  text, text, text, text, text, text, text, text, integer, text, text, text, boolean
) to anon, authenticated;
grant execute on function public.admin_update_category(
  text, text, text, text, text, text, text, text, integer, text, text, text, boolean
) to anon, authenticated;
grant execute on function public.admin_delete_category(text, text) to anon, authenticated;
