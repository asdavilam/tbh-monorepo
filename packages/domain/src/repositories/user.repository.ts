import type { User } from '../entities/user.entity';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  save(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
