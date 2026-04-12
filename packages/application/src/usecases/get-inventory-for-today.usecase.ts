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
  calculateStockDifference,
} from '@tbh/domain';
import type {
  GetInventoryForTodayDto,
  InventoryItemDto,
  InventoryRecordResponseDto,
} from '../dto/inventory-record.dto';

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

    // Obtener productos según rol y registros de hoy en paralelo
    const [products, todayRecords] = await Promise.all([
      adminUser ? this.productRepo.findAll() : this.productRepo.findByAssignedUser(dto.userId),
      this.inventoryRepo.findByDateRange(dto.date, dto.date),
    ]);

    // Mapa productId → registro de hoy (para detectar ya contados)
    const todayRecordByProductId = new Map(todayRecords.map((r) => [r.productId, r]));

    // Filtrar por visibilidad y frecuencia del día
    const visible = products.filter((p) => isProductVisibleToUser(p, dto.userId, adminUser));
    const dueToday = getProductsDueToday(visible, dto.date);

    // Determinar qué productos son contenedores de variantes (no se cuentan directamente)
    // Necesitamos todos los productos para detectar padres aunque el usuario no los vea todos
    const allProductsForCheck = adminUser ? products : await this.productRepo.findAll();
    const variantParentIds = new Set(
      allProductsForCheck.filter((p) => p.parentProductId !== null).map((p) => p.parentProductId!)
    );

    // Mapas id → nombre y categoría para lookup de padres
    const productNameById = new Map(allProductsForCheck.map((p) => [p.id, p.name]));
    const productCategoryById = new Map(allProductsForCheck.map((p) => [p.id, p.category]));

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

        // Categoría efectiva: variantes heredan la categoría del padre si la propia es nula
        const effectiveCategory = product.parentProductId
          ? (product.category ?? productCategoryById.get(product.parentProductId) ?? null)
          : product.category;

        // Si ya existe un registro de hoy, adjuntarlo con campos calculados
        const todayRecord = todayRecordByProductId.get(product.id);
        let existingRecord: InventoryRecordResponseDto | undefined;
        if (todayRecord) {
          const difference =
            todayRecord.finalCount !== null && initialStock !== null
              ? calculateStockDifference(initialStock, todayRecord.finalCount)
              : null;
          existingRecord = {
            id: todayRecord.id,
            productId: todayRecord.productId,
            userId: todayRecord.userId,
            date: todayRecord.date.toISOString().split('T')[0],
            finalCount: todayRecord.finalCount,
            qualitativeValue: todayRecord.qualitativeValue,
            initialStock,
            difference,
            recordedAt: todayRecord.recordedAt.toISOString(),
            notes: todayRecord.notes,
          };
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
          category: effectiveCategory,
          minStock: product.minStock,
          existingRecord,
        };
      })
    );

    return items;
  }
}
