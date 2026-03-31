import type { QualitativeValue } from '../value-objects';

export interface InventoryRecord {
  id: string;
  productId: string;
  userId: string;
  /** Conteo final numérico. null cuando unitType === 'qualitative' */
  finalCount: number | null;
  /** Valor cualitativo. null cuando unitType !== 'qualitative' */
  qualitativeValue: QualitativeValue | null;
  recordedAt: Date;
  notes: string | null;
}
