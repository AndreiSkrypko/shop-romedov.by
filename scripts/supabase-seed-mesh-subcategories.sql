-- Категория «Сетка армирующая сварная» + 3 подкатегории (диаметр проволоки).
-- Перед запуском: supabase-subcategories.sql, supabase-admin-rpc.sql.
-- Slug категории: setka-armiruyushchaya → ?sub=d-4-mm | d-3-mm | d-5-mm

insert into public.categories (
  id, slug, name, menu_name, tagline, description, image, sort_order,
  dimension_label, seo_title, seo_description, is_published, updated_at
) values (
  'mesh',
  'setka-armiruyushchaya',
  'Сетка армирующая сварная',
  'Сетка сварная',
  'Карты 50×50 — 200×200 мм',
  'Сварная арматурная сетка в картах для стяжек, фундаментных плит, дорожек и кладки. Точный шаг ячейки и надёжные сварные узлы.',
  '/products/mesh.webp',
  10,
  'Ячейка',
  'Сетка сварная армирующая в картах — цена | Ромедов',
  'Сварная арматурная сетка 50×50, 100×100, 150×150, 200×200 мм в картах. Цена за карту и за м², наличие, доставка по Беларуси.',
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

insert into public.subcategories (id, category_id, slug, name, image, sort_order, is_published, updated_at)
select
  v.id,
  c.id,
  v.slug,
  v.name,
  coalesce(nullif(c.image, ''), '/products/mesh.webp'),
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'mesh-d4',
      'd-4-mm',
      'Сетка сварная d 4 мм',
      1
    ),
    (
      'mesh-d3',
      'd-3-mm',
      'Сетка сварная d 3 мм',
      2
    ),
    (
      'mesh-d5',
      'd-5-mm',
      'Сетка сварная d 5 мм',
      3
    )
) as v(id, slug, name, sort_order)
where c.slug = 'setka-armiruyushchaya'
on conflict (id) do update set
  category_id = excluded.category_id,
  slug = excluded.slug,
  name = excluded.name,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = true,
  updated_at = now();

-- select id, slug, name from public.subcategories
-- where category_id = 'mesh' order by sort_order;
