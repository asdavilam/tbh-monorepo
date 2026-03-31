import type { ProductType, UnitType, CountFrequency, DayOfWeek, UserRole } from '@tbh/domain';

export interface CreateProductDto {
  name: string;
  type: ProductType;
  unitType: UnitType;
  unitLabel: string;
  countFrequency: CountFrequency;
  countDays: DayOfWeek[];
  minStock: number | null;
  assignedUserId: string | null;
}

export interface UpdateProductDto {
  id: string;
  name?: string;
  type?: ProductType;
  unitType?: UnitType;
  unitLabel?: string;
  countFrequency?: CountFrequency;
  countDays?: DayOfWeek[];
  minStock?: number | null;
  assignedUserId?: string | null;
}

export interface ProductResponseDto {
  id: string;
  name: string;
  type: ProductType;
  unitType: UnitType;
  unitLabel: string;
  countFrequency: CountFrequency;
  countDays: DayOfWeek[];
  minStock: number | null;
  assignedUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetProductsByUserDto {
  userId: string;
  userRole: UserRole;
  /** Fecha para filtrar por frecuencia de conteo */
  date: Date;
}

export interface ShoppingListItemDto {
  productId: string;
  productName: string;
  unitLabel: string;
  currentStock: number;
  minStock: number;
  suggestedQuantity: number;
}
