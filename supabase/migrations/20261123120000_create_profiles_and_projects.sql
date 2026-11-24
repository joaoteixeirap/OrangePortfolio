-- Orange Portfólio: perfis e projetos
-- profiles.id = auth.users.id (1:1); cada perfil tem N projetos.

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  nome        text not null default '' check (char_length(nome) <= 50),
  sobrenome   text not null default '' check (char_length(sobrenome) <= 50),
  pais        text not null default 'Brasil' check (char_length(pais) <= 56),
  avatar_url  text check (avatar_url is null or avatar_url ~* '^https://'),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'Perfil público de cada pessoa usuária (1:1 com auth.users).';

create table public.projects (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  title        text not null check (char_length(btrim(title)) between 1 and 100),
  description  text not null default '' check (char_length(description) <= 2000),
  link         text check (link is null or (link ~* '^https?://' and char_length(link) <= 500)),
  tags         text[] not null default '{}'
                 check (cardinality(tags) <= 8 and array_position(tags, null) is null),
  cover_url    text check (cover_url is null or cover_url ~* '^https://'),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.projects is 'Projetos do portfólio. Leitura para qualquer pessoa logada; escrita só pela dona.';

create index projects_user_id_created_at_idx on public.projects (user_id, created_at desc);
create index projects_created_at_idx on public.projects (created_at desc);
create index projects_tags_idx on public.projects using gin (tags);

-- ---------------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Perfil criado automaticamente no cadastro (e-mail/senha ou Google)
-- E-mail/senha envia {nome, sobrenome} em options.data.
-- Google envia {full_name, name, given_name, family_name, avatar_url, picture}.
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta       jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  full_name  text  := btrim(coalesce(meta ->> 'full_name', meta ->> 'name', ''));
  v_nome     text;
  v_sobrenome text;
  v_avatar   text;
begin
  v_nome := nullif(btrim(coalesce(meta ->> 'nome', meta ->> 'given_name', '')), '');
  if v_nome is null and full_name <> '' then
    v_nome := split_part(full_name, ' ', 1);
  end if;
  if v_nome is null then
    v_nome := split_part(coalesce(new.email, ''), '@', 1);
  end if;

  v_sobrenome := nullif(btrim(coalesce(meta ->> 'sobrenome', meta ->> 'family_name', '')), '');
  if v_sobrenome is null and position(' ' in full_name) > 0 then
    v_sobrenome := btrim(substr(full_name, position(' ' in full_name) + 1));
  end if;

  v_avatar := coalesce(meta ->> 'avatar_url', meta ->> 'picture');
  if v_avatar is not null and v_avatar !~* '^https://' then
    v_avatar := null;
  end if;

  insert into public.profiles (id, nome, sobrenome, avatar_url)
  values (
    new.id,
    left(v_nome, 50),
    left(coalesce(v_sobrenome, ''), 50),
    v_avatar
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.projects enable row level security;

-- profiles: qualquer pessoa logada lê (nome/avatar dos autores no "Descobrir");
-- só a própria pessoa atualiza. Insert é feito pelo trigger; não há delete
-- (o perfil some junto com o auth.users, via on delete cascade).
create policy "profiles: leitura para pessoas logadas"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles: dona atualiza o próprio perfil"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- projects: qualquer pessoa logada lê todos; só a dona cria, edita e exclui.
create policy "projects: leitura para pessoas logadas"
  on public.projects for select
  to authenticated
  using (true);

create policy "projects: dona cria"
  on public.projects for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "projects: dona edita"
  on public.projects for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "projects: dona exclui"
  on public.projects for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Visitantes anônimos não acessam nada.
revoke all on table public.profiles from anon;
revoke all on table public.projects from anon;
