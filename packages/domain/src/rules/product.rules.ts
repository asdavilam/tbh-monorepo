import type { Product } from '../entities/product.entity';
import type { DayOfWeek } from '../value-objects';

/**
 * Determina si un producto debe contarse en una fecha dada,
 * según su frecuencia de conteo configurada.
 */
export function isProductDueOnDate(product: Product, date: Date): boolean {
  if (product.countFrequency === 'daily') return true;
  const dayOfWeek = date.getDay() as DayOfWeek;
  return product.countDays.includes(dayOfWeek);
}

/**
 * Filtra una lista de productos a los que corresponde contar hoy.
 */
export function getProductsDueToday(products: Product[], today: Date): Product[] {
  return products.filter((p) => isProductDueOnDate(p, today));
}

/**
 * Determina si un producto es visible para un usuario dado.
 * - [] en assignedUserIds = visible para todos
 * - Con assignedUserIds = solo esos usuarios (y admins)
 */
export function isProductVisibleToUser(
  product: Product,
  userId: string,
  isAdmin: boolean
): boolean {
  if (isAdmin) return true;
  if (product.assignedUserIds.length === 0) return true;
  return product.assignedUserIds.includes(userId);
}
