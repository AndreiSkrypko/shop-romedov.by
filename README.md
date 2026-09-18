# shop.romedov.by — интернет-магазин металлопроката

Магазин собран на том же стеке и дизайн-системе, что и основной сайт `romedov.by`:
TanStack Start (React 19 + Vite), Tailwind CSS v4, статический пререндер всех страниц.

## Команды

```bash
npm install
npm run dev      # локальная разработка, http://localhost:3000
npm run build    # пререндер в dist/ + sitemap.xml
npm run lint     # eslint + prettier
```

Админка (товары в Supabase): http://localhost:3000/admin/login — логин `admin`, пароль `romedov2026`.  
Если таблица `products` уже была создана раньше, выполните в SQL Editor файл `scripts/supabase-admin-rpc.sql`.
Для загрузки фото в админке на Hoster.by: выполните `scripts/supabase-storage.sql` в Supabase (политика загрузки через publishable key).

Каталог и админка читают данные из Supabase (ключ в `src/lib/supabase/config.ts`).

**Новая база** — в SQL Editor по порядку:

1. `scripts/supabase-schema.sql`
2. `scripts/supabase-subcategories.sql`
3. `scripts/supabase-admin-rpc.sql`
4. `scripts/supabase-storage.sql` (загрузка фото в админке)
5. `scripts/supabase-seed-data.sql` (категории, подкатегории, товары)

Обложки: `public/products/`. Повторный запуск сидов безопасен (`on conflict`).

`npm run build` → `dist/` (витрина + админка) — заливка на Hoster.by.

## Структура

| Путь | Назначение |
| --- | --- |
| `src/lib/catalog/` | Категории, товары, расчёт цен и веса, фильтры, поиск |
| `src/lib/supabase/` | Ключи и запросы к Supabase (товары из таблицы `products`) |
| `scripts/supabase-*.sql` | Схема, RPC, сид каталога |
| `src/lib/cart.tsx` | Провайдер корзины с сохранением в `localStorage` |
| `src/lib/order.ts` | Формат заказа, валидация, текст письма |
| `src/lib/request.ts` | Формат заявки без корзины (форма на странице контактов) |
| `src/lib/mailer.server.ts` | SMTP и Telegram для локальной разработки |
| `src/components/shop/` | Шапка, подвал, карточки, таблица сортамента, формы |
| `public/api/submit.php` | Обработчик заказов и заявок на Hoster.by |
| `public/products/` | Изображения категорий |

## Каталог

Товары в Supabase; в коде — расчёт цены и веса. Вес считается из площади сечения
(плотность стали 7,85 г/см³) или берётся из таблиц ГОСТ для сортового проката.
Цена задаётся либо за тонну (`pricePerTon`), либо за единицу продажи (`pricePerUnit`) —
итог по объёму покупателя считает `unitPrice()`.

Чтобы скрыть цены и превратить каталог в форму заявки, поставьте `SHOW_PRICES = false`
в `src/lib/site.ts`.

## Приём заказов

Форма на **контактах**, **карточке товара** и **оформление из корзины** отправляют один
и тот же запрос в `POST /api/submit.php`: сначала **почта**, затем **Telegram**.
Ошибка бота не отменяет принятую заявку, ошибка почты — отменяет.

1. Заполните **`src/lib/lead-delivery.config.ts`**: `telegram_bot_token`, `telegram_chat_id`,
   для локальной разработки — **SMTP** (`smtp_host`, `smtp_user`, `smtp_pass`).
2. `npm run build` кладёт те же настройки в `dist/api/config.json` для `submit.php` на Hoster.by
   (почта через `mail()`, SMTP в JSON на хостинге не нужен).
3. Опционально: `public/api/config.json` переопределяет значения из TS (файл в `.gitignore`).
4. Заливайте **`dist/`** целиком — внутри уже `api/submit.php` и `api/config.json`.
