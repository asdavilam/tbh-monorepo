import type { IUserRepository, User } from '@tbh/domain';

export class GetCurrentUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  /**
   * Carga el perfil completo desde la DB usando el userId de la sesión.
   * El email viene de Auth (no está en la tabla profiles) y se mezcla aquí.
   */
  async execute(userId: string, email: string): Promise<User | null> {
    const user = await this.userRepo.findById(userId);
    if (!user) return null;
    return { ...user, email };
  }
}
