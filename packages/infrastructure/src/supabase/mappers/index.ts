// Mappers Entity <-> DB Row
// Responsabilidad: convertir entre entidades del dominio y filas de Supabase
// Nunca retornar raw JSON de Supabase fuera de esta capa

export * from './product.mapper';
export * from './inventory-record.mapper';
export * from './purchase.mapper';
export * from './user.mapper';
