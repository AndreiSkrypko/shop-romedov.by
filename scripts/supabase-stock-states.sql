-- Три статуса наличия: in | out | order
-- Выполните в Supabase SQL Editor после основной схемы.

alter table public.products drop constraint if exists products_stock_check;

alter table public.products
  add constraint products_stock_check
  check (stock in ('in', 'out', 'order'));
