import type { Product } from '../entities/product.entity';

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findByAssignedUser(userId: string): Promise<Product[]>;
  findByParentId(parentId: string): Promise<Product[]>;
  save(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
  bulkUpdateAssignedUser(productIds: string[], userId: string | null): Promise<void>;
}
