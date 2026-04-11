import type {
  IProductRepository,
  IInventoryRecordRepository,
  IPurchaseRepository,
  IUserRepository,
} from '@tbh/domain';
import { canManageStock, calculateInitialStock, isBelowMinStock } from '@tbh/domain';
import type { StockItemDto } from '../dto/inventory-record.dto';

export class GetCurrentStockUseCase {
  constructor(
    private readonly productRepo: IProductRepository,
    private readonly inventoryRepo: IInventoryRecordRepository,
    private readonly purchaseRepo: IPurchaseRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(userId: string): Promise<StockItemDto[]> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');
    if (!canManageStock(user.role)) throw new Error('Sin permisos para ver el stock completo');

    const products = await this.productRepo.findAll();

    // Determine which products are variant containers
    const variantParentIds = new Set(
      products.filter((p) => p.parentProductId !== null).map((p) => p.parentProductId!)
    );

    // Calculate stock for every non-container product (variants + standalones)
    const stockByProductId = new Map<string, number | null>();

    await Promise.all(
      products
        .filter((p) => !variantParentIds.has(p.id))
        .map(async (product) => {
          if (product.unitType === 'qualitative') {
            stockByProductId.set(product.id, null);
            return;
          }
          const lastRecord = await this.inventoryRepo.findLatestByProduct(product.id);
          if (lastRecord?.finalCount == null) {
            stockByProductId.set(product.id, null);
            return;
          }
          const purchases = await this.purchaseRepo.findByProductAndDateRange(
            product.id,
            lastRecord.date,
            new Date()
          );
          const totalPurchases = purchases.reduce((sum, p) => sum + p.quantity, 0);
          stockByProductId.set(
            product.id,
            calculateInitialStock(lastRecord.finalCount, totalPurchases)
          );
        })
    );

    const items: StockItemDto[] = await Promise.all(
      products.map(async (product) => {
        const isContainer = variantParentIds.has(product.id);
        const lastRecord = isContainer
          ? null
          : await this.inventoryRepo.findLatestByProduct(product.id);

        const qualitativeValue = lastRecord?.qualitativeValue ?? null;
        const lastCountDate = isContainer
          ? null
          : (lastRecord?.date?.toISOString().split('T')[0] ?? null);

        let currentStock: number | null;
        if (isContainer) {
          // Sum all variant stocks
          const variantStocks = products
            .filter((p) => p.parentProductId === product.id)
            .map((v) => stockByProductId.get(v.id) ?? null);
          currentStock = variantStocks.every((s) => s === null)
            ? null
            : variantStocks.reduce<number>((sum, s) => sum + (s ?? 0), 0);
        } else {
          currentStock = stockByProductId.get(product.id) ?? null;
        }

        const isLow =
          !isContainer &&
          product.unitType !== 'qualitative' &&
          product.minStock !== null &&
          currentStock !== null &&
          isBelowMinStock(currentStock, product.minStock);

        return {
          productId: product.id,
          name: product.name,
          type: product.type,
          unitType: product.unitType,
          unitLabel: product.unitLabel,
          currentStock,
          qualitativeValue,
          lastCountDate,
          minStock: product.minStock,
          isLow,
          packageUnit: product.packageUnit,
          packageSize: product.packageSize,
          parentProductId: product.parentProductId,
          isVariantContainer: isContainer,
          category: product.category,
        };
      })
    );

    // Sort: containers/standalones alphabetically; variants grouped right after their parent
    const containers = items
      .filter((i) => i.isVariantContainer)
      .sort((a, b) => a.name.localeCompare(b.name));
    const standalones = items
      .filter((i) => !i.isVariantContainer && !i.parentProductId)
      .sort((a, b) => {
        if (a.isLow && !b.isLow) return -1;
        if (!a.isLow && b.isLow) return 1;
        return a.name.localeCompare(b.name);
      });

    const sorted: StockItemDto[] = [];
    for (const container of containers) {
      sorted.push(container);
      const variants = items
        .filter((i) => i.parentProductId === container.productId)
        .sort((a, b) => a.name.localeCompare(b.name));
      sorted.push(...variants);
    }
    sorted.push(...standalones);

    return sorted;
  }
}
