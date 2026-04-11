import type {
  IProductRepository,
  IInventoryRecordRepository,
  IPurchaseRepository,
  IUserRepository,
} from '@tbh/domain';
import {
  isAdmin,
  isProductVisibleToUser,
  getProductsDueToday,
  calculateInitialStock,
} from '@tbh/domain';
import type { GetInventoryForTodayDto, InventoryItemDto } from '../dto/inventory-record.dto';

export class GetInventoryForTodayUseCase {
  constructor(
    private readonly productRepo: IProductRepository,
    private readonly inventoryRepo: IInventoryRecordRepository,
    private readonly purchaseRepo: IPurchaseRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(dto: GetInventoryForTodayDto): Promise<InventoryItemDto[]> {
    const user = await this.userRepo.findById(dto.userId);
    if (!user) throw new Error('Usuario no encontrado');

    const adminUser = isAdmin(user.role);

    // Obtener productos según rol
    const products = adminUser
      ? await this.productRepo.findAll()
      : await this.productRepo.findByAssignedUser(dto.userId);

    // Filtrar por visibilidad y frecuencia del día
    const visible = products.filter((p) => isProductVisibleToUser(p, dto.userId, adminUser));
    const dueToday = getProductsDueToday(visible, dto.date);

    // Determinar qué productos son contenedores de variantes (no se cuentan directamente)
    // Necesitamos todos los productos para detectar padres aunque el usuario no los vea todos
    const allProductsForCheck = adminUser ? products : await this.productRepo.findAll();
    const variantParentIds = new Set(
      allProductsForCheck.filter((p) => p.parentProductId !== null).map((p) => p.parentProductId!)
    );

    // Mapa id → nombre para lookup de padres
    const productNameById = new Map(allProductsForCheck.map((p) => [p.id, p.name]));

    // Excluir contenedores — solo contar variantes y productos independientes
    const countable = dueToday.filter((p) => !variantParentIds.has(p.id));

    // Para cada producto contable, calcular stock inicial
    const items: InventoryItemDto[] = await Promise.all(
      countable.map(async (product) => {
        let initialStock: number | null = null;

        if (product.unitType !== 'qualitative') {
          const lastRecord = await this.inventoryRepo.findLatestByProduct(product.id);

          if (lastRecord?.finalCount != null) {
            const purchases = await this.purchaseRepo.findByProductAndDateRange(
              product.id,
              lastRecord.date,
              dto.date
            );
            const totalPurchases = purchases.reduce((sum, p) => sum + p.quantity, 0);
            initialStock = calculateInitialStock(lastRecord.finalCount, totalPurchases);
          }
        }

        return {
          productId: product.id,
          name: product.name,
          type: product.type,
          unitType: product.unitType,
          unitLabel: product.unitLabel,
          initialStock,
          packageUnit: product.packageUnit,
          packageSize: product.packageSize,
          parentProductId: product.parentProductId,
          parentName: product.parentProductId
            ? (productNameById.get(product.parentProductId) ?? null)
            : null,
          category: product.category,
        };
      })
    );

    return items;
  }
}
