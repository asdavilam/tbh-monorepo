import type { IUserRepository, UserRole } from '@tbh/domain';
import { canManageUsers } from '@tbh/domain';
import type { IAuthService } from '../services/auth.service';

export class InviteUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(
    requestingUserId: string,
    email: string,
    name: string,
    role: UserRole
  ): Promise<void> {
    const requester = await this.userRepo.findById(requestingUserId);
    if (!requester) throw new Error('Usuario no encontrado');
    if (!canManageUsers(requester.role)) throw new Error('Sin permisos para invitar usuarios');

    await this.authService.inviteUser(email, name, role);
  }
}
