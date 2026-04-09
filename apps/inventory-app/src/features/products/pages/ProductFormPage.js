import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PRODUCT_TYPE_LABELS, UNIT_TYPE_LABELS, DAY_OF_WEEK_LABELS } from '@tbh/domain';
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
const PRODUCT_TYPES = ['raw_material', 'disposable', 'basic'];
const UNIT_TYPES = ['unit', 'fraction', 'qualitative'];
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const UNIT_LABEL_OPTIONS = {
  unit: ['pz', 'bolsa', 'caja', 'lata', 'sobre', 'rollo'],
  fraction: ['g', 'kg', 'ml', 'l'],
  qualitative: [],
};
const EMPTY_FORM = {
  name: '',
  type: 'raw_material',
  unitType: 'unit',
  unitLabel: 'pz',
  countFrequency: 'daily',
  countDays: [],
  minStock: '',
  assignedUserId: '',
  packageUnit: '',
  packageSize: '',
  barcode: '',
};
export function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  // Variants state (edit mode only)
  const [variants, setVariants] = useState([]);
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
          assignedUserId: product.assignedUserId ?? '',
          packageUnit: product.packageUnit ?? '',
          packageSize: product.packageSize !== null ? String(product.packageSize) : '',
          barcode: product.barcode ?? '',
        });
        // Load existing variants
        setVariants(products.filter((p) => p.parentProductId === id));
      })
      .catch(() => setError('No se pudo cargar el producto'))
      .finally(() => setLoading(false));
  }, [isEdit, id, user?.id]);
  function handleUnitTypeChange(unitType) {
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
  function toggleDay(day) {
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
        assignedUserId: form.assignedUserId || null,
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
  async function handleDeleteVariant(variantId, variantName) {
    if (!user) return;
    if (!window.confirm(`¿Eliminar variante "${variantName}"?`)) return;
    try {
      await deleteProduct.execute(user.id, variantId);
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
    } catch (e) {
      setVariantError(e instanceof Error ? e.message : 'No se pudo eliminar la variante');
    }
  }
  async function handleSubmit(e) {
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
          assignedUserId: form.assignedUserId || null,
          packageUnit: form.packageUnit || null,
          packageSize: packageSizeValue,
          barcode: form.barcode || null,
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
          packageUnit: form.packageUnit || null,
          packageSize: packageSizeValue,
          barcode: form.barcode || null,
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
    return _jsx(Layout, {
      title: isEdit ? 'Editar producto' : 'Nuevo producto',
      children: _jsx('p', {
        style: { color: colors.textMuted, fontSize: fontSize.base },
        children: 'Cargando...',
      }),
    });
  }
  const labelOptions = UNIT_LABEL_OPTIONS[form.unitType];
  const isQualitative = form.unitType === 'qualitative';
  return _jsx(Layout, {
    title: isEdit ? 'Editar producto' : 'Nuevo producto',
    children: _jsxs('form', {
      onSubmit: handleSubmit,
      style: { display: 'flex', flexDirection: 'column', gap: '20px' },
      children: [
        _jsxs('div', {
          style: fieldGroup,
          children: [
            _jsx('label', { style: labelStyle, children: 'NOMBRE' }),
            _jsx('input', {
              type: 'text',
              value: form.name,
              onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
              required: true,
              placeholder: 'Ej: Carne de res',
              style: inputStyle,
            }),
          ],
        }),
        _jsxs('div', {
          style: fieldGroup,
          children: [
            _jsx('label', { style: labelStyle, children: 'TIPO DE PRODUCTO' }),
            _jsx('select', {
              value: form.type,
              onChange: (e) => setForm((f) => ({ ...f, type: e.target.value })),
              style: selectStyle,
              children: PRODUCT_TYPES.map((t) =>
                _jsx('option', { value: t, children: PRODUCT_TYPE_LABELS[t] }, t)
              ),
            }),
          ],
        }),
        _jsxs('div', {
          style: fieldGroup,
          children: [
            _jsx('label', { style: labelStyle, children: 'TIPO DE UNIDAD' }),
            _jsx('div', {
              style: {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '8px',
              },
              children: UNIT_TYPES.map((u) => {
                const active = form.unitType === u;
                return _jsx(
                  'button',
                  {
                    type: 'button',
                    onClick: () => handleUnitTypeChange(u),
                    style: {
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
                    },
                    children: UNIT_TYPE_LABELS[u],
                  },
                  u
                );
              }),
            }),
            _jsxs('p', {
              style: { margin: 0, fontSize: '12px', color: colors.textMuted, lineHeight: 1.4 },
              children: [
                form.unitType === 'unit' && 'Conteo por piezas completas: bolsas, latas, cajas...',
                form.unitType === 'fraction' && 'Conteo por cantidad: gramos, litros, kilos...',
                form.unitType === 'qualitative' && 'Conteo por percepción: mucho / poco / nada',
              ],
            }),
          ],
        }),
        !isQualitative &&
          _jsxs('div', {
            style: fieldGroup,
            children: [
              _jsx('label', { style: labelStyle, children: 'ETIQUETA DE UNIDAD' }),
              _jsx('div', {
                style: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
                children: labelOptions.map((opt) => {
                  const active = form.unitLabel === opt;
                  return _jsx(
                    'button',
                    {
                      type: 'button',
                      onClick: () => setForm((f) => ({ ...f, unitLabel: opt })),
                      style: {
                        padding: '8px 16px',
                        borderRadius: '999px',
                        border: `2px solid ${active ? colors.primary : colors.border}`,
                        backgroundColor: active ? colors.primaryLight : colors.surface,
                        color: active ? colors.primary : colors.text,
                        fontSize: '14px',
                        fontWeight: active ? 700 : 500,
                        cursor: 'pointer',
                        minHeight: '44px',
                      },
                      children: opt,
                    },
                    opt
                  );
                }),
              }),
            ],
          }),
        _jsx('div', { style: { height: '1px', backgroundColor: colors.border } }),
        _jsxs('div', {
          style: fieldGroup,
          children: [
            _jsx('label', { style: labelStyle, children: 'FRECUENCIA DE CONTEO' }),
            _jsxs('select', {
              value: form.countFrequency,
              onChange: (e) =>
                setForm((f) => ({
                  ...f,
                  countFrequency: e.target.value,
                  countDays: [],
                })),
              style: selectStyle,
              children: [
                _jsx('option', { value: 'daily', children: 'Diario' }),
                _jsx('option', { value: 'specific_days', children: 'D\u00EDas espec\u00EDficos' }),
              ],
            }),
          ],
        }),
        form.countFrequency === 'specific_days' &&
          _jsxs('div', {
            style: fieldGroup,
            children: [
              _jsx('label', { style: labelStyle, children: 'D\u00CDAS ACTIVOS' }),
              _jsx('div', {
                style: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
                children: ALL_DAYS.map((day) => {
                  const active = form.countDays.includes(day);
                  return _jsx(
                    'button',
                    {
                      type: 'button',
                      onClick: () => toggleDay(day),
                      style: {
                        padding: '8px 12px',
                        borderRadius: radius.sm,
                        border: `1px solid ${active ? colors.primary : colors.border}`,
                        backgroundColor: active ? colors.primaryLight : colors.surface,
                        color: active ? colors.primary : colors.text,
                        fontSize: fontSize.sm,
                        fontWeight: active ? 600 : 400,
                        cursor: 'pointer',
                        minHeight: '44px',
                      },
                      children: DAY_OF_WEEK_LABELS[day],
                    },
                    day
                  );
                }),
              }),
            ],
          }),
        !isQualitative &&
          _jsxs('div', {
            style: fieldGroup,
            children: [
              _jsxs('label', {
                style: labelStyle,
                children: [
                  'STOCK M\u00CDNIMO',
                  ' ',
                  _jsx('span', {
                    style: { color: colors.textMuted, fontWeight: 400, textTransform: 'none' },
                    children: '(opcional)',
                  }),
                ],
              }),
              _jsxs('div', {
                style: { position: 'relative' },
                children: [
                  _jsx('input', {
                    type: 'number',
                    min: '0',
                    step: 'any',
                    value: form.minStock,
                    onChange: (e) => setForm((f) => ({ ...f, minStock: e.target.value })),
                    placeholder: 'Ej: 10',
                    style: inputStyle,
                  }),
                  form.unitLabel &&
                    _jsx('span', {
                      style: {
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: colors.textMuted,
                        pointerEvents: 'none',
                      },
                      children: form.unitLabel,
                    }),
                ],
              }),
            ],
          }),
        _jsx('div', { style: { height: '1px', backgroundColor: colors.border } }),
        !isQualitative &&
          _jsxs('div', {
            style: fieldGroup,
            children: [
              _jsxs('label', {
                style: labelStyle,
                children: [
                  'EMPAQUE DE COMPRA',
                  ' ',
                  _jsx('span', {
                    style: { color: colors.textMuted, fontWeight: 400, textTransform: 'none' },
                    children: '(opcional)',
                  }),
                ],
              }),
              _jsx('p', {
                style: { margin: 0, fontSize: '12px', color: colors.textMuted, lineHeight: 1.4 },
                children:
                  'Define c\u00F3mo se compra este producto. Permite registrar compras por empaque y calcular stock autom\u00E1ticamente.',
              }),
              _jsxs('div', {
                style: { display: 'flex', gap: '10px', alignItems: 'flex-end' },
                children: [
                  _jsxs('div', {
                    style: { flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' },
                    children: [
                      _jsx('span', { style: subLabelStyle, children: 'Nombre del empaque' }),
                      _jsx('input', {
                        type: 'text',
                        value: form.packageUnit,
                        onChange: (e) => setForm((f) => ({ ...f, packageUnit: e.target.value })),
                        placeholder: 'paquete, gal\u00F3n, caja...',
                        style: inputStyle,
                      }),
                    ],
                  }),
                  _jsxs('div', {
                    style: { width: '100px', display: 'flex', flexDirection: 'column', gap: '6px' },
                    children: [
                      _jsx('span', { style: subLabelStyle, children: 'Cantidad' }),
                      _jsxs('div', {
                        style: { position: 'relative' },
                        children: [
                          _jsx('input', {
                            type: 'number',
                            min: '0.01',
                            step: 'any',
                            value: form.packageSize,
                            onChange: (e) =>
                              setForm((f) => ({ ...f, packageSize: e.target.value })),
                            placeholder: 'Ej: 20',
                            style: {
                              ...inputStyle,
                              paddingRight: form.unitLabel ? '36px' : '12px',
                            },
                          }),
                          form.unitLabel &&
                            _jsx('span', {
                              style: {
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: colors.textMuted,
                                pointerEvents: 'none',
                              },
                              children: form.unitLabel,
                            }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              form.packageUnit.trim() &&
                form.packageSize.trim() &&
                Number(form.packageSize) > 0 &&
                _jsxs('div', {
                  style: {
                    backgroundColor: colors.surfaceLow,
                    border: `1px solid ${colors.border}`,
                    borderRadius: radius.sm,
                    padding: '10px 14px',
                    fontSize: '13px',
                    color: colors.text,
                  },
                  children: [
                    _jsx('span', {
                      style: { color: colors.textMuted },
                      children: 'Conversi\u00F3n: ',
                    }),
                    _jsxs('strong', {
                      children: [
                        '1 ',
                        form.packageUnit,
                        ' = ',
                        form.packageSize,
                        ' ',
                        form.unitLabel,
                      ],
                    }),
                  ],
                }),
            ],
          }),
        _jsx('div', { style: { height: '1px', backgroundColor: colors.border } }),
        _jsxs('div', {
          style: fieldGroup,
          children: [
            _jsxs('label', {
              style: labelStyle,
              children: [
                'C\u00D3DIGO DE BARRAS',
                ' ',
                _jsx('span', {
                  style: { color: colors.textMuted, fontWeight: 400, textTransform: 'none' },
                  children: '(opcional)',
                }),
              ],
            }),
            _jsxs('div', {
              style: { display: 'flex', gap: '8px' },
              children: [
                _jsx('input', {
                  type: 'text',
                  value: form.barcode,
                  onChange: (e) => setForm((f) => ({ ...f, barcode: e.target.value })),
                  placeholder: 'Ej: 7501234567890',
                  style: { ...inputStyle, flex: 1 },
                  inputMode: 'numeric',
                }),
                _jsx(BarcodeScannerButton, {
                  onScan: (code) => setForm((f) => ({ ...f, barcode: code })),
                }),
              ],
            }),
          ],
        }),
        _jsxs('div', {
          style: fieldGroup,
          children: [
            _jsxs('label', {
              style: labelStyle,
              children: [
                'USUARIO ASIGNADO',
                ' ',
                _jsx('span', {
                  style: { color: colors.textMuted, fontWeight: 400, textTransform: 'none' },
                  children: '(opcional)',
                }),
              ],
            }),
            _jsxs('select', {
              value: form.assignedUserId,
              onChange: (e) => setForm((f) => ({ ...f, assignedUserId: e.target.value })),
              style: selectStyle,
              children: [
                _jsx('option', { value: '', children: 'Sin asignar \u2014 visible para todos' }),
                users.map((u) => _jsx('option', { value: u.id, children: u.name }, u.id)),
              ],
            }),
          ],
        }),
        isEdit &&
          _jsxs(_Fragment, {
            children: [
              _jsx('div', { style: { height: '1px', backgroundColor: colors.border } }),
              _jsxs('div', {
                style: fieldGroup,
                children: [
                  _jsx('label', { style: labelStyle, children: 'VARIANTES' }),
                  _jsx('p', {
                    style: {
                      margin: 0,
                      fontSize: '12px',
                      color: colors.textMuted,
                      lineHeight: 1.4,
                    },
                    children:
                      'Cada variante se cuenta por separado pero su stock se suma al total de este producto.',
                  }),
                  variants.length > 0 &&
                    _jsx('div', {
                      style: { display: 'flex', flexDirection: 'column', gap: '6px' },
                      children: variants.map((v) =>
                        _jsxs(
                          'div',
                          {
                            style: {
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 14px',
                              backgroundColor: colors.surfaceLow,
                              border: `1px solid ${colors.border}`,
                              borderRadius: radius.sm,
                              gap: '8px',
                            },
                            children: [
                              _jsx('span', {
                                style: {
                                  fontSize: fontSize.base,
                                  fontWeight: 600,
                                  color: colors.text,
                                  flex: 1,
                                },
                                children: v.name,
                              }),
                              _jsx('button', {
                                type: 'button',
                                onClick: () => handleDeleteVariant(v.id, v.name),
                                style: {
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
                                },
                                onMouseEnter: (e) => (e.currentTarget.style.color = colors.danger),
                                onMouseLeave: (e) =>
                                  (e.currentTarget.style.color = colors.textLight),
                                'aria-label': `Eliminar ${v.name}`,
                                children: _jsxs('svg', {
                                  width: '16',
                                  height: '16',
                                  viewBox: '0 0 24 24',
                                  fill: 'none',
                                  stroke: 'currentColor',
                                  strokeWidth: '2',
                                  strokeLinecap: 'round',
                                  strokeLinejoin: 'round',
                                  'aria-hidden': 'true',
                                  children: [
                                    _jsx('polyline', { points: '3 6 5 6 21 6' }),
                                    _jsx('path', {
                                      d: 'M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6',
                                    }),
                                    _jsx('path', { d: 'M10 11v6M14 11v6' }),
                                    _jsx('path', { d: 'M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2' }),
                                  ],
                                }),
                              }),
                            ],
                          },
                          v.id
                        )
                      ),
                    }),
                  _jsxs('div', {
                    style: { display: 'flex', gap: '8px', alignItems: 'flex-end' },
                    children: [
                      _jsx('input', {
                        type: 'text',
                        value: newVariantName,
                        onChange: (e) => setNewVariantName(e.target.value),
                        onKeyDown: (e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddVariant();
                          }
                        },
                        placeholder: 'Ej: Boing Mango',
                        style: { ...inputStyle, flex: 1 },
                      }),
                      _jsx('button', {
                        type: 'button',
                        onClick: handleAddVariant,
                        disabled: addingVariant || !newVariantName.trim(),
                        style: {
                          height: '52px',
                          padding: '0 18px',
                          backgroundColor: newVariantName.trim() ? colors.primary : colors.border,
                          color: newVariantName.trim() ? '#fff' : colors.textMuted,
                          border: 'none',
                          borderRadius: radius.sm,
                          fontSize: fontSize.sm,
                          fontWeight: 700,
                          cursor:
                            addingVariant || !newVariantName.trim() ? 'not-allowed' : 'pointer',
                          whiteSpace: 'nowrap',
                          transition: `background-color ${transition.fast}`,
                        },
                        children: addingVariant ? '...' : '+ Agregar',
                      }),
                    ],
                  }),
                  variantError &&
                    _jsx('p', {
                      style: {
                        margin: 0,
                        fontSize: fontSize.sm,
                        color: colors.danger,
                        backgroundColor: colors.dangerLight,
                        padding: '8px 12px',
                        borderRadius: radius.sm,
                      },
                      children: variantError,
                    }),
                ],
              }),
            ],
          }),
        error &&
          _jsx('p', {
            style: {
              margin: 0,
              fontSize: fontSize.sm,
              color: colors.danger,
              backgroundColor: colors.dangerLight,
              padding: '10px 12px',
              borderRadius: radius.sm,
            },
            children: error,
          }),
        _jsxs('div', {
          style: { display: 'flex', gap: spacing.sm, paddingBottom: spacing.md },
          children: [
            _jsx('button', {
              type: 'button',
              onClick: () => navigate('/productos'),
              style: {
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
              },
              children: 'Cancelar',
            }),
            _jsx('button', {
              type: 'submit',
              disabled: saving,
              style: {
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
              },
              children: saving ? 'Guardando...' : isEdit ? 'GUARDAR CAMBIOS' : 'CREAR PRODUCTO',
            }),
          ],
        }),
      ],
    }),
  });
}
const fieldGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};
const labelStyle = {
  fontSize: '10px',
  fontWeight: 700,
  color: colors.textMuted,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};
const subLabelStyle = {
  fontSize: '11px',
  fontWeight: 600,
  color: colors.textMuted,
};
const inputStyle = {
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
const selectStyle = {
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
