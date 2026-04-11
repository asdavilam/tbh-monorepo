import type { IProductRepository, IUserRepository, Product } from '@tbh/domain';
import { isAdmin, isProductVisibleToUser, getProductsDueToday } from '@tbh/domain';
import type { GetProductsByUserDto, ProductResponseDto } from '../dto/product.dto';

function toProductResponseDto(product: Product): ProductResponseDto {
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
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export class GetProductsByUserUseCase {
  constructor(
    private readonly productRepo: IProductRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(dto: GetProductsByUserDto): Promise<ProductResponseDto[]> {
    const user = await this.userRepo.findById(dto.userId);
    if (!user) throw new Error('Usuario no encontrado');

    const adminUser = isAdmin(user.role);

    // Admins ven todos los productos; los demás solo los asignados
    const products = adminUser
      ? await this.productRepo.findAll()
      : await this.productRepo.findByAssignedUser(dto.userId);

    // Filtrar por visibilidad según rol y asignación
    const visible = products.filter((p) => isProductVisibleToUser(p, dto.userId, adminUser));

    // Filtrar por frecuencia — solo los que corresponden al día
    const dueToday = getProductsDueToday(visible, dto.date);

    return dueToday.map(toProductResponseDto);
  }
}
