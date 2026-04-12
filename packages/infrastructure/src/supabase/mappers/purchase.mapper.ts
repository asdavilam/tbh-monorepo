import type { Purchase, EntryType } from '@tbh/domain';

export interface PurchaseRow {
  id: string;
  product_id: string;
  user_id: string;
  quantity: number;
  purchased_at: string;
  notes: string | null;
  entry_type: EntryType;
}

export function toPurchaseEntity(row: PurchaseRow): Purchase {
  return {
    id: row.id,
    productId: row.product_id,
    userId: row.user_id,
    quantity: row.quantity,
    purchasedAt: new Date(row.purchased_at),
    notes: row.notes,
    entryType: row.entry_type ?? 'compra',
  };
}

export function toPurchaseRow(purchase: Omit<Purchase, 'id'>): Omit<PurchaseRow, 'id'> {
  return {
    product_id: purchase.productId,
    user_id: purchase.userId,
    quantity: purchase.quantity,
    purchased_at: purchase.purchasedAt.toISOString(),
    notes: purchase.notes,
    entry_type: purchase.entryType,
  };
}
