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

`npm run build` кладёт готовые статические файлы в `dist/` — их же можно заливать на
Hoster.by. Для Vercel используется `npm run build:vercel` и `vercel.json`.

## Структура

| Путь | Назначение |
| --- | --- |
| `src/lib/catalog/` | Категории, товары, расчёт цен и веса, фильтры, поиск |
| `src/lib/supabase/` | Ключи и запросы к Supabase (товары из таблицы `products`) |
| `scripts/supabase-schema.sql` | SQL для создания таблицы и первой позиции в Supabase |
| `src/lib/cart.tsx` | Провайдер корзины с сохранением в `localStorage` |
| `src/lib/order.ts` | Формат заказа, валидация, текст письма |
| `src/lib/request.ts` | Формат заявки без корзины (форма на странице контактов) |
| `src/lib/mailer.server.ts` | SMTP и Telegram для локальной разработки |
| `src/components/shop/` | Шапка, подвал, карточки, таблица сортамента, формы |
| `public/api/submit.php` | Обработчик заказов и заявок на Hoster.by |
| `public/products/` | Изображения категорий |

## Каталог

Товары описаны в `src/lib/catalog/products.ts`. Вес считается из площади сечения
(плотность стали 7,85 г/см³) или берётся из таблиц ГОСТ для сортового проката.
Цена задаётся либо за тонну (`pricePerTon`), либо за единицу продажи (`pricePerUnit`) —
итог по объёму покупателя считает `unitPrice()`.

Чтобы скрыть цены и превратить каталог в форму заявки, поставьте `SHOW_PRICES = false`
в `src/lib/site.ts`.

## Приём заказов

Заказ и заявка сначала уходят **на почту**, затем дублируются **в Telegram**.
Ошибка бота не отменяет уже принятый заказ, ошибка почты — отменяет.

- Локально (`npm run dev`) используется серверная функция и SMTP из `.env`
  (см. `.env.example`).
- На хостинге запрос идёт в `public/api/submit.php`. Скопируйте
  `public/api/config.example.php` в `config.php` и заполните `email_to`,
  `telegram_bot_token`, `telegram_chat_id`. Файл `config.php` закрыт `.htaccess`
  и не попадает в git.
