import { useState, useEffect, useCallback } from 'react';
import type { ShoppingListItemDto, ProductResponseDto } from '@tbh/application';
import { generateShoppingList, getAllProducts } from '../../../shared/di';
import type { AuthUser } from '../../../shared/contexts/AuthContext';
import { loadManualItems, saveManualItems } from '../../../shared/shoppingListStorage';

export interface ManualItem {
  productId: string;
  productName: string;
  unitLabel: string;
  quantity: number;
}

interface ShoppingListState {
  autoItems: ShoppingListItemDto[];
  manualItems: ManualItem[];
  allProducts: ProductResponseDto[];
  loading: boolean;
  error: string;
}

export function useShoppingList(user: AuthUser) {
  const [state, setState] = useState<ShoppingListState>({
    autoItems: [],
    manualItems: loadManualItems(user.id),
    allProducts: [],
    loading: true,
    error: '',
  });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const [autoItems, allProducts] = await Promise.all([
        generateShoppingList.execute(),
        getAllProducts.execute(user.id),
      ]);
      setState((s) => ({ ...s, autoItems, allProducts, loading: false }));
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: String(err) }));
    }
  }, [user.id]);

  useEffect(() => {
    load();
  }, [load]);

  function addManualItem(item: ManualItem) {
    setState((s) => {
      const updated = [...s.manualItems, item];
      saveManualItems(user.id, updated);
      return { ...s, manualItems: updated };
    });
  }

  function removeManualItem(index: number) {
    setState((s) => {
      const updated = s.manualItems.filter((_, i) => i !== index);
      saveManualItems(user.id, updated);
      return { ...s, manualItems: updated };
    });
  }

  function clearManualItems() {
    saveManualItems(user.id, []);
    setState((s) => ({ ...s, manualItems: [] }));
  }

  // Sincroniza el estado con localStorage (por si usePurchase borró un item externamente)
  const syncFromStorage = useCallback(() => {
    setState((s) => ({ ...s, manualItems: loadManualItems(user.id) }));
  }, [user.id]);

  useEffect(() => {
    window.addEventListener('focus', syncFromStorage);
    return () => window.removeEventListener('focus', syncFromStorage);
  }, [syncFromStorage]);

  return { ...state, reload: load, addManualItem, removeManualItem, clearManualItems };
}
