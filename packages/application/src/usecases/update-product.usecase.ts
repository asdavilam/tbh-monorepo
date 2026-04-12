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
    assignedUserIds: product.assignedUserIds,
    packageUnit: product.packageUnit,
    packageSize: product.packageSize,
    barcode: product.barcode,
    category: product.category,
    parentProductId: product.parentProductId,
    isProduction: product.isProduction,
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

    const newAssignedUserIds =
      dto.assignedUserIds !== undefined ? dto.assignedUserIds : existing.assignedUserIds;

    const updated = await this.productRepo.update({
      ...existing,
      name: dto.name !== undefined ? dto.name.trim() : existing.name,
      type: dto.type ?? existing.type,
      unitType: dto.unitType ?? existing.unitType,
      unitLabel: dto.unitLabel !== undefined ? dto.unitLabel.trim() : existing.unitLabel,
      countFrequency: dto.countFrequency ?? existing.countFrequency,
      countDays: dto.countDays ?? existing.countDays,
      minStock: dto.minStock !== undefined ? dto.minStock : existing.minStock,
      assignedUserIds: newAssignedUserIds,
      packageUnit: dto.packageUnit !== undefined ? dto.packageUnit : existing.packageUnit,
      packageSize: dto.packageSize !== undefined ? dto.packageSize : existing.packageSize,
      barcode:
        dto.barcode !== undefined ? (dto.barcode ? dto.barcode.trim() : null) : existing.barcode,
      category: dto.category !== undefined ? dto.category : existing.category,
      parentProductId:
        dto.parentProductId !== undefined ? dto.parentProductId : existing.parentProductId,
      isProduction: dto.isProduction !== undefined ? dto.isProduction : existing.isProduction,
    });

    // Cascade assignedUserIds to variants so they stay in sync with their parent
    if (dto.assignedUserIds !== undefined && !existing.parentProductId) {
      const variants = await this.productRepo.findByParentId(existing.id);
      await Promise.all(
        variants.map((v) => this.productRepo.update({ ...v, assignedUserIds: newAssignedUserIds }))
      );
    }

    return toDto(updated);
  }
}
