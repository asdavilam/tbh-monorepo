import type { IProductRepository, IUserRepository } from '@tbh/domain';
import { canEditProducts } from '@tbh/domain';

export class BulkAssignProductsUseCase {
  constructor(
    private readonly productRepo: IProductRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(
    requestingUserId: string,
    productIds: string[],
    targetUserId: string | null
  ): Promise<void> {
    const requester = await this.userRepo.findById(requestingUserId);
    if (!requester) throw new Error('Usuario no encontrado');
    if (!canEditProducts(requester.role)) throw new Error('Sin permisos para asignar productos');

    if (productIds.length === 0) throw new Error('Selecciona al menos un producto');

    if (targetUserId !== null) {
      const target = await this.userRepo.findById(targetUserId);
      if (!target) throw new Error('Usuario destino no encontrado');
    }

    await this.productRepo.bulkUpdateAssignedUser(productIds, targetUserId);
  }
}
