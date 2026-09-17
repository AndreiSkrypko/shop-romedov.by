-- Удалить пример подкатегорий «Трубы», если категория pipe не используется.
-- SQL Editor → Run (только если не планируете раздел «Трубы стальные»).

delete from public.subcategories
where category_id = 'pipe'
  and id in ('pipe-vgp', 'pipe-electro', 'pipe-profile');
