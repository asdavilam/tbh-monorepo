import type { QualitativeValue } from '@tbh/domain';

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
  date: Date;
}
