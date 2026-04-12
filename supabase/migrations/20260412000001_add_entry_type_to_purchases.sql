-- Agrega tipo de entrada a compras: 'compra' (proveedor) o 'produccion' (elaboración interna)
-- Ambas aumentan el stock del producto de la misma forma; la diferencia es semántica/reporteo.

alter table purchases
  add column entry_type text not null default 'compra'
    check (entry_type in ('compra', 'produccion'));
