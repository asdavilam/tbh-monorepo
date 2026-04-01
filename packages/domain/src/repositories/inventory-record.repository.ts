import type { InventoryRecord } from '../entities/inventory-record.entity';

export interface IInventoryRecordRepository {
  findById(id: string): Promise<InventoryRecord | null>;
  /** Último registro del producto — base para calcular stock inicial */
  findLatestByProduct(productId: string): Promise<InventoryRecord | null>;
  /** Todos los registros del producto ordenados por fecha ASC — para historial */
  findAllByProduct(productId: string): Promise<InventoryRecord[]>;
  findByProductAndDateRange(productId: string, from: Date, to: Date): Promise<InventoryRecord[]>;
  findByDateRange(from: Date, to: Date): Promise<InventoryRecord[]>;
  save(record: Omit<InventoryRecord, 'id'>): Promise<InventoryRecord>;
}
