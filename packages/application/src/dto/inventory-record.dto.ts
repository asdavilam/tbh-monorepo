import type {
  QualitativeValue,
  ProductType,
  UnitType,
  UserRole,
  ProductCategory,
} from '@tbh/domain';

export interface StockItemDto {
  productId: string;
  name: string;
  type: ProductType;
  unitType: UnitType;
  unitLabel: string;
  /** Stock actual calculado (lastFinalCount + compras). Null si no hay historial o es cualitativo. */
  currentStock: number | null;
  /** Solo para productos cualitativos */
  qualitativeValue: QualitativeValue | null;
  /** Fecha ISO del último conteo registrado. Null si nunca se ha contado. */
  lastCountDate: string | null;
  minStock: number | null;
  /** true si currentStock < minStock (solo para numéricos con minStock definido) */
  isLow: boolean;
  packageUnit: string | null;
  packageSize: number | null;
  /** ID del producto padre si es variante. Null si es independiente o contenedor. */
  parentProductId: string | null;
  /** true si este producto es un contenedor de variantes (no se cuenta directamente) */
  isVariantContainer: boolean;
  /** Categoría del producto para agrupación en UI */
  category: ProductCategory | null;
}

export interface CorrectStockDto {
  userId: string;
  productId: string;
  finalCount: number | null;
  qualitativeValue: QualitativeValue | null;
  notes?: string;
}

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
  /** ID del producto padre si es variante. Null si es independiente. */
  parentProductId: string | null;
  /** Nombre del producto padre si es variante. Null si es independiente. */
  parentName: string | null;
  /** Categoría del producto para agrupación en UI */
  category: ProductCategory | null;
}
