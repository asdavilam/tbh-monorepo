export interface RegisterPurchaseDto {
  productId: string;
  userId: string;
  quantity: number;
  notes?: string;
}

export interface PurchaseResponseDto {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  purchasedAt: string;
  notes: string | null;
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
}
