import type { IProductRepository, IUserRepository } from '@tbh/domain';
import { canEditProducts } from '@tbh/domain';

export class DeleteProductUseCase {
  constructor(
    private readonly productRepo: IProductRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(userId: string, productId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');
    if (!canEditProducts(user.role)) throw new Error('Sin permisos para eliminar productos');

    const existing = await this.productRepo.findById(productId);
    if (!existing) throw new Error('Producto no encontrado');

    await this.productRepo.delete(productId);
  }
}
