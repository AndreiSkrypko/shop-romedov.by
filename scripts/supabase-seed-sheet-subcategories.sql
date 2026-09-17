-- Подкатегории «Листы стальные» (6 плиток на витрине).
-- Г/к (sheet-gk) можно уже иметь — скрипт идempotent (on conflict).
-- Supabase → SQL Editor. Категория: slug listy-stalnye.

update public.categories
set is_published = true
where slug = 'listy-stalnye' or id in ('sheet', 'listy-stalnye');

insert into public.subcategories (id, category_id, slug, name, image, sort_order, is_published, updated_at)
select
  v.id,
  c.id,
  v.slug,
  v.name,
  coalesce(nullif(c.image, ''), '/products/sheet.webp'),
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'sheet-gk',
      'goryachekatannyy',
      'Лист стальной горячекатанный',
      1
    ),
    (
      'sheet-polymer',
      'polimernoe-pokrytie',
      'Лист плоский с полимерным покрытием',
      2
    ),
    (
      'sheet-hk',
      'holodnokatanyy',
      'Лист стальной холоднокатаный',
      3
    ),
    (
      'sheet-pvl',
      'prosechno-vytyazhnoy',
      'Лист просечно-вытяжной',
      4
    ),
    (
      'sheet-rif',
      'riflenyy',
      'Лист рифлёный стальной',
      5
    ),
    (
      'sheet-zn',
      'ocinkovannyy',
      'Лист стальной оцинкованный',
      6
    )
) as v(id, slug, name, sort_order)
where c.slug = 'listy-stalnye'
on conflict (id) do update set
  category_id = excluded.category_id,
  slug = excluded.slug,
  name = excluded.name,
  sort_order = excluded.sort_order,
  is_published = true,
  updated_at = now();

-- Проверка:
-- select id, slug, name, sort_order from public.subcategories
-- where category_id = (select id from categories where slug = 'listy-stalnye' limit 1)
-- order by sort_order;
