// src/app/organizer/decisions/page.tsx
// AI Decision Support — strategic planning models for organizers
'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useStadiumStore } from '@/store/stadium-store';
import { stadiums } from '@/data/stadiums';
import { GlassCard } from '@/components/ui/GlassCard';
import { ActionButton } from '@/components/ui/ActionButton';
import { BrainCircuit, Sparkles } from 'lucide-react';

export default function OrganizerDecisions() {
  const { selectedStadiumId } = useStadiumStore();
  const stadium = stadiums.find((s) => s.id === selectedStadiumId) || stadiums[0];

  const [staffCount, setStaffCount] = useState(250);
  const [incidentsCount, setIncidentsCount] = useState(1);
  const [matchStage, setMatchStage] = useState('pre-match');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setInsights(null);

    try {
      const res = await fetch('/api/ai/operational', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stadiumId: selectedStadiumId,
          currentStaffCount: staffCount,
          activeIncidentsCount: incidentsCount,
          matchStage,
        }),
      });

      const contentType = res.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        throw new Error(`Server returned ${res.status} (non-JSON). Failed to run optimization models.`);
      }
      const data = await res.json();
      if (res.ok) {
        setInsights(data.insights);
      } else {
        throw new Error(data.error || 'Failed to get insights');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setInsights(`❌ Strategic Error: ${errMsg}. Failed to run optimization models.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Decision Support</h1>
          <p className="text-xs text-muted-foreground">Run predictive logistics, resource allocations, and safety mitigation models for {stadium.name}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard variant="default" className="space-y-4">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                Operational Scenario
              </h2>

              <form onSubmit={handleAnalyze} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">CURRENT STAFF COUNT</label>
                  <input
                    type="number"
                    value={staffCount}
                    onChange={(e) => setStaffCount(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">ACTIVE INCIDENTS</label>
                  <input
                    type="number"
                    value={incidentsCount}
                    onChange={(e) => setIncidentsCount(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">MATCH STAGE</label>
                  <select
                    value={matchStage}
                    onChange={(e) => setMatchStage(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="pre-match">Pre-Match Gate Entrance</option>
                    <option value="first-half">First Half</option>
                    <option value="half-time">Half-Time Concourse Peak</option>
                    <option value="second-half">Second Half</option>
                    <option value="post-match">Post-Match Gate Exit</option>
                  </select>
                </div>

                <ActionButton type="submit" variant="fifa" fullWidth loading={loading}>
                  Run Operational Analysis
                </ActionButton>
              </form>
            </GlassCard>

            {/* Quick scenarios */}
            <GlassCard variant="default" className="space-y-3">
              <h3 className="font-semibold text-xs text-muted-foreground uppercase">Common Risk Scenarios</h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => { setStaffCount(150); setIncidentsCount(4); setMatchStage('half-time'); }}
                  className="w-full text-left text-xs p-2.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 transition-colors border border-red-500/20 text-red-700 dark:text-red-300"
                >
                  ⚠️ Staff Shortage at Peak Concourse
                </button>
                <button
                  type="button"
                  onClick={() => { setStaffCount(300); setIncidentsCount(0); setMatchStage('post-match'); }}
                  className="w-full text-left text-xs p-2.5 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors border border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                >
                  🟢 Normal Operations post-match
                </button>
              </div>
            </GlassCard>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Insights display */}
            {insights ? (
              <GlassCard variant="glass" className="space-y-4 border border-border/60">
                <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-base">Strategic Plan Recommendations</h3>
                </div>
                <div className="text-sm prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                  {insights}
                </div>
              </GlassCard>
            ) : (
              <GlassCard variant="default" className="h-full flex flex-col justify-center items-center p-8 text-center text-muted-foreground bg-muted/20 border-dashed">
                <BrainCircuit className="h-12 w-12 text-muted-foreground/60 mb-2" />
                <p className="text-sm">Submit an operational scenario on the left to receive AI decision support insights.</p>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
