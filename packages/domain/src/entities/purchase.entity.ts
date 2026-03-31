export interface Purchase {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  purchasedAt: Date;
  notes: string | null;
}
