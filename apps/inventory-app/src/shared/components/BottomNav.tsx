import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme';

export function BottomNav() {
  const { user, signOut } = useAuth();

  const items = [
    { to: '/inventario', label: 'Inventario', icon: '📋' },
    ...(user?.role === 'encargado' || user?.role === 'admin'
      ? [{ to: '/compras', label: 'Compras', icon: '🛒' }]
      : []),
    ...(user?.role === 'encargado' || user?.role === 'admin'
      ? [{ to: '/lista', label: 'Lista', icon: '📝' }]
      : []),
    ...(user?.role === 'admin' ? [{ to: '/productos', label: 'Productos', icon: '📦' }] : []),
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.surface,
        borderTop: `1px solid ${colors.border}`,
        display: 'flex',
        zIndex: 20,
      }}
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 4px',
            minHeight: '56px',
            textDecoration: 'none',
            color: isActive ? colors.primary : colors.textMuted,
            fontSize: '11px',
            fontWeight: isActive ? 600 : 400,
            gap: '2px',
          })}
        >
          <span style={{ fontSize: '20px' }}>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}

      {/* Botón salir */}
      <button
        onClick={() => signOut()}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 4px',
          minHeight: '56px',
          border: 'none',
          backgroundColor: 'transparent',
          color: colors.textMuted,
          fontSize: '11px',
          cursor: 'pointer',
          gap: '2px',
        }}
      >
        <span style={{ fontSize: '20px' }}>🚪</span>
        Salir
      </button>
    </nav>
  );
}
