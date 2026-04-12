-- Add is_production flag to products
-- true = item is produced internally (aderezos, carnes, etc.)
-- false = item is purchased from suppliers (default)
alter table products
  add column is_production boolean not null default false;
