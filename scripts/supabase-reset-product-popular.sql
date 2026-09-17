-- Сброс «популярных» на главной: после этого отметьте нужные товары только в админке.
-- (Старые сиды могли проставить popular = true массово.)

update public.products
set popular = false,
    updated_at = now()
where popular = true;
