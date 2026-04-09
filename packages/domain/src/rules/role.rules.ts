import type { UserRole } from '../value-objects';

export function canEditProducts(role: UserRole): boolean {
  return role === 'admin';
}

export function canRegisterInventory(role: UserRole): boolean {
  return role === 'admin' || role === 'encargado' || role === 'trabajador';
}

export function canRegisterPurchases(role: UserRole): boolean {
  return role === 'admin' || role === 'encargado';
}

export function canManageUsers(role: UserRole): boolean {
  return role === 'admin';
}

export function canEditInventoryRecords(role: UserRole): boolean {
  return role === 'admin';
}

export function canManageStock(role: UserRole): boolean {
  return role === 'admin' || role === 'encargado';
}

export function isAdmin(role: UserRole): boolean {
  return role === 'admin';
}
