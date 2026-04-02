import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { colors, radius, transition } from '../theme';

// ── Icons ────────────────────────────────────────────────────────────────────

function IconInventory() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  );
}

function IconCart() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function IconList() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function IconHistory() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function IconBox() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconMore() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="5" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="19" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const navItemBase: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 4px',
  minHeight: '60px',
  textDecoration: 'none',
  fontSize: '10px',
  fontWeight: 600,
  gap: '3px',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  transition: `color ${transition.fast}`,
  cursor: 'pointer',
  borderRadius: radius.md,
  margin: '4px 2px',
};

// ── Component ────────────────────────────────────────────────────────────────

export function BottomNav() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isEncargado = user?.role === 'encargado';
  const canManage = isAdmin || isEncargado;

  // Primary nav items (always visible)
  const primaryItems = [
    { to: '/inventario', label: 'Inventario', Icon: IconInventory, show: true },
    { to: '/compras', label: 'Compras', Icon: IconCart, show: canManage },
    { to: '/lista', label: 'Lista', Icon: IconList, show: canManage },
  ].filter((item) => item.show);

  // Secondary items inside the "Más" drawer
  const secondaryItems = [
    { to: '/historial', label: 'Historial', Icon: IconHistory, show: canManage },
    { to: '/productos', label: 'Productos', Icon: IconBox, show: isAdmin },
  ].filter((item) => item.show);

  function handleSecondaryNav(to: string) {
    setMoreOpen(false);
    navigate(to);
  }

  function handleSignOut() {
    setMoreOpen(false);
    signOut();
  }

  return (
    <>
      {/* ── Backdrop ── */}
      {moreOpen && (
        <div
          onClick={() => setMoreOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(30, 20, 10, 0.45)',
            zIndex: 40,
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Bottom sheet "Más" ── */}
      <div
        role="dialog"
        aria-label="Más opciones"
        aria-hidden={!moreOpen}
        style={{
          position: 'fixed',
          bottom: moreOpen ? '72px' : '-100%',
          left: 0,
          right: 0,
          backgroundColor: colors.surface,
          borderRadius: `${radius.lg} ${radius.lg} 0 0`,
          boxShadow: '0 -8px 32px rgba(80, 60, 40, 0.14)',
          zIndex: 45,
          transition: `bottom 280ms cubic-bezier(0.32, 0.72, 0, 1)`,
          overflow: 'hidden',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div
            style={{
              width: '36px',
              height: '4px',
              borderRadius: '99px',
              backgroundColor: colors.border,
            }}
          />
        </div>

        <div style={{ padding: '4px 12px 16px' }}>
          {secondaryItems.map(({ to, label, Icon }) => (
            <button
              key={to}
              onClick={() => handleSecondaryNav(to)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '14px 12px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: radius.md,
                color: colors.text,
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                minHeight: '52px',
                transition: `background-color ${transition.fast}`,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.surfaceLow)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span style={{ color: colors.textMuted, display: 'flex' }}>
                <Icon />
              </span>
              {label}
            </button>
          ))}

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: colors.border, margin: '4px 12px' }} />

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '14px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: radius.md,
              color: colors.danger,
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              minHeight: '52px',
              transition: `background-color ${transition.fast}`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.dangerLight)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <IconLogout />
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* ── Bottom nav bar ── */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(253, 252, 251, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          zIndex: 50,
          borderRadius: '16px 16px 0 0',
          boxShadow: '0 -8px 24px rgba(80, 60, 40, 0.06)',
        }}
      >
        {primaryItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMoreOpen(false)}
            style={({ isActive }) => ({
              ...navItemBase,
              color: isActive ? colors.primary : colors.textMuted,
              backgroundColor: isActive ? `${colors.primary}12` : 'transparent',
            })}
          >
            <Icon />
            {label}
          </NavLink>
        ))}

        {/* Más button */}
        <button
          onClick={() => setMoreOpen((prev) => !prev)}
          aria-expanded={moreOpen}
          aria-haspopup="dialog"
          style={{
            ...navItemBase,
            flex: 1,
            border: 'none',
            color: moreOpen ? colors.primary : colors.textMuted,
            backgroundColor: moreOpen ? `${colors.primary}12` : 'transparent',
          }}
        >
          <IconMore />
          Más
        </button>
      </nav>
    </>
  );
}
