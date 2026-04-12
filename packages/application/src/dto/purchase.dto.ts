import type { EntryType } from '@tbh/domain';

export interface RegisterPurchaseDto {
  productId: string;
  userId: string;
  quantity: number;
  notes?: string;
  /** Tipo de entrada: compra a proveedor o producción interna. Default: 'compra' */
  entryType?: EntryType;
}

export interface PurchaseResponseDto {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  purchasedAt: string;
  notes: string | null;
  entryType: EntryType;
}

export interface GetRecentPurchasesDto {
  daysBack?: number;
}

export interface PurchaseHistoryItemDto {
  id: string;
  productName: string;
  unitLabel: string;
  quantity: number;
  purchasedAt: string;
  notes: string | null;
  entryType: EntryType;
}
