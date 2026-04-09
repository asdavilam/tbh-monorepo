import { useState, useEffect, useCallback } from 'react';
import { getInventoryForToday } from '../../../shared/di';
export function useInventoryToday(user) {
  const [state, setState] = useState({ items: [], loading: true, error: null });
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
  return { ...state, reload: load };
}
