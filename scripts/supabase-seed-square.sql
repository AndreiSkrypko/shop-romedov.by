-- Категория «Квадрат стальной» + 2 товара (референс витрины).
-- Перед запуском: supabase-schema.sql, supabase-admin-rpc.sql.
-- Полный список категорий: supabase-seed-categories.sql (id square уже там).

insert into public.categories (
  id, slug, name, menu_name, tagline, description, image, sort_order,
  dimension_label, seo_title, seo_description, is_published, updated_at
) values (
  'square',
  'kvadrat-stalnoy',
  'Квадрат стальной',
  'Квадрат стальной',
  'Горячекатаный 10–40 мм',
  'Стальной квадратный прокат для осей, кронштейнов, декоративной ковки и заготовок под мехобработку. Марка Ст3сп/пс, длина 6 м.',
  '/products/square.webp',
  8,
  'Сторона',
  'Квадрат стальной горячекатаный — цена, наличие | Ромедов',
  'Квадрат стальной горячекатаный 10×10 — 40×40 мм по ГОСТ 2591-2006. Продажа тоннами и метрами, резка в размер, доставка по Беларуси.',
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
  'square',
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
  '/products/square.webp',
  v.sort_order,
  true,
  now()
from (
  values
    (
      'kvadrat-stalnoy-art-15226',
      'Квадрат стальной ст3 12×12 мм',
      '12×12 мм',
      12::numeric,
      'Ст3',
      'ГОСТ 2591-2006',
      1.13::numeric,
      4011.85::numeric,
      'in',
      '15226',
      'Квадрат стальной ст3 12×12 мм',
      1
    ),
    (
      'kvadrat-stalnoy-art-08490',
      'Квадрат стальной ст3 10×10 мм',
      '10×10 мм',
      10::numeric,
      'Ст3',
      'ГОСТ 2591-2006',
      0.785::numeric,
      null::numeric,
      'out',
      '08490',
      'Квадрат стальной ст3 10×10 мм',
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
