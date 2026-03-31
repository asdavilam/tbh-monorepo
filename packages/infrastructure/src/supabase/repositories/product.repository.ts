import type { SupabaseClient } from '@supabase/supabase-js';
import type { Product, IProductRepository } from '@tbh/domain';
import { toProductEntity, toProductRow } from '../mappers/product.mapper';

export class SupabaseProductRepository implements IProductRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findById(id: string): Promise<Product | null> {
    const { data, error } = await this.client.from('products').select('*').eq('id', id).single();

    if (error) throw new Error(`Error al buscar producto: ${error.message}`);
    if (!data) return null;
    return toProductEntity(data);
  }

  async findAll(): Promise<Product[]> {
    const { data, error } = await this.client.from('products').select('*').order('name');

    if (error) throw new Error(`Error al listar productos: ${error.message}`);
    return (data ?? []).map(toProductEntity);
  }

  async findByAssignedUser(userId: string): Promise<Product[]> {
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .or(`assigned_user_id.eq.${userId},assigned_user_id.is.null`)
      .order('name');

    if (error) throw new Error(`Error al buscar productos del usuario: ${error.message}`);
    return (data ?? []).map(toProductEntity);
  }

  async save(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const { data, error } = await this.client
      .from('products')
      .insert(toProductRow(product))
      .select()
      .single();

    if (error) throw new Error(`Error al crear producto: ${error.message}`);
    return toProductEntity(data);
  }

  async update(product: Product): Promise<Product> {
    const { id, createdAt: _c, updatedAt: _u, ...rest } = product;
    const { data, error } = await this.client
      .from('products')
      .update(toProductRow(rest))
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Error al actualizar producto: ${error.message}`);
    return toProductEntity(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from('products').delete().eq('id', id);

    if (error) throw new Error(`Error al eliminar producto: ${error.message}`);
  }
}
