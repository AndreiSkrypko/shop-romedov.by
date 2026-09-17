-- Подкатегории и привязка товаров. Выполните после supabase-admin-rpc.sql

create table if not exists public.subcategories (
  id text primary key,
  category_id text not null,
  slug text not null,
  name text not null,
  image text not null default '',
  sort_order integer not null default 100,
  is_published boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (category_id, slug)
);

create index if not exists subcategories_category_id_idx on public.subcategories (category_id);

alter table public.subcategories enable row level security;

drop policy if exists "Каталог: чтение подкатегорий" on public.subcategories;
create policy "Каталог: чтение подкатегорий"
  on public.subcategories for select
  to anon, authenticated
  using (is_published = true);

alter table public.products
  add column if not exists subcategory_id text references public.subcategories (id) on delete set null;

-- ---------- RPC: подкатегории ----------

create or replace function public.admin_list_subcategories(admin_secret text, p_category_id text default null)
returns setof public.subcategories
language plpgsql
security definer
set search_path = public
as $$
begin
  if admin_secret is distinct from 'romedov2026' then
    raise exception 'forbidden';
  end if;
  if p_category_id is null or p_category_id = '' then
    return query select * from public.subcategories order by category_id, sort_order, name;
  end if;
  return query
    select * from public.subcategories
    where category_id = p_category_id
    order by sort_order asc, name asc;
end;
$$;

create or replace function public.admin_insert_subcategory(
  admin_secret text,
  p_id text,
  p_category_id text,
  p_slug text,
  p_name text,
  p_image text,
  p_sort_order integer,
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

  insert into public.subcategories (
    id, category_id, slug, name, image, sort_order, is_published, updated_at
  ) values (
    p_id, p_category_id, p_slug, p_name, coalesce(p_image, ''),
    coalesce(p_sort_order, 100), coalesce(p_is_published, true), now()
  );

  return p_id;
end;
$$;

create or replace function public.admin_update_subcategory(
  admin_secret text,
  p_id text,
  p_category_id text,
  p_slug text,
  p_name text,
  p_image text,
  p_sort_order integer,
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

  update public.subcategories set
    category_id = p_category_id,
    slug = p_slug,
    name = p_name,
    image = coalesce(nullif(p_image, ''), image),
    sort_order = coalesce(p_sort_order, sort_order),
    is_published = coalesce(p_is_published, is_published),
    updated_at = now()
  where id = p_id;

  if not found then
    raise exception 'not_found';
  end if;

  return true;
end;
$$;

create or replace function public.admin_delete_subcategory(admin_secret text, p_id text)
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

  select count(*) into cnt from public.products where subcategory_id = p_id;
  if cnt > 0 then
    raise exception 'subcategory_has_products';
  end if;

  delete from public.subcategories where id = p_id;
  if not found then
    raise exception 'not_found';
  end if;

  return true;
end;
$$;

-- ---------- RPC: товары (добавлен subcategory_id) ----------

drop function if exists public.admin_insert_product(
  text, text, text, text, text, numeric, text, text, numeric, text, numeric,
  numeric, numeric, numeric, numeric, text, boolean, text, text, text, boolean
);

create or replace function public.admin_insert_product(
  admin_secret text,
  p_slug text,
  p_category_id text,
  p_subcategory_id text,
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
    slug, category_id, subcategory_id, name, size, dimension, steel, gost, length_m, sale_unit,
    weight_kg, price_per_ton, price_per_unit, price_per_meter, meters_per_sale_unit,
    stock, popular, article, card_title, image, is_published, updated_at
  ) values (
    p_slug, p_category_id, nullif(p_subcategory_id, ''), p_name, p_size, p_dimension, p_steel, p_gost, p_length_m, p_sale_unit,
    p_weight_kg, p_price_per_ton, p_price_per_unit, p_price_per_meter, p_meters_per_sale_unit,
    p_stock, p_popular, p_article, p_card_title, p_image, coalesce(p_is_published, true), now()
  )
  returning id into new_id;

  return new_id;
end;
$$;

drop function if exists public.admin_update_product(
  text, text, text, text, text, numeric, text, text, numeric, text, numeric,
  numeric, numeric, numeric, numeric, text, boolean, text, text, text, boolean
);

create or replace function public.admin_update_product(
  admin_secret text,
  p_slug text,
  p_category_id text,
  p_subcategory_id text,
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
    subcategory_id = nullif(p_subcategory_id, ''),
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

grant execute on function public.admin_list_subcategories(text, text) to anon, authenticated;
grant execute on function public.admin_insert_subcategory(text, text, text, text, text, text, integer, boolean) to anon, authenticated;
grant execute on function public.admin_update_subcategory(text, text, text, text, text, text, integer, boolean) to anon, authenticated;
grant execute on function public.admin_delete_subcategory(text, text) to anon, authenticated;

grant execute on function public.admin_insert_product(
  text, text, text, text, text, text, numeric, text, text, numeric, text, numeric,
  numeric, numeric, numeric, numeric, text, boolean, text, text, text, boolean
) to anon, authenticated;
grant execute on function public.admin_update_product(
  text, text, text, text, text, text, numeric, text, text, numeric, text, numeric,
  numeric, numeric, numeric, numeric, text, boolean, text, text, text, boolean
) to anon, authenticated;

-- Пример для «Трубы стальные» (можно удалить или изменить в админке)
insert into public.subcategories (id, category_id, slug, name, image, sort_order, is_published)
values
  ('pipe-vgp', 'pipe', 'vgp', 'Трубы стальные водогазопроводные', '/products/pipe-sub/vgp.webp', 1, true),
  ('pipe-electro', 'pipe', 'elektrosvarnye', 'Трубы стальные электросварные', '/products/pipe-sub/electro.webp', 2, true),
  ('pipe-profile', 'pipe', 'profilnye', 'Трубы стальные профильные', '/products/pipe-sub/profile.webp', 3, true)
on conflict (id) do update set
  name = excluded.name,
  image = excluded.image,
  sort_order = excluded.sort_order,
  updated_at = now();
