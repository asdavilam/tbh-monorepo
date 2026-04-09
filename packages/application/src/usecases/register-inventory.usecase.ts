import type {
  IInventoryRecordRepository,
  IPurchaseRepository,
  IProductRepository,
} from '@tbh/domain';
import { calculateInitialStock, calculateStockDifference } from '@tbh/domain';
import type { RegisterInventoryDto, InventoryRecordResponseDto } from '../dto/inventory-record.dto';

export class RegisterInventoryUseCase {
  constructor(
    private readonly inventoryRepo: IInventoryRecordRepository,
    private readonly purchaseRepo: IPurchaseRepository,
    private readonly productRepo: IProductRepository
  ) {}

  async execute(dto: RegisterInventoryDto): Promise<InventoryRecordResponseDto> {
    // 1. Obtener producto para validar tipo de unidad
    const product = await this.productRepo.findById(dto.productId);
    if (!product) throw new Error('Producto no encontrado');

    // 2. Validar consistencia del tipo de unidad con el valor ingresado
    if (product.unitType === 'qualitative') {
      if (dto.qualitativeValue === null) {
        throw new Error('Producto cualitativo requiere un valor cualitativo (mucho/poco/nada)');
      }
      if (dto.finalCount !== null) {
        throw new Error('Producto cualitativo no acepta conteo numérico');
      }
    } else {
      if (dto.finalCount === null) {
        throw new Error('Producto numérico requiere conteo final');
      }
      if (dto.qualitativeValue !== null) {
        throw new Error('Producto numérico no acepta valor cualitativo');
      }
    }

    // 3. Calcular stock inicial a partir del último registro (solo para productos numéricos)
    let initialStock: number | null = null;
    let difference: number | null = null;

    if (product.unitType !== 'qualitative') {
      const lastRecord = await this.inventoryRepo.findLatestByProduct(dto.productId);

      if (lastRecord?.finalCount != null) {
        // Compras realizadas entre el último registro y la fecha del conteo actual
        const purchases = await this.purchaseRepo.findByProductAndDateRange(
          dto.productId,
          lastRecord.date,
          dto.date
        );
        const totalPurchases = purchases.reduce((sum, p) => sum + p.quantity, 0);

        initialStock = calculateInitialStock(lastRecord.finalCount, totalPurchases);
        difference = calculateStockDifference(initialStock, dto.finalCount!);
      }
    }

    // 4. Persistir solo datos fuente (nunca initialStock ni difference)
    const record = await this.inventoryRepo.save({
      productId: dto.productId,
      userId: dto.userId,
      date: dto.date,
      finalCount: dto.finalCount,
      qualitativeValue: dto.qualitativeValue ?? null,
      recordedAt: new Date(),
      notes: dto.notes ?? null,
    });

    // 5. Retornar con campos calculados (no almacenados en DB)
    return {
      id: record.id,
      productId: record.productId,
      userId: record.userId,
      date: record.date.toISOString().split('T')[0],
      finalCount: record.finalCount,
      qualitativeValue: record.qualitativeValue,
      initialStock,
      difference,
      recordedAt: record.recordedAt.toISOString(),
      notes: record.notes,
    };
  }
}
