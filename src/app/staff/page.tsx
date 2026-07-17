// src/app/staff/page.tsx
// Staff Hub Dashboard — Real-time event coordination dashboard
'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useStadiumStore } from '@/store/stadium-store';
import { stadiums } from '@/data/stadiums';
import { GlassCard } from '@/components/ui/GlassCard';
import { FifaBadge } from '@/components/ui/FifaBadge';
import { ActionButton } from '@/components/ui/ActionButton';
import { AlertOctagon, Users2, Shield, Calendar, LifeBuoy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Incident } from '@/types';

export default function StaffHub() {
  const router = useRouter();
  const { selectedStadiumId } = useStadiumStore();
  const stadium = stadiums.find((s) => s.id === selectedStadiumId) || stadiums[0];

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIncidents() {
      try {
        setLoading(true);
        const res = await fetch(`/api/incidents?stadiumId=${selectedStadiumId}`);
        const contentType = res.headers.get('content-type') ?? '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          setIncidents(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchIncidents();
  }, [selectedStadiumId]);

  const activeIncidents = incidents.filter((inc) => inc.status !== 'resolved');
  const criticalIncidents = activeIncidents.filter((inc) => inc.severity === 'critical' || inc.severity === 'high');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Staff Operations Hub</h1>
            <p className="text-xs text-muted-foreground">Monitor real-time alerts, logistics status, and coordinate response units</p>
          </div>
          <FifaBadge variant="fifa" pulse>
            Match day operations active
          </FifaBadge>
        </div>

        {/* Operational Statistics */}
        <div className="grid gap-6 md:grid-cols-4">
          <GlassCard variant="default" className="flex items-center gap-4">
            <div className="h-10 w-10 text-red-500 bg-red-500/10 p-2 rounded-xl flex items-center justify-center">
              <AlertOctagon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Active Incidents</div>
              <div className="text-2xl font-bold">{activeIncidents.length}</div>
            </div>
          </GlassCard>

          <GlassCard variant="default" className="flex items-center gap-4">
            <div className="h-10 w-10 text-orange-500 bg-orange-500/10 p-2 rounded-xl flex items-center justify-center">
              <LifeBuoy className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Critical Emergencies</div>
              <div className="text-2xl font-bold">{criticalIncidents.length}</div>
            </div>
          </GlassCard>

          <GlassCard variant="default" className="flex items-center gap-4">
            <div className="h-10 w-10 text-blue-500 bg-blue-500/10 p-2 rounded-xl flex items-center justify-center">
              <Users2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Staff On Duty</div>
              <div className="text-2xl font-bold">285 Units</div>
            </div>
          </GlassCard>

          <GlassCard variant="default" className="flex items-center gap-4">
            <div className="h-10 w-10 text-emerald-500 bg-emerald-500/10 p-2 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Gates Status</div>
              <div className="text-2xl font-bold text-emerald-500">All Open</div>
            </div>
          </GlassCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Incidents listing preview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold flex items-center gap-2">
                <AlertOctagon className="h-5 w-5 text-primary" />
                Recent Incidents
              </h2>
              <ActionButton variant="outline" size="sm" onClick={() => router.push('/staff/incidents')}>
                View Log
              </ActionButton>
            </div>

            <div className="space-y-3">
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
                ))
              ) : activeIncidents.length === 0 ? (
                <GlassCard variant="default" className="text-center p-6 text-muted-foreground">
                  No active incidents. Everything is running smoothly.
                </GlassCard>
              ) : (
                activeIncidents.slice(0, 3).map((inc) => (
                  <GlassCard key={inc.id} variant="default" className="space-y-2 border-l-4 border-l-red-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm">{inc.title}</h3>
                        <p className="text-xs text-muted-foreground">Location: {inc.location.zoneName}</p>
                      </div>
                      <FifaBadge variant={inc.severity === 'critical' || inc.severity === 'high' ? 'danger' : 'warning'}>
                        {inc.severity.toUpperCase()}
                      </FifaBadge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{inc.description}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-border/40 text-[10px] text-muted-foreground">
                      <span>Status: <strong>{inc.status.replace('-', ' ')}</strong></span>
                      <span>Reported {new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </GlassCard>
                ))
              )}
            </div>
          </div>

          {/* Quick task tools */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard variant="default" className="space-y-4">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Logistics & Match Info
              </h2>

              <div className="space-y-2.5 text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg border border-border/55">
                <div>🏟️ Stadium: <strong>{stadium.name}</strong></div>
                <div>🚪 Gates Opening: <strong>16:30 Local Time</strong></div>
                <div>⚽ Match Kickoff: <strong>19:30 Local Time</strong></div>
                <div>👥 Projected Crowd: <strong>72,500 Attendees</strong></div>
              </div>

              <ActionButton variant="primary" fullWidth onClick={() => router.push('/staff/incidents')}>
                Report New Incident
              </ActionButton>
            </GlassCard>

            <GlassCard variant="glass" className="space-y-3 bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-2">
                <Users2 className="h-5 w-5 text-blue-500" />
                <h3 className="font-bold text-sm text-blue-600 dark:text-blue-400">Crowd Intelligence</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Gate A concourse is currently reporting high occupancy (84%). Consider routing fans to Gate B for smoother entries.
              </p>
              <ActionButton variant="outline" fullWidth size="sm" onClick={() => router.push('/staff/crowd')}>
                Analyze Crowd Flow
              </ActionButton>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
