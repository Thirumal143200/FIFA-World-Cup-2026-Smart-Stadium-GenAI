// src/app/profile/page.tsx
// Profile — FIFA StadiumOS modern, accessible profile settings screen

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { logoutUser, sendVerificationEmail } from '@/lib/firebase/auth';
import { useUserStore } from '@/store/user-store';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { GlassCard } from '@/components/ui/GlassCard';
import { ActionButton } from '@/components/ui/ActionButton';
import { FifaBadge } from '@/components/ui/FifaBadge';
import { User, LogOut, Settings, Eye, Volume2, ShieldCheck } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  // Zustand Store sync
  const displayName = useUserStore((s) => s.displayName);
  const setDisplayName = useUserStore((s) => s.setDisplayName);
  const preferences = useUserStore((s) => s.preferences);
  const updatePreferences = useUserStore((s) => s.updatePreferences);

  const [newName, setNewName] = useState(displayName);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [verifySent, setVerifySent] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      setDisplayName(newName);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await sendVerificationEmail();
      setVerifySent(true);
      setTimeout(() => setVerifySent(false), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Profile & Preferences</h1>
            <p className="text-xs text-muted-foreground">
              Manage your personal preferences, visuals, and security options
            </p>
          </div>
          <ActionButton onClick={handleLogout} variant="danger" size="sm" icon={<LogOut className="h-4 w-4" />}>
            Sign Out
          </ActionButton>
        </div>

        {/* Profile Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1: User Account */}
          <GlassCard variant="default" className="space-y-4 md:col-span-1">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <User className="text-primary h-5 w-5" />
              Account details
            </h2>
            <div className="flex flex-col items-center py-4 border-b border-border/50">
              <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xl font-bold text-primary">
                {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-center mt-3">
                <div className="font-bold text-base">{displayName}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
              </div>
              <FifaBadge variant="outline" className="mt-3 capitalize text-[10px]">
                Role: {user?.role}
              </FifaBadge>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Account Status</span>
                <span className="flex items-center gap-1 font-semibold text-emerald-500">
                  <ShieldCheck className="h-4 w-4" /> Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Email Verification</span>
                {user?.emailVerified ? (
                  <span className="text-emerald-500 font-semibold">Verified</span>
                ) : (
                  <button
                    onClick={handleVerifyEmail}
                    disabled={verifySent}
                    className="text-primary hover:underline font-semibold disabled:text-muted-foreground"
                  >
                    {verifySent ? 'Link sent!' : 'Verify email'}
                  </button>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Card 2: Update Profile details */}
          <GlassCard variant="default" className="space-y-4 md:col-span-2">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Settings className="text-primary h-5 w-5" />
              Preferences
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {successMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-semibold">
                  {successMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="name-input" className="block text-xs font-bold text-muted-foreground uppercase">
                  Display Name
                </label>
                <input
                  id="name-input"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              {/* Theme Settings */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <span className="block text-xs font-bold text-muted-foreground uppercase">
                  Visual theme
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['light', 'dark', 'high-contrast'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTheme(t)}
                      className={`h-9 rounded-lg border flex items-center justify-center font-medium capitalize ${
                        theme === t
                          ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20 font-bold'
                          : 'border-border bg-background/50 hover:bg-background'
                      }`}
                    >
                      {t.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessible Font size settings */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <span className="block text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase">
                  <Eye className="h-4 w-4 text-primary" /> Font sizing
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['normal', 'large', 'extra-large'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => updatePreferences({ fontSize: sz as 'normal' | 'large' | 'extra-large' })}
                      className={`h-9 rounded-lg border flex items-center justify-center font-medium capitalize ${
                        preferences.fontSize === sz
                          ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20 font-bold'
                          : 'border-border bg-background/50 hover:bg-background'
                      }`}
                    >
                      {sz.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound and alerts settings */}
              <div className="space-y-4 pt-2 border-t border-border/50 text-xs">
                <span className="block text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase">
                  <Volume2 className="h-4 w-4 text-primary" /> Assistive services
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">AI Voice Guidance</div>
                    <div className="text-muted-foreground">Read out loud navigation route directions</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.voiceGuidance}
                    onChange={(e) => updatePreferences({ voiceGuidance: e.target.checked })}
                    className="h-4 w-4 text-primary rounded border-border"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">Haptic Feedback</div>
                    <div className="text-muted-foreground">Vibrate on navigation steps and alerts</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.hapticFeedback}
                    onChange={(e) => updatePreferences({ hapticFeedback: e.target.checked })}
                    className="h-4 w-4 text-primary rounded border-border"
                  />
                </div>
              </div>

              <ActionButton type="submit" variant="fifa" loading={saving} className="w-full sm:w-auto px-6 text-xs uppercase font-bold tracking-wider">
                Save preferences
              </ActionButton>
            </form>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
