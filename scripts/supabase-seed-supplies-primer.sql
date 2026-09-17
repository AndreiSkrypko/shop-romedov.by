-- Товары: подкатегория «Грунтовка по металлу» (supplies-primer).
-- Перед запуском: supabase-seed-supplies-subcategories.sql.

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
  'supplies-primer',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  v.gost,
  null,
  'шт',
  v.weight_kg,
  null,
  v.price_per_unit,
  null,
  null,
  'in',
  false,
  v.article,
  v.card_title,
  '/products/supplies.webp',
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'soputstvuyushchie-art-15003',
      'Грунтовка ГФ-021 по металлу красно-коричневый 2,5 кг ГОСТ 25129-82',
      'банка 2,5 кг',
      2.5::numeric,
      'ГФ-021',
      'ГОСТ 25129-82',
      2.5::numeric,
      33::numeric,
      '15003',
      'Грунтовка ГФ-021 2,5 кг, красно-коричн.',
      1
    ),
    (
      'soputstvuyushchie-art-14927',
      'Грунтовка ГФ-021 банка 2,5 кг, банка СЕРАЯ, ГОСТ 25129-82, РФ',
      'банка 2,5 кг, серая',
      2.5::numeric,
      'ГФ-021',
      'ГОСТ 25129-82',
      2.5::numeric,
      29::numeric,
      '14927',
      'Грунтовка ГФ-021 2,5 кг, серая, РФ',
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
  price_per_unit,
  article,
  card_title,
  sort_order
)
where c.slug = 'soputstvuyushchie-tovary'
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
  price_per_unit = excluded.price_per_unit,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();
