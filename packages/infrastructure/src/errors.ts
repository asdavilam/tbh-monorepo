// Errores de la capa de infraestructura
// Los repositorios capturan errores técnicos (Supabase) y los transforman a estos tipos.
// Application layer solo ve RepositoryError — nunca detalles de Supabase.

export class RepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RepositoryError';
  }
}
