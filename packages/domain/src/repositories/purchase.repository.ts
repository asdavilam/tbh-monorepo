import type { Purchase } from '../entities/purchase.entity';

export interface IPurchaseRepository {
  findById(id: string): Promise<Purchase | null>;
  findByProduct(productId: string): Promise<Purchase[]>;
  findByProductAndDateRange(productId: string, from: Date, to: Date): Promise<Purchase[]>;
  findByDateRange(from: Date, to: Date): Promise<Purchase[]>;
  save(purchase: Omit<Purchase, 'id'>): Promise<Purchase>;
}
