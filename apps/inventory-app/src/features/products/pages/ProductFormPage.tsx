import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ProductType, UnitType, CountFrequency, DayOfWeek } from '@tbh/domain';
import { PRODUCT_TYPE_LABELS, UNIT_TYPE_LABELS, DAY_OF_WEEK_LABELS } from '@tbh/domain';
import type { UserResponseDto } from '@tbh/application';
import { createProduct, updateProduct, getAllProducts, getAllUsers } from '../../../shared/di';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { Layout } from '../../../shared/components/Layout';
import { colors, fontSize, radius, spacing } from '../../../shared/theme';

const PRODUCT_TYPES: ProductType[] = ['raw_material', 'disposable', 'basic'];
const UNIT_TYPES: UnitType[] = ['unit', 'fraction', 'qualitative'];
const ALL_DAYS: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];

interface FormState {
  name: string;
  type: ProductType;
  unitType: UnitType;
  unitLabel: string;
  countFrequency: CountFrequency;
  countDays: DayOfWeek[];
  minStock: string;
  assignedUserId: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  type: 'raw_material',
  unitType: 'unit',
  unitLabel: 'pz',
  countFrequency: 'daily',
  countDays: [],
  minStock: '',
  assignedUserId: '',
};

const UNIT_LABEL_SUGGESTIONS: Record<UnitType, string> = {
  unit: 'pz',
  fraction: 'g',
  qualitative: '—',
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

  // Cargar usuarios para el selector de asignación
  useEffect(() => {
    if (!user) return;
    getAllUsers
      .execute(user.id)
      .then(setUsers)
      .catch(() => setUsers([]));
  }, [user?.id]);

  // En modo edición, cargar datos del producto
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
          assignedUserId: product.assignedUserId ?? '',
        });
      })
      .catch(() => setError('No se pudo cargar el producto'))
      .finally(() => setLoading(false));
  }, [isEdit, id, user?.id]);

  function handleUnitTypeChange(unitType: UnitType) {
    setForm((prev) => ({
      ...prev,
      unitType,
      unitLabel: UNIT_LABEL_SUGGESTIONS[unitType],
      // Qualitative no tiene stock mínimo
      minStock: unitType === 'qualitative' ? '' : prev.minStock,
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

    const minStockValue =
      form.unitType !== 'qualitative' && form.minStock !== '' ? Number(form.minStock) : null;

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
          assignedUserId: form.assignedUserId || null,
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
          assignedUserId: form.assignedUserId || null,
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

  return (
    <Layout title={isEdit ? 'Editar producto' : 'Nuevo producto'}>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}
      >
        {/* Nombre */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={labelStyle}>Nombre</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            placeholder="Ej: Carne de res"
            style={inputStyle}
          />
        </div>

        {/* Tipo de producto */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={labelStyle}>Tipo</label>
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

        {/* Tipo de unidad */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={labelStyle}>Tipo de unidad</label>
          <select
            value={form.unitType}
            onChange={(e) => handleUnitTypeChange(e.target.value as UnitType)}
            style={selectStyle}
          >
            {UNIT_TYPES.map((u) => (
              <option key={u} value={u}>
                {UNIT_TYPE_LABELS[u]}
              </option>
            ))}
          </select>
        </div>

        {/* Etiqueta de unidad (no aplica para cualitativo) */}
        {form.unitType !== 'qualitative' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={labelStyle}>Etiqueta de unidad</label>
            <input
              type="text"
              value={form.unitLabel}
              onChange={(e) => setForm((f) => ({ ...f, unitLabel: e.target.value }))}
              required
              placeholder="Ej: pz, kg, l"
              style={inputStyle}
            />
          </div>
        )}

        {/* Frecuencia de conteo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={labelStyle}>Frecuencia de conteo</label>
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

        {/* Días específicos */}
        {form.countFrequency === 'specific_days' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={labelStyle}>Días activos</label>
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

        {/* Stock mínimo (no aplica para cualitativo) */}
        {form.unitType !== 'qualitative' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={labelStyle}>
              Stock mínimo{' '}
              <span style={{ color: colors.textMuted, fontWeight: 400 }}>(opcional)</span>
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={form.minStock}
              onChange={(e) => setForm((f) => ({ ...f, minStock: e.target.value }))}
              placeholder="Ej: 10"
              style={inputStyle}
            />
          </div>
        )}

        {/* Usuario asignado */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={labelStyle}>
            Usuario asignado{' '}
            <span style={{ color: colors.textMuted, fontWeight: 400 }}>(opcional)</span>
          </label>
          <select
            value={form.assignedUserId}
            onChange={(e) => setForm((f) => ({ ...f, assignedUserId: e.target.value }))}
            style={selectStyle}
          >
            <option value="">Sin asignar (visible para todos)</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

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
        <div style={{ display: 'flex', gap: spacing.sm }}>
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
              minHeight: '44px',
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
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              minHeight: '44px',
            }}
          >
            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>
      </form>
    </Layout>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 500,
  color: colors.text,
};

const inputStyle: React.CSSProperties = {
  padding: '12px',
  border: `1px solid ${colors.border}`,
  borderRadius: radius.sm,
  fontSize: '16px',
  minHeight: '44px',
  boxSizing: 'border-box',
  width: '100%',
};

const selectStyle: React.CSSProperties = {
  padding: '12px',
  border: `1px solid ${colors.border}`,
  borderRadius: radius.sm,
  fontSize: '16px',
  backgroundColor: colors.surface,
  minHeight: '44px',
  appearance: 'auto',
  width: '100%',
};
