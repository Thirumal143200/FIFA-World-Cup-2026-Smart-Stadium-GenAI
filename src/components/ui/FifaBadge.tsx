// src/components/ui/FifaBadge.tsx
// Branded badge component for status indicators and labels
'use client';

import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface FifaBadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'fifa' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'bg-muted text-muted-foreground',
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  fifa: 'bg-fifa-purple text-white',
  outline: 'border border-border text-foreground bg-transparent',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function FifaBadge({
  children,
  variant = 'default',
  size = 'sm',
  pulse = false,
  className,
}: FifaBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      role="status"
    >
      {pulse && (
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
