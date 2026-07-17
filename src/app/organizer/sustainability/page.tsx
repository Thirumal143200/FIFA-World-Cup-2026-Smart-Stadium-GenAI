// src/app/organizer/sustainability/page.tsx
// Organizer Sustainability Metrics Dashboard — Displays carbon footprint logs
'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useStadiumStore } from '@/store/stadium-store';
import { stadiums } from '@/data/stadiums';
import { GlassCard } from '@/components/ui/GlassCard';
import { ActionButton } from '@/components/ui/ActionButton';
import { Leaf, Award, Scale, Sparkles } from 'lucide-react';
import type { SustainabilityMetrics } from '@/types';

export default function OrganizerSustainability() {
  const { selectedStadiumId } = useStadiumStore();
  const stadium = stadiums.find((s) => s.id === selectedStadiumId) || stadiums[0];

  const [metrics, setMetrics] = useState<SustainabilityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true);
        const res = await fetch(`/api/sustainability/${selectedStadiumId}`);
        const contentType = res.headers.get('content-type') ?? '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, [selectedStadiumId]);

  const getAiRecommendations = async () => {
    setSubmitting(true);
    setAiTip(null);
    try {
      const res = await fetch('/api/ai/sustainability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stadiumId: selectedStadiumId,
        }),
      });
      const contentType = res.headers.get('content-type') ?? '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setAiTip(data.recommendations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sustainability Benchmarks</h1>
            <p className="text-xs text-muted-foreground">View energy recycling diversion metrics and run carbon offset optimization models for {stadium.name}</p>
          </div>
          <ActionButton variant="accent" size="sm" onClick={getAiRecommendations} loading={submitting}>
            <Sparkles className="h-4 w-4" />
            Optimize Sustainability
          </ActionButton>
        </div>

        {/* Top KPIs */}
        <div className="grid gap-6 md:grid-cols-3">
          <GlassCard variant="default" className="flex items-center gap-4">
            <Leaf className="h-10 w-10 text-emerald-500 bg-emerald-500/10 p-2 rounded-xl" />
            <div>
              <div className="text-xs text-muted-foreground">FIFA Green Index</div>
              <div className="text-2xl font-bold">{metrics?.score || 85}/100</div>
            </div>
          </GlassCard>

          <GlassCard variant="default" className="flex items-center gap-4">
            <Scale className="h-10 w-10 text-blue-500 bg-blue-500/10 p-2 rounded-xl" />
            <div>
              <div className="text-xs text-muted-foreground">Renewable Energy</div>
              <div className="text-2xl font-bold">73% Active</div>
            </div>
          </GlassCard>

          <GlassCard variant="default" className="flex items-center gap-4">
            <Award className="h-10 w-10 text-amber-500 bg-amber-500/10 p-2 rounded-xl" />
            <div>
              <div className="text-xs text-muted-foreground">Diversion Rate</div>
              <div className="text-2xl font-bold">81% Diverted</div>
            </div>
          </GlassCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Metrics summary */}
          <div className="lg:col-span-2 space-y-4">
            <GlassCard variant="default" className="space-y-4">
              <h2 className="font-semibold text-base">Sustainability Metrics log</h2>
              {loading ? (
                <div className="h-40 bg-muted animate-pulse rounded-xl" />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-3 border border-border/50 rounded-xl space-y-1.5">
                    <div className="text-xs font-bold text-muted-foreground">ENERGY PROFILE</div>
                    <div className="text-sm font-semibold">Consumption: {metrics?.energy.consumed} {metrics?.energy.unit}</div>
                    <div className="text-xs text-muted-foreground">Renewable Source: {metrics?.energy.renewable} {metrics?.energy.unit}</div>
                  </div>

                  <div className="p-3 border border-border/50 rounded-xl space-y-1.5">
                    <div className="text-xs font-bold text-muted-foreground">WATER USE</div>
                    <div className="text-sm font-semibold">Consumed: {metrics?.water.consumed} {metrics?.water.unit}</div>
                    <div className="text-xs text-muted-foreground">Recycled: {metrics?.water.recycled} {metrics?.water.unit}</div>
                  </div>

                  <div className="p-3 border border-border/50 rounded-xl space-y-1.5">
                    <div className="text-xs font-bold text-muted-foreground">WASTE DIVERSION</div>
                    <div className="text-sm font-semibold">Generated: {metrics?.waste.generated} {metrics?.waste.unit}</div>
                    <div className="text-xs text-muted-foreground">Diverted: {metrics?.waste.diverted} {metrics?.waste.unit}</div>
                  </div>

                  <div className="p-3 border border-border/50 rounded-xl space-y-1.5">
                    <div className="text-xs font-bold text-muted-foreground">CARBON OFFSET</div>
                    <div className="text-sm font-semibold">Emissions: {metrics?.carbon.emissions} {metrics?.carbon.unit}</div>
                    <div className="text-xs text-muted-foreground">Offset: {metrics?.carbon.offset} {metrics?.carbon.unit}</div>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>

          {/* AI Advisor Panel */}
          <div className="lg:col-span-1">
            {aiTip && (
              <GlassCard variant="glass" className="space-y-3 bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-emerald-500" />
                  <h3 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">AI Green Advice</h3>
                </div>
                <div className="text-sm prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                  {aiTip}
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
