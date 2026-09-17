-- Синхронизация «Арматура рифлёная»: 8 позиций, уникальные иллюстрации, порядок карточек.
-- Файлы: public/products/rebar-catalog/ribbed/art-*.svg
-- SQL Editor → Run

alter table public.products add column if not exists sort_order integer not null default 0;

delete from public.products
where category_id = 'rebar-ribbed'
  and slug not in (
    'armatura-riflenaya-art-08152',
    'armatura-riflenaya-art-16068',
    'armatura-riflenaya-art-10311',
    'armatura-riflenaya-art-06626',
    'armatura-riflenaya-art-08663',
    'armatura-riflenaya-art-05862',
    'armatura-riflenaya-art-08492',
    'armatura-riflenaya-art-08750'
  );

update public.products set sort_order = 1, image = '/products/rebar-catalog/ribbed/art-08152.svg', subcategory_id = null, updated_at = now()
where slug = 'armatura-riflenaya-art-08152';

update public.products set sort_order = 2, image = '/products/rebar-catalog/ribbed/art-16068.svg', subcategory_id = null, updated_at = now()
where slug = 'armatura-riflenaya-art-16068';

update public.products set sort_order = 3, image = '/products/rebar-catalog/ribbed/art-10311.svg', card_title = 'Арматура ненапрягаемая х/д.ф8 мм S500 СТБ1704-2012', subcategory_id = null, updated_at = now()
where slug = 'armatura-riflenaya-art-10311';

update public.products set sort_order = 4, image = '/products/rebar-catalog/ribbed/art-06626.svg', subcategory_id = null, updated_at = now()
where slug = 'armatura-riflenaya-art-06626';

update public.products set sort_order = 5, image = '/products/rebar-catalog/ribbed/art-08663.svg', subcategory_id = null, updated_at = now()
where slug = 'armatura-riflenaya-art-08663';

update public.products set sort_order = 6, image = '/products/rebar-catalog/ribbed/art-05862.svg', subcategory_id = null, updated_at = now()
where slug = 'armatura-riflenaya-art-05862';

update public.products set sort_order = 7, image = '/products/rebar-catalog/ribbed/art-08492.svg', subcategory_id = null, updated_at = now()
where slug = 'armatura-riflenaya-art-08492';

update public.products set sort_order = 8, image = '/products/rebar-catalog/ribbed/art-08750.svg', subcategory_id = null, updated_at = now()
where slug = 'armatura-riflenaya-art-08750';
