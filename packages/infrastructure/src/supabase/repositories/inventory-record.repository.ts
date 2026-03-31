import type { SupabaseClient } from '@supabase/supabase-js';
import type { InventoryRecord, IInventoryRecordRepository } from '@tbh/domain';
import { toInventoryRecordEntity, toInventoryRecordRow } from '../mappers/inventory-record.mapper';

export class SupabaseInventoryRecordRepository implements IInventoryRecordRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findById(id: string): Promise<InventoryRecord | null> {
    const { data, error } = await this.client
      .from('inventory_records')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(`Error al buscar registro: ${error.message}`);
    if (!data) return null;
    return toInventoryRecordEntity(data);
  }

  async findLatestByProduct(productId: string): Promise<InventoryRecord | null> {
    const { data, error } = await this.client
      .from('inventory_records')
      .select('*')
      .eq('product_id', productId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(`Error al buscar último registro: ${error.message}`);
    if (!data) return null;
    return toInventoryRecordEntity(data);
  }

  async findByProductAndDateRange(
    productId: string,
    from: Date,
    to: Date
  ): Promise<InventoryRecord[]> {
    const { data, error } = await this.client
      .from('inventory_records')
      .select('*')
      .eq('product_id', productId)
      .gte('recorded_at', from.toISOString())
      .lte('recorded_at', to.toISOString())
      .order('recorded_at', { ascending: false });

    if (error) throw new Error(`Error al buscar registros por rango: ${error.message}`);
    return (data ?? []).map(toInventoryRecordEntity);
  }

  async findByDateRange(from: Date, to: Date): Promise<InventoryRecord[]> {
    const { data, error } = await this.client
      .from('inventory_records')
      .select('*')
      .gte('recorded_at', from.toISOString())
      .lte('recorded_at', to.toISOString())
      .order('recorded_at', { ascending: false });

    if (error) throw new Error(`Error al buscar registros: ${error.message}`);
    return (data ?? []).map(toInventoryRecordEntity);
  }

  async save(record: Omit<InventoryRecord, 'id'>): Promise<InventoryRecord> {
    const { data, error } = await this.client
      .from('inventory_records')
      .insert(toInventoryRecordRow(record))
      .select()
      .single();

    if (error) throw new Error(`Error al guardar registro: ${error.message}`);
    return toInventoryRecordEntity(data);
  }
}
