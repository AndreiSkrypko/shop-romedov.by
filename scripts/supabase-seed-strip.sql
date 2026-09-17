-- Категория «Полоса стальная» + 2 товара (референс витрины).
-- Перед запуском: supabase-schema.sql, supabase-admin-rpc.sql.

insert into public.categories (
  id, slug, name, menu_name, tagline, description, image, sort_order,
  dimension_label, seo_title, seo_description, is_published, updated_at
) values (
  'strip',
  'polosa-stalnaya',
  'Полоса стальная',
  'Полоса стальная',
  'Толщины 4–10 мм, ширины 20–100 мм',
  'Горячекатаная стальная полоса для обвязок, накладок, закладных деталей и ограждений. Ровная геометрия, готова к сварке и гибке.',
  '/products/strip.webp',
  9,
  'Сечение',
  'Полоса стальная горячекатаная — купить в Беларуси | Ромедов',
  'Полоса стальная горячекатаная 20×4 — 100×10 мм по ГОСТ 103-2006. Цена за тонну и за метр, резка в размер, доставка по Минску и области.',
  true,
  now()
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  menu_name = excluded.menu_name,
  tagline = excluded.tagline,
  description = excluded.description,
  image = excluded.image,
  sort_order = excluded.sort_order,
  dimension_label = excluded.dimension_label,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  is_published = true,
  updated_at = now();

insert into public.products (
  slug,
  category_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  v.slug,
  'strip',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  v.gost,
  6::numeric,
  'м',
  v.weight_kg,
  v.price_per_ton,
  null,
  null,
  null,
  v.stock,
  false,
  v.article,
  v.card_title,
  '/products/strip.webp',
  v.sort_order,
  true,
  now()
from (
  values
    (
      'polosa-stalnaya-art-06243',
      'Полоса стальная г/к 25×4×6000',
      '25×4×6000 мм',
      25::numeric,
      'Ст3сп/пс',
      'ГОСТ 103-2006',
      0.785::numeric,
      3340::numeric,
      'in',
      '06243',
      'Полоса г/к 25×4×6000',
      1
    ),
    (
      'polosa-stalnaya-art-05991',
      'Полоса стальная г/к 40×4×6000',
      '40×4×6000 мм',
      40::numeric,
      'Ст3сп/пс',
      'ГОСТ 103-2006',
      1.256::numeric,
      null::numeric,
      'out',
      '05991',
      'Полоса г/к 40×4×6000',
      2
    )
) as v(
  slug,
  name,
  size,
  dimension,
  steel,
  gost,
  weight_kg,
  price_per_ton,
  stock,
  article,
  card_title,
  sort_order
)
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  length_m = excluded.length_m,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_ton = excluded.price_per_ton,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();
