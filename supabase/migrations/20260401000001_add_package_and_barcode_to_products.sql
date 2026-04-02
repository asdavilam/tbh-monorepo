-- Agrega campos de empaque de compra y código de barras a productos

alter table products
  add column if not exists package_unit text,
  add column if not exists package_size numeric,
  add column if not exists barcode      text;

comment on column products.package_unit is
  'Nombre del empaque de compra. Ej: paquete, galón, caja. null = sin empaque definido';
comment on column products.package_size is
  'Cantidad de unidades de conteo por empaque. Ej: 20 para "1 paquete = 20 pz"';
comment on column products.barcode is
  'Código de barras del producto para identificación rápida';
