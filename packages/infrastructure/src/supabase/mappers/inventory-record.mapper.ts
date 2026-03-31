import type { InventoryRecord, QualitativeValue } from '@tbh/domain';

export interface InventoryRecordRow {
  id: string;
  product_id: string;
  user_id: string;
  final_count: number | null;
  qualitative_value: string | null;
  recorded_at: string;
  notes: string | null;
}

export function toInventoryRecordEntity(row: InventoryRecordRow): InventoryRecord {
  return {
    id: row.id,
    productId: row.product_id,
    userId: row.user_id,
    finalCount: row.final_count,
    qualitativeValue: row.qualitative_value as QualitativeValue | null,
    recordedAt: new Date(row.recorded_at),
    notes: row.notes,
  };
}

export function toInventoryRecordRow(
  record: Omit<InventoryRecord, 'id'>
): Omit<InventoryRecordRow, 'id'> {
  return {
    product_id: record.productId,
    user_id: record.userId,
    final_count: record.finalCount,
    qualitative_value: record.qualitativeValue,
    recorded_at: record.recordedAt.toISOString(),
    notes: record.notes,
  };
}
