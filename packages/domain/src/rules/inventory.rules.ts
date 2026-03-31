/**
 * Reglas de inventario — lógica de negocio pura.
 *
 * REGLA FUNDAMENTAL: El sistema NO usa movimientos.
 * Stock inicial = último conteo final + compras posteriores.
 * Diferencia = conteo final actual - stock inicial esperado.
 */

/**
 * Calcula el stock inicial esperado para un producto en un día dado.
 *
 * @param previousFinalCount - Conteo final del último registro
 * @param purchasesAfterPrevious - Suma de compras realizadas después del último registro
 */
export function calculateInitialStock(
  previousFinalCount: number,
  purchasesAfterPrevious: number
): number {
  return previousFinalCount + purchasesAfterPrevious;
}

/**
 * Calcula la diferencia entre el stock esperado y el conteo actual.
 * Valor negativo = faltante. Valor positivo = excedente.
 *
 * @param initialStock - Stock inicial esperado (calculado, nunca ingresado manualmente)
 * @param finalCount - Conteo final ingresado por el usuario
 */
export function calculateStockDifference(initialStock: number, finalCount: number): number {
  return finalCount - initialStock;
}

/**
 * Determina si un producto tiene stock por debajo del mínimo.
 * Para productos cualitativos siempre retorna false (no aplica).
 */
export function isBelowMinStock(currentStock: number, minStock: number | null): boolean {
  if (minStock === null) return false;
  return currentStock < minStock;
}

/**
 * Calcula la cantidad sugerida para compra.
 * Solo aplica a productos con unidad numérica.
 */
export function calculateSuggestedPurchaseQuantity(currentStock: number, minStock: number): number {
  const deficit = minStock - currentStock;
  return deficit > 0 ? deficit : 0;
}
