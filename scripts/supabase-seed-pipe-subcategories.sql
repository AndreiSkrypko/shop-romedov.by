-- Категория «Трубы стальные» + 4 подкатегории (плитки на витрине).
-- Перед запуском: supabase-subcategories.sql, supabase-admin-rpc.sql.
-- Slug категории: truby-stalnye → ?sub=vgp | elektrosvarnye | profilnye | ocinkovannye

insert into public.categories (
  id, slug, name, menu_name, tagline, description, image, sort_order,
  dimension_label, seo_title, seo_description, is_published, updated_at
) values (
  'pipe',
  'truby-stalnye',
  'Трубы стальные',
  'Трубы стальные',
  'Профильные, круглые электросварные, ВГП',
  'Профильная труба для каркасов и навесов, круглая электросварная для конструкций и ВГП для водогазопроводных линий. Резка в размер бесплатно.',
  '/products/pipe.webp',
  5,
  'Сечение',
  'Трубы стальные — профильная, круглая, ВГП | Ромедов',
  'Профильная, круглая электросварная и водогазопроводная труба. Цена за тонну и за метр, наличие, резка в размер, доставка по Минску и Беларуси.',
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
  v.image,
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'pipe-vgp',
      'vgp',
      'Трубы стальные водогазопроводные',
      '/products/pipe-sub/vgp.webp',
      1
    ),
    (
      'pipe-electro',
      'elektrosvarnye',
      'Трубы стальные электросварные',
      '/products/pipe-sub/electro.webp',
      2
    ),
    (
      'pipe-profile',
      'profilnye',
      'Трубы стальные профильные',
      '/products/pipe-sub/profile.webp',
      3
    ),
    (
      'pipe-zn',
      'ocinkovannye',
      'Трубы оцинкованные водогазопроводные (ВГП) и электросварные',
      '/products/pipe.webp',
      4
    )
) as v(id, slug, name, image, sort_order)
where c.slug = 'truby-stalnye'
on conflict (id) do update set
  category_id = excluded.category_id,
  slug = excluded.slug,
  name = excluded.name,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = true,
  updated_at = now();

-- select id, slug, name from public.subcategories
-- where category_id = 'pipe' order by sort_order;
