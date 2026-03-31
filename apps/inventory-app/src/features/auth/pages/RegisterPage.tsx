import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../../shared/supabase';
import { colors, fontSize, radius, spacing } from '../../../shared/theme';

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (signUpError) throw signUpError;
      navigate('/inventario');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg === 'User already registered' ? 'Este correo ya está registrado' : msg);
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
          Crear cuenta
        </h1>
        <p style={{ fontSize: fontSize.base, color: colors.textMuted, marginBottom: '32px' }}>
          TBH — Sistema de inventario
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: fontSize.base, fontWeight: 500, color: colors.text }}>
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Tu nombre"
              style={{
                padding: '12px',
                border: `1px solid ${colors.border}`,
                borderRadius: radius.sm,
                fontSize: '16px',
                boxSizing: 'border-box',
                width: '100%',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: fontSize.base, fontWeight: 500, color: colors.text }}>
              Correo electrónico
            </label>
            <input
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
                fontSize: '16px',
                boxSizing: 'border-box',
                width: '100%',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: fontSize.base, fontWeight: 500, color: colors.text }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              style={{
                padding: '12px',
                border: `1px solid ${colors.border}`,
                borderRadius: radius.sm,
                fontSize: '16px',
                boxSizing: 'border-box',
                width: '100%',
              }}
            />
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
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <p
            style={{
              textAlign: 'center',
              fontSize: fontSize.base,
              color: colors.textMuted,
              margin: 0,
            }}
          >
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ color: colors.primary, fontWeight: 500 }}>
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
