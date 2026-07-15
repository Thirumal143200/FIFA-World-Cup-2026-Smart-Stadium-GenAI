// src/app/staff/crowd/page.tsx
// Crowd Flow Analysis — monitors current occupancies, triggers alerts, and displays heatmaps
'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useStadiumStore } from '@/store/stadium-store';
import { stadiums } from '@/data/stadiums';
import { GlassCard } from '@/components/ui/GlassCard';
import { FifaBadge } from '@/components/ui/FifaBadge';
import { ActionButton } from '@/components/ui/ActionButton';
import { Sparkles, ShieldAlert } from 'lucide-react';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('@/components/ui/LeafletMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-muted text-xs text-muted-foreground min-h-[300px]">Loading interactive map...</div>
});

export default function StaffCrowd() {
  const { selectedStadiumId } = useStadiumStore();
  const stadium = stadiums.find((s) => s.id === selectedStadiumId) || stadiums[0];

  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<string | null>(null);

  // Generate simulated density per zone
  const zonesWithOccupancy = stadium.zones.map((zone) => {
    const seed = zone.id.includes('gate') ? 0.75 : 0.45;
    const idHash = zone.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const pseudoRandom = (idHash % 100) / 100;
    const density = Math.min(0.98, Number((seed + pseudoRandom * 0.2).toFixed(2)));
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
          eventType: 'FIFA World Cup Group Stage',
          matchImportance: 8,
          weatherCondition: 'Clear, 23°C',
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
            <h1 className="text-2xl font-bold tracking-tight">Crowd Flow Intelligence</h1>
            <p className="text-xs text-muted-foreground">Monitor real-time concourse occupancy, trigger alerts, and run predictive flow analytics</p>
          </div>
          <ActionButton variant="accent" size="sm" onClick={getAiCrowdInsights} loading={loading}>
            <Sparkles className="h-4 w-4" />
            Predict Crowd Flow
          </ActionButton>
        </div>

        {/* Heatmap visualization and active recommendations */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map simulator */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interactive Stadium Map with Crowd Heatmap */}
            <GlassCard variant="default" className="p-0 overflow-hidden relative aspect-[16/9] w-full flex flex-col justify-between border border-border">
              <LeafletMap
                lat={stadium.coordinates.lat}
                lng={stadium.coordinates.lng}
                heatmapZones={stadium.zones.map((zone, idx) => {
                  const angle = (idx / stadium.zones.length) * 2 * Math.PI;
                  const latOffset = Math.sin(angle) * 0.0015;
                  const lngOffset = Math.cos(angle) * 0.0015;
                  const densitySeed = (zone.name.length * (zone.level + 1)) % 10;
                  const density = densitySeed / 10;
                  return {
                    name: zone.name,
                    latOffset,
                    lngOffset,
                    density,
                  };
                })}
              />
              {/* Status overlay */}
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <FifaBadge variant="success" pulse>
                  Live Heatmap Connected
                </FifaBadge>
              </div>
            </GlassCard>

            {/* AI Predictions printout */}
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
