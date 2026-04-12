import type {
  IProductRepository,
  IInventoryRecordRepository,
  IPurchaseRepository,
} from '@tbh/domain';
import {
  calculateInitialStock,
  isBelowMinStock,
  calculateSuggestedPurchaseQuantity,
} from '@tbh/domain';
import type { ShoppingListItemDto } from '../dto/product.dto';

export class GenerateShoppingListUseCase {
  constructor(
    private readonly productRepo: IProductRepository,
    private readonly inventoryRepo: IInventoryRecordRepository,
    private readonly purchaseRepo: IPurchaseRepository
  ) {}

  /**
   * Genera la lista de compras de forma dinámica.
   * NUNCA persiste el resultado — se calcula en tiempo real.
   */
  async execute(): Promise<ShoppingListItemDto[]> {
    // 1. Solo productos numéricos con stock mínimo definido son elegibles.
    //    Los contenedores de variantes se excluyen — su stock es la suma de sus variantes
    //    y no se compran directamente; se compra cada variante por separado.
    const allProducts = await this.productRepo.findAll();
    const variantParentIds = new Set(
      allProducts.filter((p) => p.parentProductId !== null).map((p) => p.parentProductId!)
    );
    const eligibleProducts = allProducts.filter(
      (p) => p.unitType !== 'qualitative' && p.minStock !== null && !variantParentIds.has(p.id)
    );

    const shoppingList: ShoppingListItemDto[] = [];

    // 2. Calcular stock actual en paralelo para todos los productos elegibles
    const stockResults = await Promise.all(
      eligibleProducts.map(async (product) => {
        const lastRecord = await this.inventoryRepo.findLatestByProduct(product.id);
        const lastCount = lastRecord?.finalCount ?? 0;
        const lastRecordDate = lastRecord?.date ?? new Date(0);

        const purchases = await this.purchaseRepo.findByProductAndDateRange(
          product.id,
          lastRecordDate,
          new Date()
        );
        const totalPurchases = purchases.reduce((sum, p) => sum + p.quantity, 0);
        const currentStock = calculateInitialStock(lastCount, totalPurchases);

        return { product, currentStock };
      })
    );

    // 3. Filtrar los que están bajo el mínimo
    for (const { product, currentStock } of stockResults) {
      if (isBelowMinStock(currentStock, product.minStock)) {
        shoppingList.push({
          productId: product.id,
          productName: product.name,
          unitLabel: product.unitLabel,
          currentStock,
          minStock: product.minStock!,
          suggestedQuantity: calculateSuggestedPurchaseQuantity(currentStock, product.minStock!),
        });
      }
    }

    return shoppingList;
  }
}
