import type { IInventoryRecordRepository, IProductRepository, IUserRepository } from '@tbh/domain';
import { canManageStock } from '@tbh/domain';
import type { CorrectStockDto, InventoryRecordResponseDto } from '../dto/inventory-record.dto';

export class CorrectStockUseCase {
  constructor(
    private readonly inventoryRepo: IInventoryRecordRepository,
    private readonly productRepo: IProductRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(dto: CorrectStockDto): Promise<InventoryRecordResponseDto> {
    const user = await this.userRepo.findById(dto.userId);
    if (!user) throw new Error('Usuario no encontrado');
    if (!canManageStock(user.role)) throw new Error('Sin permisos para corregir el stock');

    const product = await this.productRepo.findById(dto.productId);
    if (!product) throw new Error('Producto no encontrado');

    if (product.unitType === 'qualitative') {
      if (dto.qualitativeValue === null)
        throw new Error('Producto cualitativo requiere un valor (mucho/poco/nada)');
      if (dto.finalCount !== null)
        throw new Error('Producto cualitativo no acepta conteo numérico');
    } else {
      if (dto.finalCount === null) throw new Error('Producto numérico requiere una cantidad');
      if (dto.finalCount < 0) throw new Error('La cantidad no puede ser negativa');
    }

    const correctionNote = dto.notes?.trim()
      ? `Corrección manual: ${dto.notes.trim()}`
      : 'Corrección manual';

    const now = new Date();
    const record = await this.inventoryRepo.save({
      productId: dto.productId,
      userId: dto.userId,
      date: now,
      finalCount: product.unitType !== 'qualitative' ? dto.finalCount : null,
      qualitativeValue: product.unitType === 'qualitative' ? dto.qualitativeValue : null,
      recordedAt: now,
      notes: correctionNote,
    });

    return {
      id: record.id,
      productId: record.productId,
      userId: record.userId,
      date: record.date.toISOString().split('T')[0],
      finalCount: record.finalCount,
      qualitativeValue: record.qualitativeValue,
      initialStock: null,
      difference: null,
      recordedAt: record.recordedAt.toISOString(),
      notes: record.notes,
    };
  }
}
