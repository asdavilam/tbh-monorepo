import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type {
  ProductType,
  UnitType,
  CountFrequency,
  DayOfWeek,
  ProductCategory,
} from '@tbh/domain';
import {
  PRODUCT_TYPE_LABELS,
  UNIT_TYPE_LABELS,
  DAY_OF_WEEK_LABELS,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_LABELS,
} from '@tbh/domain';
import type { ProductResponseDto, UserResponseDto } from '@tbh/application';
import {
  createProduct,
  updateProduct,
  getAllProducts,
  getAllUsers,
  deleteProduct,
} from '../../../shared/di';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { Layout } from '../../../shared/components/Layout';
import { colors, fontSize, radius, spacing, transition } from '../../../shared/theme';
import { BarcodeScannerButton } from '../components/BarcodeScannerButton';

const PRODUCT_TYPES: ProductType[] = ['raw_material', 'disposable', 'basic'];
const UNIT_TYPES: UnitType[] = ['unit', 'fraction', 'qualitative'];
const ALL_DAYS: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];

const UNIT_LABEL_OPTIONS: Record<UnitType, string[]> = {
  unit: ['pz', 'bolsa', 'caja', 'lata', 'sobre', 'rollo'],
  fraction: ['g', 'kg', 'ml', 'l'],
  qualitative: [],
};

interface FormState {
  name: string;
  type: ProductType;
  unitType: UnitType;
  unitLabel: string;
  countFrequency: CountFrequency;
  countDays: DayOfWeek[];
  minStock: string;
  assignedUserIds: string[];
  packageUnit: string;
  packageSize: string;
  barcode: string;
  category: ProductCategory | '';
}

const EMPTY_FORM: FormState = {
  name: '',
  type: 'raw_material',
  unitType: 'unit',
  unitLabel: 'pz',
  countFrequency: 'daily',
  countDays: [],
  minStock: '',
  assignedUserIds: [],
  packageUnit: '',
  packageSize: '',
  barcode: '',
  category: '',
};

export function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  // Variants state (edit mode only)
  const [variants, setVariants] = useState<ProductResponseDto[]>([]);
  const [newVariantName, setNewVariantName] = useState('');
  const [addingVariant, setAddingVariant] = useState(false);
  const [variantError, setVariantError] = useState('');

  useEffect(() => {
    if (!user) return;
    getAllUsers
      .execute(user.id)
      .then(setUsers)
      .catch(() => setUsers([]));
  }, [user?.id]);

  useEffect(() => {
    if (!isEdit || !id || !user) return;
    setLoading(true);
    getAllProducts
      .execute(user.id)
      .then((products) => {
        const product = products.find((p) => p.id === id);
        if (!product) {
          setError('Producto no encontrado');
          return;
        }
        setForm({
          name: product.name,
          type: product.type,
          unitType: product.unitType,
          unitLabel: product.unitLabel,
          countFrequency: product.countFrequency,
          countDays: product.countDays,
          minStock: product.minStock !== null ? String(product.minStock) : '',
          assignedUserIds: product.assignedUserIds ?? [],
          packageUnit: product.packageUnit ?? '',
          packageSize: product.packageSize !== null ? String(product.packageSize) : '',
          barcode: product.barcode ?? '',
          category: product.category ?? '',
        });
        // Load existing variants
        setVariants(products.filter((p) => p.parentProductId === id));
      })
      .catch(() => setError('No se pudo cargar el producto'))
      .finally(() => setLoading(false));
  }, [isEdit, id, user?.id]);

  function handleUnitTypeChange(unitType: UnitType) {
    const labels = UNIT_LABEL_OPTIONS[unitType];
    setForm((prev) => ({
      ...prev,
      unitType,
      unitLabel: labels[0] ?? '',
      minStock: unitType === 'qualitative' ? '' : prev.minStock,
      packageUnit: unitType === 'qualitative' ? '' : prev.packageUnit,
      packageSize: unitType === 'qualitative' ? '' : prev.packageSize,
    }));
  }

  function toggleDay(day: DayOfWeek) {
    setForm((prev) => ({
      ...prev,
      countDays: prev.countDays.includes(day)
        ? prev.countDays.filter((d) => d !== day)
        : [...prev.countDays, day].sort((a, b) => a - b),
    }));
  }

  async function handleAddVariant() {
    if (!user || !id || !newVariantName.trim()) return;
    setAddingVariant(true);
    setVariantError('');
    try {
      const variant = await createProduct.execute(user.id, {
        name: newVariantName.trim(),
        type: form.type,
        unitType: form.unitType,
        unitLabel: form.unitLabel,
        countFrequency: form.countFrequency,
        countDays: form.countDays,
        minStock: null,
        assignedUserIds: form.assignedUserIds,
        packageUnit: null,
        packageSize: null,
        barcode: null,
        parentProductId: id,
      });
      setVariants((prev) => [...prev, variant]);
      setNewVariantName('');
    } catch (e) {
      setVariantError(e instanceof Error ? e.message : 'No se pudo agregar la variante');
    } finally {
      setAddingVariant(false);
    }
  }

  async function handleDeleteVariant(variantId: string, variantName: string) {
    if (!user) return;
    if (!window.confirm(`¿Eliminar variante "${variantName}"?`)) return;
    try {
      await deleteProduct.execute(user.id, variantId);
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
    } catch (e) {
      setVariantError(e instanceof Error ? e.message : 'No se pudo eliminar la variante');
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;

    if (!form.name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    if (form.countFrequency === 'specific_days' && form.countDays.length === 0) {
      setError('Selecciona al menos un día para la frecuencia específica');
      return;
    }
    if (form.packageUnit && !form.packageSize) {
      setError('Indica la cantidad por empaque');
      return;
    }

    const minStockValue =
      form.unitType !== 'qualitative' && form.minStock !== '' ? Number(form.minStock) : null;
    const packageSizeValue = form.packageUnit && form.packageSize ? Number(form.packageSize) : null;

    setSaving(true);
    setError('');

    try {
      if (isEdit && id) {
        await updateProduct.execute(user.id, {
          id,
          name: form.name,
          type: form.type,
          unitType: form.unitType,
          unitLabel: form.unitLabel,
          countFrequency: form.countFrequency,
          countDays: form.countDays,
          minStock: minStockValue,
          assignedUserIds: form.assignedUserIds,
          packageUnit: form.packageUnit || null,
          packageSize: packageSizeValue,
          barcode: form.barcode || null,
          category: form.category || null,
        });
      } else {
        await createProduct.execute(user.id, {
          name: form.name,
          type: form.type,
          unitType: form.unitType,
          unitLabel: form.unitLabel,
          countFrequency: form.countFrequency,
          countDays: form.countDays,
          minStock: minStockValue,
          assignedUserIds: form.assignedUserIds,
          packageUnit: form.packageUnit || null,
          packageSize: packageSizeValue,
          barcode: form.barcode || null,
          category: form.category || null,
        });
      }
      navigate('/productos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el producto');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Layout title={isEdit ? 'Editar producto' : 'Nuevo producto'}>
        <p style={{ color: colors.textMuted, fontSize: fontSize.base }}>Cargando...</p>
      </Layout>
    );
  }

  const labelOptions = UNIT_LABEL_OPTIONS[form.unitType];
  const isQualitative = form.unitType === 'qualitative';

  return (
    <Layout title={isEdit ? 'Editar producto' : 'Nuevo producto'}>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        {/* Nombre */}
        <div style={fieldGroup}>
          <label style={labelStyle}>NOMBRE</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            placeholder="Ej: Carne de res"
            style={inputStyle}
          />
        </div>

        {/* Categoría */}
        <div style={fieldGroup}>
          <label style={labelStyle}>
            CATEGORÍA{' '}
            <span style={{ color: colors.textMuted, fontWeight: 400, textTransform: 'none' }}>
              (opcional)
            </span>
          </label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value as ProductCategory | '' }))
            }
            style={selectStyle}
          >
            <option value="">Sin categoría</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {PRODUCT_CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de producto */}
        <div style={fieldGroup}>
          <label style={labelStyle}>TIPO DE PRODUCTO</label>
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ProductType }))}
            style={selectStyle}
          >
            {PRODUCT_TYPES.map((t) => (
              <option key={t} value={t}>
                {PRODUCT_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de unidad — segmented buttons */}
        <div style={fieldGroup}>
          <label style={labelStyle}>TIPO DE UNIDAD</label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '8px',
            }}
          >
            {UNIT_TYPES.map((u) => {
              const active = form.unitType === u;
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => handleUnitTypeChange(u)}
                  style={{
                    padding: '10px 8px',
                    borderRadius: radius.sm,
                    border: `2px solid ${active ? colors.primary : colors.border}`,
                    backgroundColor: active ? colors.primaryLight : colors.surface,
                    color: active ? colors.primary : colors.textMuted,
                    fontSize: '12px',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                    minHeight: '44px',
                    transition: 'all 0.15s',
                  }}
                >
                  {UNIT_TYPE_LABELS[u]}
                </button>
              );
            })}
          </div>
          {/* Descripción contextual */}
          <p style={{ margin: 0, fontSize: '12px', color: colors.textMuted, lineHeight: 1.4 }}>
            {form.unitType === 'unit' && 'Conteo por piezas completas: bolsas, latas, cajas...'}
            {form.unitType === 'fraction' && 'Conteo por cantidad: gramos, litros, kilos...'}
            {form.unitType === 'qualitative' && 'Conteo por percepción: mucho / poco / nada'}
          </p>
        </div>

        {/* Etiqueta de unidad — solo para unit y fraction */}
        {!isQualitative && (
          <div style={fieldGroup}>
            <label style={labelStyle}>ETIQUETA DE UNIDAD</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {labelOptions.map((opt) => {
                const active = form.unitLabel === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, unitLabel: opt }))}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '999px',
                      border: `2px solid ${active ? colors.primary : colors.border}`,
                      backgroundColor: active ? colors.primaryLight : colors.surface,
                      color: active ? colors.primary : colors.text,
                      fontSize: '14px',
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                      minHeight: '44px',
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Separador */}
        <div style={{ height: '1px', backgroundColor: colors.border }} />

        {/* Frecuencia de conteo */}
        <div style={fieldGroup}>
          <label style={labelStyle}>FRECUENCIA DE CONTEO</label>
          <select
            value={form.countFrequency}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                countFrequency: e.target.value as CountFrequency,
                countDays: [],
              }))
            }
            style={selectStyle}
          >
            <option value="daily">Diario</option>
            <option value="specific_days">Días específicos</option>
          </select>
        </div>

        {form.countFrequency === 'specific_days' && (
          <div style={fieldGroup}>
            <label style={labelStyle}>DÍAS ACTIVOS</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {ALL_DAYS.map((day) => {
                const active = form.countDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: radius.sm,
                      border: `1px solid ${active ? colors.primary : colors.border}`,
                      backgroundColor: active ? colors.primaryLight : colors.surface,
                      color: active ? colors.primary : colors.text,
                      fontSize: fontSize.sm,
                      fontWeight: active ? 600 : 400,
                      cursor: 'pointer',
                      minHeight: '44px',
                    }}
                  >
                    {DAY_OF_WEEK_LABELS[day]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stock mínimo */}
        {!isQualitative && (
          <div style={fieldGroup}>
            <label style={labelStyle}>
              STOCK MÍNIMO{' '}
              <span style={{ color: colors.textMuted, fontWeight: 400, textTransform: 'none' }}>
                (opcional)
              </span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min="0"
                step="any"
                value={form.minStock}
                onChange={(e) => setForm((f) => ({ ...f, minStock: e.target.value }))}
                placeholder="Ej: 10"
                style={inputStyle}
              />
              {form.unitLabel && (
                <span
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: colors.textMuted,
                    pointerEvents: 'none',
                  }}
                >
                  {form.unitLabel}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Separador */}
        <div style={{ height: '1px', backgroundColor: colors.border }} />

        {/* Empaque de compra */}
        {!isQualitative && (
          <div style={fieldGroup}>
            <label style={labelStyle}>
              EMPAQUE DE COMPRA{' '}
              <span style={{ color: colors.textMuted, fontWeight: 400, textTransform: 'none' }}>
                (opcional)
              </span>
            </label>
            <p style={{ margin: 0, fontSize: '12px', color: colors.textMuted, lineHeight: 1.4 }}>
              Define cómo se compra este producto. Permite registrar compras por empaque y calcular
              stock automáticamente.
            </p>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              {/* Nombre del empaque */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={subLabelStyle}>Nombre del empaque</span>
                <input
                  type="text"
                  value={form.packageUnit}
                  onChange={(e) => setForm((f) => ({ ...f, packageUnit: e.target.value }))}
                  placeholder="paquete, galón, caja..."
                  style={inputStyle}
                />
              </div>
              {/* Cantidad */}
              <div style={{ width: '100px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={subLabelStyle}>Cantidad</span>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    value={form.packageSize}
                    onChange={(e) => setForm((f) => ({ ...f, packageSize: e.target.value }))}
                    placeholder="Ej: 20"
                    style={{ ...inputStyle, paddingRight: form.unitLabel ? '36px' : '12px' }}
                  />
                  {form.unitLabel && (
                    <span
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: colors.textMuted,
                        pointerEvents: 'none',
                      }}
                    >
                      {form.unitLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Preview de la conversión */}
            {form.packageUnit.trim() && form.packageSize.trim() && Number(form.packageSize) > 0 && (
              <div
                style={{
                  backgroundColor: colors.surfaceLow,
                  border: `1px solid ${colors.border}`,
                  borderRadius: radius.sm,
                  padding: '10px 14px',
                  fontSize: '13px',
                  color: colors.text,
                }}
              >
                <span style={{ color: colors.textMuted }}>Conversión: </span>
                <strong>
                  1 {form.packageUnit} = {form.packageSize} {form.unitLabel}
                </strong>
              </div>
            )}
          </div>
        )}

        {/* Separador */}
        <div style={{ height: '1px', backgroundColor: colors.border }} />

        {/* Código de barras */}
        <div style={fieldGroup}>
          <label style={labelStyle}>
            CÓDIGO DE BARRAS{' '}
            <span style={{ color: colors.textMuted, fontWeight: 400, textTransform: 'none' }}>
              (opcional)
            </span>
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={form.barcode}
              onChange={(e) => setForm((f) => ({ ...f, barcode: e.target.value }))}
              placeholder="Ej: 7501234567890"
              style={{ ...inputStyle, flex: 1 }}
              inputMode="numeric"
            />
            <BarcodeScannerButton onScan={(code) => setForm((f) => ({ ...f, barcode: code }))} />
          </div>
        </div>

        {/* Usuarios asignados */}
        <div style={fieldGroup}>
          <label style={labelStyle}>
            USUARIOS ASIGNADOS{' '}
            <span style={{ color: colors.textMuted, fontWeight: 400, textTransform: 'none' }}>
              (opcional)
            </span>
          </label>
          <p style={{ margin: 0, fontSize: '12px', color: colors.textMuted, lineHeight: 1.4 }}>
            Sin selección = visible para todos los trabajadores.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {users.map((u) => {
              const checked = form.assignedUserIds.includes(u.id);
              return (
                <label
                  key={u.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: radius.sm,
                    border: `2px solid ${checked ? colors.primary : colors.border}`,
                    backgroundColor: checked ? colors.primaryLight : colors.surface,
                    cursor: 'pointer',
                    minHeight: '52px',
                    boxSizing: 'border-box',
                    transition: `all ${transition.fast}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setForm((f) => ({
                        ...f,
                        assignedUserIds: checked
                          ? f.assignedUserIds.filter((id) => id !== u.id)
                          : [...f.assignedUserIds, u.id],
                      }))
                    }
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: colors.primary,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: fontSize.base,
                        fontWeight: checked ? 700 : 500,
                        color: checked ? colors.primary : colors.text,
                      }}
                    >
                      {u.name}
                    </span>
                    {u.role && (
                      <span
                        style={{
                          fontSize: '11px',
                          color: colors.textMuted,
                          marginLeft: '8px',
                          textTransform: 'capitalize',
                        }}
                      >
                        {u.role}
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
            {users.length === 0 && (
              <p style={{ margin: 0, fontSize: fontSize.sm, color: colors.textMuted }}>
                No hay usuarios registrados.
              </p>
            )}
          </div>
        </div>

        {/* Variantes — solo en modo edición */}
        {isEdit && (
          <>
            <div style={{ height: '1px', backgroundColor: colors.border }} />

            <div style={fieldGroup}>
              <label style={labelStyle}>VARIANTES</label>
              <p style={{ margin: 0, fontSize: '12px', color: colors.textMuted, lineHeight: 1.4 }}>
                Cada variante se cuenta por separado pero su stock se suma al total de este
                producto.
              </p>

              {/* Existing variants */}
              {variants.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {variants.map((v) => (
                    <div
                      key={v.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        backgroundColor: colors.surfaceLow,
                        border: `1px solid ${colors.border}`,
                        borderRadius: radius.sm,
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: fontSize.base,
                          fontWeight: 600,
                          color: colors.text,
                          flex: 1,
                        }}
                      >
                        {v.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteVariant(v.id, v.name)}
                        style={{
                          padding: '6px 8px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: colors.textLight,
                          cursor: 'pointer',
                          minHeight: '36px',
                          minWidth: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: radius.sm,
                          transition: `color ${transition.fast}`,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = colors.danger)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = colors.textLight)}
                        aria-label={`Eliminar ${v.name}`}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add variant */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <input
                  type="text"
                  value={newVariantName}
                  onChange={(e) => setNewVariantName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddVariant();
                    }
                  }}
                  placeholder="Ej: Boing Mango"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleAddVariant}
                  disabled={addingVariant || !newVariantName.trim()}
                  style={{
                    height: '52px',
                    padding: '0 18px',
                    backgroundColor: newVariantName.trim() ? colors.primary : colors.border,
                    color: newVariantName.trim() ? '#fff' : colors.textMuted,
                    border: 'none',
                    borderRadius: radius.sm,
                    fontSize: fontSize.sm,
                    fontWeight: 700,
                    cursor: addingVariant || !newVariantName.trim() ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap',
                    transition: `background-color ${transition.fast}`,
                  }}
                >
                  {addingVariant ? '...' : '+ Agregar'}
                </button>
              </div>

              {variantError && (
                <p
                  style={{
                    margin: 0,
                    fontSize: fontSize.sm,
                    color: colors.danger,
                    backgroundColor: colors.dangerLight,
                    padding: '8px 12px',
                    borderRadius: radius.sm,
                  }}
                >
                  {variantError}
                </p>
              )}
            </div>
          </>
        )}

        {error && (
          <p
            style={{
              margin: 0,
              fontSize: fontSize.sm,
              color: colors.danger,
              backgroundColor: colors.dangerLight,
              padding: '10px 12px',
              borderRadius: radius.sm,
            }}
          >
            {error}
          </p>
        )}

        {/* Acciones */}
        <div style={{ display: 'flex', gap: spacing.sm, paddingBottom: spacing.md }}>
          <button
            type="button"
            onClick={() => navigate('/productos')}
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              borderRadius: radius.sm,
              padding: '14px',
              fontSize: fontSize.md,
              fontWeight: 500,
              cursor: 'pointer',
              minHeight: '52px',
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{
              flex: 2,
              backgroundColor: saving ? colors.border : colors.primary,
              color: saving ? colors.textMuted : '#fff',
              border: 'none',
              borderRadius: radius.sm,
              padding: '14px',
              fontSize: fontSize.md,
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: saving ? 'not-allowed' : 'pointer',
              minHeight: '52px',
              boxShadow: saving ? 'none' : `0 4px 12px ${colors.primary}33`,
            }}
          >
            {saving ? 'Guardando...' : isEdit ? 'GUARDAR CAMBIOS' : 'CREAR PRODUCTO'}
          </button>
        </div>
      </form>
    </Layout>
  );
}

const fieldGroup: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  color: colors.textMuted,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

const subLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: colors.textMuted,
};

const inputStyle: React.CSSProperties = {
  padding: '0 14px',
  border: `1px solid ${colors.border}`,
  borderRadius: radius.sm,
  fontSize: '16px',
  height: '52px',
  boxSizing: 'border-box',
  width: '100%',
  backgroundColor: colors.surfaceLow,
  color: colors.text,
};

const selectStyle: React.CSSProperties = {
  padding: '0 14px',
  border: `1px solid ${colors.border}`,
  borderRadius: radius.sm,
  fontSize: '16px',
  backgroundColor: colors.surfaceLow,
  height: '52px',
  appearance: 'auto',
  width: '100%',
  color: colors.text,
};
