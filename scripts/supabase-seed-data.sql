-- Полный сид каталога (категории, подкатегории, товары).
-- Порядок развёртывания БД:
--   1. supabase-schema.sql
--   2. supabase-subcategories.sql
--   3. supabase-admin-rpc.sql
--   4. supabase-storage.sql
--   5. supabase-seed-data.sql  (этот файл)
-- Повторный запуск безопасен (on conflict).


-- ========== supabase-seed-categories.sql ==========

-- 11 категорий витрины (каталог только из БД, без статики в коде).
-- Перед запуском: supabase-admin-rpc.sql (таблица categories).
-- Скрипты rebar/fiberglass обновят те же id через on conflict.

insert into public.categories (
  id, slug, name, menu_name, tagline, description, image, sort_order,
  dimension_label, seo_title, seo_description, is_published, updated_at
) values
(
  'rebar-ribbed',
  'armatura-riflenaya',
  'Арматура рифлёная',
  'Арматура рифлёная',
  'А500С, диаметры 6–32 мм',
  'Горячекатаная арматура периодического профиля класса А500С для армирования железобетонных конструкций. Мерная длина 11,7 м, рубка в размер по запросу.',
  '/products/rebar-catalog/armatura-riflenaya.webp',
  1,
  'Диаметр',
  'Арматура рифлёная А500С — купить в Минске и Борисове | Ромедов',
  'Арматура рифлёная А500С Ø6–32 мм по ГОСТ 34028-2016. Цена за тонну и за метр, наличие на складе, рубка в размер, доставка по Беларуси.',
  true,
  now()
),
(
  'rebar-smooth',
  'armatura-gladkaya',
  'Арматура гладкая',
  'Арматура гладкая',
  'А240 (А1), диаметры 6–20 мм',
  'Гладкая горячекатаная арматура класса А240 для хомутов, монтажных петель и распределительной сетки. Хорошо гнётся и сваривается.',
  '/products/rebar-smooth.webp',
  2,
  'Диаметр',
  'Арматура гладкая А240 — цена, наличие | Ромедов',
  'Арматура гладкая А240 (А1) Ø6–20 мм по ГОСТ 34028-2016. Продажа тоннами и метрами, резка в размер, доставка по Минску и Беларуси.',
  true,
  now()
),
(
  'fiberglass-rebar',
  'armatura-stekloplastikovaya',
  'Арматура стеклопластиковая',
  'Арматура композитная',
  'АКП Ø4–16 мм, в прутках и бухтах',
  'Композитная арматура из стеклоровинга: в 4 раза легче стальной, не корродирует и не проводит тепло. Для фундаментов, стяжек, дорожных плит и гибких связей.',
  '/products/fiberglass-rebar.webp',
  3,
  'Диаметр',
  'Стеклопластиковая арматура АКП — купить в Беларуси | Ромедов',
  'Композитная стеклопластиковая арматура АКП Ø4–16 мм. Цена за метр, прутки и бухты, доставка по Беларуси. Не корродирует, легче стальной в 4 раза.',
  true,
  now()
),
(
  'sheet',
  'listy-stalnye',
  'Листы стальные',
  'Листы стальные',
  'Горячекатаный, оцинкованный, нержавейка',
  'Листовой металл под раскрой и изготовление деталей: горячекатаный Ст3сп5, оцинкованный и нержавеющий AISI 304. Порежем в размер на лазере или гильотине.',
  '/products/sheet.webp',
  4,
  'Толщина',
  'Лист стальной — горячекатаный, оцинкованный, нержавеющий | Ромедов',
  'Стальной лист г/к Ст3сп5, оцинкованный и нержавеющий AISI 304. Толщины 0,5–20 мм, резка в размер, лазерный раскрой, доставка по Беларуси.',
  true,
  now()
),
(
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
),
(
  'angle',
  'ugolok-stalnoy',
  'Уголок стальной',
  'Уголок стальной',
  'Равнополочный 25–100 мм',
  'Горячекатаный равнополочный уголок по ГОСТ 8509-93 для рам, обвязок, закладных и усиления конструкций. Мерная длина 6 и 11,7 м.',
  '/products/angle.webp',
  6,
  'Полка',
  'Уголок стальной равнополочный — цена за тонну и метр | Ромедов',
  'Уголок стальной равнополочный 25×25 — 100×100 мм по ГОСТ 8509-93. Продажа тоннами и метрами, резка в размер, доставка по Беларуси.',
  true,
  now()
),
(
  'channel',
  'shveller-stalnoy',
  'Швеллер стальной',
  'Швеллер стальной',
  'П-образный, номера 5–20',
  'Горячекатаный швеллер с параллельными полками по ГОСТ 8240-97. Основа для перекрытий, рам, эстакад и тяжёлых металлоконструкций.',
  '/products/channel.webp',
  7,
  'Номер',
  'Швеллер стальной — купить в Минске и Борисове | Ромедов',
  'Швеллер стальной горячекатаный № 5–20 по ГОСТ 8240-97. Цена за тонну и за метр, наличие на складе, резка, доставка по Беларуси.',
  true,
  now()
),
(
  'square',
  'kvadrat-stalnoy',
  'Квадрат стальной',
  'Квадрат стальной',
  'Горячекатаный 10–40 мм',
  'Стальной квадратный прокат для осей, кронштейнов, декоративной ковки и заготовок под мехобработку. Марка Ст3сп/пс, длина 6 м.',
  '/products/square.webp',
  8,
  'Сторона',
  'Квадрат стальной горячекатаный — цена, наличие | Ромедов',
  'Квадрат стальной горячекатаный 10×10 — 40×40 мм по ГОСТ 2591-2006. Продажа тоннами и метрами, резка в размер, доставка по Беларуси.',
  true,
  now()
),
(
  'strip',
  'polosa-stalnaya',
  'Полоса стальная',
  'Полоса стальная',
  'Толщины 4–10 мм, ширины 20–100 мм',
  'Горячекатаная стальная полоса для обвязок, накладок, закладных деталей и ограждений. Ровная геометрия, готова к сварке и гибке.',
  '/products/strip.webp',
  9,
  'Сечение',
  'Полоса стальная горячекатаная — купить в Беларуси | Ромедов',
  'Полоса стальная горячекатаная 20×4 — 100×10 мм по ГОСТ 103-2006. Цена за тонну и за метр, резка в размер, доставка по Минску и области.',
  true,
  now()
),
(
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
),
(
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
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-rebar-ribbed.sql ==========

-- Категория «Арматура рифлёная» и 8 позиций как на витрине-референсе.
-- Перед запуском: supabase-schema.sql, supabase-admin-rpc.sql, supabase-storage.sql (по необходимости).
-- Картинка категории: public/products/rebar-catalog/armatura-riflenaya.webp

alter table public.products add column if not exists sort_order integer not null default 0;

insert into public.categories (
  id, slug, name, menu_name, tagline, description, image, sort_order,
  dimension_label, seo_title, seo_description, is_published, updated_at
) values (
  'rebar-ribbed',
  'armatura-riflenaya',
  'Арматура рифлёная',
  'Арматура рифлёная',
  'А500С, А400С, S500 — в наличии',
  'Рифлёная арматура различных классов и диаметров: мерная длина 11,7 м, рубка в размер. Цена за тонну, доставка по Беларуси.',
  '/products/rebar-catalog/armatura-riflenaya.webp',
  1,
  'Диаметр',
  'Арматура рифлёная — купить в Минске и Борисове | Ромедов',
  'Арматура рифлёная А500С и А400С, цена за тонну, наличие на складе, резка в размер.',
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
  is_published = excluded.is_published,
  updated_at = now();

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

insert into public.products (
  slug, category_id, name, size, dimension, steel, gost, length_m, sale_unit,
  weight_kg, price_per_ton, price_per_unit, price_per_meter, meters_per_sale_unit,
  stock, popular, article, card_title, image, sort_order, is_published, updated_at
) values
(
  'armatura-riflenaya-art-08152',
  'rebar-ribbed',
  'Арматура ненапрягаемая х/д ф6 мм S500 СТБ 1704-2012, РБ',
  'Ø6 мм',
  6,
  'S500',
  'СТБ 1704-2012',
  11.7,
  'м',
  0.222,
  3450,
  null, null, null,
  'in', false, '08152',
  'Арматура ненапрягаемая х/д ф6мм S500 СТБ 1704-2012, РБ',
  '/products/rebar-catalog/ribbed/art-08152.svg',
  1,
  true, now()
),
(
  'armatura-riflenaya-art-16068',
  'rebar-ribbed',
  'Арматура ф25 А500С 11,7 м Россия',
  'Ø25 мм',
  25,
  'А500С',
  'ГОСТ 34028-2016',
  11.7,
  'м',
  3.853,
  3300,
  null, null, null,
  'in', false, '16068',
  'Арматура ф25 А500С 11,7м Россия',
  '/products/rebar-catalog/ribbed/art-16068.svg',
  2,
  true, now()
),
(
  'armatura-riflenaya-art-10311',
  'rebar-ribbed',
  'Арматура ненапрягаемая х/д ф8 мм S500 СТБ 1704-2012',
  'Ø8 мм',
  8,
  'S500',
  'СТБ 1704-2012',
  11.7,
  'м',
  0.395,
  3500,
  null, null, null,
  'in', false, '10311',
  'Арматура ненапрягаемая х/д.ф8 мм S500 СТБ1704-2012',
  '/products/rebar-catalog/ribbed/art-10311.svg',
  3,
  true, now()
),
(
  'armatura-riflenaya-art-06626',
  'rebar-ribbed',
  'Арматура ф12 А500С 11700 мм ГОСТ 34028-2016 Ст3сп (Россия)',
  'Ø12 мм',
  12,
  'А500С',
  'ГОСТ 34028-2016',
  11.7,
  'м',
  0.888,
  3250,
  null, null, null,
  'in', false, '06626',
  'Арматура ф12 А500 С 11700мм ГОСТ 34028-2016 Ст3сп (Россия)',
  '/products/rebar-catalog/ribbed/art-06626.svg',
  4,
  true, now()
),
(
  'armatura-riflenaya-art-08663',
  'rebar-ribbed',
  'Арматура ф20 А500С 11,7 м ГОСТ Р52544-2006 Россия',
  'Ø20 мм',
  20,
  'А500С',
  'ГОСТ Р52544-2006',
  11.7,
  'м',
  2.466,
  3250,
  null, null, null,
  'in', false, '08663',
  'Арматура ф20 А500С 11,7м Гост Р52544-2006 Россия',
  '/products/rebar-catalog/ribbed/art-08663.svg',
  5,
  true, now()
),
(
  'armatura-riflenaya-art-05862',
  'rebar-ribbed',
  'Арматура ф10, А500С, Ст3сп, 11,7 м Россия ГОСТ 34028-2016 СТБ 1704-2012',
  'Ø10 мм',
  10,
  'А500С',
  'ГОСТ 34028-2016 / СТБ 1704-2012',
  11.7,
  'м',
  0.617,
  3400,
  null, null, null,
  'in', false, '05862',
  'Арматура ф10, А500 С, Ст.3сп, 11,7м Россия ГОСТ 34028-2016 СТБ1704-2012',
  '/products/rebar-catalog/ribbed/art-05862.svg',
  6,
  true, now()
),
(
  'armatura-riflenaya-art-08492',
  'rebar-ribbed',
  'Арматура А400С/А500С, 16, Ст.сп/пс, Россия',
  'Ø16 мм',
  16,
  'А400С/А500С',
  'ГОСТ 34028-2016',
  11.7,
  'м',
  1.578,
  3250,
  null, null, null,
  'in', false, '08492',
  'Арматура А400С/А500С, 16, Ст.сп/пс, Россия',
  '/products/rebar-catalog/ribbed/art-08492.svg',
  7,
  true, now()
),
(
  'armatura-riflenaya-art-08750',
  'rebar-ribbed',
  'Арматура А400С/А500С, 14, Ст.сп/пс (ГОСТ 34028-2016 / СТБ 1704-2012) Россия',
  'Ø14 мм',
  14,
  'А400С/А500С',
  'ГОСТ 34028-2016 / СТБ 1704-2012',
  11.7,
  'м',
  1.208,
  3300,
  null, null, null,
  'in', false, '08750',
  'Арматура А400С/А500С, 14, Ст.сп/пс, (Гост 34028-2016/ СТБ 1704-2012)Россия',
  '/products/rebar-catalog/ribbed/art-08750.svg',
  8,
  true, now()
)
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  length_m = excluded.length_m,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_ton = excluded.price_per_ton,
  stock = excluded.stock,
  popular = excluded.popular,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-rebar-smooth.sql ==========

-- Категория «Арматура гладкая» и 7 позиций как на витрине-референсе.
-- Перед запуском: supabase-schema.sql, supabase-admin-rpc.sql
-- Картинка категории: public/products/rebar-catalog/armatura-gladkaya.png

delete from public.products where slug like 'armatura-gladkaya-%' and slug not like '%-art-%';

insert into public.categories (
  id, slug, name, menu_name, tagline, description, image, sort_order,
  dimension_label, seo_title, seo_description, is_published, updated_at
) values (
  'rebar-smooth',
  'armatura-gladkaya',
  'Арматура гладкая',
  'Арматура гладкая',
  'А240, круг — в наличии и под заказ',
  'Гладкая горячекатаная арматура и круглый прокат для хомутов, распределительной сетки и монтажных элементов. Цена за тонну, резка в размер.',
  '/products/rebar-catalog/armatura-gladkaya.png',
  2,
  'Диаметр',
  'Арматура гладкая — купить в Минске и Борисове | Ромедов',
  'Арматура гладкая А240 и круглый прокат, цена за тонну, наличие на складе.',
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
  is_published = excluded.is_published,
  updated_at = now();

insert into public.products (
  slug, category_id, name, size, dimension, steel, gost, length_m, sale_unit,
  weight_kg, price_per_ton, price_per_unit, price_per_meter, meters_per_sale_unit,
  stock, popular, article, card_title, image, is_published, updated_at
) values
(
  'armatura-gladkaya-art-10388',
  'rebar-smooth',
  'Арматура гладкая А240 (класс А1) ф. 10 мм Россия',
  'Ø10 мм',
  10,
  'А240 (А1)',
  'ГОСТ 34028-2016',
  11.7,
  'м',
  0.617,
  2317.5,
  null, null, null,
  'in', false, '10388',
  'Арматура гладкая А240 (класс А1) ф. 10 мм Россия',
  null,
  true, now()
),
(
  'armatura-gladkaya-art-08583',
  'rebar-smooth',
  'Круг Ст3 12 мм ГОСТ 2590-2006',
  'Ø12 мм',
  12,
  'Ст3',
  'ГОСТ 2590-2006',
  6,
  'м',
  0.888,
  2472,
  null, null, null,
  'in', false, '08583',
  'Круг Ст3 12мм Гост 2590-2006',
  null,
  true, now()
),
(
  'armatura-gladkaya-art-08729',
  'rebar-smooth',
  'Арматура гладкая 8,0 Ст1сп ГОСТ 3282-74 РБ',
  'Ø8 мм',
  8,
  'Ст1сп',
  'ГОСТ 3282-74',
  11.7,
  'м',
  0.395,
  3450,
  null, null, null,
  'in', false, '08729',
  'Арматура гладкая 8,0 Ст1сп Гост 3282-74 РБ',
  null,
  true, now()
),
(
  'armatura-gladkaya-art-11533',
  'rebar-smooth',
  'Круг 10,0 Ст1сп ГОСТ 3282-74',
  'Ø10 мм',
  10,
  'Ст1сп',
  'ГОСТ 3282-74',
  11.7,
  'м',
  0.617,
  null,
  null, null, null,
  'order', false, '11533',
  'Круг 10,0 Ст1сп ГОСТ 3282-74',
  null,
  true, now()
),
(
  'armatura-gladkaya-art-10510',
  'rebar-smooth',
  'Арматура гладкая 6,0 Ст1сп ГОСТ 3282-74',
  'Ø6 мм',
  6,
  'Ст1сп',
  'ГОСТ 3282-74',
  11.7,
  'м',
  0.222,
  2626.5,
  null, null, null,
  'in', false, '10510',
  'Арматура гладкая 6,0 Ст1сп Гост 3282-74',
  null,
  true, now()
),
(
  'armatura-gladkaya-art-12420',
  'rebar-smooth',
  'Арматура гладкая А240 (класс А1) ф. 25 мм РБ',
  'Ø25 мм',
  25,
  'А240 (А1)',
  'ГОСТ 34028-2016',
  11.7,
  'м',
  3.853,
  2317.5,
  null, null, null,
  'in', false, '12420',
  'Арматура гладкая А240 (класс А1) ф. 25 мм РБ',
  null,
  true, now()
),
(
  'armatura-gladkaya-art-09228',
  'rebar-smooth',
  'Арматурный прокат 16 А-1 11,7 м (круг гладкий)',
  'Ø16 мм',
  16,
  'А240 (А1)',
  'ГОСТ 34028-2016',
  11.7,
  'м',
  1.578,
  3450,
  null, null, null,
  'in', false, '09228',
  'Арматурный прокат 16 А-1 11,7м (КРУГ ГЛАДКИЙ)',
  null,
  true, now()
)
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  length_m = excluded.length_m,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_ton = excluded.price_per_ton,
  price_per_unit = excluded.price_per_unit,
  price_per_meter = excluded.price_per_meter,
  meters_per_sale_unit = excluded.meters_per_sale_unit,
  stock = excluded.stock,
  popular = excluded.popular,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-fiberglass-rebar.sql ==========

-- Категория «Арматура стеклопластиковая» и 7 позиций как на витрине-референсе.
-- Перед запуском: supabase-schema.sql, supabase-admin-rpc.sql
-- Картинка категории: public/products/rebar-catalog/armatura-stekloplastikovaya.png

delete from public.products where slug like 'armatura-kompozitnaya-%';
delete from public.products where slug = 'sterzhen-stekloplastikovyy-ssp-8-50-buhta-50m';

insert into public.categories (
  id, slug, name, menu_name, tagline, description, image, sort_order,
  dimension_label, seo_title, seo_description, is_published, updated_at
) values (
  'fiberglass-rebar',
  'armatura-stekloplastikovaya',
  'Арматура стеклопластиковая',
  'Арматура стеклопластиковая',
  'Бухты и прутки 3 м — цена за метр',
  'Композитная арматура из стеклоровинга: не корродирует, легче стали. Продажа метрами, бухты 25–50 м и прутки по 3 м.',
  '/products/rebar-catalog/armatura-stekloplastikovaya.png',
  3,
  'Диаметр',
  'Арматура стеклопластиковая — купить в Беларуси | Ромедов',
  'Стеклопластиковая арматура в бухтах и прутках, цена за метр, доставка по Беларуси.',
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
  is_published = excluded.is_published,
  updated_at = now();

insert into public.products (
  slug, category_id, name, size, dimension, steel, gost, length_m, sale_unit,
  weight_kg, price_per_ton, price_per_unit, price_per_meter, meters_per_sale_unit,
  stock, popular, article, card_title, image, is_published, updated_at
) values
(
  'armatura-stekloplastikovaya-art-15191',
  'fiberglass-rebar',
  'Арматура стеклопластиковая ф. 8 бухта 50 м',
  'Ø8 мм',
  8,
  'АКП',
  'ГОСТ 31938-2012',
  50,
  'боб',
  3.5,
  null,
  59.5,
  1.19,
  50,
  'in', false, '15191',
  'Арматура стеклопластиковая ф. 8 бухта 50 м',
  null,
  true, now()
),
(
  'armatura-stekloplastikovaya-art-15190',
  'fiberglass-rebar',
  'Арматура стеклопластиковая ф.6 бухта 50 м',
  'Ø6 мм',
  6,
  'АКП',
  'ГОСТ 31938-2012',
  50,
  'боб',
  2.5,
  null,
  41.5,
  0.83,
  50,
  'in', false, '15190',
  'Арматура стеклопластиковая ф.6 бухта 50 м',
  null,
  true, now()
),
(
  'armatura-stekloplastikovaya-art-15098',
  'fiberglass-rebar',
  'Арматура стеклопластиковая ф. 10 бухта 50 м',
  'Ø10 мм',
  10,
  'АКП',
  'ГОСТ 31938-2012',
  50,
  'боб',
  6,
  null,
  90,
  1.8,
  50,
  'in', false, '15098',
  'Арматура стеклопластиковая ф. 10 бухта 50 м',
  null,
  true, now()
),
(
  'armatura-stekloplastikovaya-art-15095',
  'fiberglass-rebar',
  'Арматура стеклопластиковая ф. 8 по 3 м',
  'Ø8 мм',
  8,
  'АКП',
  'ГОСТ 31938-2012',
  3,
  'шт',
  0.21,
  null,
  3.57,
  1.19,
  null,
  'in', false, '15095',
  'Арматура стеклопластиковая ф. 8 по 3 м',
  null,
  true, now()
),
(
  'armatura-stekloplastikovaya-art-15094',
  'fiberglass-rebar',
  'Арматура стеклопластиковая ф. 6 бухта 25 м',
  'Ø6 мм',
  6,
  'АКП',
  'ГОСТ 31938-2012',
  25,
  'боб',
  1.25,
  null,
  20.75,
  0.83,
  25,
  'in', false, '15094',
  'Арматура стеклопластиковая ф. 6 бухта 25 м',
  null,
  true, now()
),
(
  'armatura-stekloplastikovaya-art-15093',
  'fiberglass-rebar',
  'Арматура стеклопластиковая ф. 6 по 3 м',
  'Ø6 мм',
  6,
  'АКП',
  'ГОСТ 31938-2012',
  3,
  'шт',
  0.15,
  null,
  2.49,
  0.83,
  null,
  'in', false, '15093',
  'Арматура стеклопластиковая ф. 6 по 3 м',
  null,
  true, now()
),
(
  'armatura-stekloplastikovaya-art-15097',
  'fiberglass-rebar',
  'Арматура стеклопластиковая ф.10 по 3 м',
  'Ø10 мм',
  10,
  'АКП',
  'ГОСТ 31938-2012',
  3,
  'шт',
  0.36,
  null,
  null,
  null,
  null,
  'order', false, '15097',
  'Арматура стеклопластиковая ф.10 по 3 м',
  null,
  true, now()
)
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  length_m = excluded.length_m,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_ton = excluded.price_per_ton,
  price_per_unit = excluded.price_per_unit,
  price_per_meter = excluded.price_per_meter,
  meters_per_sale_unit = excluded.meters_per_sale_unit,
  stock = excluded.stock,
  popular = excluded.popular,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-sheet-subcategories.sql ==========

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
  v.image,
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
      '/products/sheet.webp',
      1
    ),
    (
      'sheet-polymer',
      'polimernoe-pokrytie',
      'Лист плоский с полимерным покрытием',
      '/products/sheet.webp',
      2
    ),
    (
      'sheet-hk',
      'holodnokatanyy',
      'Лист стальной холоднокатаный',
      '/products/sheet.webp',
      3
    ),
    (
      'sheet-pvl',
      'prosechno-vytyazhnoy',
      'Лист просечно-вытяжной',
      '/products/sheet.webp',
      4
    ),
    (
      'sheet-rif',
      'riflenyy',
      'Лист рифлёный стальной',
      '/products/sheet.webp',
      5
    ),
    (
      'sheet-zn',
      'ocinkovannyy',
      'Лист стальной оцинкованный',
      '/products/sheet.webp',
      6
    )
) as v(id, slug, name, image, sort_order)
where c.slug = 'listy-stalnye'
on conflict (id) do update set
  category_id = excluded.category_id,
  slug = excluded.slug,
  name = excluded.name,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = true,
  updated_at = now();

-- Проверка:
-- select id, slug, name, sort_order from public.subcategories
-- where category_id = (select id from categories where slug = 'listy-stalnye' limit 1)
-- order by sort_order;


-- ========== supabase-seed-sheet-hot-rolled.sql ==========

-- Подкатегория «Лист стальной горячекатанный» + 8 товаров (как на референсе).
-- Перед запуском: supabase-admin-rpc.sql, supabase-subcategories.sql.
-- Если категория пропала с витрины — scripts/supabase-fix-listy-stalnye.sql

update public.categories
set is_published = true
where slug = 'listy-stalnye' or id in ('sheet', 'listy-stalnye');

-- Подкатегории: scripts/supabase-seed-sheet-subcategories.sql

insert into public.products (
  slug,
  category_id,
  subcategory_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  v.slug,
  c.id,
  'sheet-gk',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  v.gost,
  null,
  'лист',
  v.weight_kg,
  v.price_per_ton,
  null,
  null,
  null,
  v.stock,
  false,
  v.article,
  v.card_title,
  '/products/sheet.webp',
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'listy-stalnye-gk-art-17559',
      'Лист г/к 3х1500х3000 Ст3п/сп5 Россия',
      '3×1500×3000 мм',
      3::numeric,
      'Ст3п/сп5',
      '',
      105.98::numeric,
      2950::numeric,
      'in',
      '17559',
      'Лист г/к 3×1500×3000 Ст3п/сп5',
      1
    ),
    (
      'listy-stalnye-gk-art-08542',
      'Лист стальной горячекатаный 4х1500*6000',
      '4×1500×6000 мм',
      4::numeric,
      'Ст3сп',
      'ГОСТ 19903-2015',
      282.6::numeric,
      2910::numeric,
      'in',
      '08542',
      'Лист г/к 4×1500×6000',
      2
    ),
    (
      'listy-stalnye-gk-art-08529',
      'Лист стальной горячекатаный 8х1500х6000',
      '8×1500×6000 мм',
      8::numeric,
      'Ст3сп',
      'ГОСТ 19903-2015',
      565.2::numeric,
      2950::numeric,
      'in',
      '08529',
      'Лист г/к 8×1500×6000',
      3
    ),
    (
      'listy-stalnye-gk-art-08543',
      'Лист стальной горячекатаный 6х1500х6000',
      '6×1500×6000 мм',
      6::numeric,
      'Ст3сп',
      'ГОСТ 19903-2015',
      423.9::numeric,
      3080::numeric,
      'in',
      '08543',
      'Лист г/к 6×1500×6000',
      4
    ),
    (
      'listy-stalnye-gk-art-10027',
      'Лист г/к (Б-ПН-НО-IV-3*1500*6000)',
      '3×1500×6000 мм',
      3::numeric,
      'Ст3сп',
      'ГОСТ 19903-2015',
      211.95::numeric,
      2925.2::numeric,
      'in',
      '10027',
      'Лист г/к 3×1500×6000 Б-ПН-НО-IV',
      5
    ),
    (
      'listy-stalnye-gk-art-09817',
      'Сталь листовая г\к ГОСТ 14637 Ст3сп5 10,0х1500х6000 (РФ)',
      '10×1500×6000 мм',
      10::numeric,
      'Ст3сп5',
      'ГОСТ 14637',
      706.5::numeric,
      2960::numeric,
      'in',
      '09817',
      'Лист г/к 10×1500×6000 Ст3сп5',
      6
    ),
    (
      'listy-stalnye-gk-art-06002',
      'Лист стальной горячекатаный 2х1250х2500',
      '2×1250×2500 мм',
      2::numeric,
      'Ст3сп',
      'ГОСТ 19903-2015',
      49.06::numeric,
      3100::numeric,
      'in',
      '06002',
      'Лист г/к 2×1250×2500',
      7
    ),
    (
      'listy-stalnye-gk-art-09733',
      'Лист стальной горячекатаный 3х1250х2500',
      '3×1250×2500 мм',
      3::numeric,
      'Ст3сп',
      'ГОСТ 19903-2015',
      73.59::numeric,
      3100::numeric,
      'out',
      '09733',
      'Лист г/к 3×1250×2500',
      8
    )
) as v(
  slug,
  name,
  size,
  dimension,
  steel,
  gost,
  weight_kg,
  price_per_ton,
  stock,
  article,
  card_title,
  sort_order
)
where c.slug = 'listy-stalnye'
on conflict (slug) do update set
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_ton = excluded.price_per_ton,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-sheet-polymer.sql ==========

-- Товары: подкатегория «Лист плоский с полимерным покрытием» (sheet-polymer).
-- Перед запуском: supabase-seed-sheet-subcategories.sql, категория slug listy-stalnye.
-- Цена: 29,33 BYN/м² (price_per_meter); лист 1250×2000 мм = 2,5 м².

insert into public.products (
  slug,
  category_id,
  subcategory_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  v.slug,
  c.id,
  'sheet-polymer',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  v.gost,
  null,
  'лист',
  v.weight_kg,
  null,
  v.price_per_unit,
  v.price_per_meter,
  2.5,
  v.stock,
  false,
  v.article,
  v.card_title,
  '/products/sheet.webp',
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'listy-stalnye-polymer-art-10371',
      'Лист плоский синий насыщенный (ПЭП-01-5005-0,45х1250х2000), ООО «Металлопрофиль»',
      '0,45×1250×2000 мм',
      0.45::numeric,
      'ПЭП-01-5005',
      'ТУ производителя',
      8.83::numeric,
      73.33::numeric,
      29.33::numeric,
      'in',
      '10371',
      'Лист плоский синий насыщенный 0,45×1250×2000',
      1
    ),
    (
      'listy-stalnye-polymer-art-09437',
      'Лист плоский красное вино (ПЭП-01-3005-0,45х1250х2000), ООО «Металлопрофиль»',
      '0,45×1250×2000 мм',
      0.45::numeric,
      'ПЭП-01-3005',
      'ТУ производителя',
      8.83::numeric,
      73.33::numeric,
      29.33::numeric,
      'in',
      '09437',
      'Лист плоский красное вино 0,45×1250×2000',
      2
    ),
    (
      'listy-stalnye-polymer-art-09432',
      'Лист плоский коричневый шоколад (ПЭП-01-8017-0,45х1250х2000), ООО «Металлопрофиль»',
      '0,45×1250×2000 мм',
      0.45::numeric,
      'ПЭП-01-8017',
      'ТУ производителя',
      8.83::numeric,
      73.33::numeric,
      29.33::numeric,
      'in',
      '09432',
      'Лист плоский коричневый шоколад 0,45×1250×2000',
      3
    ),
    (
      'listy-stalnye-polymer-art-09430',
      'Лист плоский зеленый мох (ПЭП-01-6005-0,45х1250х2000), ООО «Металлопрофиль»',
      '0,45×1250×2000 мм',
      0.45::numeric,
      'ПЭП-01-6005',
      'ТУ производителя',
      8.83::numeric,
      73.33::numeric,
      29.33::numeric,
      'in',
      '09430',
      'Лист плоский зеленый мох 0,45×1250×2000',
      4
    ),
    (
      'listy-stalnye-polymer-art-09509',
      'Лист плоский белый (ПЭП-01-9003-0,45х1250х2000), ООО «Металлопрофиль»',
      '0,45×1250×2000 мм',
      0.45::numeric,
      'ПЭП-01-9003',
      'ТУ производителя',
      8.83::numeric,
      73.33::numeric,
      29.33::numeric,
      'out',
      '09509',
      'Лист плоский белый 0,45×1250×2000',
      5
    )
) as v(
  slug,
  name,
  size,
  dimension,
  steel,
  gost,
  weight_kg,
  price_per_unit,
  price_per_meter,
  stock,
  article,
  card_title,
  sort_order
)
where c.slug = 'listy-stalnye'
on conflict (slug) do update set
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_unit = excluded.price_per_unit,
  price_per_meter = excluded.price_per_meter,
  meters_per_sale_unit = excluded.meters_per_sale_unit,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-sheet-cold-rolled.sql ==========

-- Товары: подкатегория «Лист стальной холоднокатаный» (sheet-hk).
-- Перед запуском: supabase-seed-sheet-subcategories.sql, категория slug listy-stalnye.

insert into public.products (
  slug,
  category_id,
  subcategory_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  v.slug,
  c.id,
  'sheet-hk',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  v.gost,
  null,
  'лист',
  v.weight_kg,
  v.price_per_ton,
  null,
  null,
  null,
  v.stock,
  false,
  v.article,
  v.card_title,
  '/products/sheet.webp',
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'listy-stalnye-hk-art-10537',
      'Лист х/к 1,2×1250×2500, РФ',
      '1,2×1250×2500 мм',
      1.2::numeric,
      'Ст3сп',
      'ГОСТ 19904-90',
      29.44::numeric,
      3090::numeric,
      'in',
      '10537',
      'Лист х/к 1,2×1250×2500',
      1
    ),
    (
      'listy-stalnye-hk-art-12241',
      'Лист холоднокатаный 1×1250×2500 мм',
      '1×1250×2500 мм',
      1::numeric,
      'Ст3сп',
      'ГОСТ 19904-90',
      24.53::numeric,
      3370::numeric,
      'in',
      '12241',
      'Лист х/к 1×1250×2500',
      2
    ),
    (
      'listy-stalnye-hk-art-09264',
      'Лист холоднокатаный 1,5×1250×2500 мм',
      '1,5×1250×2500 мм',
      1.5::numeric,
      'Ст3сп',
      'ГОСТ 19904-90',
      36.8::numeric,
      3310::numeric,
      'in',
      '09264',
      'Лист х/к 1,5×1250×2500',
      3
    ),
    (
      'listy-stalnye-hk-art-09262',
      'Лист холоднокатаный 0,8×1250×2500 мм',
      '0,8×1250×2500 мм',
      0.8::numeric,
      'Ст3сп',
      'ГОСТ 19904-90',
      19.63::numeric,
      3110::numeric,
      'in',
      '09262',
      'Лист х/к 0,8×1250×2500',
      4
    )
) as v(
  slug,
  name,
  size,
  dimension,
  steel,
  gost,
  weight_kg,
  price_per_ton,
  stock,
  article,
  card_title,
  sort_order
)
where c.slug = 'listy-stalnye'
on conflict (slug) do update set
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_ton = excluded.price_per_ton,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-sheet-pvl.sql ==========

-- Товары: подкатегория «Лист просечно-вытяжной» (sheet-pvl).
-- Перед запуском: supabase-seed-sheet-subcategories.sql, категория slug listy-stalnye.
-- Вес листа — ориентир для расчёта цены за лист (ПВЛ легче сплошного листа).

insert into public.products (
  slug,
  category_id,
  subcategory_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  v.slug,
  c.id,
  'sheet-pvl',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  v.gost,
  null,
  'лист',
  v.weight_kg,
  v.price_per_ton,
  null,
  null,
  null,
  v.stock,
  false,
  v.article,
  v.card_title,
  '/products/sheet.webp',
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'listy-stalnye-pvl-art-16481',
      'Лист ПВ 506 5×1000×3400 ТУ 25.93.13-003-33316304-2022',
      'ПВ506 5×1000×3400 мм',
      5::numeric,
      'ПВ506',
      'ТУ 25.93.13-003-33316304-2022',
      22::numeric,
      3390::numeric,
      'in',
      '16481',
      'Лист ПВ506 5×1000×3400',
      1
    ),
    (
      'listy-stalnye-pvl-art-16778',
      'Лист ПВЛ (просечно-вытяжной) 506×1500×3300 ТУ',
      'ПВ506 1500×3300 мм',
      5::numeric,
      'ПВ506',
      'ТУ',
      32::numeric,
      3660::numeric,
      'in',
      '16778',
      'Лист ПВЛ 506×1500×3300',
      2
    )
) as v(
  slug,
  name,
  size,
  dimension,
  steel,
  gost,
  weight_kg,
  price_per_ton,
  stock,
  article,
  card_title,
  sort_order
)
where c.slug = 'listy-stalnye'
on conflict (slug) do update set
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_ton = excluded.price_per_ton,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-sheet-ribbed.sql ==========

-- Товар: подкатегория «Лист рифлёный стальной» (sheet-rif).
-- Перед запуском: supabase-seed-sheet-subcategories.sql, категория slug listy-stalnye.

insert into public.products (
  slug,
  category_id,
  subcategory_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  'listy-stalnye-rif-art-09889',
  c.id,
  'sheet-rif',
  'Лист рифленый стальной чечевица 4×1500×6000',
  '4×1500×6000 мм',
  4::numeric,
  'Ст3сп',
  'ГОСТ 8568-77',
  null,
  'лист',
  282.6::numeric,
  2970::numeric,
  null,
  null,
  null,
  'in',
  false,
  '09889',
  'Лист рифлёный чечевица 4×1500×6000',
  '/products/sheet.webp',
  1,
  true,
  now()
from public.categories c
where c.slug = 'listy-stalnye'
on conflict (slug) do update set
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_ton = excluded.price_per_ton,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-sheet-galvanized.sql ==========

-- Товары: подкатегория «Лист стальной оцинкованный» (sheet-zn).
-- Перед запуском: supabase-seed-sheet-subcategories.sql, категория slug listy-stalnye.
-- Цена: BYN/м² (price_per_meter); площадь листа в meters_per_sale_unit.

insert into public.products (
  slug,
  category_id,
  subcategory_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  v.slug,
  c.id,
  'sheet-zn',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  v.gost,
  null,
  'лист',
  v.weight_kg,
  null,
  v.price_per_unit,
  v.price_per_meter,
  v.area_m2,
  v.stock,
  false,
  v.article,
  v.card_title,
  '/products/sheet.webp',
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'listy-stalnye-zn-art-12387',
      'Лист стальной оцинкованный 0,55×1250×2500',
      '0,55×1250×2500 мм',
      0.55::numeric,
      'оцинкованная сталь',
      'ГОСТ 52246-2016',
      13.48::numeric,
      65.63::numeric,
      21::numeric,
      3.125::numeric,
      'in',
      '12387',
      'Лист оцинкованный 0,55×1250×2500',
      1
    ),
    (
      'listy-stalnye-zn-art-12386',
      'Лист стальной оцинкованный 0,7×1250×2500',
      '0,7×1250×2500 мм',
      0.7::numeric,
      'оцинкованная сталь',
      'ГОСТ 52246-2016',
      17.16::numeric,
      78.31::numeric,
      25.06::numeric,
      3.125::numeric,
      'in',
      '12386',
      'Лист оцинкованный 0,7×1250×2500',
      2
    ),
    (
      'listy-stalnye-zn-art-12347',
      'Лист стальной оцинкованный 0,45×1250×2000',
      '0,45×1250×2000 мм',
      0.45::numeric,
      'оцинкованная сталь',
      'ГОСТ 52246-2016',
      8.83::numeric,
      43.65::numeric,
      17.46::numeric,
      2.5::numeric,
      'in',
      '12347',
      'Лист оцинкованный 0,45×1250×2000',
      3
    )
) as v(
  slug,
  name,
  size,
  dimension,
  steel,
  gost,
  weight_kg,
  price_per_unit,
  price_per_meter,
  area_m2,
  stock,
  article,
  card_title,
  sort_order
)
where c.slug = 'listy-stalnye'
on conflict (slug) do update set
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_unit = excluded.price_per_unit,
  price_per_meter = excluded.price_per_meter,
  meters_per_sale_unit = excluded.meters_per_sale_unit,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-square.sql ==========

-- Категория «Квадрат стальной» + 2 товара (референс витрины).
-- Перед запуском: supabase-schema.sql, supabase-admin-rpc.sql.
-- Полный список категорий: supabase-seed-categories.sql (id square уже там).

insert into public.categories (
  id, slug, name, menu_name, tagline, description, image, sort_order,
  dimension_label, seo_title, seo_description, is_published, updated_at
) values (
  'square',
  'kvadrat-stalnoy',
  'Квадрат стальной',
  'Квадрат стальной',
  'Горячекатаный 10–40 мм',
  'Стальной квадратный прокат для осей, кронштейнов, декоративной ковки и заготовок под мехобработку. Марка Ст3сп/пс, длина 6 м.',
  '/products/square.webp',
  8,
  'Сторона',
  'Квадрат стальной горячекатаный — цена, наличие | Ромедов',
  'Квадрат стальной горячекатаный 10×10 — 40×40 мм по ГОСТ 2591-2006. Продажа тоннами и метрами, резка в размер, доставка по Беларуси.',
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

insert into public.products (
  slug,
  category_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  v.slug,
  'square',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  v.gost,
  6::numeric,
  'м',
  v.weight_kg,
  v.price_per_ton,
  null,
  null,
  null,
  v.stock,
  false,
  v.article,
  v.card_title,
  '/products/square.webp',
  v.sort_order,
  true,
  now()
from (
  values
    (
      'kvadrat-stalnoy-art-15226',
      'Квадрат стальной ст3 12×12 мм',
      '12×12 мм',
      12::numeric,
      'Ст3',
      'ГОСТ 2591-2006',
      1.13::numeric,
      4011.85::numeric,
      'in',
      '15226',
      'Квадрат стальной ст3 12×12 мм',
      1
    ),
    (
      'kvadrat-stalnoy-art-08490',
      'Квадрат стальной ст3 10×10 мм',
      '10×10 мм',
      10::numeric,
      'Ст3',
      'ГОСТ 2591-2006',
      0.785::numeric,
      null::numeric,
      'out',
      '08490',
      'Квадрат стальной ст3 10×10 мм',
      2
    )
) as v(
  slug,
  name,
  size,
  dimension,
  steel,
  gost,
  weight_kg,
  price_per_ton,
  stock,
  article,
  card_title,
  sort_order
)
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  length_m = excluded.length_m,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_ton = excluded.price_per_ton,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-angle.sql ==========

-- Категория «Уголок стальной» + 10 товаров (референс витрины).
-- Перед запуском: supabase-schema.sql, supabase-admin-rpc.sql.
-- weight_kg — масса 1 п.м. (7850 кг/м³, площадь сечения 2×a×t − t²).

insert into public.categories (
  id, slug, name, menu_name, tagline, description, image, sort_order,
  dimension_label, seo_title, seo_description, is_published, updated_at
) values (
  'angle',
  'ugolok-stalnoy',
  'Уголок стальной',
  'Уголок стальной',
  'Равнополочный 25–100 мм',
  'Горячекатаный равнополочный уголок по ГОСТ 8509-93 для рам, обвязок, закладных и усиления конструкций. Мерная длина 6 и 12 м.',
  '/products/angle.webp',
  6,
  'Полка',
  'Уголок стальной равнополочный — цена за тонну и метр | Ромедов',
  'Уголок стальной равнополочный 25×25 — 100×100 мм по ГОСТ 8509-93. Продажа тоннами и метрами, резка в размер, доставка по Беларуси.',
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

insert into public.products (
  slug,
  category_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  v.slug,
  'angle',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  v.gost,
  v.length_m,
  'м',
  v.weight_kg,
  v.price_per_ton,
  null,
  null,
  null,
  'in',
  false,
  v.article,
  v.card_title,
  '/products/angle.webp',
  v.sort_order,
  true,
  now()
from (
  values
    (
      'ugolok-stalnoy-art-11555',
      'Уголок равнополочный 75×75×5×12000, ст.сп/пс (ГОСТ 8509-93), Россия',
      '75×75×5×12000 мм',
      75::numeric,
      'Ст3сп/пс',
      'ГОСТ 8509-93',
      12::numeric,
      5.69::numeric,
      4670::numeric,
      '11555',
      'Уголок 75×75×5×12000, Россия',
      1
    ),
    (
      'ugolok-stalnoy-art-17478',
      'Уголок 50×50×4×12000 ГОСТ 8509-93 Россия',
      '50×50×4×12000 мм',
      50::numeric,
      'Ст3сп/пс',
      'ГОСТ 8509-93',
      12::numeric,
      3.01::numeric,
      3860::numeric,
      '17478',
      'Уголок 50×50×4×12000, Россия',
      2
    ),
    (
      'ugolok-stalnoy-art-17477',
      'Уголок 40×40×3 ГОСТ 535-2005 РОССИЯ',
      '40×40×3 мм',
      40::numeric,
      'Ст3',
      'ГОСТ 535-2005',
      6::numeric,
      1.81::numeric,
      3420::numeric,
      '17477',
      'Уголок 40×40×3, Россия',
      3
    ),
    (
      'ugolok-stalnoy-art-05335',
      'Уголок стальной г/к равнополочный 50×50×5 мм',
      '50×50×5 мм',
      50::numeric,
      'Ст3сп/пс',
      'ГОСТ 8509-93',
      6::numeric,
      3.73::numeric,
      3400::numeric,
      '05335',
      'Уголок г/к 50×50×5 мм',
      4
    ),
    (
      'ugolok-stalnoy-art-06428',
      'Уголок стальной г/к равнополочный 32×32×4 мм',
      '32×32×4 мм',
      32::numeric,
      'Ст3сп/пс',
      'ГОСТ 8509-93',
      6::numeric,
      1.88::numeric,
      4090::numeric,
      '06428',
      'Уголок г/к 32×32×4 мм',
      5
    ),
    (
      'ugolok-stalnoy-art-05905',
      'Уголок стальной г/к равнополочный 75×75×6 мм',
      '75×75×6 мм',
      75::numeric,
      'Ст3сп/пс',
      'ГОСТ 8509-93',
      6::numeric,
      6.78::numeric,
      4080::numeric,
      '05905',
      'Уголок г/к 75×75×6 мм',
      6
    ),
    (
      'ugolok-stalnoy-art-05476',
      'Уголок стальной г/к равнополочный 63×63×5 мм',
      '63×63×5 мм',
      63::numeric,
      'Ст3сп/пс',
      'ГОСТ 8509-93',
      6::numeric,
      4.75::numeric,
      4030::numeric,
      '05476',
      'Уголок г/к 63×63×5 мм',
      7
    ),
    (
      'ugolok-stalnoy-art-06559',
      'Уголок стальной г/к равнополочный 25×25×4 мм',
      '25×25×4 мм',
      25::numeric,
      'Ст3сп/пс',
      'ГОСТ 8509-93',
      6::numeric,
      1.44::numeric,
      4300::numeric,
      '06559',
      'Уголок г/к 25×25×4 мм',
      8
    ),
    (
      'ugolok-stalnoy-art-06016',
      'Уголок стальной г/к равнополочный 100×100×7 мм',
      '100×100×7 мм',
      100::numeric,
      'Ст3сп/пс',
      'ГОСТ 8509-93',
      6::numeric,
      10.61::numeric,
      3000::numeric,
      '06016',
      'Уголок г/к 100×100×7 мм',
      9
    ),
    (
      'ugolok-stalnoy-art-09363',
      'Уголок стальной г/к равнополочный 40×40×4 мм',
      '40×40×4 мм',
      40::numeric,
      'Ст3сп/пс',
      'ГОСТ 8509-93',
      6::numeric,
      2.39::numeric,
      3690::numeric,
      '09363',
      'Уголок г/к 40×40×4 мм',
      10
    )
) as v(
  slug,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  weight_kg,
  price_per_ton,
  article,
  card_title,
  sort_order
)
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  length_m = excluded.length_m,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_ton = excluded.price_per_ton,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-channel.sql ==========

-- Категория «Швеллер стальной» + 7 товаров (референс витрины).
-- Перед запуском: supabase-schema.sql, supabase-admin-rpc.sql.
-- weight_kg — масса 1 п.м. по справочнику ГОСТ 8240-97 (ориентир).

insert into public.categories (
  id, slug, name, menu_name, tagline, description, image, sort_order,
  dimension_label, seo_title, seo_description, is_published, updated_at
) values (
  'channel',
  'shveller-stalnoy',
  'Швеллер стальной',
  'Швеллер стальной',
  'П-образный, номера 5–20',
  'Горячекатаный швеллер с параллельными полками по ГОСТ 8240-97. Основа для перекрытий, рам, эстакад и тяжёлых металлоконструкций.',
  '/products/channel.webp',
  7,
  'Номер',
  'Швеллер стальной — купить в Минске и Борисове | Ромедов',
  'Швеллер стальной горячекатаный № 5–20 по ГОСТ 8240-97. Цена за тонну и за метр, наличие на складе, резка, доставка по Беларуси.',
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

insert into public.products (
  slug,
  category_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  v.slug,
  'channel',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  v.gost,
  v.length_m,
  'м',
  v.weight_kg,
  v.price_per_ton,
  null,
  null,
  null,
  v.stock,
  false,
  v.article,
  v.card_title,
  '/products/channel.webp',
  v.sort_order,
  true,
  now()
from (
  values
    (
      'shveller-stalnoy-art-05902',
      'Швеллер стальной г/к 10П ст3сп5 ГОСТ 8240-97, Россия',
      '№ 10П',
      10::numeric,
      'Ст3сп5',
      'ГОСТ 8240-97',
      6::numeric,
      8.59::numeric,
      2667.7::numeric,
      'in',
      '05902',
      'Швеллер г/к 10П, Россия',
      1
    ),
    (
      'shveller-stalnoy-art-08673',
      'Швеллер стальной 18П, ГОСТ 27772-2021, Россия',
      '№ 18П',
      18::numeric,
      'Ст3сп',
      'ГОСТ 27772-2021',
      6::numeric,
      18.4::numeric,
      4080::numeric,
      'in',
      '08673',
      'Швеллер 18П, Россия',
      2
    ),
    (
      'shveller-stalnoy-art-09365',
      'Швеллер стальной г/к 16П',
      '№ 16П',
      16::numeric,
      'Ст3сп',
      'ГОСТ 8240-97',
      6::numeric,
      15.9::numeric,
      4330::numeric,
      'in',
      '09365',
      'Швеллер г/к 16П',
      3
    ),
    (
      'shveller-stalnoy-art-09231',
      'Швеллер г/к 12П×12000-МД Ст3сп-5 (Россия)',
      '№ 12П×12000 мм',
      12::numeric,
      'Ст3сп5',
      'ГОСТ 8240-97',
      12::numeric,
      10.4::numeric,
      2719.2::numeric,
      'in',
      '09231',
      'Швеллер г/к 12П×12 м',
      4
    ),
    (
      'shveller-stalnoy-art-08493',
      'Швеллер стальной г/к 8',
      '№ 8',
      8::numeric,
      'Ст3сп',
      'ГОСТ 8240-97',
      6::numeric,
      7.05::numeric,
      3090::numeric,
      'in',
      '08493',
      'Швеллер г/к 8',
      5
    ),
    (
      'shveller-stalnoy-art-13070',
      'Швеллер стальной г/к 20П',
      '№ 20П',
      20::numeric,
      'Ст3сп',
      'ГОСТ 8240-97',
      6::numeric,
      21::numeric,
      5718.54::numeric,
      'in',
      '13070',
      'Швеллер г/к 20П',
      6
    ),
    (
      'shveller-stalnoy-art-11210',
      'Швеллер стальной г/к 6,5',
      '№ 6,5',
      6.5::numeric,
      'Ст3сп',
      'ГОСТ 8240-97',
      6::numeric,
      5.98::numeric,
      null::numeric,
      'out',
      '11210',
      'Швеллер г/к 6,5',
      7
    )
) as v(
  slug,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  weight_kg,
  price_per_ton,
  stock,
  article,
  card_title,
  sort_order
)
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  length_m = excluded.length_m,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_ton = excluded.price_per_ton,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-strip.sql ==========

-- Категория «Полоса стальная» + 2 товара (референс витрины).
-- Перед запуском: supabase-schema.sql, supabase-admin-rpc.sql.

insert into public.categories (
  id, slug, name, menu_name, tagline, description, image, sort_order,
  dimension_label, seo_title, seo_description, is_published, updated_at
) values (
  'strip',
  'polosa-stalnaya',
  'Полоса стальная',
  'Полоса стальная',
  'Толщины 4–10 мм, ширины 20–100 мм',
  'Горячекатаная стальная полоса для обвязок, накладок, закладных деталей и ограждений. Ровная геометрия, готова к сварке и гибке.',
  '/products/strip.webp',
  9,
  'Сечение',
  'Полоса стальная горячекатаная — купить в Беларуси | Ромедов',
  'Полоса стальная горячекатаная 20×4 — 100×10 мм по ГОСТ 103-2006. Цена за тонну и за метр, резка в размер, доставка по Минску и области.',
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

insert into public.products (
  slug,
  category_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  v.slug,
  'strip',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  v.gost,
  6::numeric,
  'м',
  v.weight_kg,
  v.price_per_ton,
  null,
  null,
  null,
  v.stock,
  false,
  v.article,
  v.card_title,
  '/products/strip.webp',
  v.sort_order,
  true,
  now()
from (
  values
    (
      'polosa-stalnaya-art-06243',
      'Полоса стальная г/к 25×4×6000',
      '25×4×6000 мм',
      25::numeric,
      'Ст3сп/пс',
      'ГОСТ 103-2006',
      0.785::numeric,
      3340::numeric,
      'in',
      '06243',
      'Полоса г/к 25×4×6000',
      1
    ),
    (
      'polosa-stalnaya-art-05991',
      'Полоса стальная г/к 40×4×6000',
      '40×4×6000 мм',
      40::numeric,
      'Ст3сп/пс',
      'ГОСТ 103-2006',
      1.256::numeric,
      null::numeric,
      'out',
      '05991',
      'Полоса г/к 40×4×6000',
      2
    )
) as v(
  slug,
  name,
  size,
  dimension,
  steel,
  gost,
  weight_kg,
  price_per_ton,
  stock,
  article,
  card_title,
  sort_order
)
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  length_m = excluded.length_m,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_ton = excluded.price_per_ton,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-mesh-subcategories.sql ==========

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


-- ========== supabase-seed-mesh-d4.sql ==========

-- Товары: подкатегория «Сетка сварная d 4 мм» (mesh-d4).
-- Перед запуском: supabase-seed-mesh-subcategories.sql.
-- weight_kg — масса одной карты (ориентир для цены за карту из BYN/т).

insert into public.products (
  slug,
  category_id,
  subcategory_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  v.slug,
  c.id,
  'mesh-d4',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  v.gost,
  null,
  'карта',
  v.weight_kg,
  v.price_per_ton,
  null,
  null,
  null,
  'in',
  false,
  v.article,
  v.card_title,
  '/products/mesh.webp',
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'setka-armiruyushchaya-art-07343',
      'Сетка армирующая сварная С500 d4,0 мм, ячейка 50×50 мм, лист 500×2000 мм, ГОСТ 23279',
      '50×50 мм, лист 500×2000 мм',
      50::numeric,
      'С500',
      'ГОСТ 23279-2012',
      3.95::numeric,
      3708::numeric,
      '07343',
      'Сетка С500 d4, 50×50, лист 500×2000',
      1
    ),
    (
      'setka-armiruyushchaya-art-07342',
      'Сетка армирующая сварная С500 d4,0 мм, ячейка 50×50 мм, лист 380×2000 мм, ГОСТ 23279',
      '50×50 мм, лист 380×2000 мм',
      50::numeric,
      'С500',
      'ГОСТ 23279-2012',
      3.0::numeric,
      3090::numeric,
      '07342',
      'Сетка С500 d4, 50×50, лист 380×2000',
      2
    ),
    (
      'setka-armiruyushchaya-art-07239',
      'Сетка армирующая сварная С500 d4,0 мм, ячейка 100×100 мм, лист 1000×2000 мм, ГОСТ 23279',
      '100×100 мм, лист 1000×2000 мм',
      100::numeric,
      'С500',
      'ГОСТ 23279-2012',
      4.4::numeric,
      3710::numeric,
      '07239',
      'Сетка С500 d4, 100×100, лист 1000×2000',
      3
    )
) as v(
  slug,
  name,
  size,
  dimension,
  steel,
  gost,
  weight_kg,
  price_per_ton,
  article,
  card_title,
  sort_order
)
where c.slug = 'setka-armiruyushchaya'
on conflict (slug) do update set
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_ton = excluded.price_per_ton,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-mesh-d3.sql ==========

-- Товары: подкатегория «Сетка сварная d 3 мм» (mesh-d3).
-- Перед запуском: supabase-seed-mesh-subcategories.sql.
-- weight_kg — масса одной карты (ориентир для цены за карту из BYN/т).

insert into public.products (
  slug,
  category_id,
  subcategory_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  v.slug,
  c.id,
  'mesh-d3',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  v.gost,
  null,
  'карта',
  v.weight_kg,
  v.price_per_ton,
  null,
  null,
  null,
  'in',
  false,
  v.article,
  v.card_title,
  '/products/mesh.webp',
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'setka-armiruyushchaya-art-07238',
      'Сетка армирующая сварная С500 d3,0 мм, ячейка 100×100 мм, лист 1000×2000 мм, ГОСТ 23279, РБ',
      '100×100 мм, лист 1000×2000 мм',
      100::numeric,
      'С500',
      'ГОСТ 23279-2012',
      2.48::numeric,
      3930::numeric,
      '07238',
      'Сетка С500 d3, 100×100, лист 1000×2000',
      1
    ),
    (
      'setka-armiruyushchaya-art-07237',
      'Сетка армирующая сварная 4С ВР-1 d3,0 мм, ячейка 50×50 мм, лист 500×2000 мм, ГОСТ 23279',
      '50×50 мм, лист 500×2000 мм',
      50::numeric,
      'ВР-1',
      'ГОСТ 23279-2012',
      2.22::numeric,
      3930::numeric,
      '07237',
      'Сетка ВР-1 d3, 50×50, лист 500×2000',
      2
    ),
    (
      'setka-armiruyushchaya-art-07236',
      'Сетка армирующая сварная 4С ВР-1 d3,0 мм, ячейка 50×50 мм, лист 380×2000 мм, ГОСТ 23279',
      '50×50 мм, лист 380×2000 мм',
      50::numeric,
      'ВР-1',
      'ГОСТ 23279-2012',
      1.69::numeric,
      3930::numeric,
      '07236',
      'Сетка ВР-1 d3, 50×50, лист 380×2000',
      3
    ),
    (
      'setka-armiruyushchaya-art-07813',
      'Сетка армирующая сварная 4С 3,0 мм, ВР-1 ячейка 150×150 мм, лист 1000×2000 мм, ГОСТ 23279',
      '150×150 мм, лист 1000×2000 мм',
      150::numeric,
      'ВР-1',
      'ГОСТ 23279-2012',
      1.7::numeric,
      3930::numeric,
      '07813',
      'Сетка ВР-1 d3, 150×150, лист 1000×2000',
      4
    )
) as v(
  slug,
  name,
  size,
  dimension,
  steel,
  gost,
  weight_kg,
  price_per_ton,
  article,
  card_title,
  sort_order
)
where c.slug = 'setka-armiruyushchaya'
on conflict (slug) do update set
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_ton = excluded.price_per_ton,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-mesh-d5.sql ==========

-- Товар: подкатегория «Сетка сварная d 5 мм» (mesh-d5).
-- Перед запуском: supabase-seed-mesh-subcategories.sql.

insert into public.products (
  slug,
  category_id,
  subcategory_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  'setka-armiruyushchaya-art-08756',
  c.id,
  'mesh-d5',
  'Сетка арматурная сварная С500 d5,0 мм, ячейка 100×100 мм, лист 1000×2000 мм, ГОСТ 23279',
  '100×100 мм, лист 1000×2000 мм',
  100::numeric,
  'С500',
  'ГОСТ 23279-2012',
  null,
  'карта',
  6.8::numeric,
  3530::numeric,
  null,
  null,
  null,
  'in',
  false,
  '08756',
  'Сетка С500 d5, 100×100, лист 1000×2000',
  '/products/mesh.webp',
  1,
  true,
  now()
from public.categories c
where c.slug = 'setka-armiruyushchaya'
on conflict (slug) do update set
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_ton = excluded.price_per_ton,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-supplies-subcategories.sql ==========

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


-- ========== supabase-seed-supplies-electrodes.sql ==========

-- Товары: подкатегория «Сварочные электроды» (supplies-electrodes).
-- Перед запуском: supabase-seed-supplies-subcategories.sql.
-- price_per_unit — цена упаковки (BYN/кг × масса упаковки); на плитке — BYN/шт.

insert into public.products (
  slug,
  category_id,
  subcategory_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  v.slug,
  c.id,
  'supplies-electrodes',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  v.gost,
  null,
  'шт',
  v.weight_kg,
  null,
  v.price_per_unit,
  null,
  null,
  'in',
  false,
  v.article,
  v.card_title,
  '/products/supplies.webp',
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'soputstvuyushchie-art-17283',
      'Электроды МЭЗ МРЗ Ультра d=3,0 по 2,5 кг, РБ',
      'Ø3,0 мм, уп. 2,5 кг',
      3::numeric,
      'МЭЗ Ультра',
      'ТУ производителя',
      2.5::numeric,
      25.25::numeric,
      '17283',
      'Электроды Ультра d3,0, 2,5 кг',
      1
    ),
    (
      'soputstvuyushchie-art-17282',
      'Электроды МЭЗ МРЗ Ультра d=3,0 по 1 кг, РБ',
      'Ø3,0 мм, уп. 1 кг',
      3::numeric,
      'МЭЗ Ультра',
      'ТУ производителя',
      1::numeric,
      10.1::numeric,
      '17282',
      'Электроды Ультра d3,0, 1 кг',
      2
    ),
    (
      'soputstvuyushchie-art-15385',
      'Электроды МР-3 ф3 мм ПЛАЗМА (уп. 2,5 кг) ТМ Континент (ООО «СЗСЭ»), Узбекистан',
      'Ø3 мм, уп. 2,5 кг',
      3::numeric,
      'МР-3',
      'ГОСТ 9466-75',
      2.5::numeric,
      45.5::numeric,
      '15385',
      'Электроды МР-3 ф3, Континент, 2,5 кг',
      3
    ),
    (
      'soputstvuyushchie-art-15384',
      'Электроды МР-3 ф3 мм ПЛАЗМА (уп. 1 кг) ТМ Континент',
      'Ø3 мм, уп. 1 кг',
      3::numeric,
      'МР-3',
      'ГОСТ 9466-75',
      1::numeric,
      17.8::numeric,
      '15384',
      'Электроды МР-3 ф3, Континент, 1 кг',
      4
    ),
    (
      'soputstvuyushchie-art-16160',
      'Электроды МР-3, D 4,0 (5,5 кг), п-во Судиславль, (РФ)',
      'Ø4,0 мм, уп. 5,5 кг',
      4::numeric,
      'МР-3',
      'ГОСТ 9466-75',
      5.5::numeric,
      67.65::numeric,
      '16160',
      'Электроды МР-3 d4,0, 5,5 кг, РФ',
      5
    )
) as v(
  slug,
  name,
  size,
  dimension,
  steel,
  gost,
  weight_kg,
  price_per_unit,
  article,
  card_title,
  sort_order
)
where c.slug = 'soputstvuyushchie-tovary'
on conflict (slug) do update set
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_unit = excluded.price_per_unit,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-supplies-caps.sql ==========

-- Товары: подкатегория «Заглушки на профильные трубы» (supplies-caps).
-- Перед запуском: supabase-seed-supplies-subcategories.sql.
-- dimension — большая сторона сечения (мм) для фильтра «Типоразмер».

insert into public.products (
  slug,
  category_id,
  subcategory_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  v.slug,
  c.id,
  'supplies-caps',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  '',
  null,
  'шт',
  v.weight_kg,
  null,
  v.price_per_unit,
  null,
  null,
  v.stock,
  false,
  v.article,
  v.card_title,
  '/products/supplies.webp',
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'soputstvuyushchie-art-16790',
      'Заглушка квадратная внутр. 30×30 универсальная',
      '30×30 мм',
      30::numeric,
      'пластик',
      0.02::numeric,
      0.8::numeric,
      'in',
      '16790',
      'Заглушка внутр. 30×30',
      1
    ),
    (
      'soputstvuyushchie-art-16791',
      'Заглушка квадратная внутр. 20×20',
      '20×20 мм',
      20::numeric,
      'пластик',
      0.02::numeric,
      null::numeric,
      'out',
      '16791',
      'Заглушка внутр. 20×20',
      2
    ),
    (
      'soputstvuyushchie-art-12417',
      'Заглушка пластиковая квадратная 120×120 мм, Россия',
      '120×120 мм',
      120::numeric,
      'пластик',
      0.08::numeric,
      10.8::numeric,
      'in',
      '12417',
      'Заглушка 120×120, Россия',
      3
    ),
    (
      'soputstvuyushchie-art-12416',
      'Заглушка пластиковая прямоугольная 20×40 мм, Россия',
      '20×40 мм',
      40::numeric,
      'пластик',
      0.02::numeric,
      0.5::numeric,
      'in',
      '12416',
      'Заглушка 20×40, Россия',
      4
    ),
    (
      'soputstvuyushchie-art-12415',
      'Заглушка пластиковая прямоугольная 40×80 мм, Россия',
      '40×80 мм',
      80::numeric,
      'пластик',
      0.03::numeric,
      1::numeric,
      'in',
      '12415',
      'Заглушка 40×80, Россия',
      5
    ),
    (
      'soputstvuyushchie-art-11676',
      'Заглушка пластиковая квадратная 40×40 мм, Россия',
      '40×40 мм',
      40::numeric,
      'пластик',
      0.02::numeric,
      0.8::numeric,
      'in',
      '11676',
      'Заглушка 40×40, Россия',
      6
    ),
    (
      'soputstvuyushchie-art-11675',
      'Заглушка пластиковая квадратная 50×50 мм, Россия',
      '50×50 мм',
      50::numeric,
      'пластик',
      0.03::numeric,
      0.85::numeric,
      'in',
      '11675',
      'Заглушка 50×50, Россия',
      7
    ),
    (
      'soputstvuyushchie-art-11674',
      'Заглушка пластиковая квадратная 100×100 мм, Россия',
      '100×100 мм',
      100::numeric,
      'пластик',
      0.06::numeric,
      3.1::numeric,
      'in',
      '11674',
      'Заглушка 100×100, Россия',
      8
    ),
    (
      'soputstvuyushchie-art-11673',
      'Заглушка пластиковая прямоугольная 60×80 мм, Россия',
      '60×80 мм',
      80::numeric,
      'пластик',
      0.04::numeric,
      1.5::numeric,
      'in',
      '11673',
      'Заглушка 60×80, Россия',
      9
    ),
    (
      'soputstvuyushchie-art-11672',
      'Заглушка пластиковая квадратная 80×80 мм, Россия',
      '80×80 мм',
      80::numeric,
      'пластик',
      0.05::numeric,
      2::numeric,
      'in',
      '11672',
      'Заглушка 80×80, Россия',
      10
    ),
    (
      'soputstvuyushchie-art-11671',
      'Заглушка пластиковая квадратная 60×60 мм, Россия',
      '60×60 мм',
      60::numeric,
      'пластик',
      0.04::numeric,
      1.2::numeric,
      'in',
      '11671',
      'Заглушка 60×60, Россия',
      11
    ),
    (
      'soputstvuyushchie-art-11670',
      'Заглушка пластиковая прямоугольная 40×60 мм, Россия',
      '40×60 мм',
      60::numeric,
      'пластик',
      0.03::numeric,
      1.2::numeric,
      'in',
      '11670',
      'Заглушка 40×60, Россия',
      12
    )
) as v(
  slug,
  name,
  size,
  dimension,
  steel,
  weight_kg,
  price_per_unit,
  stock,
  article,
  card_title,
  sort_order
)
where c.slug = 'soputstvuyushchie-tovary'
on conflict (slug) do update set
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_unit = excluded.price_per_unit,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-supplies-primer.sql ==========

-- Товары: подкатегория «Грунтовка по металлу» (supplies-primer).
-- Перед запуском: supabase-seed-supplies-subcategories.sql.

insert into public.products (
  slug,
  category_id,
  subcategory_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  v.slug,
  c.id,
  'supplies-primer',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  v.gost,
  null,
  'шт',
  v.weight_kg,
  null,
  v.price_per_unit,
  null,
  null,
  'in',
  false,
  v.article,
  v.card_title,
  '/products/supplies.webp',
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'soputstvuyushchie-art-15003',
      'Грунтовка ГФ-021 по металлу красно-коричневый 2,5 кг ГОСТ 25129-82',
      'банка 2,5 кг',
      2.5::numeric,
      'ГФ-021',
      'ГОСТ 25129-82',
      2.5::numeric,
      33::numeric,
      '15003',
      'Грунтовка ГФ-021 2,5 кг, красно-коричн.',
      1
    ),
    (
      'soputstvuyushchie-art-14927',
      'Грунтовка ГФ-021 банка 2,5 кг, банка СЕРАЯ, ГОСТ 25129-82, РФ',
      'банка 2,5 кг, серая',
      2.5::numeric,
      'ГФ-021',
      'ГОСТ 25129-82',
      2.5::numeric,
      29::numeric,
      '14927',
      'Грунтовка ГФ-021 2,5 кг, серая, РФ',
      2
    )
) as v(
  slug,
  name,
  size,
  dimension,
  steel,
  gost,
  weight_kg,
  price_per_unit,
  article,
  card_title,
  sort_order
)
where c.slug = 'soputstvuyushchie-tovary'
on conflict (slug) do update set
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_unit = excluded.price_per_unit,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-supplies-wire.sql ==========

-- Товары: подкатегория «Проволока вязальная» (supplies-wire).
-- Перед запуском: supabase-seed-supplies-subcategories.sql.
-- Бухты: sale_unit «боб», length_m и meters_per_sale_unit — метраж бухты.

insert into public.products (
  slug,
  category_id,
  subcategory_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  v.slug,
  c.id,
  'supplies-wire',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  v.gost,
  v.length_m,
  v.sale_unit,
  v.weight_kg,
  null,
  v.price_per_unit,
  null,
  v.meters_per_sale_unit,
  v.stock,
  false,
  v.article,
  v.card_title,
  '/products/supplies.webp',
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'soputstvuyushchie-art-14254',
      'Проволока стальная низкоугл. оцинкованная Ø3,0 мм (бухта 50 м), РФ',
      'Ø3,0 мм, бухта 50 м',
      3::numeric,
      'оцинкованная',
      'ГОСТ 3282-74',
      50::numeric,
      'боб',
      2.8::numeric,
      18::numeric,
      50::numeric,
      'in',
      '14254',
      'Проволока оц. Ø3,0, бухта 50 м',
      1
    ),
    (
      'soputstvuyushchie-art-16667',
      'Проволока оцинкованная вязальная 5,0 мм (бухта 7,7 кг — 50 м), РФ',
      'Ø5,0 мм, бухта 50 м',
      5::numeric,
      'оцинкованная',
      'ГОСТ 3282-74',
      50::numeric,
      'боб',
      7.7::numeric,
      53::numeric,
      50::numeric,
      'in',
      '16667',
      'Проволока вяз. Ø5,0, 7,7 кг / 50 м',
      2
    ),
    (
      'soputstvuyushchie-art-16423',
      'Проволока оцинкованная вязальная 2,0 мм (бухта 2,47 кг — 100 м), РФ',
      'Ø2,0 мм, бухта 100 м',
      2::numeric,
      'оцинкованная',
      'ГОСТ 3282-74',
      100::numeric,
      'боб',
      2.47::numeric,
      12::numeric,
      100::numeric,
      'in',
      '16423',
      'Проволока вяз. Ø2,0, 100 м',
      3
    ),
    (
      'soputstvuyushchie-art-17086',
      'Проволока ТО оцинк. KRONEX, 4,0 мм',
      'Ø4,0 мм',
      4::numeric,
      'оцинкованная',
      'ТУ производителя',
      null::numeric,
      'шт',
      5::numeric,
      null::numeric,
      null::numeric,
      'out',
      '17086',
      'Проволока KRONEX Ø4,0',
      4
    ),
    (
      'soputstvuyushchie-art-16654',
      'Проволока оцинкованная вязальная 1,2 мм (бухта 1 кг), РФ',
      'Ø1,2 мм, бухта 1 кг',
      1.2::numeric,
      'оцинкованная',
      'ГОСТ 3282-74',
      null::numeric,
      'шт',
      1::numeric,
      null::numeric,
      null::numeric,
      'out',
      '16654',
      'Проволока вяз. Ø1,2, 1 кг',
      5
    ),
    (
      'soputstvuyushchie-art-16292',
      'Заготовка из проволоки ОЦИНК., d/1,2 т/о, бухта 100 м.п., РБ',
      'Ø1,2 мм, бухта 100 м',
      1.2::numeric,
      'оцинкованная',
      'ТУ производителя',
      100::numeric,
      'боб',
      1.1::numeric,
      12::numeric,
      100::numeric,
      'in',
      '16292',
      'Проволока оц. Ø1,2, бухта 100 м, РБ',
      6
    )
) as v(
  slug,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_unit,
  meters_per_sale_unit,
  stock,
  article,
  card_title,
  sort_order
)
where c.slug = 'soputstvuyushchie-tovary'
on conflict (slug) do update set
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  length_m = excluded.length_m,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_unit = excluded.price_per_unit,
  meters_per_sale_unit = excluded.meters_per_sale_unit,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-pipe-subcategories.sql ==========

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


-- ========== supabase-seed-pipe-vgp.sql ==========

-- Товары: подкатегория «Трубы стальные водогазопроводные» (pipe-vgp).
-- Перед запуском: supabase-seed-pipe-subcategories.sql.
-- dimension — условный проход Du (мм); weight_kg — масса 1 п.м. (ориентир по ГОСТ 3262-75).

insert into public.products (
  slug,
  category_id,
  subcategory_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  v.slug,
  c.id,
  'pipe-vgp',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  v.gost,
  6::numeric,
  'м',
  v.weight_kg,
  v.price_per_ton,
  null,
  null,
  null,
  'in',
  false,
  v.article,
  v.card_title,
  '/products/pipe-sub/vgp.webp',
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'truby-stalnye-vgp-art-05357',
      'Труба чёрная ВГП Ду 32×3,2 ГОСТ 3262-75 (РФ)',
      'Ду 32×3,2 мм',
      32::numeric,
      'Ст3сп',
      'ГОСТ 3262-75',
      2.9::numeric,
      2960::numeric,
      '05357',
      'Труба ВГП Ду 32×3,2, РФ',
      1
    ),
    (
      'truby-stalnye-vgp-art-04935',
      'Труба чёрная ВГП Ду 20×2,8 ГОСТ 3262-75 (РФ)',
      'Ду 20×2,8 мм',
      20::numeric,
      'Ст3сп',
      'ГОСТ 3262-75',
      1.63::numeric,
      2910::numeric,
      '04935',
      'Труба ВГП Ду 20×2,8, РФ',
      2
    ),
    (
      'truby-stalnye-vgp-art-05481',
      'Труба чёрная ВГП Ду 40×3,5 ГОСТ 3262-75 (Россия)',
      'Ду 40×3,5 мм',
      40::numeric,
      'Ст3сп',
      'ГОСТ 3262-75',
      3.55::numeric,
      3330::numeric,
      '05481',
      'Труба ВГП Ду 40×3,5, Россия',
      3
    ),
    (
      'truby-stalnye-vgp-art-05480',
      'Труба чёрная ВГП Ду 25×3,2 мм ГОСТ 3262-75 (Россия)',
      'Ду 25×3,2 мм',
      25::numeric,
      'Ст3сп',
      'ГОСТ 3262-75',
      2.33::numeric,
      2770::numeric,
      '05480',
      'Труба ВГП Ду 25×3,2, Россия',
      4
    ),
    (
      'truby-stalnye-vgp-art-05478',
      'Труба чёрная ВГП Ду 15×2,8 мм ГОСТ 3262-75 (Россия)',
      'Ду 15×2,8 мм',
      15::numeric,
      'Ст3сп',
      'ГОСТ 3262-75',
      1.28::numeric,
      3010::numeric,
      '05478',
      'Труба ВГП Ду 15×2,8, Россия',
      5
    )
) as v(
  slug,
  name,
  size,
  dimension,
  steel,
  gost,
  weight_kg,
  price_per_ton,
  article,
  card_title,
  sort_order
)
where c.slug = 'truby-stalnye'
on conflict (slug) do update set
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  length_m = excluded.length_m,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_ton = excluded.price_per_ton,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-pipe-electro.sql ==========

-- Товары: подкатегория «Трубы стальные электросварные» (pipe-electro).
-- Перед запуском: supabase-seed-pipe-subcategories.sql.
-- dimension — наружный диаметр (мм); weight_kg — масса 1 п.м. (0,02466×(D−t)×t).

insert into public.products (
  slug,
  category_id,
  subcategory_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  v.slug,
  c.id,
  'pipe-electro',
  v.name,
  v.size,
  v.dimension,
  v.steel,
  v.gost,
  6::numeric,
  'м',
  v.weight_kg,
  v.price_per_ton,
  null,
  null,
  null,
  'in',
  false,
  v.article,
  v.card_title,
  '/products/pipe-sub/electro.webp',
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'truby-stalnye-electro-art-07771',
      'Труба электросварная 114×4 мм ГОСТ 10705-80',
      '114×4 мм',
      114::numeric,
      'Ст3сп',
      'ГОСТ 10705-80',
      10.85::numeric,
      2980::numeric,
      '07771',
      'Труба э/с 114×4',
      1
    ),
    (
      'truby-stalnye-electro-art-07770',
      'Труба электросварная 219×6 мм ГОСТ 10705-80',
      '219×6 мм',
      219::numeric,
      'Ст3сп',
      'ГОСТ 10705-80',
      31.51::numeric,
      2801.6::numeric,
      '07770',
      'Труба э/с 219×6',
      2
    ),
    (
      'truby-stalnye-electro-art-05540',
      'Труба электросварная 89×3,5 мм',
      '89×3,5 мм',
      89::numeric,
      'Ст3сп',
      'ГОСТ 10704-91',
      7.38::numeric,
      2860::numeric,
      '05540',
      'Труба э/с 89×3,5',
      3
    ),
    (
      'truby-stalnye-electro-art-05539',
      'Труба электросварная 57×3,5 мм ГОСТ 10705-80',
      '57×3,5 мм',
      57::numeric,
      'Ст3сп',
      'ГОСТ 10705-80',
      4.62::numeric,
      2880::numeric,
      '05539',
      'Труба э/с 57×3,5',
      4
    ),
    (
      'truby-stalnye-electro-art-05534',
      'Труба электросварная 76×3,5 мм ГОСТ 10705-80',
      '76×3,5 мм',
      76::numeric,
      'Ст3сп',
      'ГОСТ 10705-80',
      6.26::numeric,
      2820::numeric,
      '05534',
      'Труба э/с 76×3,5',
      5
    ),
    (
      'truby-stalnye-electro-art-05533',
      'Труба электросварная 108×3,5 мм ГОСТ 10704-91',
      '108×3,5 мм',
      108::numeric,
      'Ст3сп',
      'ГОСТ 10704-91',
      9.03::numeric,
      2860::numeric,
      '05533',
      'Труба э/с 108×3,5',
      6
    ),
    (
      'truby-stalnye-electro-art-10885',
      'Труба электросварная 273×6 мм ГОСТ 10705-80',
      '273×6 мм',
      273::numeric,
      'Ст3сп',
      'ГОСТ 10705-80',
      39.52::numeric,
      3193::numeric,
      '10885',
      'Труба э/с 273×6',
      7
    ),
    (
      'truby-stalnye-electro-art-10390',
      'Труба электросварная 325×6 мм ГОСТ 10705-80',
      '325×6 мм',
      325::numeric,
      'Ст3сп',
      'ГОСТ 10705-80',
      47.2::numeric,
      3007.6::numeric,
      '10390',
      'Труба э/с 325×6',
      8
    ),
    (
      'truby-stalnye-electro-art-10389',
      'Труба электросварная 159×4,5 мм ГОСТ 10705-80',
      '159×4,5 мм',
      159::numeric,
      'Ст3сп',
      'ГОСТ 10705-80',
      17.15::numeric,
      3141.5::numeric,
      '10389',
      'Труба э/с 159×4,5',
      9
    ),
    (
      'truby-stalnye-electro-art-09341',
      'Труба электросварная 133×4,5 мм ГОСТ 10705-80',
      '133×4,5 мм',
      133::numeric,
      'Ст3сп',
      'ГОСТ 10705-80',
      14.26::numeric,
      2860::numeric,
      '09341',
      'Труба э/с 133×4,5',
      10
    )
) as v(
  slug,
  name,
  size,
  dimension,
  steel,
  gost,
  weight_kg,
  price_per_ton,
  article,
  card_title,
  sort_order
)
where c.slug = 'truby-stalnye'
on conflict (slug) do update set
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  length_m = excluded.length_m,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_ton = excluded.price_per_ton,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-pipe-profile.sql ==========

-- Товары: подкатегория «Трубы стальные профильные» (pipe-profile), 23 позиции.
-- Перед запуском: supabase-seed-pipe-subcategories.sql.
-- dimension — большая сторона сечения (мм); weight_kg — масса 1 п.м. (ориентир).

insert into public.products (
  slug,
  category_id,
  subcategory_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  v.slug,
  c.id,
  'pipe-profile',
  v.name,
  v.size,
  v.dimension,
  'Ст3сп',
  'ГОСТ 8639-82',
  v.length_m,
  'м',
  v.weight_kg,
  v.price_per_ton,
  null,
  null,
  null,
  'in',
  false,
  v.article,
  v.card_title,
  '/products/pipe-sub/profile.webp',
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    ('truby-stalnye-profile-art-13114', 'Труба профильная 30×30×1,5×6000 мм (Россия)', '30×30×1,5 мм', 30::numeric, 6::numeric, 1.34::numeric, 3180::numeric, '13114', 'Труба проф. 30×30×1,5×6000', 1),
    ('truby-stalnye-profile-art-09682', 'Труба 50×50×2,0 мм 6 м, РФ', '50×50×2 мм', 50::numeric, 6::numeric, 3.01::numeric, 3080::numeric, '09682', 'Труба 50×50×2, 6 м', 2),
    ('truby-stalnye-profile-art-14170', 'Труба профильная 25×25×1,5×6000 мм, Россия', '25×25×1,5 мм', 25::numeric, 6::numeric, 1.11::numeric, 3200::numeric, '14170', 'Труба проф. 25×25×1,5×6000', 3),
    ('truby-stalnye-profile-art-14140', 'Труба стальная электросварная 60×60×3 (Россия)', '60×60×3 мм', 60::numeric, 6::numeric, 5.37::numeric, 2750::numeric, '14140', 'Труба 60×60×3', 4),
    ('truby-stalnye-profile-art-14139', 'Труба стальная квадратная 40×40×3×6000', '40×40×3 мм', 40::numeric, 6::numeric, 3.48::numeric, 2790::numeric, '14139', 'Труба 40×40×3×6000', 5),
    ('truby-stalnye-profile-art-08545', 'Труба сварная прямоугольная 80×60×3 Россия', '80×60×3 мм', 80::numeric, 6::numeric, 6.31::numeric, 2810::numeric, '08545', 'Труба 80×60×3', 6),
    ('truby-stalnye-profile-art-04522', 'Труба профильная 50×25×2×6000 мм', '50×25×2 мм', 50::numeric, 6::numeric, 2.23::numeric, 2760::numeric, '04522', 'Труба проф. 50×25×2×6000', 7),
    ('truby-stalnye-profile-art-05908', 'Труба профильная 80×80×3×12000 мм (Россия)', '80×80×3 мм', 80::numeric, 12::numeric, 7.25::numeric, 2770::numeric, '05908', 'Труба проф. 80×80×3×12000', 8),
    ('truby-stalnye-profile-art-05535', 'Труба профильная 40×20×1,5×6000 мм (Россия)', '40×20×1,5 мм', 40::numeric, 6::numeric, 1.34::numeric, 2960::numeric, '05535', 'Труба проф. 40×20×1,5×6000', 9),
    ('truby-stalnye-profile-art-05474', 'Труба профильная 40×40×2×6000 мм (Россия)', '40×40×2 мм', 40::numeric, 6::numeric, 2.39::numeric, 2930::numeric, '05474', 'Труба проф. 40×40×2×6000', 10),
    ('truby-stalnye-profile-art-05472', 'Труба профильная 20×20×1,5×6000 мм (Россия)', '20×20×1,5 мм', 20::numeric, 6::numeric, 0.87::numeric, 3220::numeric, '05472', 'Труба проф. 20×20×1,5×6000', 11),
    ('truby-stalnye-profile-art-12456', 'Труба профильная 40×40×1,5×6000 мм (Россия)', '40×40×1,5 мм', 40::numeric, 6::numeric, 1.81::numeric, 3180::numeric, '12456', 'Труба проф. 40×40×1,5×6000', 12),
    ('truby-stalnye-profile-art-12375', 'Труба профильная 40×25×1,5×6000 мм', '40×25×1,5 мм', 40::numeric, 6::numeric, 1.46::numeric, 3296::numeric, '12375', 'Труба проф. 40×25×1,5×6000', 13),
    ('truby-stalnye-profile-art-12373', 'Труба Пр Уг 120×120×4×12000 Россия', '120×120×4 мм', 120::numeric, 12::numeric, 14.57::numeric, 2810::numeric, '12373', 'Труба 120×120×4×12000', 14),
    ('truby-stalnye-profile-art-12371', 'Труба профильная 80×40×2×6000 мм (Россия)', '80×40×2 мм', 80::numeric, 6::numeric, 3.64::numeric, 3040::numeric, '12371', 'Труба проф. 80×40×2×6000', 15),
    ('truby-stalnye-profile-art-12369', 'Труба профильная 60×40×3×6000 мм', '60×40×3 мм', 60::numeric, 6::numeric, 4.43::numeric, 2890::numeric, '12369', 'Труба проф. 60×40×3×6000', 16),
    ('truby-stalnye-profile-art-12368', 'Труба профильная 60×40×1,5×6000 мм (Россия)', '60×40×1,5 мм', 60::numeric, 6::numeric, 2.21::numeric, 2980::numeric, '12368', 'Труба проф. 60×40×1,5×6000', 17),
    ('truby-stalnye-profile-art-11176', 'Труба профильная 40×20×2×6000 мм (Россия)', '40×20×2 мм', 40::numeric, 6::numeric, 1.76::numeric, 2760::numeric, '11176', 'Труба проф. 40×20×2×6000', 18),
    ('truby-stalnye-profile-art-11036', 'Труба профильная 60×40×2×6000 мм (Россия)', '60×40×2 мм', 60::numeric, 6::numeric, 2.95::numeric, 3020::numeric, '11036', 'Труба проф. 60×40×2×6000', 19),
    ('truby-stalnye-profile-art-09643', 'Труба профильная 30×20×1,5×6000 мм (Россия)', '30×20×1,5 мм', 30::numeric, 6::numeric, 1.11::numeric, 3200::numeric, '09643', 'Труба проф. 30×20×1,5×6000', 20),
    ('truby-stalnye-profile-art-09385', 'Труба профильная 60×60×2×6000 мм (Россия)', '60×60×2 мм', 60::numeric, 6::numeric, 2.39::numeric, 2870::numeric, '09385', 'Труба проф. 60×60×2×6000', 21),
    ('truby-stalnye-profile-art-09383', 'Труба профильная 15×15×1,5×6000 мм (Россия)', '15×15×1,5 мм', 15::numeric, 6::numeric, 0.64::numeric, 3260::numeric, '09383', 'Труба проф. 15×15×1,5×6000', 22),
    ('truby-stalnye-profile-art-08785', 'Труба профильная 100×100×3×12000 мм (Россия)', '100×100×3 мм', 100::numeric, 12::numeric, 9.14::numeric, 2800::numeric, '08785', 'Труба проф. 100×100×3×12000', 23)
) as v(
  slug,
  name,
  size,
  dimension,
  length_m,
  weight_kg,
  price_per_ton,
  article,
  card_title,
  sort_order
)
where c.slug = 'truby-stalnye'
on conflict (slug) do update set
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  length_m = excluded.length_m,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_ton = excluded.price_per_ton,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();


-- ========== supabase-seed-pipe-zn.sql ==========

-- Товары: подкатегория «Трубы оцинкованные ВГП и электросварные» (pipe-zn).
-- Перед запуском: supabase-seed-pipe-subcategories.sql.

insert into public.products (
  slug,
  category_id,
  subcategory_id,
  name,
  size,
  dimension,
  steel,
  gost,
  length_m,
  sale_unit,
  weight_kg,
  price_per_ton,
  price_per_unit,
  price_per_meter,
  meters_per_sale_unit,
  stock,
  popular,
  article,
  card_title,
  image,
  sort_order,
  is_published,
  updated_at
)
select
  v.slug,
  c.id,
  'pipe-zn',
  v.name,
  v.size,
  v.dimension,
  'оцинкованная',
  v.gost,
  6::numeric,
  'м',
  v.weight_kg,
  v.price_per_ton,
  null,
  null,
  null,
  v.stock,
  false,
  v.article,
  v.card_title,
  '/products/pipe.webp',
  v.sort_order,
  true,
  now()
from public.categories c
cross join (
  values
    (
      'truby-stalnye-zn-art-04518',
      'Труба ВГП оцинкованная Ду 25×3,2 ГОСТ 3262-75',
      'Ду 25×3,2 мм',
      25::numeric,
      'ГОСТ 3262-75',
      2.33::numeric,
      null::numeric,
      'out',
      '04518',
      'Труба ВГП оц. Ду 25×3,2',
      1
    ),
    (
      'truby-stalnye-zn-art-04732',
      'Труба электросварная оцинкованная 76×3,5 мм ГОСТ 10704-91',
      '76×3,5 мм',
      76::numeric,
      'ГОСТ 10704-91',
      6.26::numeric,
      4230::numeric,
      'in',
      '04732',
      'Труба э/с оц. 76×3,5',
      2
    ),
    (
      'truby-stalnye-zn-art-04731',
      'Труба ВГП оцинкованная Ду 40×3,5 ГОСТ 3262-75',
      'Ду 40×3,5 мм',
      40::numeric,
      'ГОСТ 3262-75',
      3.55::numeric,
      5770::numeric,
      'in',
      '04731',
      'Труба ВГП оц. Ду 40×3,5',
      3
    ),
    (
      'truby-stalnye-zn-art-04527',
      'Труба ВГП оцинкованная Ду 15×2,8 ГОСТ 3262-75',
      'Ду 15×2,8 мм',
      15::numeric,
      'ГОСТ 3262-75',
      1.28::numeric,
      4732.03::numeric,
      'in',
      '04527',
      'Труба ВГП оц. Ду 15×2,8',
      4
    ),
    (
      'truby-stalnye-zn-art-04519',
      'Труба ВГП оцинкованная Ду 32×3,2 ГОСТ 3262-75',
      'Ду 32×3,2 мм',
      32::numeric,
      'ГОСТ 3262-75',
      2.9::numeric,
      4430::numeric,
      'in',
      '04519',
      'Труба ВГП оц. Ду 32×3,2',
      5
    ),
    (
      'truby-stalnye-zn-art-04517',
      'Труба ВГП оцинкованная Ду 20×2,8 ГОСТ 3262-75',
      'Ду 20×2,8 мм',
      20::numeric,
      'ГОСТ 3262-75',
      1.63::numeric,
      4573.2::numeric,
      'in',
      '04517',
      'Труба ВГП оц. Ду 20×2,8',
      6
    ),
    (
      'truby-stalnye-zn-art-04402',
      'Труба ВГП оцинкованная Ду 50×3,5 ГОСТ 3262-75',
      'Ду 50×3,5 мм',
      50::numeric,
      'ГОСТ 3262-75',
      4.88::numeric,
      4950::numeric,
      'in',
      '04402',
      'Труба ВГП оц. Ду 50×3,5',
      7
    ),
    (
      'truby-stalnye-zn-art-08775',
      'Труба электросварная оцинкованная Ду 89×3,5 мм ГОСТ 10705-80',
      '89×3,5 мм',
      89::numeric,
      'ГОСТ 10705-80',
      7.38::numeric,
      4170::numeric,
      'in',
      '08775',
      'Труба э/с оц. 89×3,5',
      8
    ),
    (
      'truby-stalnye-zn-art-08774',
      'Труба электросварная оцинкованная Ду 108×3,5 мм ГОСТ 10704-91',
      '108×3,5 мм',
      108::numeric,
      'ГОСТ 10704-91',
      9.03::numeric,
      4480::numeric,
      'in',
      '08774',
      'Труба э/с оц. 108×3,5',
      9
    )
) as v(
  slug,
  name,
  size,
  dimension,
  gost,
  weight_kg,
  price_per_ton,
  stock,
  article,
  card_title,
  sort_order
)
where c.slug = 'truby-stalnye'
on conflict (slug) do update set
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  name = excluded.name,
  size = excluded.size,
  dimension = excluded.dimension,
  steel = excluded.steel,
  gost = excluded.gost,
  length_m = excluded.length_m,
  sale_unit = excluded.sale_unit,
  weight_kg = excluded.weight_kg,
  price_per_ton = excluded.price_per_ton,
  stock = excluded.stock,
  article = excluded.article,
  card_title = excluded.card_title,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();

