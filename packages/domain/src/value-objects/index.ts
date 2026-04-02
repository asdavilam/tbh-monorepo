// Value Objects — tipos primitivos con semántica de negocio
// Sin dependencias externas

export type UserRole = 'admin' | 'encargado' | 'trabajador';

export type ProductType = 'raw_material' | 'disposable' | 'basic';

export type UnitType = 'unit' | 'fraction' | 'qualitative';

export type QualitativeValue = 'mucho' | 'poco' | 'nada';

export type CountFrequency = 'daily' | 'specific_days';

/** 0 = Domingo, 1 = Lunes, ..., 6 = Sábado */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  encargado: 'Encargado',
  trabajador: 'Trabajador',
};

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  raw_material: 'Materia prima',
  disposable: 'Desechable',
  basic: 'Básico',
};

export const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  unit: 'Unidad',
  fraction: 'Fracción',
  qualitative: 'Cualitativo',
};

export const QUALITATIVE_VALUE_LABELS: Record<QualitativeValue, string> = {
  mucho: 'Mucho',
  poco: 'Poco',
  nada: 'Nada',
};

export const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};
