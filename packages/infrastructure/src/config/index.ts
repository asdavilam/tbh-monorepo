// Configuración del cliente Supabase
// La app inyecta estos valores desde sus variables de entorno.
// Infrastructure no accede a process.env ni import.meta.env directamente.

export interface SupabaseEnvironmentConfig {
  url: string;
  anonKey: string;
}
