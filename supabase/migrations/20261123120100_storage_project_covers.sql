-- Bucket de capas dos projetos.
-- Público para leitura (as capas aparecem em <img> sem token), até 5 MB,
-- apenas JPEG, PNG e WebP. Cada pessoa só envia, substitui e apaga arquivos
-- dentro da pasta com o próprio id: project-covers/<auth.uid()>/<arquivo>.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-covers',
  'project-covers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Necessária para remove()/upsert via API (a API lê o objeto antes de agir).
create policy "project-covers: dona lê os próprios arquivos"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'project-covers'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "project-covers: dona envia na própria pasta"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'project-covers'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "project-covers: dona substitui os próprios arquivos"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'project-covers'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'project-covers'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "project-covers: dona apaga os próprios arquivos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'project-covers'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
