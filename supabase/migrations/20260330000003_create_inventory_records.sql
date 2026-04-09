-- Tabla de registros de inventario (conteos diarios)
-- REGLA: Solo se almacenan datos fuente. Las diferencias se calculan en la aplicación.
-- date = día del conteo (puede diferir de created_at si se registra tarde)
-- recorded_at = timestamp exacto de cuando se creó el registro en DB

do $$ begin
  create type qualitative_value as enum ('mucho', 'poco', 'nada');
exception when duplicate_object then null;
end $$;

create table if not exists inventory_records (
  id                 uuid primary key default gen_random_uuid(),
  product_id         uuid not null references products (id) on delete cascade,
  user_id            uuid not null references profiles (id) on delete cascade,
  -- Fecha del conteo (ej: 2026-03-30). Puede diferir de recorded_at.
  date               date not null,
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

-- Agregar columna date si la tabla ya existe sin ella (upgrade seguro)
do $$ begin
  alter table inventory_records add column date date not null default current_date;
exception when duplicate_column then null;
end $$;

-- Índices para consultas frecuentes
create index if not exists inventory_records_product_id_idx on inventory_records (product_id);
create index if not exists inventory_records_date_idx on inventory_records (date desc);
create index if not exists inventory_records_recorded_at_idx on inventory_records (recorded_at desc);
create index if not exists inventory_records_user_id_idx on inventory_records (user_id);
create index if not exists inventory_records_product_date_idx on inventory_records (product_id, date desc);

-- RLS
alter table inventory_records enable row level security;

-- Los usuarios pueden leer sus propios registros
do $$ begin
  create policy "users_read_own_records"
    on inventory_records for select
    using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- Admins y encargados pueden leer todos los registros
do $$ begin
  create policy "admins_encargados_read_all_records"
    on inventory_records for select
    using (
      exists (
        select 1 from profiles
        where id = auth.uid() and role in ('admin', 'encargado')
      )
    );
exception when duplicate_object then null;
end $$;

-- Todos los roles pueden insertar registros (solo los propios)
do $$ begin
  create policy "users_insert_own_records"
    on inventory_records for insert
    with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- Solo admins pueden editar registros
do $$ begin
  create policy "admins_update_records"
    on inventory_records for update
    using (
      exists (
        select 1 from profiles
        where id = auth.uid() and role = 'admin'
      )
    );
exception when duplicate_object then null;
end $$;
