import type { IUserRepository } from '@tbh/domain';
import { canManageUsers } from '@tbh/domain';
import type { UserRole } from '@tbh/domain';
import type { UserResponseDto } from '../dto/user.dto';

export class UpdateUserRoleUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(
    requestingUserId: string,
    targetUserId: string,
    role: UserRole
  ): Promise<UserResponseDto> {
    const requester = await this.userRepo.findById(requestingUserId);
    if (!requester) throw new Error('Usuario no encontrado');
    if (!canManageUsers(requester.role)) throw new Error('Sin permisos para cambiar roles');

    const target = await this.userRepo.findById(targetUserId);
    if (!target) throw new Error('Usuario objetivo no encontrado');

    const updated = await this.userRepo.update({ ...target, role });
    return {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
      createdAt: updated.createdAt.toISOString(),
    };
  }
}
