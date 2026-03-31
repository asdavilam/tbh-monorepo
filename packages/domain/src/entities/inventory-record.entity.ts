import type { QualitativeValue } from '../value-objects';

export interface InventoryRecord {
  id: string;
  productId: string;
  userId: string;
  /** Fecha del conteo (puede diferir de recordedAt si se registra tarde) */
  date: Date;
  /** Conteo final numérico. null cuando unitType === 'qualitative' */
  finalCount: number | null;
  /** Valor cualitativo. null cuando unitType !== 'qualitative' */
  qualitativeValue: QualitativeValue | null;
  /** Timestamp de creación en DB */
  recordedAt: Date;
  notes: string | null;
}
