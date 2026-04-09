import { useState } from 'react';
import type { UserResponseDto } from '@tbh/application';
import type { UserRole } from '@tbh/domain';
import { USER_ROLE_LABELS } from '@tbh/domain';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { useUsers } from '../hooks/useUsers';
import { Layout } from '../../../shared/components/Layout';
import { colors, fontSize, radius, spacing, transition } from '../../../shared/theme';

const ROLES: UserRole[] = ['admin', 'encargado', 'trabajador'];

const roleBadgeColors: Record<UserRole, { bg: string; text: string }> = {
  admin: { bg: `${colors.primary}20`, text: colors.primary },
  encargado: { bg: colors.warningLight, text: colors.warning },
  trabajador: { bg: colors.surfaceLow, text: colors.textMuted },
};

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const { users, loading, error, remove, changeRole } = useUsers();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  async function handleDelete(target: UserResponseDto) {
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

  async function handleRoleChange(target: UserResponseDto, role: UserRole) {
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

  return (
    <Layout title="Usuarios">
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        {actionError && (
          <div
            style={{
              backgroundColor: colors.dangerLight,
              color: colors.danger,
              padding: '12px 14px',
              borderRadius: radius.md,
              fontSize: fontSize.sm,
              fontWeight: 500,
            }}
          >
            {actionError}
          </div>
        )}

        {loading && (
          <p style={{ color: colors.textMuted, fontSize: fontSize.base, margin: 0 }}>
            Cargando usuarios...
          </p>
        )}

        {error && !loading && (
          <div
            style={{
              backgroundColor: colors.dangerLight,
              color: colors.danger,
              padding: '12px 14px',
              borderRadius: radius.md,
              fontSize: fontSize.base,
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <p style={{ color: colors.textMuted, fontSize: fontSize.base, margin: 0 }}>
            No hay usuarios registrados.
          </p>
        )}

        {users.map((u) => {
          const isCurrentUser = u.id === currentUser?.id;
          const badge = roleBadgeColors[u.role];
          const isDeleting = deletingId === u.id;
          const isUpdatingRole = updatingRoleId === u.id;

          return (
            <div
              key={u.id}
              style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: radius.md,
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                opacity: isDeleting ? 0.6 : 1,
                transition: `opacity ${transition.base}`,
              }}
            >
              {/* Name + role badge */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: fontSize.md,
                      color: colors.text,
                      textTransform: 'uppercase',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {u.name}
                    {isCurrentUser && (
                      <span
                        style={{
                          marginLeft: '8px',
                          fontSize: fontSize.xs,
                          fontWeight: 600,
                          color: colors.textMuted,
                          textTransform: 'none',
                          letterSpacing: 0,
                        }}
                      >
                        (tú)
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: fontSize.sm,
                      color: colors.textMuted,
                      marginTop: '2px',
                    }}
                  >
                    {u.email}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: badge.text,
                    backgroundColor: badge.bg,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.04em',
                  }}
                >
                  {USER_ROLE_LABELS[u.role]}
                </span>
              </div>

              {/* Role selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  style={{
                    fontSize: fontSize.sm,
                    fontWeight: 600,
                    color: colors.textMuted,
                  }}
                >
                  Rol
                </label>
                <select
                  value={u.role}
                  disabled={isCurrentUser || isUpdatingRole || isDeleting}
                  onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                  style={{
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
                  }}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {USER_ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
                {isUpdatingRole && (
                  <span style={{ fontSize: fontSize.xs, color: colors.textMuted }}>
                    Actualizando rol...
                  </span>
                )}
              </div>

              {/* Delete */}
              {!isCurrentUser && (
                <button
                  onClick={() => handleDelete(u)}
                  disabled={isDeleting || isUpdatingRole}
                  style={{
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
                  }}
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar usuario'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
