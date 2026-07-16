// src/app/forgot-password/page.tsx
// ForgotPassword — FIFA StadiumOS modern password recovery screen

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendPasswordReset } from '@/lib/firebase/auth';
import { GlassCard } from '@/components/ui/GlassCard';
import { ActionButton } from '@/components/ui/ActionButton';
import { FifaBadge } from '@/components/ui/FifaBadge';
import { Mail, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await sendPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to send recovery email.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 bg-background relative overflow-hidden">
      {/* Background visual graphics */}
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
            Reset Password
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter your email below to receive password recovery instructions
          </p>
        </div>

        {/* Forgot Password Card */}
        <GlassCard variant="glass" className="border border-border/40 shadow-2xl" padding="lg">
          {success ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 animate-bounce" />
              <div className="space-y-1">
                <h3 className="font-bold text-sm">Recovery Link Dispatched</h3>
                <p className="text-xs text-muted-foreground">
                  Check your inbox for a message from StadiumOS with further instructions.
                </p>
              </div>
              <Link href="/login" className="block mt-2">
                <ActionButton variant="outline" fullWidth>
                  Back to Sign In
                </ActionButton>
              </Link>
            </div>
          ) : (
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

              <ActionButton type="submit" variant="fifa" fullWidth loading={loading} className="mt-2 font-bold tracking-wider uppercase text-xs h-11">
                Send Recovery Instructions
              </ActionButton>
            </form>
          )}
        </GlassCard>

        {/* Back Link */}
        <p className="text-center text-xs text-muted-foreground">
          Remembered your password?{' '}
          <Link
            href="/login"
            className="font-bold text-primary hover:underline hover:text-primary/80 transition-all"
          >
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
