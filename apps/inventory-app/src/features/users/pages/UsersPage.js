import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { USER_ROLE_LABELS } from '@tbh/domain';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { useUsers } from '../hooks/useUsers';
import { Layout } from '../../../shared/components/Layout';
import { colors, fontSize, radius, spacing, transition } from '../../../shared/theme';
const ROLES = ['admin', 'encargado', 'trabajador'];
const roleBadgeColors = {
  admin: { bg: `${colors.primary}20`, text: colors.primary },
  encargado: { bg: colors.warningLight, text: colors.warning },
  trabajador: { bg: colors.surfaceLow, text: colors.textMuted },
};
export function UsersPage() {
  const { user: currentUser } = useAuth();
  const { users, loading, error, remove, changeRole } = useUsers();
  const [deletingId, setDeletingId] = useState(null);
  const [updatingRoleId, setUpdatingRoleId] = useState(null);
  const [actionError, setActionError] = useState('');
  async function handleDelete(target) {
    if (!window.confirm(`¿Eliminar a "${target.name}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(target.id);
    setActionError('');
    try {
      await remove(target.id);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'No se pudo eliminar el usuario');
    } finally {
      setDeletingId(null);
    }
  }
  async function handleRoleChange(target, role) {
    if (role === target.role) return;
    setUpdatingRoleId(target.id);
    setActionError('');
    try {
      await changeRole(target.id, role);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'No se pudo cambiar el rol');
    } finally {
      setUpdatingRoleId(null);
    }
  }
  return _jsx(Layout, {
    title: 'Usuarios',
    children: _jsxs('div', {
      style: { display: 'flex', flexDirection: 'column', gap: spacing.md },
      children: [
        actionError &&
          _jsx('div', {
            style: {
              backgroundColor: colors.dangerLight,
              color: colors.danger,
              padding: '12px 14px',
              borderRadius: radius.md,
              fontSize: fontSize.sm,
              fontWeight: 500,
            },
            children: actionError,
          }),
        loading &&
          _jsx('p', {
            style: { color: colors.textMuted, fontSize: fontSize.base, margin: 0 },
            children: 'Cargando usuarios...',
          }),
        error &&
          !loading &&
          _jsx('div', {
            style: {
              backgroundColor: colors.dangerLight,
              color: colors.danger,
              padding: '12px 14px',
              borderRadius: radius.md,
              fontSize: fontSize.base,
              fontWeight: 500,
            },
            children: error,
          }),
        !loading &&
          !error &&
          users.length === 0 &&
          _jsx('p', {
            style: { color: colors.textMuted, fontSize: fontSize.base, margin: 0 },
            children: 'No hay usuarios registrados.',
          }),
        users.map((u) => {
          const isCurrentUser = u.id === currentUser?.id;
          const badge = roleBadgeColors[u.role];
          const isDeleting = deletingId === u.id;
          const isUpdatingRole = updatingRoleId === u.id;
          return _jsxs(
            'div',
            {
              style: {
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: radius.md,
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                opacity: isDeleting ? 0.6 : 1,
                transition: `opacity ${transition.base}`,
              },
              children: [
                _jsxs('div', {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '8px',
                  },
                  children: [
                    _jsxs('div', {
                      style: { flex: 1 },
                      children: [
                        _jsxs('div', {
                          style: {
                            fontWeight: 700,
                            fontSize: fontSize.md,
                            color: colors.text,
                            textTransform: 'uppercase',
                            letterSpacing: '-0.01em',
                          },
                          children: [
                            u.name,
                            isCurrentUser &&
                              _jsx('span', {
                                style: {
                                  marginLeft: '8px',
                                  fontSize: fontSize.xs,
                                  fontWeight: 600,
                                  color: colors.textMuted,
                                  textTransform: 'none',
                                  letterSpacing: 0,
                                },
                                children: '(t\u00FA)',
                              }),
                          ],
                        }),
                        _jsx('div', {
                          style: {
                            fontSize: fontSize.sm,
                            color: colors.textMuted,
                            marginTop: '2px',
                          },
                          children: u.email,
                        }),
                      ],
                    }),
                    _jsx('span', {
                      style: {
                        fontSize: '11px',
                        fontWeight: 700,
                        color: badge.text,
                        backgroundColor: badge.bg,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.04em',
                      },
                      children: USER_ROLE_LABELS[u.role],
                    }),
                  ],
                }),
                _jsxs('div', {
                  style: { display: 'flex', flexDirection: 'column', gap: '6px' },
                  children: [
                    _jsx('label', {
                      style: {
                        fontSize: fontSize.sm,
                        fontWeight: 600,
                        color: colors.textMuted,
                      },
                      children: 'Rol',
                    }),
                    _jsx('select', {
                      value: u.role,
                      disabled: isCurrentUser || isUpdatingRole || isDeleting,
                      onChange: (e) => handleRoleChange(u, e.target.value),
                      style: {
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: radius.sm,
                        border: `1px solid ${colors.border}`,
                        backgroundColor: colors.surfaceLow,
                        color: colors.text,
                        fontSize: fontSize.base,
                        fontWeight: 500,
                        cursor: isCurrentUser ? 'not-allowed' : 'pointer',
                        minHeight: '44px',
                        opacity: isCurrentUser ? 0.6 : 1,
                      },
                      children: ROLES.map((r) =>
                        _jsx('option', { value: r, children: USER_ROLE_LABELS[r] }, r)
                      ),
                    }),
                    isUpdatingRole &&
                      _jsx('span', {
                        style: { fontSize: fontSize.xs, color: colors.textMuted },
                        children: 'Actualizando rol...',
                      }),
                  ],
                }),
                !isCurrentUser &&
                  _jsx('button', {
                    onClick: () => handleDelete(u),
                    disabled: isDeleting || isUpdatingRole,
                    style: {
                      width: '100%',
                      backgroundColor: colors.dangerLight,
                      color: colors.danger,
                      border: `1px solid ${colors.danger}44`,
                      borderRadius: radius.sm,
                      padding: '10px',
                      fontSize: fontSize.sm,
                      fontWeight: 700,
                      cursor: isDeleting || isUpdatingRole ? 'not-allowed' : 'pointer',
                      minHeight: '44px',
                      letterSpacing: '0.04em',
                      transition: `opacity ${transition.fast}`,
                    },
                    children: isDeleting ? 'Eliminando...' : 'Eliminar usuario',
                  }),
              ],
            },
            u.id
          );
        }),
      ],
    }),
  });
}
