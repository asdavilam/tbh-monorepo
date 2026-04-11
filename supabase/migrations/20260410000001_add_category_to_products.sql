alter table products
  add column if not exists category text;

-- Null out any free-text values that don't match the allowed enum
update products
  set category = null
  where category is not null
    and category not in (
      'carnes',
      'panaderia',
      'aderezos',
      'congelados',
      'frescos',
      'lacteos',
      'bebidas',
      'desechables',
      'limpieza',
      'otros'
    );

-- Apply (or replace) the allowed-values constraint
alter table products
  drop constraint if exists products_category_check;

alter table products
  add constraint products_category_check
    check (category in (
      'carnes',
      'panaderia',
      'aderezos',
      'congelados',
      'frescos',
      'lacteos',
      'bebidas',
      'desechables',
      'limpieza',
      'otros'
    ));
