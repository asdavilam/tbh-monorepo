import { useState, useEffect, useCallback } from 'react';
import type { InventoryItemDto } from '@tbh/application';
import { getInventoryForToday } from '../../../shared/di';
import type { AuthUser } from '../../../shared/contexts/AuthContext';

interface State {
  items: InventoryItemDto[];
  loading: boolean;
  error: string | null;
}

export function useInventoryToday(user: AuthUser) {
  const [state, setState] = useState<State>({ items: [], loading: true, error: null });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const items = await getInventoryForToday.execute({
        userId: user.id,
        userRole: user.role,
        date: new Date(),
      });
      setState({ items, loading: false, error: null });
    } catch (err) {
      setState({ items: [], loading: false, error: String(err) });
    }
  }, [user.id, user.role]);

  useEffect(() => {
    load();
  }, [load]);

  // Recargar cuando la PWA vuelve al primer plano (desde background en móvil)
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === 'visible') load();
    }
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [load]);

  return { ...state, reload: load };
}
