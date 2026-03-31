import type { IUserRepository, IPurchaseRepository } from '@tbh/domain';
import { canRegisterPurchases } from '@tbh/domain';
import type { RegisterPurchaseDto, PurchaseResponseDto } from '../dto/purchase.dto';

export class RegisterPurchaseUseCase {
  constructor(
    private readonly purchaseRepo: IPurchaseRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(dto: RegisterPurchaseDto): Promise<PurchaseResponseDto> {
    // 1. Validar que el usuario existe y tiene permisos
    const user = await this.userRepo.findById(dto.userId);
    if (!user) throw new Error('Usuario no encontrado');

    if (!canRegisterPurchases(user.role)) {
      throw new Error('No tienes permisos para registrar compras');
    }

    // 2. Validar cantidad positiva
    if (dto.quantity <= 0) {
      throw new Error('La cantidad de la compra debe ser mayor a cero');
    }

    // 3. Guardar compra
    // Nota: el impacto en inventario es derivado — el cálculo de stock
    // incluye automáticamente esta compra al buscar compras entre registros
    const purchase = await this.purchaseRepo.save({
      productId: dto.productId,
      userId: dto.userId,
      quantity: dto.quantity,
      purchasedAt: new Date(),
      notes: dto.notes ?? null,
    });

    return {
      id: purchase.id,
      productId: purchase.productId,
      userId: purchase.userId,
      quantity: purchase.quantity,
      purchasedAt: purchase.purchasedAt.toISOString(),
      notes: purchase.notes,
    };
  }
}
