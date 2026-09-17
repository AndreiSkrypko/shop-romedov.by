-- Категория «Сопутствующие товары» + 4 подкатегории (плитки на витрине).
-- Перед запуском: supabase-subcategories.sql, supabase-admin-rpc.sql.
-- Slug категории: soputstvuyushchie-tovary

insert into public.categories (
  id, slug, name, menu_name, tagline, description, image, sort_order,
  dimension_label, seo_title, seo_description, is_published, updated_at
) values (
  'supplies',
  'soputstvuyushchie-tovary',
  'Сопутствующие товары',
  'Сопутствующие товары',
  'Крепёж, проволока, электроды, ЛКМ',
  'Всё, что нужно закрыть вместе с металлом: вязальная проволока, электроды, диски, анкеры и грунт-эмаль. Одна доставка на весь объект.',
  '/products/supplies.webp',
  11,
  'Типоразмер',
  'Сопутствующие товары для металла — крепёж, электроды | Ромедов',
  'Вязальная проволока, электроды, отрезные диски, анкеры и грунт-эмаль. Доставим одной машиной вместе с металлопрокатом по Беларуси.',
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
  coalesce(nullif(c.image, ''), '/products/supplies.webp'),
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'supplies-electrodes',
      'svarochnye-elektrody',
      'Сварочные электроды',
      1
    ),
    (
      'supplies-caps',
      'zaglushki-na-profilnye-truby',
      'Заглушки на профильные трубы',
      2
    ),
    (
      'supplies-primer',
      'gruntovka-po-metallu',
      'Грунтовка по металлу',
      3
    ),
    (
      'supplies-wire',
      'provoloka-vyazalnaya',
      'Проволока вязальная',
      4
    )
) as v(id, slug, name, sort_order)
where c.slug = 'soputstvuyushchie-tovary'
on conflict (id) do update set
  category_id = excluded.category_id,
  slug = excluded.slug,
  name = excluded.name,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = true,
  updated_at = now();

-- select id, slug, name from public.subcategories
-- where category_id = 'supplies' order by sort_order;
