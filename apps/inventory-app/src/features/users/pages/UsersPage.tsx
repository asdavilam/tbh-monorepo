import { useState, type FormEvent } from 'react';
import type { UserResponseDto } from '@tbh/application';
import type { UserRole } from '@tbh/domain';
import { USER_ROLE_LABELS } from '@tbh/domain';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { useUsers } from '../hooks/useUsers';
import { Layout } from '../../../shared/components/Layout';
import { colors, fontSize, radius, spacing, transition } from '../../../shared/theme';
import { inviteUser } from '../../../shared/di';

const ROLES: UserRole[] = ['admin', 'encargado', 'trabajador'];

const roleBadgeColors: Record<UserRole, { bg: string; text: string }> = {
  admin: { bg: `${colors.primary}20`, text: colors.primary },
  encargado: { bg: colors.warningLight, text: colors.warning },
  trabajador: { bg: colors.surfaceLow, text: colors.textMuted },
};

function InviteModal({
  onClose,
  onSuccess,
  currentUserId,
}: {
  onClose: () => void;
  onSuccess: (email: string) => void;
  currentUserId: string;
}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('trabajador');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await inviteUser.execute(currentUserId, email, name, role);
      onSuccess(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar la invitación');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 100,
        padding: '0',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: colors.surface,
          borderRadius: `${radius.lg} ${radius.lg} 0 0`,
          padding: '28px 24px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: fontSize.lg, fontWeight: 800, color: colors.text }}>
              Invitar usuario
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: fontSize.sm, color: colors.textMuted }}>
              Se enviará un email con el link de acceso
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: colors.textMuted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '44px',
              minHeight: '44px',
            }}
            aria-label="Cerrar"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: colors.dangerLight,
              color: colors.danger,
              padding: '12px 14px',
              borderRadius: radius.md,
              fontSize: fontSize.sm,
              fontWeight: 500,
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {/* Nombre */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="invite-name"
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: colors.textMuted,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Nombre
            </label>
            <input
              id="invite-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              placeholder="Nombre del empleado"
              style={{
                width: '100%',
                height: '52px',
                padding: '0 14px',
                backgroundColor: colors.surfaceLow,
                border: `1px solid ${colors.border}`,
                borderRadius: radius.md,
                fontSize: '16px',
                color: colors.text,
                fontWeight: 500,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="invite-email"
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: colors.textMuted,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Correo electrónico
            </label>
            <input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              placeholder="empleado@correo.com"
              style={{
                width: '100%',
                height: '52px',
                padding: '0 14px',
                backgroundColor: colors.surfaceLow,
                border: `1px solid ${colors.border}`,
                borderRadius: radius.md,
                fontSize: '16px',
                color: colors.text,
                fontWeight: 500,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Rol */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="invite-role"
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: colors.textMuted,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Rol
            </label>
            <select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              style={{
                width: '100%',
                height: '52px',
                padding: '0 14px',
                backgroundColor: colors.surfaceLow,
                border: `1px solid ${colors.border}`,
                borderRadius: radius.md,
                fontSize: '16px',
                color: colors.text,
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {USER_ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '52px',
              backgroundColor: loading ? colors.textLight : colors.primary,
              color: '#fff',
              border: 'none',
              borderRadius: radius.md,
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : `0 4px 16px ${colors.primary}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '4px',
            }}
          >
            {loading ? 'Enviando invitación...' : 'Enviar invitación'}
            {!loading && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function SuccessBanner({ email, onClose }: { email: string; onClose: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        backgroundColor: colors.successLight ?? '#f0fdf4',
        color: colors.success ?? '#16a34a',
        padding: '14px 16px',
        borderRadius: radius.md,
        fontSize: fontSize.sm,
        fontWeight: 500,
        border: `1px solid ${colors.success ?? '#16a34a'}33`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Invitación enviada a {email}
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          color: 'inherit',
          display: 'flex',
        }}
        aria-label="Cerrar"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const { users, loading, error, remove, changeRole } = useUsers();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState('');

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

  function handleInviteSuccess(email: string) {
    setShowInviteModal(false);
    setInvitedEmail(email);
  }

  return (
    <Layout title="Usuarios">
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        {/* Botón invitar */}
        <button
          onClick={() => {
            setInvitedEmail('');
            setShowInviteModal(true);
          }}
          style={{
            width: '100%',
            height: '52px',
            backgroundColor: colors.primary,
            color: '#fff',
            border: 'none',
            borderRadius: radius.md,
            fontSize: fontSize.md,
            fontWeight: 700,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            boxShadow: `0 4px 16px ${colors.primary}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
          Invitar usuario
        </button>

        {/* Banner de éxito */}
        {invitedEmail && <SuccessBanner email={invitedEmail} onClose={() => setInvitedEmail('')} />}

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

      {/* Modal de invitación */}
      {showInviteModal && currentUser && (
        <InviteModal
          currentUserId={currentUser.id}
          onClose={() => setShowInviteModal(false)}
          onSuccess={handleInviteSuccess}
        />
      )}
    </Layout>
  );
}
