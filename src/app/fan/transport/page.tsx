// src/app/fan/transport/page.tsx
// Fan Transit Planner — Recommends public transportation options and compares carbon foot prints
'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useStadiumStore } from '@/store/stadium-store';
import { stadiums } from '@/data/stadiums';
import { GlassCard } from '@/components/ui/GlassCard';
import { FifaBadge } from '@/components/ui/FifaBadge';
import { Bus, Clock, DollarSign, ShieldAlert, Leaf } from 'lucide-react';

interface TransportStatus {
  mode: string;
  status: string;
  message: string;
}

export default function FanTransport() {
  const { selectedStadiumId } = useStadiumStore();
  const stadium = stadiums.find((s) => s.id === selectedStadiumId) || stadiums[0];

  const [statuses, setStatuses] = useState<TransportStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  useEffect(() => {
    async function fetchTransitStatus() {
      try {
        setLoading(true);
        const res = await fetch(`/api/transport/${selectedStadiumId}`);
        const contentType = res.headers.get('content-type') ?? '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          setStatuses(data.status);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchAIAdvice() {
      try {
        setLoadingAdvice(true);
        setAiAdvice(null);
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `Recommend the best transit option, departure times, estimated arrival, alternative routing, and carbon impact comparisons to reach ${stadium.name} from the local city hub.`,
            language: 'en',
            stadiumId: selectedStadiumId,
            module: 'transport',
          }),
        });
        const contentType = res.headers.get('content-type') ?? '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          setAiAdvice(data.message);
        }
      } catch (err) {
        console.error(err);
        setAiAdvice('Unable to generate AI transit recommendations. Please try again.');
      } finally {
        setLoadingAdvice(false);
      }
    }

    fetchTransitStatus();
    fetchAIAdvice();
  }, [selectedStadiumId, stadium.name]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Transit Planner</h1>
            <p className="text-xs text-muted-foreground">Find accessible, sustainable, and real-time transportation to {stadium.name}</p>
          </div>
          <FifaBadge variant="success" pulse>
            Live Schedule Sync
          </FifaBadge>
        </div>

        {/* Real-time alerts */}
        <div className="space-y-3">
          <h2 className="text-base font-bold flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            Live Transit Updates
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />
              ))
            ) : (
              statuses.map((stat, i) => (
                <GlassCard key={i} variant="glass" padding="sm" className="space-y-1.5 border border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wide">{stat.mode}</span>
                    <FifaBadge variant={stat.status === 'on-time' ? 'success' : 'warning'} className="text-[10px]">
                      {stat.status}
                    </FifaBadge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{stat.message}</p>
                </GlassCard>
              ))
            )}
          </div>
        </div>

        {/* Options List */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Options grid */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" />
              Available Transportation Options
            </h2>

            <div className="space-y-3">
              {stadium.transportOptions.map((opt, i) => (
                <GlassCard key={i} variant="default" padding="md" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{opt.name}</span>
                      {opt.ecoFriendly && (
                        <FifaBadge variant="success" className="text-[9px] py-0 gap-0.5">
                          <Leaf className="h-2.5 w-2.5" /> ECO
                        </FifaBadge>
                      )}
                      {opt.accessible && (
                        <FifaBadge variant="info" className="text-[9px] py-0">
                          Accessible
                        </FifaBadge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{opt.description}</p>
                  </div>

                  <div className="flex sm:flex-col items-start sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-border/55">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-3 w-3" /> {opt.estimatedTime || 'N/A'}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <DollarSign className="h-3 w-3" /> {opt.cost || 'Free'}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* AI Eco recommendations banner */}
          <div className="lg:col-span-1">
            <GlassCard variant="glass" className="space-y-4 bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-emerald-500" />
                <h3 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">AI Green Travel Advisor</h3>
              </div>
              {loadingAdvice ? (
                <div className="space-y-2 animate-pulse py-2">
                  <div className="h-3 bg-muted rounded w-5/6" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              ) : (
                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {aiAdvice}
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
