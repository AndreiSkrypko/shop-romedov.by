-- Все товары раздела «Метизы» → «Цена по запросу» на витрине.
-- Сначала выполните scripts/supabase-prod-patch-product-price-display.sql (колонки price_display_mode).
-- Supabase → SQL Editor → Run. Безопасно повторять.

-- 1) По категории (id / slug / название)
update public.products p
set
  price_display_mode = 'on_request',
  price_custom_label = null,
  updated_at = now()
from public.categories c
where p.category_id = c.id
  and (
    lower(c.id) in ('metizy', 'metiz', 'metizy-i-krepezh', 'krepezh', 'fasteners', 'hardware')
    or lower(c.slug) in ('metizy', 'metiz', 'metizy-i-krepezh', 'krepezh', 'krepezh-metizy')
    or c.name ilike '%метиз%'
    or c.menu_name ilike '%метиз%'
    or c.name ilike '%крепёж%'
    or c.menu_name ilike '%крепёж%'
  );

-- 2) По подкатегории (если метизы — плитка внутри другой категории)
update public.products p
set
  price_display_mode = 'on_request',
  price_custom_label = null,
  updated_at = now()
from public.subcategories s
where p.subcategory_id = s.id
  and (
    lower(s.id) like '%metiz%'
    or lower(s.slug) like '%metiz%'
    or lower(s.slug) like '%krepezh%'
    or s.name ilike '%метиз%'
    or s.name ilike '%крепёж%'
  );

-- Проверка (сколько строк затронуто — смотрите результат Run):
-- select p.slug, p.name, c.name as category, s.name as subcategory, p.price_display_mode
-- from public.products p
-- join public.categories c on c.id = p.category_id
-- left join public.subcategories s on s.id = p.subcategory_id
-- where p.price_display_mode = 'on_request'
-- order by c.name, p.name;
