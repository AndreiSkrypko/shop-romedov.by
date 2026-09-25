-- Прод: ошибка «Could not find the function public.admin_update_product(… p_sort_order … p_subcategory_id …)»
-- Выполните в Supabase → SQL Editor (прод-проект). Безопасно повторять.

alter table public.products
  add column if not exists subcategory_id text references public.subcategories (id) on delete set null;

alter table public.products
  add column if not exists sort_order integer not null default 0;

do $$
declare
  fn record;
begin
  for fn in
    select p.oid::regprocedure as sig
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('admin_insert_product', 'admin_update_product')
  loop
    execute format('drop function if exists %s', fn.sig);
  end loop;
end;
$$;

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
  p_sort_order integer,
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
    stock, popular, article, card_title, image, sort_order, is_published, updated_at
  ) values (
    p_slug, p_category_id, nullif(trim(p_subcategory_id), ''), p_name, p_size, p_dimension, p_steel,
    p_gost, p_length_m, p_sale_unit, p_weight_kg, p_price_per_ton, p_price_per_unit, p_price_per_meter,
    p_meters_per_sale_unit, p_stock, p_popular, p_article, p_card_title, p_image,
    coalesce(p_sort_order, 0), coalesce(p_is_published, true), now()
  )
  returning id into new_id;

  return new_id;
end;
$$;

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

  update public.products set
    category_id = p_category_id,
    subcategory_id = nullif(trim(p_subcategory_id), ''),
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
    sort_order = coalesce(p_sort_order, sort_order),
    is_published = coalesce(p_is_published, true),
    updated_at = now()
  where slug = p_slug;

  if not found then
    raise exception 'not_found';
  end if;

  return true;
end;
$$;

grant execute on function public.admin_insert_product(
  text, text, text, text, text, text, numeric, text, text, numeric, text, numeric,
  numeric, numeric, numeric, numeric, text, boolean, text, text, text, integer, boolean
) to anon, authenticated;
grant execute on function public.admin_update_product(
  text, text, text, text, text, text, numeric, text, text, numeric, text, numeric,
  numeric, numeric, numeric, numeric, text, boolean, text, text, text, integer, boolean
) to anon, authenticated;

notify pgrst, 'reload schema';
