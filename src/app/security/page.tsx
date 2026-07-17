// src/app/security/page.tsx
// Security Hub Command Center — Real-time threat levels and alerts dashboard
'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useStadiumStore } from '@/store/stadium-store';
import { GlassCard } from '@/components/ui/GlassCard';
import { FifaBadge } from '@/components/ui/FifaBadge';
import { ActionButton } from '@/components/ui/ActionButton';
import { Shield, AlertTriangle, Users, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Incident } from '@/types';

export default function SecurityHub() {
  const router = useRouter();
  const { selectedStadiumId } = useStadiumStore();

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  const [loadingThreat, setLoadingThreat] = useState(false);
  const [threatBrief, setThreatBrief] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIncidentsAndAssess() {
      try {
        setLoading(true);
        const res = await fetch(`/api/incidents?stadiumId=${selectedStadiumId}`);
        let securityIncidentsCount = 0;
        const contentType1 = res.headers.get('content-type') ?? '';
        if (res.ok && contentType1.includes('application/json')) {
          const data = await res.json();
          setIncidents(data);
          securityIncidentsCount = data.filter((inc: Incident) => inc.category === 'security' && inc.status !== 'resolved').length;
        }

        // Auto assess threat level using operational API
        setLoadingThreat(true);
        setThreatBrief(null);
        const operationalRes = await fetch('/api/ai/operational', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stadiumId: selectedStadiumId,
            currentStaffCount: 320,
            activeIncidentsCount: securityIncidentsCount,
            matchStage: 'mid-game',
          }),
        });
        const contentType2 = operationalRes.headers.get('content-type') ?? '';
        if (operationalRes.ok && contentType2.includes('application/json')) {
          const operationalData = await operationalRes.json();
          setThreatBrief(operationalData.insights);
        }
      } catch (err) {
        console.error(err);
        setThreatBrief('Failed to load real-time AI security threat assessments.');
      } finally {
        setLoading(false);
        setLoadingThreat(false);
      }
    }
    fetchIncidentsAndAssess();
  }, [selectedStadiumId]);

  const activeSecurityIncidents = incidents.filter((inc) => inc.category === 'security' && inc.status !== 'resolved');

  const getThreatAssessment = async () => {
    setLoadingThreat(true);
    setThreatBrief(null);
    try {
      const res = await fetch('/api/ai/operational', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stadiumId: selectedStadiumId,
          currentStaffCount: 320,
          activeIncidentsCount: activeSecurityIncidents.length,
          matchStage: 'mid-game',
        }),
      });
      const contentType = res.headers.get('content-type') ?? '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setThreatBrief(data.insights);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingThreat(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Security Command Center</h1>
            <p className="text-xs text-muted-foreground">Monitor real-time threat levels, active patrol teams, and emergency incidents logs</p>
          </div>
          <FifaBadge variant="danger" pulse>
            Security Operations Active
          </FifaBadge>
        </div>

        {/* Security KPIs */}
        <div className="grid gap-6 md:grid-cols-4">
          <GlassCard variant="default" className="flex items-center gap-4">
            <div className="h-10 w-10 text-red-500 bg-red-500/10 p-2 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Threat Level</div>
              <div className="text-2xl font-bold text-emerald-500">LOW</div>
            </div>
          </GlassCard>

          <GlassCard variant="default" className="flex items-center gap-4">
            <div className="h-10 w-10 text-orange-500 bg-orange-500/10 p-2 rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Active Security Incidents</div>
              <div className="text-2xl font-bold">{activeSecurityIncidents.length}</div>
            </div>
          </GlassCard>

          <GlassCard variant="default" className="flex items-center gap-4">
            <div className="h-10 w-10 text-blue-500 bg-blue-500/10 p-2 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Patrol Crews Active</div>
              <div className="text-2xl font-bold">48 Units</div>
            </div>
          </GlassCard>

          <GlassCard variant="default" className="flex items-center gap-4">
            <div className="h-10 w-10 text-emerald-500 bg-emerald-500/10 p-2 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Access Gates</div>
              <div className="text-2xl font-bold text-emerald-500">Secured</div>
            </div>
          </GlassCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Incidents preview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Active Security Alerts
              </h2>
              <ActionButton variant="outline" size="sm" onClick={() => router.push('/security/incidents')}>
                View Incident Log
              </ActionButton>
            </div>

            <div className="space-y-3">
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
                ))
              ) : activeSecurityIncidents.length === 0 ? (
                <GlassCard variant="default" className="text-center p-6 text-muted-foreground">
                  No active security incidents reported.
                </GlassCard>
              ) : (
                activeSecurityIncidents.map((inc) => (
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
                  </GlassCard>
                ))
              )}
            </div>
          </div>

          {/* Quick links & AI Support */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard variant="glass" className="space-y-4 bg-red-500/5 border border-red-500/20">
              <div className="flex items-center justify-between border-b border-red-550/10 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-red-500" />
                  <h3 className="font-bold text-sm text-red-600 dark:text-red-400">AI Threat Advisor</h3>
                </div>
                <ActionButton variant="danger" size="sm" onClick={getThreatAssessment} loading={loadingThreat} className="h-7 text-[10px] px-2">
                  Assess
                </ActionButton>
              </div>

              {threatBrief ? (
                <div className="text-xs prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                  {threatBrief}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Click the button above to generate a real-time Gemini-powered threat evaluation based on active alerts.
                </p>
              )}

              <ActionButton variant="outline" fullWidth size="sm" onClick={() => router.push('/security/crowd')}>
                Analyze Crowd Heatmap
              </ActionButton>
            </GlassCard>

            <GlassCard variant="default" className="space-y-3">
              <h3 className="font-semibold text-sm">Logistics Status</h3>
              <div className="space-y-2 text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg border border-border/55">
                <div>🚪 Exit Gates Status: <strong>Ready</strong></div>
                <div>👤 Security Personnel count: <strong>320</strong></div>
                <div>🛡️ Emergency Evac Status: <strong>STANDBY</strong></div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
