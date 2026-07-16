// src/app/login/page.tsx
// Login — FIFA StadiumOS modern, glassmorphic login screen

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser } from '@/lib/firebase/auth';
import { GlassCard } from '@/components/ui/GlassCard';
import { ActionButton } from '@/components/ui/ActionButton';
import { FifaBadge } from '@/components/ui/FifaBadge';
import { Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    setLoading(true);
    setError(null);

    try {
      const user = await loginUser(email, password);
      // Success: AuthProvider redirects automatically, but let's push manually just in case
      router.push(`/${user.role}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to login. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 bg-background relative overflow-hidden">
      {/* Dynamic background element for premium aesthetic */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 z-10">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <FifaBadge variant="fifa" size="md" className="mb-2">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            WORLD CUP 2026
          </FifaBadge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-fifa-purple via-primary to-fifa-teal bg-clip-text text-transparent">
            StadiumOS
          </h1>
          <p className="text-xs text-muted-foreground">
            Sign in to access your customized smart stadium assistant
          </p>
        </div>

        {/* Form Card */}
        <GlassCard variant="glass" className="border border-border/40 shadow-2xl" padding="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-start gap-2 text-xs font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email-input" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@stadium.com"
                  className="w-full h-10 pl-10 pr-3 rounded-lg border border-border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password-input" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 pl-10 pr-3 rounded-lg border border-border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-all"
                  required
                />
              </div>
            </div>

            <ActionButton type="submit" variant="fifa" fullWidth loading={loading} className="mt-2 font-bold tracking-wider uppercase text-xs h-11">
              Sign In
            </ActionButton>
          </form>
        </GlassCard>

        {/* Footer info */}
        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-bold text-primary hover:underline hover:text-primary/80 transition-all"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
