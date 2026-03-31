import type { SupabaseClient } from '@supabase/supabase-js';
import type { Purchase, IPurchaseRepository } from '@tbh/domain';
import { toPurchaseEntity, toPurchaseRow } from '../mappers/purchase.mapper';

export class SupabasePurchaseRepository implements IPurchaseRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findById(id: string): Promise<Purchase | null> {
    const { data, error } = await this.client.from('purchases').select('*').eq('id', id).single();

    if (error) throw new Error(`Error al buscar compra: ${error.message}`);
    if (!data) return null;
    return toPurchaseEntity(data);
  }

  async findByProduct(productId: string): Promise<Purchase[]> {
    const { data, error } = await this.client
      .from('purchases')
      .select('*')
      .eq('product_id', productId)
      .order('purchased_at', { ascending: false });

    if (error) throw new Error(`Error al buscar compras del producto: ${error.message}`);
    return (data ?? []).map(toPurchaseEntity);
  }

  async findByProductAndDateRange(productId: string, from: Date, to: Date): Promise<Purchase[]> {
    const { data, error } = await this.client
      .from('purchases')
      .select('*')
      .eq('product_id', productId)
      .gte('purchased_at', from.toISOString())
      .lte('purchased_at', to.toISOString())
      .order('purchased_at', { ascending: false });

    if (error) throw new Error(`Error al buscar compras por rango: ${error.message}`);
    return (data ?? []).map(toPurchaseEntity);
  }

  async findByDateRange(from: Date, to: Date): Promise<Purchase[]> {
    const { data, error } = await this.client
      .from('purchases')
      .select('*')
      .gte('purchased_at', from.toISOString())
      .lte('purchased_at', to.toISOString())
      .order('purchased_at', { ascending: false });

    if (error) throw new Error(`Error al buscar compras: ${error.message}`);
    return (data ?? []).map(toPurchaseEntity);
  }

  async save(purchase: Omit<Purchase, 'id'>): Promise<Purchase> {
    const { data, error } = await this.client
      .from('purchases')
      .insert(toPurchaseRow(purchase))
      .select()
      .single();

    if (error) throw new Error(`Error al guardar compra: ${error.message}`);
    return toPurchaseEntity(data);
  }
}
