import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isConfigured =
  url && anonKey && url !== 'your-supabase-project-url' && anonKey !== 'your-supabase-anon-key';
// Exportar flag para que los componentes puedan mostrar error de configuración
export const supabaseConfigured = Boolean(isConfigured);
// Si no está configurado, crear cliente con valores dummy para no crashear módulos
export const supabase = createClient(
  isConfigured ? url : 'https://placeholder.supabase.co',
  isConfigured ? anonKey : 'placeholder-key'
);
