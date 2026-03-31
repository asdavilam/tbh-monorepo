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
    // 1. Solo productos numéricos con stock mínimo definido son elegibles
    const allProducts = await this.productRepo.findAll();
    const eligibleProducts = allProducts.filter(
      (p) => p.unitType !== 'qualitative' && p.minStock !== null
    );

    const shoppingList: ShoppingListItemDto[] = [];

    for (const product of eligibleProducts) {
      // 2. Obtener último conteo del producto
      const lastRecord = await this.inventoryRepo.findLatestByProduct(product.id);
      const lastCount = lastRecord?.finalCount ?? 0;
      const lastRecordDate = lastRecord?.date ?? new Date(0);

      // 3. Sumar compras realizadas desde el último conteo
      const purchases = await this.purchaseRepo.findByProductAndDateRange(
        product.id,
        lastRecordDate,
        new Date()
      );
      const totalPurchases = purchases.reduce((sum, p) => sum + p.quantity, 0);

      // 4. Stock actual = último conteo + compras (calculado, no persistido)
      const currentStock = calculateInitialStock(lastCount, totalPurchases);

      // 5. Agregar a la lista si está bajo el mínimo
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
