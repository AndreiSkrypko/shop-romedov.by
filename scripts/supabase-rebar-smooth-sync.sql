-- Синхронизация «Арматура гладкая»: 7 позиций, порядок на витрине (иллюстрации — в коде сайта).
-- SQL Editor → Run

alter table public.products add column if not exists sort_order integer not null default 0;

delete from public.products
where category_id = 'rebar-smooth'
  and slug not in (
    'armatura-gladkaya-art-10388',
    'armatura-gladkaya-art-08583',
    'armatura-gladkaya-art-08729',
    'armatura-gladkaya-art-11533',
    'armatura-gladkaya-art-10510',
    'armatura-gladkaya-art-12420',
    'armatura-gladkaya-art-09228'
  );

update public.products set sort_order = 1, image = null, subcategory_id = null, updated_at = now()
where slug = 'armatura-gladkaya-art-10510';

update public.products set sort_order = 2, image = null, subcategory_id = null, updated_at = now()
where slug = 'armatura-gladkaya-art-08729';

update public.products set sort_order = 3, image = null, subcategory_id = null, updated_at = now()
where slug = 'armatura-gladkaya-art-10388';

update public.products set sort_order = 4, image = null, subcategory_id = null, updated_at = now()
where slug = 'armatura-gladkaya-art-11533';

update public.products set sort_order = 5, image = null, subcategory_id = null, updated_at = now()
where slug = 'armatura-gladkaya-art-08583';

update public.products set sort_order = 6, image = null, subcategory_id = null, updated_at = now()
where slug = 'armatura-gladkaya-art-09228';

update public.products set sort_order = 7, image = null, subcategory_id = null, updated_at = now()
where slug = 'armatura-gladkaya-art-12420';
