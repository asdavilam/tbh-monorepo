import type { QualitativeValue, ProductType, UnitType, UserRole } from '@tbh/domain';

export interface RegisterInventoryDto {
  productId: string;
  userId: string;
  /** Fecha del conteo (día al que corresponde, no necesariamente hoy) */
  date: Date;
  /** Para productos unit/fraction */
  finalCount: number | null;
  /** Para productos qualitative */
  qualitativeValue: QualitativeValue | null;
  notes?: string;
}

export interface InventoryRecordResponseDto {
  id: string;
  productId: string;
  userId: string;
  date: string;
  finalCount: number | null;
  qualitativeValue: QualitativeValue | null;
  /** Stock inicial calculado (no almacenado en DB) */
  initialStock: number | null;
  /** Diferencia calculada (no almacenada en DB) */
  difference: number | null;
  recordedAt: string;
  notes: string | null;
}

export interface GetInventoryForTodayDto {
  userId: string;
  userRole: UserRole;
  date: Date;
}

export interface GetInventoryHistoryByProductDto {
  productId: string;
  userId: string;
}

/** Un registro del historial de inventario con campos calculados */
export interface InventoryHistoryItemDto {
  id: string;
  date: string;
  finalStock: number | null;
  qualitativeValue: QualitativeValue | null;
  /** Stock inicial calculado = finalStock del registro anterior + compras intermedias. Null si no hay registro previo o es cualitativo. */
  initialStock: number | null;
  /** Consumo = initialStock - finalStock. Positivo = normal. Negativo = posible error. Null si no hay stock inicial. */
  difference: number | null;
  notes: string | null;
}

/** Producto enriquecido con stock inicial pre-calculado para la pantalla de inventario */
export interface InventoryItemDto {
  productId: string;
  name: string;
  type: ProductType;
  unitType: UnitType;
  unitLabel: string;
  /** Stock inicial calculado desde el último registro + compras posteriores. Null si no hay historial o es cualitativo. */
  initialStock: number | null;
  /** Nombre del empaque. Ej: "galón". Solo aplica cuando unitType === 'fraction' y hay empaque definido. */
  packageUnit: string | null;
  /** Cantidad de unidades por empaque. Permite calcular fracciones automáticamente. */
  packageSize: number | null;
}
