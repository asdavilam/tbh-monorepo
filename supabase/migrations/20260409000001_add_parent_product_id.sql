-- Agrega soporte para variantes de producto (ej: Boing Mango, Boing Fresa bajo "Refrescos")
-- Un producto con parent_product_id es una variante; se cuenta individualmente pero su
-- stock se suma al del padre para reportes.
-- ON DELETE CASCADE: al eliminar el padre se eliminan todas sus variantes.

alter table products
  add column if not exists parent_product_id uuid
    references products(id) on delete cascade;

comment on column products.parent_product_id is
  'Producto padre al que pertenece esta variante. null = producto independiente o contenedor de variantes';

create index if not exists products_parent_product_id_idx
  on products(parent_product_id)
  where parent_product_id is not null;
