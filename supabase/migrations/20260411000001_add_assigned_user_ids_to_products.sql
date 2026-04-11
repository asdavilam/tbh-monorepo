-- Migrar de assigned_user_id (single) a assigned_user_ids (array)
-- Permite asignar un producto a múltiples usuarios

ALTER TABLE products
  ADD COLUMN assigned_user_ids uuid[] NOT NULL DEFAULT '{}';

-- Migrar datos existentes: si tenía un usuario asignado, lo pasamos al array
UPDATE products
  SET assigned_user_ids = ARRAY[assigned_user_id]
  WHERE assigned_user_id IS NOT NULL;

-- Eliminar columna anterior
ALTER TABLE products
  DROP COLUMN assigned_user_id;
