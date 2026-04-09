import type { IProductRepository, IUserRepository, Product } from '@tbh/domain';
import { canEditProducts } from '@tbh/domain';
import type { UpdateProductDto, ProductResponseDto } from '../dto/product.dto';

function toDto(product: Product): ProductResponseDto {
  return {
    id: product.id,
    name: product.name,
    type: product.type,
    unitType: product.unitType,
    unitLabel: product.unitLabel,
    countFrequency: product.countFrequency,
    countDays: product.countDays,
    minStock: product.minStock,
    assignedUserId: product.assignedUserId,
    packageUnit: product.packageUnit,
    packageSize: product.packageSize,
    barcode: product.barcode,
    parentProductId: product.parentProductId,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export class UpdateProductUseCase {
  constructor(
    private readonly productRepo: IProductRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(userId: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');
    if (!canEditProducts(user.role)) throw new Error('Sin permisos para editar productos');

    const existing = await this.productRepo.findById(dto.id);
    if (!existing) throw new Error('Producto no encontrado');

    const updated = await this.productRepo.update({
      ...existing,
      name: dto.name !== undefined ? dto.name.trim() : existing.name,
      type: dto.type ?? existing.type,
      unitType: dto.unitType ?? existing.unitType,
      unitLabel: dto.unitLabel !== undefined ? dto.unitLabel.trim() : existing.unitLabel,
      countFrequency: dto.countFrequency ?? existing.countFrequency,
      countDays: dto.countDays ?? existing.countDays,
      minStock: dto.minStock !== undefined ? dto.minStock : existing.minStock,
      assignedUserId:
        dto.assignedUserId !== undefined ? dto.assignedUserId : existing.assignedUserId,
      packageUnit: dto.packageUnit !== undefined ? dto.packageUnit : existing.packageUnit,
      packageSize: dto.packageSize !== undefined ? dto.packageSize : existing.packageSize,
      barcode:
        dto.barcode !== undefined ? (dto.barcode ? dto.barcode.trim() : null) : existing.barcode,
      parentProductId:
        dto.parentProductId !== undefined ? dto.parentProductId : existing.parentProductId,
    });

    return toDto(updated);
  }
}
