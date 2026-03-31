import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'background-color: #2563eb; color: white;',
  secondary: 'background-color: #e5e7eb; color: #111827;',
  danger: 'background-color: #dc2626; color: white;',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'padding: 4px 8px; font-size: 12px;',
  md: 'padding: 8px 16px; font-size: 14px;',
  lg: 'padding: 12px 24px; font-size: 16px;',
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
        ...Object.fromEntries(
          variantStyles[variant]
            .split(';')
            .filter(Boolean)
            .map((s) => s.split(':').map((p) => p.trim()))
        ),
        ...Object.fromEntries(
          sizeStyles[size]
            .split(';')
            .filter(Boolean)
            .map((s) => s.split(':').map((p) => p.trim()))
        ),
        border: 'none',
        borderRadius: '6px',
        cursor: (disabled ?? loading) ? 'not-allowed' : 'pointer',
        opacity: (disabled ?? loading) ? 0.6 : 1,
        ...style,
      }}
    >
      {loading ? 'Cargando...' : children}
    </button>
  );
}
