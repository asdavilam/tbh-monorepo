// Utilidad de localStorage para items manuales de lista de compras.
// Vive en shared/ para que tanto shopping-list como purchases puedan accederla
// sin crear dependencia cruzada entre features.

import type { ManualItem } from '../features/shopping-list/hooks/useShoppingList';

function key(userId: string) {
  return `tbh_shopping_manual_${userId}`;
}

export function loadManualItems(userId: string): ManualItem[] {
  try {
    const raw = localStorage.getItem(key(userId));
    return raw ? (JSON.parse(raw) as ManualItem[]) : [];
  } catch {
    return [];
  }
}

export function saveManualItems(userId: string, items: ManualItem[]) {
  try {
    localStorage.setItem(key(userId), JSON.stringify(items));
  } catch {
    // localStorage puede estar bloqueado (modo incógnito con cuota llena)
  }
}

export function removeManualItemByProduct(userId: string, productId: string) {
  const current = loadManualItems(userId);
  const updated = current.filter((i) => i.productId !== productId);
  saveManualItems(userId, updated);
}
