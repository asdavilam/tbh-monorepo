import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { colors, fontSize, radius, spacing } from '../../../shared/theme';
export function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signUp(email, password, name);
      navigate('/inventario');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg === 'User already registered' ? 'Este correo ya está registrado' : msg);
    } finally {
      setLoading(false);
    }
  }
  return _jsx('div', {
    style: {
      minHeight: '100vh',
      backgroundColor: colors.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.md,
    },
    children: _jsxs('div', {
      style: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: '32px 24px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      },
      children: [
        _jsx('h1', {
          style: {
            fontSize: fontSize['2xl'],
            fontWeight: 800,
            color: colors.text,
            marginBottom: '4px',
          },
          children: 'Crear cuenta',
        }),
        _jsx('p', {
          style: { fontSize: fontSize.base, color: colors.textMuted, marginBottom: '32px' },
          children: 'TBH \u2014 Sistema de inventario',
        }),
        _jsxs('form', {
          onSubmit: handleSubmit,
          style: { display: 'flex', flexDirection: 'column', gap: '16px' },
          children: [
            _jsxs('div', {
              style: { display: 'flex', flexDirection: 'column', gap: '6px' },
              children: [
                _jsx('label', {
                  style: { fontSize: fontSize.base, fontWeight: 500, color: colors.text },
                  children: 'Nombre',
                }),
                _jsx('input', {
                  type: 'text',
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  required: true,
                  placeholder: 'Tu nombre',
                  style: {
                    padding: '12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: radius.sm,
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    width: '100%',
                  },
                }),
              ],
            }),
            _jsxs('div', {
              style: { display: 'flex', flexDirection: 'column', gap: '6px' },
              children: [
                _jsx('label', {
                  style: { fontSize: fontSize.base, fontWeight: 500, color: colors.text },
                  children: 'Correo electr\u00F3nico',
                }),
                _jsx('input', {
                  type: 'email',
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  required: true,
                  autoComplete: 'email',
                  placeholder: 'usuario@ejemplo.com',
                  style: {
                    padding: '12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: radius.sm,
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    width: '100%',
                  },
                }),
              ],
            }),
            _jsxs('div', {
              style: { display: 'flex', flexDirection: 'column', gap: '6px' },
              children: [
                _jsx('label', {
                  style: { fontSize: fontSize.base, fontWeight: 500, color: colors.text },
                  children: 'Contrase\u00F1a',
                }),
                _jsx('input', {
                  type: 'password',
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  required: true,
                  autoComplete: 'new-password',
                  placeholder: 'M\u00EDnimo 6 caracteres',
                  style: {
                    padding: '12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: radius.sm,
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    width: '100%',
                  },
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
            _jsx('button', {
              type: 'submit',
              disabled: loading,
              style: {
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
              },
              children: loading ? 'Creando cuenta...' : 'Crear cuenta',
            }),
            _jsxs('p', {
              style: {
                textAlign: 'center',
                fontSize: fontSize.base,
                color: colors.textMuted,
                margin: 0,
              },
              children: [
                '\u00BFYa tienes cuenta?',
                ' ',
                _jsx(Link, {
                  to: '/login',
                  style: { color: colors.primary, fontWeight: 500 },
                  children: 'Entrar',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
