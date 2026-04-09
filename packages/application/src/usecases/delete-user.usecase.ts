import type { IUserRepository } from '@tbh/domain';
import { canManageUsers } from '@tbh/domain';

export class DeleteUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(requestingUserId: string, targetUserId: string): Promise<void> {
    const requester = await this.userRepo.findById(requestingUserId);
    if (!requester) throw new Error('Usuario no encontrado');
    if (!canManageUsers(requester.role)) throw new Error('Sin permisos para eliminar usuarios');
    if (requestingUserId === targetUserId) throw new Error('No puedes eliminarte a ti mismo');

    await this.userRepo.delete(targetUserId);
  }
}
