'use client';

import { useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ActionButton } from '@/components/ui/ActionButton';
import { AlertOctagon } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 text-foreground antialiased">
      <GlassCard variant="elevated" className="max-w-md w-full text-center space-y-4 border border-destructive/20 bg-slate-900/80 p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mx-auto">
          <AlertOctagon className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Something went wrong</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          An unexpected error occurred during stadium operations coordination. Please try resetting the viewport or return to the main dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2 justify-center">
          <ActionButton variant="outline" size="sm" onClick={() => window.location.href = '/'}>
            Go Home
          </ActionButton>
          <ActionButton variant="danger" size="sm" onClick={reset}>
            Try Again
          </ActionButton>
        </div>
      </GlassCard>
    </div>
  );
}
