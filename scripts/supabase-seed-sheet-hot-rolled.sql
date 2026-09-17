-- Подкатегория «Лист стальной горячекатанный» + 8 товаров (как на референсе).
-- Перед запуском: supabase-admin-rpc.sql, supabase-subcategories.sql.
-- Если категория пропала с витрины — scripts/supabase-fix-listy-stalnye.sql

update public.categories
set is_published = true
where slug = 'listy-stalnye' or id in ('sheet', 'listy-stalnye');

insert into public.subcategories (id, category_id, slug, name, image, sort_order, is_published, updated_at)
select
  'sheet-gk',
  c.id,
  'goryachekatannyy',
  'Лист стальной горячекатанный',
  coalesce(nullif(c.image, ''), '/products/sheet.webp'),
  1,
  true,
  now()
from public.categories c
where c.slug = 'listy-stalnye'
on conflict (id) do update set
  category_id = excluded.category_id,
  slug = excluded.slug,
  name = excluded.name,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();

insert into public.products (
  slug,
  category_id,
  subcategory_id,
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
  c.id,
  'sheet-gk',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  v.gost,
  null,
  'лист',
  v.weight_kg,
  v.price_per_ton,
  null,
  null,
  null,
  v.stock,
  false,
  v.article,
  v.card_title,
  '/products/sheet.webp',
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'listy-stalnye-gk-art-17559',
      'Лист г/к 3х1500х3000 Ст3п/сп5 Россия',
      '3×1500×3000 мм',
      3::numeric,
      'Ст3п/сп5',
      '',
      105.98::numeric,
      2950::numeric,
      'in',
      '17559',
      'Лист г/к 3×1500×3000 Ст3п/сп5',
      1
    ),
    (
      'listy-stalnye-gk-art-08542',
      'Лист стальной горячекатаный 4х1500*6000',
      '4×1500×6000 мм',
      4::numeric,
      'Ст3сп',
      'ГОСТ 19903-2015',
      282.6::numeric,
      2910::numeric,
      'in',
      '08542',
      'Лист г/к 4×1500×6000',
      2
    ),
    (
      'listy-stalnye-gk-art-08529',
      'Лист стальной горячекатаный 8х1500х6000',
      '8×1500×6000 мм',
      8::numeric,
      'Ст3сп',
      'ГОСТ 19903-2015',
      565.2::numeric,
      2950::numeric,
      'in',
      '08529',
      'Лист г/к 8×1500×6000',
      3
    ),
    (
      'listy-stalnye-gk-art-08543',
      'Лист стальной горячекатаный 6х1500х6000',
      '6×1500×6000 мм',
      6::numeric,
      'Ст3сп',
      'ГОСТ 19903-2015',
      423.9::numeric,
      3080::numeric,
      'in',
      '08543',
      'Лист г/к 6×1500×6000',
      4
    ),
    (
      'listy-stalnye-gk-art-10027',
      'Лист г/к (Б-ПН-НО-IV-3*1500*6000)',
      '3×1500×6000 мм',
      3::numeric,
      'Ст3сп',
      'ГОСТ 19903-2015',
      211.95::numeric,
      2925.2::numeric,
      'in',
      '10027',
      'Лист г/к 3×1500×6000 Б-ПН-НО-IV',
      5
    ),
    (
      'listy-stalnye-gk-art-09817',
      'Сталь листовая г\к ГОСТ 14637 Ст3сп5 10,0х1500х6000 (РФ)',
      '10×1500×6000 мм',
      10::numeric,
      'Ст3сп5',
      'ГОСТ 14637',
      706.5::numeric,
      2960::numeric,
      'in',
      '09817',
      'Лист г/к 10×1500×6000 Ст3сп5',
      6
    ),
    (
      'listy-stalnye-gk-art-06002',
      'Лист стальной горячекатаный 2х1250х2500',
      '2×1250×2500 мм',
      2::numeric,
      'Ст3сп',
      'ГОСТ 19903-2015',
      49.06::numeric,
      3100::numeric,
      'in',
      '06002',
      'Лист г/к 2×1250×2500',
      7
    ),
    (
      'listy-stalnye-gk-art-09733',
      'Лист стальной горячекатаный 3х1250х2500',
      '3×1250×2500 мм',
      3::numeric,
      'Ст3сп',
      'ГОСТ 19903-2015',
      73.59::numeric,
      3100::numeric,
      'out',
      '09733',
      'Лист г/к 3×1250×2500',
      8
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
where c.slug = 'listy-stalnye'
on conflict (slug) do update set
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
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
