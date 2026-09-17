-- Товары: подкатегория «Лист просечно-вытяжной» (sheet-pvl).
-- Перед запуском: supabase-seed-sheet-subcategories.sql, категория slug listy-stalnye.
-- Вес листа — ориентир для расчёта цены за лист (ПВЛ легче сплошного листа).

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
  'sheet-pvl',
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
      'listy-stalnye-pvl-art-16481',
      'Лист ПВ 506 5×1000×3400 ТУ 25.93.13-003-33316304-2022',
      'ПВ506 5×1000×3400 мм',
      5::numeric,
      'ПВ506',
      'ТУ 25.93.13-003-33316304-2022',
      22::numeric,
      3390::numeric,
      'in',
      '16481',
      'Лист ПВ506 5×1000×3400',
      1
    ),
    (
      'listy-stalnye-pvl-art-16778',
      'Лист ПВЛ (просечно-вытяжной) 506×1500×3300 ТУ',
      'ПВ506 1500×3300 мм',
      5::numeric,
      'ПВ506',
      'ТУ',
      32::numeric,
      3660::numeric,
      'in',
      '16778',
      'Лист ПВЛ 506×1500×3300',
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
