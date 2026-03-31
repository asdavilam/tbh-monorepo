-- Tabla de compras
-- Una compra impacta siempre el inventario actual del producto

create table purchases (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references products (id) on delete cascade,
  user_id      uuid not null references profiles (id) on delete cascade,
  quantity     numeric not null check (quantity > 0),
  purchased_at timestamptz not null default now(),
  notes        text
);

-- Índices para consultas frecuentes
create index purchases_product_id_idx on purchases (product_id);
create index purchases_purchased_at_idx on purchases (purchased_at desc);
create index purchases_user_id_idx on purchases (user_id);

-- RLS
alter table purchases enable row level security;

-- Admins y encargados pueden leer todas las compras
create policy "admins_encargados_read_purchases"
  on purchases for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'encargado')
    )
  );

-- Admins y encargados pueden registrar compras
create policy "admins_encargados_insert_purchases"
  on purchases for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'encargado')
    )
  );

-- Solo admins pueden eliminar compras
create policy "admins_delete_purchases"
  on purchases for delete
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );
