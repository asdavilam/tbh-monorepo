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

    // Also include variants of any selected container products so assignments stay in sync
    const variantArrays = await Promise.all(
      productIds.map((id) => this.productRepo.findByParentId(id))
    );
    const variantIds = variantArrays.flat().map((v) => v.id);
    const allIds = [...new Set([...productIds, ...variantIds])];

    await this.productRepo.bulkUpdateAssignedUser(allIds, targetUserId);
  }
}
