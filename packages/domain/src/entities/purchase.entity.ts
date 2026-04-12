import type { EntryType } from '../value-objects';

export interface Purchase {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  purchasedAt: Date;
  notes: string | null;
  /** Tipo de entrada: compra a proveedor o producción interna */
  entryType: EntryType;
}
