import type { ProductType, UnitType, CountFrequency, DayOfWeek } from '@tbh/domain';

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
