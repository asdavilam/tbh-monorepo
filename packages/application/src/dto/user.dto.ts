import type { UserRole } from '@tbh/domain';

export interface CreateUserDto {
  email: string;
  name: string;
  role: UserRole;
}

export interface UserResponseDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}
