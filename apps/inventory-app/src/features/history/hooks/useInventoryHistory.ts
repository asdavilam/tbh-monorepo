import { useState, useEffect, useCallback } from 'react';
import type { InventoryHistoryItemDto } from '@tbh/application';
import { getAllProducts, getInventoryHistoryByProduct } from '../../../shared/di';
import type { AuthUser } from '../../../shared/contexts/AuthContext';
import type { ProductResponseDto } from '@tbh/application';

interface InventoryHistoryState {
  products: ProductResponseDto[];
  history: InventoryHistoryItemDto[];
  loadingProducts: boolean;
  loadingHistory: boolean;
  error: string;
}

export function useInventoryHistory(user: AuthUser) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [state, setState] = useState<InventoryHistoryState>({
    products: [],
    history: [],
    loadingProducts: true,
    loadingHistory: false,
    error: '',
  });

  // Cargar lista de productos al montar
  useEffect(() => {
    getAllProducts
      .execute(user.id)
      .then((products) => setState((s) => ({ ...s, products, loadingProducts: false })))
      .catch(() =>
        setState((s) => ({ ...s, loadingProducts: false, error: 'Error al cargar productos' }))
      );
  }, [user.id]);

  // Cargar historial cuando cambia el producto seleccionado
  const loadHistory = useCallback(
    async (productId: string) => {
      if (!productId) {
        setState((s) => ({ ...s, history: [], loadingHistory: false }));
        return;
      }

      setState((s) => ({ ...s, loadingHistory: true, error: '' }));
      try {
        const history = await getInventoryHistoryByProduct.execute({
          productId,
          userId: user.id,
        });
        setState((s) => ({ ...s, history, loadingHistory: false }));
      } catch {
        setState((s) => ({
          ...s,
          history: [],
          loadingHistory: false,
          error: 'Error al cargar el historial',
        }));
      }
    },
    [user.id]
  );

  function selectProduct(productId: string) {
    setSelectedProductId(productId);
    loadHistory(productId);
  }

  return {
    ...state,
    selectedProductId,
    selectProduct,
  };
}
