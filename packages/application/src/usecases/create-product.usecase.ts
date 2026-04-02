import type { IProductRepository, IUserRepository, Product } from '@tbh/domain';
import { canEditProducts } from '@tbh/domain';
import type { CreateProductDto, ProductResponseDto } from '../dto/product.dto';

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
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export class CreateProductUseCase {
  constructor(
    private readonly productRepo: IProductRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(userId: string, dto: CreateProductDto): Promise<ProductResponseDto> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');
    if (!canEditProducts(user.role)) throw new Error('Sin permisos para crear productos');

    if (!dto.name.trim()) throw new Error('El nombre del producto es obligatorio');

    const product = await this.productRepo.save({
      name: dto.name.trim(),
      type: dto.type,
      unitType: dto.unitType,
      unitLabel: dto.unitLabel.trim(),
      countFrequency: dto.countFrequency,
      countDays: dto.countDays,
      minStock: dto.minStock,
      assignedUserId: dto.assignedUserId,
      packageUnit: dto.packageUnit,
      packageSize: dto.packageSize,
      barcode: dto.barcode ? dto.barcode.trim() : null,
    });

    return toDto(product);
  }
}
