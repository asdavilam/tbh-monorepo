import type { SupabaseClient } from '@supabase/supabase-js';
import type { User, IUserRepository } from '@tbh/domain';
import type { UserRole } from '@tbh/domain';
import { RepositoryError } from '../../errors';

interface ProfileRow {
  id: string;
  name: string;
  role: string;
  created_at: string;
}

function toUserEntity(row: ProfileRow, email = ''): User {
  return {
    id: row.id,
    email,
    name: row.name,
    role: row.role as UserRole,
    createdAt: new Date(row.created_at),
  };
}

export class SupabaseUserRepository implements IUserRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new RepositoryError(`Error al buscar usuario: ${error.message}`);
    if (!data) return null;
    return toUserEntity(data as ProfileRow);
  }

  async findAll(): Promise<User[]> {
    const { data, error } = await this.client.from('profiles').select('*').order('name');

    if (error) throw new RepositoryError(`Error al listar usuarios: ${error.message}`);
    return (data ?? []).map((row) => toUserEntity(row as ProfileRow));
  }

  async save(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const { data, error } = await this.client
      .from('profiles')
      .insert({ name: user.name, role: user.role })
      .select()
      .single();

    if (error) throw new RepositoryError(`Error al crear usuario: ${error.message}`);
    return toUserEntity(data as ProfileRow, user.email);
  }

  async update(user: User): Promise<User> {
    const { data, error } = await this.client
      .from('profiles')
      .update({ name: user.name, role: user.role })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw new RepositoryError(`Error al actualizar usuario: ${error.message}`);
    return toUserEntity(data as ProfileRow, user.email);
  }
}
