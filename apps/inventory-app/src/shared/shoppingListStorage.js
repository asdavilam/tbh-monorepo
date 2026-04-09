// Utilidad de localStorage para items manuales de lista de compras.
// Vive en shared/ para que tanto shopping-list como purchases puedan accederla
// sin crear dependencia cruzada entre features.
function key(userId) {
  return `tbh_shopping_manual_${userId}`;
}
export function loadManualItems(userId) {
  try {
    const raw = localStorage.getItem(key(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
export function saveManualItems(userId, items) {
  try {
    localStorage.setItem(key(userId), JSON.stringify(items));
  } catch {
    // localStorage puede estar bloqueado (modo incógnito con cuota llena)
  }
}
export function removeManualItemByProduct(userId, productId) {
  const current = loadManualItems(userId);
  const updated = current.filter((i) => i.productId !== productId);
  saveManualItems(userId, updated);
}
