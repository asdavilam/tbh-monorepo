import type { IUserRepository } from '@tbh/domain';
import { canEditProducts } from '@tbh/domain';
import type { UserResponseDto } from '../dto/user.dto';

/**
 * Devuelve todos los usuarios para asignar productos.
 * Solo accesible por admin (canEditProducts).
 */
export class GetAllUsersUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(requestingUserId: string): Promise<UserResponseDto[]> {
    const requester = await this.userRepo.findById(requestingUserId);
    if (!requester) throw new Error('Usuario no encontrado');
    if (!canEditProducts(requester.role)) throw new Error('Sin permisos para ver usuarios');

    const users = await this.userRepo.findAll();
    return users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
    }));
  }
}
