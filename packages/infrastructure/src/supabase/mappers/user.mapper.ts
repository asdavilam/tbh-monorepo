import type { User, UserRole } from '@tbh/domain';

export interface UserRow {
  id: string;
  name: string;
  role: string;
  created_at: string;
}

export interface UserWithEmailRow extends UserRow {
  email: string;
}

export function toUserEntity(row: UserWithEmailRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role as UserRole,
    createdAt: new Date(row.created_at),
  };
}
