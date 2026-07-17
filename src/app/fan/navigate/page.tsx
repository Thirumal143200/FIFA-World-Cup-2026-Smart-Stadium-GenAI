// src/app/fan/navigate/page.tsx
// AI Stadium Navigator — Explains turn-by-turn route directions and features interactive maps
'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useStadiumStore } from '@/store/stadium-store';
import { useUserStore } from '@/store/user-store';
import { stadiums } from '@/data/stadiums';
import { GlassCard } from '@/components/ui/GlassCard';
import { FifaBadge } from '@/components/ui/FifaBadge';
import { ActionButton } from '@/components/ui/ActionButton';
import { Navigation, ArrowRight, Accessibility } from 'lucide-react';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('@/components/ui/LeafletMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-muted text-xs text-muted-foreground min-h-[300px]">Loading interactive map...</div>
});

export default function FanNavigate() {
  const { selectedStadiumId } = useStadiumStore();
  const { accessibility } = useUserStore();
  const stadium = stadiums.find((s) => s.id === selectedStadiumId) || stadiums[0];

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [hotel, setHotel] = useState('');
  const [parking, setParking] = useState('');
  const [seat, setSeat] = useState('');
  const [transportPreference, setTransportPreference] = useState('Metro');
  const [loading, setLoading] = useState(false);
  const [routeExplanation, setRouteExplanation] = useState<string | null>(null);

  const handleNavigate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from.trim() || !to.trim() || loading) return;

    setLoading(true);
    setRouteExplanation(null);

    try {
      const response = await fetch('/api/ai/navigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from,
          to,
          stadiumId: selectedStadiumId,
          accessibilityNeeds: accessibility.enabled
            ? Object.entries(accessibility.mobility)
                .filter(([, v]) => v === true)
                .map(([k]) => k)
            : [],
          avoidCrowded: true,
          hotel,
          parking,
          seat,
          transportPreference,
        }),
      });

      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        throw new Error(`Server returned ${response.status} (non-JSON). Navigation service may be unavailable.`);
      }
      const data = await response.json();
      if (response.ok) {
        setRouteExplanation(data.route);
      } else {
        throw new Error(data.error || 'Failed to get route');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setRouteExplanation(`❌ Navigation Error: ${errMsg}. Please verify locations inside the stadium.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Stadium Navigator</h1>
          <p className="text-xs text-muted-foreground">Get accessible, crowds-optimized turn-by-turn directions within {stadium.name}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Controls form */}
          <div className="space-y-6 lg:col-span-1">
            <GlassCard variant="default" className="space-y-4">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <Navigation className="h-5 w-5 text-primary" />
                Route Planner
              </h2>

              <form onSubmit={handleNavigate} className="space-y-4">
                <div>
                  <label htmlFor="from-input" className="block text-xs font-semibold text-muted-foreground mb-1">
                    STARTING LOCATION *
                  </label>
                  <input
                    id="from-input"
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="e.g., Gate B, Parking Lot J"
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="to-input" className="block text-xs font-semibold text-muted-foreground mb-1">
                    DESTINATION *
                  </label>
                  <input
                    id="to-input"
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="e.g., Section 112, Restroom Level 1"
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="hotel-input" className="block text-[10px] font-semibold text-muted-foreground mb-1">
                      HOTEL
                    </label>
                    <input
                      id="hotel-input"
                      type="text"
                      value={hotel}
                      onChange={(e) => setHotel(e.target.value)}
                      placeholder="Hotel name"
                      className="w-full h-9 px-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label htmlFor="parking-input" className="block text-[10px] font-semibold text-muted-foreground mb-1">
                      PARKING LOT
                    </label>
                    <input
                      id="parking-input"
                      type="text"
                      value={parking}
                      onChange={(e) => setParking(e.target.value)}
                      placeholder="e.g., Lot J"
                      className="w-full h-9 px-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="seat-input" className="block text-[10px] font-semibold text-muted-foreground mb-1">
                      SEAT NUMBER
                    </label>
                    <input
                      id="seat-input"
                      type="text"
                      value={seat}
                      onChange={(e) => setSeat(e.target.value)}
                      placeholder="e.g., Sec 112 Row D"
                      className="w-full h-9 px-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label htmlFor="transport-select" className="block text-[10px] font-semibold text-muted-foreground mb-1">
                      TRANSIT TYPE
                    </label>
                    <select
                      id="transport-select"
                      value={transportPreference}
                      onChange={(e) => setTransportPreference(e.target.value)}
                      className="w-full h-9 px-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="Metro">Metro</option>
                      <option value="Bus">Bus</option>
                      <option value="Taxi">Taxi</option>
                      <option value="Ride Share">Ride Share</option>
                      <option value="Walking">Walking</option>
                    </select>
                  </div>
                </div>

                {accessibility.enabled && (
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 flex gap-2.5 items-start">
                    <Accessibility className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <div className="font-semibold text-primary">Accessibility Profile Active</div>
                      <div className="text-muted-foreground">Route will automatically prefer elevators, ramps, and accessible entries.</div>
                    </div>
                  </div>
                )}

                <ActionButton type="submit" variant="fifa" fullWidth loading={loading}>
                  Generate Smart Route
                </ActionButton>
              </form>
            </GlassCard>

            {/* Quick Destinations */}
            <GlassCard variant="default" className="space-y-3">
              <h3 className="font-semibold text-sm">Common Destinations</h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => { setFrom('Gate A'); setTo('Section 124 (First Aid)'); }}
                  className="w-full flex items-center justify-between text-left text-xs p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border/40"
                >
                  <span>Gate A → First Aid Station</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => { setFrom('Section 110'); setTo('Sensory Room Level 2'); }}
                  className="w-full flex items-center justify-between text-left text-xs p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border/40"
                >
                  <span>Section 110 → Sensory Room</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => { setFrom('Gate B'); setTo('Section 214 (Seating)'); }}
                  className="w-full flex items-center justify-between text-left text-xs p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border/40"
                >
                  <span>Gate B → Seating Section 214</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </GlassCard>
          </div>

          {/* Results + Map visualization */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interactive Stadium Map */}
            <GlassCard variant="default" className="p-0 overflow-hidden relative aspect-[16/9] w-full flex flex-col justify-between border border-border">
              <LeafletMap
                lat={stadium.coordinates.lat}
                lng={stadium.coordinates.lng}
                stadiumId={selectedStadiumId}
                navigationPath={from && to ? { fromName: from, toName: to } : undefined}
              />
              {/* Status overlay */}
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <FifaBadge variant="success" pulse>
                  Live OpenStreetMap Active
                </FifaBadge>
              </div>

              {/* Map Legend Panel */}
              <div className="absolute bottom-4 right-4 z-10 bg-background/90 backdrop-blur-md border border-border/80 p-2.5 rounded-lg shadow-lg text-[10px] space-y-1.5 w-36 select-none">
                <div className="font-bold text-[9px] uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-1 mb-1">
                  Map Legend
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  <div className="flex items-center gap-1"><span>🚪</span> <span className="truncate">Gate</span></div>
                  <div className="flex items-center gap-1"><span>🏥</span> <span className="truncate">Medical</span></div>
                  <div className="flex items-center gap-1"><span>🍔</span> <span className="truncate">Food</span></div>
                  <div className="flex items-center gap-1"><span>🏪</span> <span className="truncate">Shop</span></div>
                  <div className="flex items-center gap-1"><span>🧠</span> <span className="truncate">Sensory</span></div>
                  <div className="flex items-center gap-1"><span>ℹ️</span> <span className="truncate">Info</span></div>
                </div>
              </div>
            </GlassCard>

            {/* Directions Output */}
            {routeExplanation && (
              <GlassCard variant="glass" className="space-y-4 border border-border/60">
                <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-base">Route Navigation Details</h3>
                </div>
                <div className="text-sm prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                  {routeExplanation}
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
