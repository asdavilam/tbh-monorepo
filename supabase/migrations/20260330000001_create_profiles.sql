-- Tabla de perfiles de usuario
-- Extiende auth.users de Supabase con datos de la aplicación

create type user_role as enum ('admin', 'encargado', 'trabajador');

create table profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text not null,
  role       user_role not null default 'trabajador',
  created_at timestamptz not null default now()
);

-- RLS
alter table profiles enable row level security;

-- Función helper para verificar admin sin recursión en RLS
-- SECURITY DEFINER: la query interna no pasa por RLS, evitando infinite recursion
create or replace function is_admin()
returns boolean
language sql
security definer set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Los usuarios pueden leer su propio perfil
create policy "users_read_own_profile"
  on profiles for select
  using (auth.uid() = id);

-- Solo admins pueden leer todos los perfiles
create policy "admins_read_all_profiles"
  on profiles for select
  using (is_admin());

-- Solo admins pueden actualizar perfiles
create policy "admins_update_profiles"
  on profiles for update
  using (is_admin());
