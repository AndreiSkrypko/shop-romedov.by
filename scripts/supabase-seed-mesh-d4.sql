-- Товары: подкатегория «Сетка сварная d 4 мм» (mesh-d4).
-- Перед запуском: supabase-seed-mesh-subcategories.sql.
-- weight_kg — масса одной карты (ориентир для цены за карту из BYN/т).

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
  'mesh-d4',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  v.gost,
  null,
  'карта',
  v.weight_kg,
  v.price_per_ton,
  null,
  null,
  null,
  'in',
  false,
  v.article,
  v.card_title,
  '/products/mesh.webp',
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'setka-armiruyushchaya-art-07343',
      'Сетка армирующая сварная С500 d4,0 мм, ячейка 50×50 мм, лист 500×2000 мм, ГОСТ 23279',
      '50×50 мм, лист 500×2000 мм',
      50::numeric,
      'С500',
      'ГОСТ 23279-2012',
      3.95::numeric,
      3708::numeric,
      '07343',
      'Сетка С500 d4, 50×50, лист 500×2000',
      1
    ),
    (
      'setka-armiruyushchaya-art-07342',
      'Сетка армирующая сварная С500 d4,0 мм, ячейка 50×50 мм, лист 380×2000 мм, ГОСТ 23279',
      '50×50 мм, лист 380×2000 мм',
      50::numeric,
      'С500',
      'ГОСТ 23279-2012',
      3.0::numeric,
      3090::numeric,
      '07342',
      'Сетка С500 d4, 50×50, лист 380×2000',
      2
    ),
    (
      'setka-armiruyushchaya-art-07239',
      'Сетка армирующая сварная С500 d4,0 мм, ячейка 100×100 мм, лист 1000×2000 мм, ГОСТ 23279',
      '100×100 мм, лист 1000×2000 мм',
      100::numeric,
      'С500',
      'ГОСТ 23279-2012',
      4.4::numeric,
      3710::numeric,
      '07239',
      'Сетка С500 d4, 100×100, лист 1000×2000',
      3
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
  article,
  card_title,
  sort_order
)
where c.slug = 'setka-armiruyushchaya'
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
