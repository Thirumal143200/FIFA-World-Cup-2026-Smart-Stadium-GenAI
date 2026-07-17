// src/app/admin/page.tsx
// Admin Dashboard Hub — AI telemetry, Firebase diagnostic tools, and system controls

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useStadiumStore } from '@/store/stadium-store';
import { stadiums } from '@/data/stadiums';
import { GlassCard } from '@/components/ui/GlassCard';
import { FifaBadge } from '@/components/ui/FifaBadge';
import { ActionButton } from '@/components/ui/ActionButton';
import { ShieldCheck, Cpu, Terminal, Users, ExternalLink, HardDrive, KeyRound } from 'lucide-react';
import { isFirebaseConfigured } from '@/lib/firebase/config';

export default function AdminHub() {
  const router = useRouter();
  const { selectedStadiumId } = useStadiumStore();
  const stadium = stadiums.find((s) => s.id === selectedStadiumId) || stadiums[0];

  const [loadingBrief, setLoadingBrief] = useState(false);
  const [adminReport, setAdminReport] = useState<string | null>(null);

  // Simulated telemetry data
  const telemetry = {
    apiRequests: 1420,
    averageLatency: '1.4s',
    totalTokens: '42.8k',
    mockFallback: 'Inactive (Live Key Active)',
    registeredUsersCount: 28,
  };

  const mockUsersList = [
    { name: 'Admin Officer', email: 'admin@fifastadium.com', role: 'admin', lastActive: 'Just now' },
    { name: 'John Steward', email: 'john@volunteers.com', role: 'volunteer', lastActive: '2m ago' },
    { name: 'Security Lead', email: 'patrol@security.com', role: 'security', lastActive: '5m ago' },
    { name: 'Event Lead', email: 'director@fifaworldcup.com', role: 'organizer', lastActive: '12m ago' },
  ];

  const getAiSystemReport = async () => {
    setLoadingBrief(true);
    setAdminReport(null);
    try {
      const res = await fetch('/api/ai/operational', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stadiumId: selectedStadiumId,
          currentStaffCount: 420,
          activeIncidentsCount: 0,
          matchStage: 'post-game',
        }),
      });

      const contentType = res.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        throw new Error(`Server returned ${res.status} (non-JSON). Stand by for local system logs.`);
      }
      const data = await res.json();
      if (res.ok) {
        setAdminReport(data.insights);
      } else {
        throw new Error(data.error || 'Failed to generate diagnostic report');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setAdminReport(`❌ Diagnostic Error: ${errMsg}. Stand by for local system logs.`);
    } finally {
      setLoadingBrief(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">System Control Console</h1>
            <p className="text-xs text-muted-foreground">Monitor platform infrastructure health, AI telemetry, and database bindings</p>
          </div>
          <FifaBadge variant="fifa" pulse>
            SYSTEM ONLINE
          </FifaBadge>
        </div>

        {/* Telemetry KPIs */}
        <div className="grid gap-6 md:grid-cols-4">
          <GlassCard variant="default" className="flex items-center gap-4">
            <div className="h-10 w-10 text-primary bg-primary/10 p-2 rounded-xl flex items-center justify-center">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Avg AI Latency</div>
              <div className="text-2xl font-bold">{telemetry.averageLatency}</div>
            </div>
          </GlassCard>

          <GlassCard variant="default" className="flex items-center gap-4">
            <div className="h-10 w-10 text-accent bg-accent/10 p-2 rounded-xl flex items-center justify-center">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Tokens Spent</div>
              <div className="text-2xl font-bold">{telemetry.totalTokens}</div>
            </div>
          </GlassCard>

          <GlassCard variant="default" className="flex items-center gap-4">
            <div className="h-10 w-10 text-emerald-500 bg-emerald-500/10 p-2 rounded-xl flex items-center justify-center">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Firebase Status</div>
              <div className={`text-sm font-bold ${isFirebaseConfigured() ? 'text-emerald-500' : 'text-amber-500'}`}>
                {isFirebaseConfigured() ? 'CONNECTED' : 'LOCAL MOCK MODE'}
              </div>
            </div>
          </GlassCard>

          <GlassCard variant="default" className="flex items-center gap-4">
            <div className="h-10 w-10 text-purple-500 bg-purple-500/10 p-2 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">System Users</div>
              <div className="text-2xl font-bold">{telemetry.registeredUsersCount}</div>
            </div>
          </GlassCard>
        </div>

        {/* User management and Access controls */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* User Directory simulation */}
          <div className="lg:col-span-2">
            <GlassCard variant="default" className="space-y-4">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Active Sessions Directory
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-muted-foreground">
                  <thead className="text-[10px] text-muted-foreground uppercase bg-muted/50 border-b border-border/40">
                    <tr>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Activity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {mockUsersList.map((usr) => (
                      <tr key={usr.email} className="hover:bg-muted/10 transition-colors">
                        <td className="px-4 py-3 font-semibold text-foreground">{usr.name}</td>
                        <td className="px-4 py-3 font-mono">{usr.email}</td>
                        <td className="px-4 py-3 capitalize">
                          <FifaBadge variant="outline" className="text-[10px] font-semibold">
                            {usr.role}
                          </FifaBadge>
                        </td>
                        <td className="px-4 py-3 text-foreground">{usr.lastActive}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>

          {/* Quick Dashboard Overrides */}
          <div className="lg:col-span-1">
            <GlassCard variant="default" className="space-y-4">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" />
                Security Overrides
              </h2>
              <div className="space-y-2">
                <ActionButton variant="outline" size="sm" fullWidth className="justify-between" onClick={() => router.push('/fan')}>
                  <span>Launch Fan Console</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </ActionButton>
                <ActionButton variant="outline" size="sm" fullWidth className="justify-between" onClick={() => router.push('/volunteer')}>
                  <span>Launch Volunteer Console</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </ActionButton>
                <ActionButton variant="outline" size="sm" fullWidth className="justify-between" onClick={() => router.push('/security')}>
                  <span>Launch Security Console</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </ActionButton>
                <ActionButton variant="outline" size="sm" fullWidth className="justify-between" onClick={() => router.push('/organizer')}>
                  <span>Launch Organizer Console</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </ActionButton>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* AI diagnostic report */}
        <GlassCard variant="glass" className="space-y-4 border-primary/20 bg-primary/5">
          <div className="flex justify-between items-center border-b border-primary/10 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-base">AI Diagnostics & Platform Overview</h3>
            </div>
            <ActionButton variant="fifa" size="sm" onClick={getAiSystemReport} loading={loadingBrief}>
              Run Diagnostics
            </ActionButton>
          </div>

          {adminReport ? (
            <div className="text-sm prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
              {adminReport}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Execute real-time Gemini-powered diagnostic auditing to inspect user counts, API quotas, and operational bottlenecks at {stadium.name}.
            </p>
          )}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
