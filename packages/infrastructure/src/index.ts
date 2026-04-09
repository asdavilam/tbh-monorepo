// Infrastructure layer — Supabase client, concrete repositories, mappers
// Retorna siempre entidades del dominio, nunca raw JSON de Supabase

export { createSupabaseClient } from './supabase/client';
export type { SupabaseConfig } from './supabase/client';

export {
  SupabaseProductRepository,
  SupabaseInventoryRecordRepository,
  SupabasePurchaseRepository,
  SupabaseUserRepository,
} from './supabase/repositories';

export * from './supabase/mappers';

export { RepositoryError } from './errors';

export { SupabaseAuthClient } from './auth';
export type { AuthSession } from './auth';

export type { SupabaseEnvironmentConfig } from './config';
