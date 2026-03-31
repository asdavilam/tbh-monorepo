-- Tabla de productos (insumos)

create type product_type as enum ('raw_material', 'disposable', 'basic');
create type unit_type as enum ('unit', 'fraction', 'qualitative');
create type count_frequency as enum ('daily', 'specific_days');

create table products (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  type            product_type not null,
  unit_type       unit_type not null,
  unit_label      text not null,
  count_frequency count_frequency not null default 'daily',
  -- Días activos: array de 0-6 (0=Domingo). Solo aplica si count_frequency = 'specific_days'
  count_days      smallint[] not null default '{}',
  -- null para productos cualitativos
  min_stock       numeric,
  -- null = visible para todos los trabajadores
  assigned_user_id uuid references profiles (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Trigger para actualizar updated_at automáticamente
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

-- RLS
alter table products enable row level security;

-- Todos los usuarios autenticados pueden leer productos
create policy "authenticated_read_products"
  on products for select
  using (auth.uid() is not null);

-- Solo admins pueden crear productos
create policy "admins_insert_products"
  on products for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Solo admins pueden actualizar productos
create policy "admins_update_products"
  on products for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Solo admins pueden eliminar productos
create policy "admins_delete_products"
  on products for delete
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );
