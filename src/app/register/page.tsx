// src/app/register/page.tsx
// Register — FIFA StadiumOS modern, role-based registration screen

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '@/lib/firebase/auth';
import { GlassCard } from '@/components/ui/GlassCard';
import { ActionButton } from '@/components/ui/ActionButton';
import { FifaBadge } from '@/components/ui/FifaBadge';
import { User, Mail, Lock, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import type { UserRole } from '@/types';

const ROLES_LIST: { value: UserRole; label: string; description: string }[] = [
  { value: 'fan', label: 'Match Fan', description: 'Seat directions, transport logs, AI translation, eco-rewards' },
  { value: 'volunteer', label: 'Volunteer', description: 'Shift-specific task guidelines, guest services and crowd flow' },
  { value: 'security', label: 'Security patrol', description: 'Threat monitoring, active incident reports, crowd heatmap' },
  { value: 'organizer', label: 'Organizer', description: 'Operational dashboard, AI logistics model predictions' },
  { value: 'admin', label: 'Administrator', description: 'Control panel, AI telemetry monitor, full system access' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('fan');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !email || !password || loading) return;

    setLoading(true);
    setError(null);

    try {
      await registerUser(email, password, displayName, selectedRole);
      // Success: AuthProvider redirects automatically, but let's push just in case
      router.push(`/${selectedRole}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to register. Please try again.';
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

      <div className="w-full max-w-lg space-y-6 z-10 my-8">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <FifaBadge variant="fifa" size="md" className="mb-2">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            WORLD CUP 2026
          </FifaBadge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-fifa-purple via-primary to-fifa-teal bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-xs text-muted-foreground">
            Sign up to get access to FIFA StadiumOS operational console
          </p>
        </div>

        {/* Register Card */}
        <GlassCard variant="glass" className="border border-border/40 shadow-2xl" padding="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-start gap-2 text-xs font-semibold">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Display name */}
            <div className="space-y-1.5">
              <label htmlFor="name-input" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="name-input"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full h-10 pl-10 pr-3 rounded-lg border border-border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password-input" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Password
              </label>
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

            {/* Role Select Grid */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Select Your Role
              </span>
              <div className="grid gap-2 sm:grid-cols-2">
                {ROLES_LIST.map((roleObj) => {
                  const isSelected = selectedRole === roleObj.value;
                  return (
                    <button
                      key={roleObj.value}
                      type="button"
                      onClick={() => setSelectedRole(roleObj.value)}
                      className={`text-left p-3 rounded-lg border text-xs transition-all relative ${
                        isSelected
                          ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20 font-bold'
                          : 'border-border bg-background/40 hover:bg-background/80 text-muted-foreground'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{roleObj.label}</span>
                        {isSelected && <UserCheck className="h-3.5 w-3.5 text-primary" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 font-normal line-clamp-2">
                        {roleObj.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <ActionButton type="submit" variant="fifa" fullWidth loading={loading} className="mt-4 font-bold tracking-wider uppercase text-xs h-11">
              Sign Up
            </ActionButton>
          </form>
        </GlassCard>

        {/* Footer info */}
        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{' '}
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
