import type { IProductRepository, IUserRepository, Product } from '@tbh/domain';
import { canRegisterPurchases } from '@tbh/domain';
import type { ProductResponseDto } from '../dto/product.dto';

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

/**
 * Devuelve todos los productos sin filtro de fecha ni asignación.
 * Usado por la pantalla de compras donde el encargado/admin necesita
 * ver todos los productos, no solo los de hoy.
 *
 * Valida que el usuario tenga permiso para registrar compras.
 */
export class GetAllProductsUseCase {
  constructor(
    private readonly productRepo: IProductRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(userId: string): Promise<ProductResponseDto[]> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');
    if (!canRegisterPurchases(user.role)) throw new Error('Sin permisos para ver productos');

    const products = await this.productRepo.findAll();
    return products.map(toProductResponseDto);
  }
}
