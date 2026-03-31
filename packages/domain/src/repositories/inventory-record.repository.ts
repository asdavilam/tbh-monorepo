import type { InventoryRecord } from '../entities/inventory-record.entity';

export interface IInventoryRecordRepository {
  findById(id: string): Promise<InventoryRecord | null>;
  /** Último registro del producto — base para calcular stock inicial */
  findLatestByProduct(productId: string): Promise<InventoryRecord | null>;
  findByProductAndDateRange(productId: string, from: Date, to: Date): Promise<InventoryRecord[]>;
  findByDateRange(from: Date, to: Date): Promise<InventoryRecord[]>;
  save(record: Omit<InventoryRecord, 'id'>): Promise<InventoryRecord>;
}
