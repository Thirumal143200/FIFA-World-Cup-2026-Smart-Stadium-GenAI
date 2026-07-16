// src/app/organizer/page.tsx
// Event Organizer Hub — Executive command center overview
'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useStadiumStore } from '@/store/stadium-store';
import { stadiums } from '@/data/stadiums';
import { GlassCard } from '@/components/ui/GlassCard';
import { FifaBadge } from '@/components/ui/FifaBadge';
import { ActionButton } from '@/components/ui/ActionButton';
import { BarChart3, Users, Leaf, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrganizerHub() {
  const router = useRouter();
  const { selectedStadiumId } = useStadiumStore();
  const stadium = stadiums.find((s) => s.id === selectedStadiumId) || stadiums[0];

  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchInsights() {
      setLoading(true);
      setAiSummary(null);
      try {
        const response = await fetch('/api/ai/operational', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stadiumId: selectedStadiumId,
            currentStaffCount: 420,
            activeIncidentsCount: 3,
            matchStage: 'mid-match',
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setAiSummary(data.insights);
        } else {
          throw new Error(data.error || 'Failed to fetch insights');
        }
      } catch (err) {
        console.error('Insights fetch error:', err);
        setAiSummary('Failed to load real-time AI Executive insights. Please refresh.');
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, [selectedStadiumId]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Event Command Center</h1>
            <p className="text-xs text-muted-foreground">Executive overview of logistics, crowd safety levels, and sustainability benchmarks</p>
          </div>
          <FifaBadge variant="fifa" pulse>
            Host operations online
          </FifaBadge>
        </div>

        {/* High-level KPIs */}
        <div className="grid gap-6 md:grid-cols-4">
          <GlassCard variant="default" className="flex items-center gap-4">
            <div className="h-10 w-10 text-primary bg-primary/10 p-2 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Total Attendance</div>
              <div className="text-2xl font-bold">72,450</div>
            </div>
          </GlassCard>

          <GlassCard variant="default" className="flex items-center gap-4">
            <div className="h-10 w-10 text-emerald-500 bg-emerald-500/10 p-2 rounded-xl flex items-center justify-center">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Sustainability Index</div>
              <div className="text-2xl font-bold">87/100</div>
            </div>
          </GlassCard>

          <GlassCard variant="default" className="flex items-center gap-4">
            <div className="h-10 w-10 text-amber-500 bg-amber-500/10 p-2 rounded-xl flex items-center justify-center">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Risk Assessment</div>
              <div className="text-2xl font-bold text-emerald-500">Low</div>
            </div>
          </GlassCard>

          <GlassCard variant="default" className="flex items-center gap-4">
            <div className="h-10 w-10 text-purple-500 bg-purple-500/10 p-2 rounded-xl flex items-center justify-center">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Staff Readiness</div>
              <div className="text-2xl font-bold text-primary">98% Ready</div>
            </div>
          </GlassCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Panel - operational tools shortcuts */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Strategic Analytics & Reports
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <GlassCard variant="default" className="space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="font-bold text-sm">Carbon & Water Logs</div>
                  <p className="text-xs text-muted-foreground">Analyze energy profiles, diverted waste, and offsets across {stadium.name}.</p>
                </div>
                <ActionButton variant="outline" size="sm" fullWidth onClick={() => router.push('/organizer/sustainability')}>
                  View Eco Metrics
                </ActionButton>
              </GlassCard>

              <GlassCard variant="default" className="space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="font-bold text-sm">Crowd & Heatmap Metrics</div>
                  <p className="text-xs text-muted-foreground">Run flow forecasts and track high-occupancy gate corridors in real time.</p>
                </div>
                <ActionButton variant="outline" size="sm" fullWidth onClick={() => router.push('/organizer/crowd')}>
                  View Crowd Intel
                </ActionButton>
              </GlassCard>

              <GlassCard variant="default" className="space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="font-bold text-sm">Operational Analytics</div>
                  <p className="text-xs text-muted-foreground">Aggregate gate speeds, response times, and volunteer allocation counts.</p>
                </div>
                <ActionButton variant="outline" size="sm" fullWidth onClick={() => router.push('/organizer/analytics')}>
                  View Analytics
                </ActionButton>
              </GlassCard>

              <GlassCard variant="default" className="space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="font-bold text-sm">AI Decisions & Staffing</div>
                  <p className="text-xs text-muted-foreground">Prompt Gemini to obtain staffing allocation, risk, and resource optimization planning.</p>
                </div>
                <ActionButton variant="outline" size="sm" fullWidth onClick={() => router.push('/organizer/decisions')}>
                  View AI Support
                </ActionButton>
              </GlassCard>
            </div>
          </div>

          {/* AI Advisor Panel */}
          <div className="lg:col-span-1">
            <GlassCard variant="glass" className="space-y-4 bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-sm text-primary">AI Executive Advisor</h3>
              </div>
              {loading ? (
                <div className="space-y-2 animate-pulse py-2">
                  <div className="h-3 bg-muted rounded w-5/6" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              ) : (
                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {aiSummary}
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
