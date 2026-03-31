// Design tokens — mobile-first
// Áreas táctiles mínimas: 44px. Tipografía mínima: 14px body, 16px inputs.

export const colors = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  primaryLight: '#eff6ff',
  danger: '#dc2626',
  dangerLight: '#fef2f2',
  success: '#16a34a',
  successLight: '#f0fdf4',
  warning: '#d97706',
  warningLight: '#fffbeb',
  bg: '#f3f4f6',
  surface: '#ffffff',
  border: '#e5e7eb',
  text: '#111827',
  textMuted: '#6b7280',
  textLight: '#9ca3af',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

export const radius = {
  sm: '6px',
  md: '12px',
  lg: '16px',
};

export const fontSize = {
  sm: '13px',
  base: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
};

// Altura mínima de tap targets (44px según WCAG)
export const minTapTarget = '44px';
