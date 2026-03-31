-- Tabla de registros de inventario (conteos diarios)
-- REGLA: Solo se almacenan datos fuente. Las diferencias se calculan en la aplicación.

create type qualitative_value as enum ('mucho', 'poco', 'nada');

create table inventory_records (
  id                 uuid primary key default gen_random_uuid(),
  product_id         uuid not null references products (id) on delete cascade,
  user_id            uuid not null references profiles (id) on delete cascade,
  -- Conteo final numérico. null para productos cualitativos
  final_count        numeric,
  -- Valor cualitativo. null para productos unit/fraction
  qualitative_value  qualitative_value,
  recorded_at        timestamptz not null default now(),
  notes              text,

  -- Constraint: debe tener final_count O qualitative_value, nunca los dos
  constraint inventory_records_count_check check (
    (final_count is not null and qualitative_value is null) or
    (final_count is null and qualitative_value is not null)
  )
);

-- Índices para consultas frecuentes
create index inventory_records_product_id_idx on inventory_records (product_id);
create index inventory_records_recorded_at_idx on inventory_records (recorded_at desc);
create index inventory_records_user_id_idx on inventory_records (user_id);

-- RLS
alter table inventory_records enable row level security;

-- Los usuarios pueden leer sus propios registros
create policy "users_read_own_records"
  on inventory_records for select
  using (auth.uid() = user_id);

-- Admins y encargados pueden leer todos los registros
create policy "admins_encargados_read_all_records"
  on inventory_records for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'encargado')
    )
  );

-- Todos los roles pueden insertar registros (solo los propios)
create policy "users_insert_own_records"
  on inventory_records for insert
  with check (auth.uid() = user_id);

-- Solo admins pueden editar registros
create policy "admins_update_records"
  on inventory_records for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );
