import type { IProductRepository, IPurchaseRepository } from '@tbh/domain';
import type { GetRecentPurchasesDto, PurchaseHistoryItemDto } from '../dto/purchase.dto';

const DEFAULT_DAYS_BACK = 7;

export class GetRecentPurchasesUseCase {
  constructor(
    private readonly purchaseRepo: IPurchaseRepository,
    private readonly productRepo: IProductRepository
  ) {}

  async execute(dto: GetRecentPurchasesDto = {}): Promise<PurchaseHistoryItemDto[]> {
    const daysBack = dto.daysBack ?? DEFAULT_DAYS_BACK;
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - daysBack);

    const purchases = await this.purchaseRepo.findByDateRange(from, to);
    if (purchases.length === 0) return [];

    const products = await this.productRepo.findAll();
    const productMap = new Map(products.map((p) => [p.id, p]));

    return purchases.map((purchase) => {
      const product = productMap.get(purchase.productId);
      return {
        id: purchase.id,
        productName: product?.name ?? 'Producto desconocido',
        unitLabel: product?.unitLabel ?? '',
        quantity: purchase.quantity,
        purchasedAt: purchase.purchasedAt.toISOString(),
        notes: purchase.notes,
      };
    });
  }
}
