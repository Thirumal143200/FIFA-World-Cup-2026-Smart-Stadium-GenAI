// src/app/emergency/page.tsx
// SOS Emergency Hub — High-visibility quick-access safety page
'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { FifaBadge } from '@/components/ui/FifaBadge';
import { useStadiumStore } from '@/store/stadium-store';
import { AlertOctagon, ShieldAlert, Phone, ArrowLeft, Heart, Flame, Activity, Eye, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmergencyHub() {
  const router = useRouter();
  const { selectedStadiumId } = useStadiumStore();

  const [loading, setLoading] = useState(false);
  const [protocol, setProtocol] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);

  const triggerSOS = async (type: string) => {
    setLoading(true);
    setProtocol(null);
    setSelectedIncident(type);

    try {
      const res = await fetch('/api/ai/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stadiumId: selectedStadiumId,
          incidentType: type,
          currentLocation: 'Concourse Level 1 Section 112',
          severity: 'critical',
        }),
      });

      const contentType = res.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        throw new Error(`Server returned ${res.status} (non-JSON response). The emergency API may be unreachable.`);
      }
      const data = await res.json();
      if (res.ok) {
        setProtocol(data.protocol);
      } else {
        throw new Error(data.error || 'Failed to get protocol');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setProtocol(`❌ SOS Error: ${errMsg}. Please report directly to nearest security officer.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-950/20 dark:bg-black text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        {/* SOS Alert Banner */}
        <div className="rounded-2xl bg-red-600 p-6 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
          <div className="space-y-1.5">
            <FifaBadge variant="outline" className="text-white border-white/30 bg-white/10 font-bold">
              CRITICAL SAFETY CONSOLE
            </FifaBadge>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">SOS EMERGENCY ASSIST</h1>
            <p className="text-white/80 text-xs sm:text-sm">
              Press one of the triggers below for instant response protocols, first-aid, or evacuation routes.
            </p>
          </div>
          <AlertOctagon className="h-20 w-20 opacity-10 absolute right-0 bottom-0 pointer-events-none" />
        </div>

        {/* Triggers */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => triggerSOS('Medical Emergency')}
            className="text-left focus:outline-none focus:ring-2 focus:ring-red-500 rounded-xl"
            disabled={loading}
          >
            <GlassCard hover className="bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 flex flex-col justify-between h-full p-5 space-y-4">
              <Heart className="h-7 w-7 text-red-500" />
              <div>
                <h2 className="font-extrabold text-sm">Medical Emergency</h2>
                <p className="text-[11px] text-muted-foreground mt-1">Cardiac distress, heat stroke, physical trauma.</p>
              </div>
            </GlassCard>
          </button>

          <button
            onClick={() => triggerSOS('Fire')}
            className="text-left focus:outline-none focus:ring-2 focus:ring-red-500 rounded-xl"
            disabled={loading}
          >
            <GlassCard hover className="bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/20 flex flex-col justify-between h-full p-5 space-y-4">
              <Flame className="h-7 w-7 text-orange-500" />
              <div>
                <h2 className="font-extrabold text-sm">Fire / Smoke</h2>
                <p className="text-[11px] text-muted-foreground mt-1">Localized fires, active smoke detector warnings.</p>
              </div>
            </GlassCard>
          </button>

          <button
            onClick={() => triggerSOS('Missing Child')}
            className="text-left focus:outline-none focus:ring-2 focus:ring-red-500 rounded-xl"
            disabled={loading}
          >
            <GlassCard hover className="bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/20 flex flex-col justify-between h-full p-5 space-y-4">
              <AlertOctagon className="h-7 w-7 text-purple-500" />
              <div>
                <h2 className="font-extrabold text-sm">Missing Child</h2>
                <p className="text-[11px] text-muted-foreground mt-1">Report lost children or family separation instantly.</p>
              </div>
            </GlassCard>
          </button>

          <button
            onClick={() => triggerSOS('Suspicious Activity')}
            className="text-left focus:outline-none focus:ring-2 focus:ring-red-500 rounded-xl"
            disabled={loading}
          >
            <GlassCard hover className="bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 flex flex-col justify-between h-full p-5 space-y-4">
              <Eye className="h-7 w-7 text-blue-500" />
              <div>
                <h2 className="font-extrabold text-sm">Suspicious Activity</h2>
                <p className="text-[11px] text-muted-foreground mt-1">Unattended luggage, suspicious behaviors near gates.</p>
              </div>
            </GlassCard>
          </button>

          <button
            onClick={() => triggerSOS('Stampede')}
            className="text-left focus:outline-none focus:ring-2 focus:ring-red-500 rounded-xl"
            disabled={loading}
          >
            <GlassCard hover className="bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 flex flex-col justify-between h-full p-5 space-y-4">
              <Activity className="h-7 w-7 text-rose-500" />
              <div>
                <h2 className="font-extrabold text-sm">Stampede / Crowd Crush</h2>
                <p className="text-[11px] text-muted-foreground mt-1">Congestion peaks, gate line surges, crush hazards.</p>
              </div>
            </GlassCard>
          </button>

          <button
            onClick={() => triggerSOS('Lost Property')}
            className="text-left focus:outline-none focus:ring-2 focus:ring-red-500 rounded-xl"
            disabled={loading}
          >
            <GlassCard hover className="bg-teal-500/5 hover:bg-teal-500/10 border border-teal-500/20 flex flex-col justify-between h-full p-5 space-y-4">
              <Briefcase className="h-7 w-7 text-teal-500" />
              <div>
                <h2 className="font-extrabold text-sm">Lost Property</h2>
                <p className="text-[11px] text-muted-foreground mt-1">Recover lost electronics, passports, wallet logs.</p>
              </div>
            </GlassCard>
          </button>
        </div>

        {/* SOS response details */}
        {selectedIncident && (
          <GlassCard variant="glass" className="space-y-4 border border-red-500/30 bg-red-500/5">
            <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                <h3 className="font-bold text-base capitalize">{selectedIncident} Response Protocol</h3>
              </div>
              <FifaBadge variant="danger" pulse>
                AI Dispatching
              </FifaBadge>
            </div>

            {loading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            ) : (
              <div className="text-sm prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                {protocol}
              </div>
            )}
          </GlassCard>
        )}

        {/* Emergency Contacts List */}
        <GlassCard variant="default" className="space-y-4">
          <h2 className="font-bold text-base flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Operational Hotlines
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <div className="p-3 bg-muted/40 rounded-xl flex items-center justify-between border border-border/40">
              <span>🚑 Medical response crew</span>
              <span className="font-mono font-bold text-primary">Extension 900</span>
            </div>
            <div className="p-3 bg-muted/40 rounded-xl flex items-center justify-between border border-border/40">
              <span>👮 Security Dispatch</span>
              <span className="font-mono font-bold text-primary">Extension 911</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
