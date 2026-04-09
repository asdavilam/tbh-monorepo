-- =============================================================================
-- SEED — Datos iniciales para desarrollo local
-- =============================================================================
-- IMPORTANTE: Este seed requiere Supabase CLI local.
-- Ejecutar con: supabase db reset (incluye migraciones + seed)
--
-- Los UUIDs son fijos para consistencia entre resets.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. USUARIOS EN AUTH.USERS (Supabase local)
-- -----------------------------------------------------------------------------
-- En entorno local de Supabase podemos insertar directamente en auth.users.
-- En producción, los usuarios se crean via Supabase Auth (signup/invite).

insert into auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) values
  (
    '00000000-0000-0000-0000-000000000001',
    'admin@tbh.local',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    'authenticated'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'encargado@tbh.local',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    'authenticated'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'trabajador@tbh.local',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    'authenticated'
  )
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- 2. PERFILES DE USUARIO
-- -----------------------------------------------------------------------------

insert into profiles (id, name, role) values
  ('00000000-0000-0000-0000-000000000001', 'Admin TBH',      'admin'),
  ('00000000-0000-0000-0000-000000000002', 'Encargado TBH',  'encargado'),
  ('00000000-0000-0000-0000-000000000003', 'Trabajador TBH', 'trabajador')
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- 3. PRODUCTOS DE EJEMPLO
-- -----------------------------------------------------------------------------
-- Productos representativos de un negocio de hamburguesas.
-- assigned_user_id = null → visible para todos los usuarios.

insert into products (
  id,
  name,
  type,
  unit_type,
  unit_label,
  count_frequency,
  count_days,
  min_stock,
  assigned_user_id
) values
  -- Materia prima — conteo diario
  (
    '10000000-0000-0000-0000-000000000001',
    'Carne de res',
    'raw_material',
    'fraction',
    'kg',
    'daily',
    '{}',
    5,
    null
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'Pan de hamburguesa',
    'raw_material',
    'unit',
    'pz',
    'daily',
    '{}',
    20,
    null
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'Queso americano',
    'raw_material',
    'unit',
    'rebanadas',
    'daily',
    '{}',
    30,
    null
  ),
  -- Desechable — conteo cada semana (lunes y jueves = 1 y 4)
  (
    '10000000-0000-0000-0000-000000000004',
    'Bolsas de papel',
    'disposable',
    'unit',
    'pz',
    'specific_days',
    '{1,4}',
    50,
    null
  ),
  -- Básico — cualitativo, conteo diario
  (
    '10000000-0000-0000-0000-000000000005',
    'Sal',
    'basic',
    'qualitative',
    '',
    'daily',
    '{}',
    null,
    null
  )
on conflict (id) do nothing;
