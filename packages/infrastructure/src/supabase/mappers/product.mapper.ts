import type {
  Product,
  ProductType,
  UnitType,
  CountFrequency,
  DayOfWeek,
  ProductCategory,
} from '@tbh/domain';

export interface ProductRow {
  id: string;
  name: string;
  type: string;
  unit_type: string;
  unit_label: string;
  count_frequency: string;
  count_days: number[];
  min_stock: number | null;
  assigned_user_id: string | null;
  package_unit: string | null;
  package_size: number | null;
  barcode: string | null;
  category: string | null;
  parent_product_id: string | null;
  created_at: string;
  updated_at: string;
}

export function toProductEntity(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    type: row.type as ProductType,
    unitType: row.unit_type as UnitType,
    unitLabel: row.unit_label,
    countFrequency: row.count_frequency as CountFrequency,
    countDays: (row.count_days ?? []) as DayOfWeek[],
    minStock: row.min_stock,
    assignedUserId: row.assigned_user_id,
    packageUnit: row.package_unit,
    packageSize: row.package_size,
    barcode: row.barcode,
    category: row.category as ProductCategory | null,
    parentProductId: row.parent_product_id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export function toProductRow(
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Omit<ProductRow, 'id' | 'created_at' | 'updated_at'> {
  return {
    name: product.name,
    type: product.type,
    unit_type: product.unitType,
    unit_label: product.unitLabel,
    count_frequency: product.countFrequency,
    count_days: product.countDays,
    min_stock: product.minStock,
    assigned_user_id: product.assignedUserId,
    package_unit: product.packageUnit,
    package_size: product.packageSize,
    barcode: product.barcode,
    category: product.category,
    parent_product_id: product.parentProductId,
  };
}
