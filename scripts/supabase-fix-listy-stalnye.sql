-- Восстановить «Листы стальные» на витрине после миграции г/к листов.
-- Supabase → SQL Editor → Run. Затем обновите сайт (F5).

-- Категория на витрине: is_published + slug listy-stalnye
update public.categories
set
  is_published = true,
  slug = 'listy-stalnye',
  updated_at = now()
where id in ('sheet', 'listy-stalnye')
   or name ilike 'Листы стальные';

-- Если строки не было — создать (id sheet, как в seed)
insert into public.categories (
  id, slug, name, menu_name, tagline, description, image, sort_order,
  dimension_label, seo_title, seo_description, is_published, updated_at
)
select
  'sheet',
  'listy-stalnye',
  'Листы стальные',
  'Листы стальные',
  'Г/К, х/к, оцинкованный, рифлёный, ПВЛ',
  'Листовой металл под раскрой. Резка в размер, доставка по Беларуси.',
  '/products/sheet.webp',
  4,
  'Толщина',
  'Лист стальной | Ромедов',
  'Стальной лист, резка в размер.',
  true,
  now()
where not exists (select 1 from public.categories where slug = 'listy-stalnye')
on conflict (id) do update set
  slug = excluded.slug,
  is_published = true,
  updated_at = now();

-- Канонический category_id
with cat as (
  select id from public.categories where slug = 'listy-stalnye' order by updated_at desc limit 1
)
update public.subcategories s
set category_id = (select id from cat), is_published = true
where s.slug = 'goryachekatannyy'
   or s.id = 'sheet-gk'
   or s.name ilike '%горячекатан%';

with cat as (
  select id from public.categories where slug = 'listy-stalnye' limit 1
)
update public.products p
set category_id = (select id from cat)
where p.slug like 'listy-stalnye-gk-art-%'
   or p.article in ('17559', '08542', '08529', '08543', '10027', '09817', '06002', '09733');

-- Проверка (должна быть 1 строка is_published = true):
-- select id, slug, is_published from public.categories where slug = 'listy-stalnye';
