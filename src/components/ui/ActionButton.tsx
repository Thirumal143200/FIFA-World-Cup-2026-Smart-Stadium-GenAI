// src/components/ui/ActionButton.tsx
// Primary action button with FIFA styling and loading states
'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'fifa' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline:
    'border border-border bg-transparent hover:bg-muted text-foreground',
  ghost:
    'bg-transparent hover:bg-muted text-foreground',
  danger:
    'bg-destructive text-white hover:bg-destructive/90 shadow-sm',
  fifa:
    'gradient-fifa text-white hover:opacity-90 shadow-md',
  accent:
    'bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm',
};

const sizeStyles: Record<string, string> = {
  sm: 'h-8 px-3 text-sm rounded-lg gap-1.5',
  md: 'h-10 px-4 text-sm rounded-lg gap-2',
  lg: 'h-12 px-6 text-base rounded-xl gap-2.5',
  icon: 'h-10 w-10 rounded-lg',
};

export function ActionButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ActionButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : icon ? (
        <span aria-hidden="true">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
