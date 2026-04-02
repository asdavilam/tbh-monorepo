import type { ProductType, UnitType, CountFrequency, DayOfWeek } from '../value-objects';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  unitType: UnitType;
  /** Etiqueta legible: "pz", "g", "l", etc. */
  unitLabel: string;
  countFrequency: CountFrequency;
  /** Días activos — solo aplica cuando countFrequency === 'specific_days' */
  countDays: DayOfWeek[];
  /** Stock mínimo para generar alerta de compra. null para tipo cualitativo */
  minStock: number | null;
  /** Usuario asignado para conteo. null = visible para todos */
  assignedUserId: string | null;
  /** Nombre del empaque de compra. Ej: "paquete", "galón", "caja". null = sin empaque */
  packageUnit: string | null;
  /** Cantidad de unidades de conteo por empaque. Ej: 20 pz/paquete, 20 L/galón */
  packageSize: number | null;
  /** Código de barras para identificación rápida */
  barcode: string | null;
  createdAt: Date;
  updatedAt: Date;
}
