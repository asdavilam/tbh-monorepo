import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: { backgroundColor: '#2563eb', color: 'white' },
  secondary: { backgroundColor: '#e5e7eb', color: '#111827' },
  danger: { backgroundColor: '#dc2626', color: 'white' },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '4px 8px', fontSize: '12px', minHeight: '32px' },
  md: { padding: '8px 16px', fontSize: '14px', minHeight: '44px' },
  lg: { padding: '12px 24px', fontSize: '16px', minHeight: '48px' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled ?? loading}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        border: 'none',
        borderRadius: '6px',
        fontWeight: 600,
        cursor: (disabled ?? loading) ? 'not-allowed' : 'pointer',
        opacity: (disabled ?? loading) ? 0.6 : 1,
        ...style,
      }}
    >
      {loading ? 'Cargando...' : children}
    </button>
  );
}
