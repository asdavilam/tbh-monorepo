import type {
  IInventoryRecordRepository,
  IPurchaseRepository,
  IUserRepository,
  IProductRepository,
} from '@tbh/domain';
import { isAdmin, isProductVisibleToUser } from '@tbh/domain';
import type {
  GetInventoryHistoryByProductDto,
  InventoryHistoryItemDto,
} from '../dto/inventory-record.dto';

export class GetInventoryHistoryByProductUseCase {
  constructor(
    private readonly inventoryRepo: IInventoryRecordRepository,
    private readonly purchaseRepo: IPurchaseRepository,
    private readonly productRepo: IProductRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(dto: GetInventoryHistoryByProductDto): Promise<InventoryHistoryItemDto[]> {
    // 1. Validar usuario y permisos
    const user = await this.userRepo.findById(dto.userId);
    if (!user) throw new Error('Usuario no encontrado');

    const adminUser = isAdmin(user.role);

    // 2. Validar que el producto existe y es visible para el usuario
    const product = await this.productRepo.findById(dto.productId);
    if (!product) throw new Error('Producto no encontrado');

    if (!isProductVisibleToUser(product, dto.userId, adminUser)) {
      throw new Error('No tienes acceso al historial de este producto');
    }

    // 3. Obtener todos los registros ordenados ASC (del más antiguo al más reciente)
    const records = await this.inventoryRepo.findAllByProduct(dto.productId);
    if (records.length === 0) return [];

    // 4. Calcular initialStock y difference para cada registro
    const items: InventoryHistoryItemDto[] = await Promise.all(
      records.map(async (record, index) => {
        // Productos cualitativos no tienen cálculo numérico
        if (product.unitType === 'qualitative') {
          return {
            id: record.id,
            date: record.date.toISOString().split('T')[0],
            finalStock: null,
            qualitativeValue: record.qualitativeValue,
            initialStock: null,
            difference: null,
            notes: record.notes,
          };
        }

        // Primer registro: no hay registro previo → initialStock desconocido
        if (index === 0) {
          return {
            id: record.id,
            date: record.date.toISOString().split('T')[0],
            finalStock: record.finalCount,
            qualitativeValue: null,
            initialStock: null,
            difference: null,
            notes: record.notes,
          };
        }

        // Registros posteriores: calcular initialStock desde el registro previo
        const prevRecord = records[index - 1];

        if (prevRecord.finalCount === null) {
          return {
            id: record.id,
            date: record.date.toISOString().split('T')[0],
            finalStock: record.finalCount,
            qualitativeValue: null,
            initialStock: null,
            difference: null,
            notes: record.notes,
          };
        }

        // Sumar compras realizadas entre el registro anterior y el actual
        const purchases = await this.purchaseRepo.findByProductAndDateRange(
          dto.productId,
          prevRecord.date,
          record.date
        );
        const totalPurchases = purchases.reduce((sum, p) => sum + p.quantity, 0);
        const initialStock = prevRecord.finalCount + totalPurchases;

        // difference = initialStock - finalStock
        // Positivo = consumo normal, Negativo = posible error o inconsistencia
        const difference = record.finalCount !== null ? initialStock - record.finalCount : null;

        return {
          id: record.id,
          date: record.date.toISOString().split('T')[0],
          finalStock: record.finalCount,
          qualitativeValue: null,
          initialStock,
          difference,
          notes: record.notes,
        };
      })
    );

    // 5. Devolver en orden DESC (más reciente primero)
    return items.reverse();
  }
}
