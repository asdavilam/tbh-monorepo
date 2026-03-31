import { useState, useEffect, useCallback } from 'react';
import type { ProductResponseDto } from '@tbh/application';
import { getProductsByUser } from '../../../shared/di';
import type { AuthUser } from '../../../shared/contexts/AuthContext';

interface State {
  products: ProductResponseDto[];
  loading: boolean;
  error: string | null;
}

export function useInventoryToday(user: AuthUser) {
  const [state, setState] = useState<State>({ products: [], loading: true, error: null });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const products = await getProductsByUser.execute({
        userId: user.id,
        userRole: user.role,
        date: new Date(),
      });
      setState({ products, loading: false, error: null });
    } catch (err) {
      setState({ products: [], loading: false, error: String(err) });
    }
  }, [user.id, user.role]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
