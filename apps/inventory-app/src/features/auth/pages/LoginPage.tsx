import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { colors, radius } from '../../../shared/theme';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/inventario');
    } catch {
      setError('Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  }

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
              width: '140px',
              height: '140px',
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              marginBottom: '16px',
              boxShadow: `0 8px 24px ${colors.primary}22`,
              border: `1px solid ${colors.border}`,
              overflow: 'hidden',
            }}
          >
            <img
              src="/isologo.png"
              alt="Trailer Burger Hall"
              style={{ width: '120px', height: '120px', objectFit: 'contain' }}
            />
          </div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 900,
              color: colors.primary,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
          >
            Trailer Burger Hall
          </h1>
          <p style={{ fontSize: '13px', color: colors.textMuted, fontWeight: 500 }}>
            Sistema de Inventario
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
                htmlFor="email"
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: colors.textMuted,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="email"
                placeholder="manager@trailerburger.com"
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
                htmlFor="password"
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: colors.textMuted,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
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
              }}
            >
              {loading ? 'Entrando...' : 'Entrar al Sistema'}
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
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
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
          Inventory System v1.3
        </p>
      </div>
    </div>
  );
}
