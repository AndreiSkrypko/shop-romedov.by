-- Хранилище фото товаров и категорий (папки products/ и categories/). SQL Editor после admin-rpc.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "product-images: публичное чтение" on storage.objects;
create policy "product-images: публичное чтение"
  on storage.objects for select
  to public
  using (bucket_id = 'product-images');

drop policy if exists "product-images: загрузка из админки" on storage.objects;
create policy "product-images: загрузка из админки"
  on storage.objects for insert
  to anon, authenticated
  with check (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] in ('products', 'categories', 'subcategories')
  );
