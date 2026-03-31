import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { colors, fontSize, radius, spacing } from '../../../shared/theme';

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
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
      }}
    >
      <div
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          padding: '32px 24px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <h1
          style={{
            fontSize: fontSize['2xl'],
            fontWeight: 800,
            color: colors.text,
            marginBottom: '4px',
          }}
        >
          TBH
        </h1>
        <p style={{ fontSize: fontSize.base, color: colors.textMuted, marginBottom: '32px' }}>
          Sistema de inventario
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="email"
              style={{ fontSize: fontSize.base, fontWeight: 500, color: colors.text }}
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="usuario@ejemplo.com"
              style={{
                padding: '12px',
                border: `1px solid ${colors.border}`,
                borderRadius: radius.sm,
                fontSize: '16px', // 16px para evitar zoom en iOS
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="password"
              style={{ fontSize: fontSize.base, fontWeight: 500, color: colors.text }}
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
                padding: '12px',
                border: `1px solid ${colors.border}`,
                borderRadius: radius.sm,
                fontSize: '16px',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p
              style={{
                fontSize: fontSize.sm,
                color: colors.danger,
                backgroundColor: colors.dangerLight,
                padding: '10px 12px',
                borderRadius: radius.sm,
                margin: 0,
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? colors.textLight : colors.primary,
              color: '#fff',
              border: 'none',
              borderRadius: radius.sm,
              padding: '14px',
              fontSize: fontSize.md,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              minHeight: '44px',
              marginTop: '8px',
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p
            style={{
              textAlign: 'center',
              fontSize: fontSize.base,
              color: colors.textMuted,
              margin: 0,
            }}
          >
            ¿No tienes cuenta?{' '}
            <Link to="/registro" style={{ color: colors.primary, fontWeight: 500 }}>
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
