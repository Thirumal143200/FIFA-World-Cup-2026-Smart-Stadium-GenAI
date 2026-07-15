// src/app/organizer/crowd/page.tsx
// Organizer Crowd Intelligence — monitors crowd density and allows triggering alerts
'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useStadiumStore } from '@/store/stadium-store';
import { stadiums } from '@/data/stadiums';
import { GlassCard } from '@/components/ui/GlassCard';
import { FifaBadge } from '@/components/ui/FifaBadge';
import { ActionButton } from '@/components/ui/ActionButton';
import { Sparkles, MapPin, Users2, ShieldAlert } from 'lucide-react';

export default function OrganizerCrowd() {
  const { selectedStadiumId } = useStadiumStore();
  const stadium = stadiums.find((s) => s.id === selectedStadiumId) || stadiums[0];

  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<string | null>(null);

  // Generate simulated density per zone
  const zonesWithOccupancy = stadium.zones.map((zone) => {
    const seed = zone.id.includes('gate') ? 0.72 : 0.42;
    const density = Math.min(0.98, Number((seed + Math.random() * 0.25).toFixed(2)));
    const current = Math.round(zone.capacity * density);
    const status = density > 0.85 ? 'at-capacity' : density > 0.65 ? 'crowded' : 'open';

    return {
      ...zone,
      density,
      currentOccupancy: current,
      status,
    };
  });

  const getAiCrowdInsights = async () => {
    setLoading(true);
    setPredictions(null);
    try {
      const res = await fetch('/api/ai/crowd-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stadiumId: selectedStadiumId,
          eventType: 'FIFA World Cup Match Day',
          matchImportance: 9,
          weatherCondition: 'Clear, 22°C',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPredictions(data.predictions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Crowd Flow Dashboard</h1>
            <p className="text-xs text-muted-foreground">Monitor real-time gate occupancy, trigger alerts, and run predictive analytics</p>
          </div>
          <ActionButton variant="accent" size="sm" onClick={getAiCrowdInsights} loading={loading}>
            <Sparkles className="h-4 w-4" />
            Analyze Flow
          </ActionButton>
        </div>

        {/* Heatmap overlay and zone listings */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map simulator */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard variant="default" className="p-0 overflow-hidden relative aspect-[16/9] w-full flex flex-col justify-between border border-border">
              <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center pointer-events-none p-4">
                <Users2 className="h-10 w-10 text-primary animate-pulse mb-2" />
                <span className="text-xs text-muted-foreground font-semibold block uppercase tracking-wider">
                  Stadium Heatmap Simulation Overlay
                </span>
                <div className="flex gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> &lt;50%
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-amber-500" /> 50-80%
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-red-500" /> &gt;80%
                  </div>
                </div>
              </div>

              <div className="relative p-4 flex justify-between items-start pointer-events-none">
                <FifaBadge variant="success" pulse>
                  Telemetry Online
                </FifaBadge>
              </div>
            </GlassCard>

            {/* AI Predictions */}
            {predictions && (
              <GlassCard variant="glass" className="space-y-3 bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-sm text-primary">AI Flow Predictions</h3>
                </div>
                <div className="text-sm prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                  {predictions}
                </div>
              </GlassCard>
            )}
          </div>

          {/* Zones list sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              Zone Density Log
            </h2>

            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
              {zonesWithOccupancy.map((zone) => (
                <div
                  key={zone.id}
                  className="p-3 bg-card border border-border rounded-xl flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold">{zone.name}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Level {zone.level} • {zone.type}</div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="font-mono font-bold">
                      {zone.currentOccupancy.toLocaleString()} / {zone.capacity.toLocaleString()}
                    </div>
                    <FifaBadge
                      variant={zone.status === 'at-capacity' ? 'danger' : zone.status === 'crowded' ? 'warning' : 'success'}
                      className="text-[9px] py-0"
                    >
                      {Math.round(zone.density * 100)}%
                    </FifaBadge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
