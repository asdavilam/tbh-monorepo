// Infrastructure layer — Supabase client, concrete repositories, mappers
// Retorna siempre entidades del dominio, nunca raw JSON de Supabase

export { createSupabaseClient } from './supabase/client';
export type { SupabaseConfig } from './supabase/client';

export {
  SupabaseProductRepository,
  SupabaseInventoryRecordRepository,
  SupabasePurchaseRepository,
} from './supabase/repositories';

export * from './supabase/mappers';
