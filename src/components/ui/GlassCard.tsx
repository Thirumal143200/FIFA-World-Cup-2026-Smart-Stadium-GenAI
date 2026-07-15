// src/components/ui/GlassCard.tsx
// Glassmorphic card component with hover effects and FIFA styling
'use client';

import { cn } from '@/lib/utils';
import { type ReactNode, type HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'bordered' | 'gradient';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'bg-card text-card-foreground border border-border',
  glass: 'glass',
  elevated: 'bg-card text-card-foreground shadow-lg dark:shadow-2xl border border-border/50',
  bordered: 'bg-card text-card-foreground border-2 border-border',
  gradient: 'gradient-fifa text-white border-0',
};

const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function GlassCard({
  children,
  variant = 'default',
  hover = false,
  padding = 'md',
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl',
        variantStyles[variant],
        paddingStyles[padding],
        hover && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
