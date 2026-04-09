import { useState, useEffect, useCallback } from 'react';
import { generateShoppingList, getAllProducts } from '../../../shared/di';
import { loadManualItems, saveManualItems } from '../../../shared/shoppingListStorage';
export function useShoppingList(user) {
  const [state, setState] = useState({
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
  function addManualItem(item) {
    setState((s) => {
      const updated = [...s.manualItems, item];
      saveManualItems(user.id, updated);
      return { ...s, manualItems: updated };
    });
  }
  function removeManualItem(index) {
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
