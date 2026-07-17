// src/app/fan/sustainability/page.tsx
// Sustainability dashboard — calculates journey footprint and outlines green metrics
'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useStadiumStore } from '@/store/stadium-store';
import { stadiums } from '@/data/stadiums';
import { GlassCard } from '@/components/ui/GlassCard';
import { ActionButton } from '@/components/ui/ActionButton';
import { Leaf, Award, Globe, Scale } from 'lucide-react';
import type { SustainabilityMetrics } from '@/types';

export default function FanSustainability() {
  const { selectedStadiumId } = useStadiumStore();
  const stadium = stadiums.find((s) => s.id === selectedStadiumId) || stadiums[0];

  const [metrics, setMetrics] = useState<SustainabilityMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Carbon calculator inputs
  const [mode, setMode] = useState('transit');
  const [distance, setDistance] = useState(25);
  const [footprint, setFootprint] = useState(1.1); // calculated carbon footprint in kg CO2
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

  const calculateFootprint = () => {
    let multiplier = 0.04; // transit
    if (mode === 'driving') multiplier = 0.18;
    else if (mode === 'rideshare') multiplier = 0.14;
    else if (mode === 'walking' || mode === 'cycling') multiplier = 0.0;

    const calc = Number((distance * multiplier).toFixed(1));
    setFootprint(calc);
  };

  const getAiRecommendations = async () => {
    setSubmitting(true);
    setAiTip(null);
    try {
      const res = await fetch('/api/ai/sustainability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stadiumId: selectedStadiumId,
          travelMode: mode,
          distanceKm: distance,
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
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Eco-Dashboard</h1>
          <p className="text-xs text-muted-foreground">Calculate your journey footprint and view {stadium.name} sustainability metrics</p>
        </div>

        {/* Top summary row */}
        <div className="grid gap-6 md:grid-cols-3">
          <GlassCard variant="default" className="flex items-center gap-4">
            <Leaf className="h-10 w-10 text-emerald-500 bg-emerald-500/10 p-2 rounded-xl" />
            <div>
              <div className="text-xs text-muted-foreground">Green score</div>
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
          {/* Carbon Calculator */}
          <div className="lg:col-span-1">
            <GlassCard variant="default" className="space-y-4">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <Globe className="h-5 w-5 text-emerald-500" />
                Travel Footprint Calculator
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">TRAVEL MODE</label>
                  <select
                    value={mode}
                    onChange={(e) => { setMode(e.target.value); calculateFootprint(); }}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="transit">Public Transit (Train/Bus)</option>
                    <option value="driving">Single Occupant Driving</option>
                    <option value="rideshare">Rideshare / Carpool</option>
                    <option value="walking">Walking / Cycling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">DISTANCE (KM)</label>
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => { setDistance(Number(e.target.value)); calculateFootprint(); }}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    min="1"
                    max="500"
                  />
                </div>

                {/* Calculation Display */}
                <div className="p-3 bg-muted/60 rounded-lg text-center space-y-1">
                  <div className="text-xs text-muted-foreground uppercase">Estimated Emissions</div>
                  <div className="text-3xl font-extrabold text-emerald-500">{footprint} kg</div>
                  <div className="text-[10px] text-muted-foreground">CO₂ Equivalent</div>
                </div>

                <ActionButton variant="primary" fullWidth loading={submitting} onClick={getAiRecommendations}>
                  Analyze Footprint
                </ActionButton>
              </div>
            </GlassCard>
          </div>

          {/* Recommendations / Advice */}
          <div className="lg:col-span-2 space-y-6">
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

            {/* Stadium Metrics */}
            <GlassCard variant="default" className="space-y-4">
              <h2 className="font-semibold text-base">Sustainability Metrics</h2>
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
        </div>
      </div>
    </DashboardLayout>
  );
}
