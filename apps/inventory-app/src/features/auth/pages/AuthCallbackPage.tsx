import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { authClient } from '../../../shared/di';
import { colors, radius } from '../../../shared/theme';

export function AuthCallbackPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  // Ref persiste entre los dos mounts de StrictMode, a diferencia del estado
  const sessionFound = useRef(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // StrictMode: segundo mount. El ref ya está en true, solo restaurar estado.
    if (sessionFound.current) {
      setReady(true);
      return;
    }

    let alive = true;

    function confirm_session() {
      if (!alive || sessionFound.current) return;
      sessionFound.current = true;
      setReady(true);
    }

    const unsubscribe = authClient.onAuthStateChange((session) => {
      if (session) confirm_session();
    });

    authClient.getSession().then((session) => {
      if (session) confirm_session();
    });

    const timer = setTimeout(() => {
      if (alive && !sessionFound.current) navigate('/login', { replace: true });
    }, 8000);

    return () => {
      alive = false;
      unsubscribe();
      clearTimeout(timer);
    };
  }, [navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setSubmitting(true);
    try {
      await updatePassword(password);
      navigate('/inventario', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar la contraseña');
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready) return null;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100px',
              height: '100px',
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              marginBottom: '16px',
              border: `1px solid ${colors.border}`,
              boxShadow: `0 8px 24px ${colors.primary}33`,
              overflow: 'hidden',
            }}
          >
            <img
              src="/isologo.png"
              alt="Trailer Burger Hall"
              style={{ width: '88px', height: '88px', objectFit: 'contain' }}
            />
          </div>
          <h1
            style={{
              fontSize: '20px',
              fontWeight: 900,
              color: colors.primary,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
          >
            Bienvenido al equipo
          </h1>
          <p style={{ fontSize: '13px', color: colors.textMuted, fontWeight: 500 }}>
            Crea tu contraseña para acceder al sistema
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            width: '100%',
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            padding: '32px 28px',
            boxShadow: '0 4px 24px rgba(80, 60, 40, 0.08)',
            border: `1px solid ${colors.border}`,
          }}
        >
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
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '20px',
              }}
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
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                htmlFor="password"
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: colors.textMuted,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Nueva contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                style={{
                  width: '100%',
                  height: '52px',
                  padding: '0 16px',
                  backgroundColor: colors.surfaceLow,
                  border: '2px solid transparent',
                  borderRadius: radius.md,
                  fontSize: '16px',
                  color: colors.text,
                  fontWeight: 500,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                htmlFor="confirm"
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: colors.textMuted,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Confirmar contraseña
              </label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Repite tu contraseña"
                style={{
                  width: '100%',
                  height: '52px',
                  padding: '0 16px',
                  backgroundColor: colors.surfaceLow,
                  border: '2px solid transparent',
                  borderRadius: radius.md,
                  fontSize: '16px',
                  color: colors.text,
                  fontWeight: 500,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                height: '52px',
                backgroundColor: submitting ? colors.textLight : colors.primary,
                color: '#fff',
                border: 'none',
                borderRadius: radius.md,
                fontSize: '15px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: submitting ? 'none' : `0 4px 16px ${colors.primary}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {submitting ? 'Guardando...' : 'Crear contraseña'}
              {!submitting && (
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
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              )}
            </button>
          </form>
        </div>

        <p
          style={{
            marginTop: '32px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            color: colors.textLight,
            textTransform: 'uppercase',
          }}
        >
          Inventory System v1.2
        </p>
      </div>
    </div>
  );
}
