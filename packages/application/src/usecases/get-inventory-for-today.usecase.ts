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

    // Para cada producto, calcular stock inicial desde el último registro
    const items: InventoryItemDto[] = await Promise.all(
      dueToday.map(async (product) => {
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
        };
      })
    );

    return items;
  }
}
