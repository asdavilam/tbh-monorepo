import { useState, useEffect, useCallback } from 'react';
import type { UserResponseDto } from '@tbh/application';
import type { UserRole } from '@tbh/domain';
import { getAllUsers, deleteUser, updateUserRole } from '../../../shared/di';
import { useAuth } from '../../../shared/contexts/AuthContext';

export function useUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const data = await getAllUsers.execute(user.id);
      setUsers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(targetId: string): Promise<void> {
    if (!user) return;
    await deleteUser.execute(user.id, targetId);
    setUsers((prev) => prev.filter((u) => u.id !== targetId));
  }

  async function changeRole(targetId: string, role: UserRole): Promise<void> {
    if (!user) return;
    const updated = await updateUserRole.execute(user.id, targetId, role);
    setUsers((prev) => prev.map((u) => (u.id === targetId ? updated : u)));
  }

  return { users, loading, error, remove, changeRole };
}
