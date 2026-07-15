// src/app/fan/page.tsx
// Fan Hub Dashboard — Main Fan landing point with interactive match day cards
'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useStadiumStore } from '@/store/stadium-store';
import { useUserStore } from '@/store/user-store';
import { stadiums } from '@/data/stadiums';
import { GlassCard } from '@/components/ui/GlassCard';
import { FifaBadge } from '@/components/ui/FifaBadge';
import { ActionButton } from '@/components/ui/ActionButton';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  CloudSun,
  Bus,
  Accessibility,
  Leaf,
  MessageSquare,
  AlertTriangle,
  Flame,
} from 'lucide-react';

export default function FanHub() {
  const router = useRouter();
  const { selectedStadiumId } = useStadiumStore();
  const { displayName } = useUserStore();

  const stadium = stadiums.find((s) => s.id === selectedStadiumId) || stadiums[0];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Hero banner */}
        <div className="rounded-2xl gradient-fifa p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-10 translate-x-10">
            <Flame className="h-64 w-64" />
          </div>

          <div className="max-w-2xl space-y-2">
            <FifaBadge variant="outline" className="text-white border-white/30 bg-white/10">
              Match Day Mode Active
            </FifaBadge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome, {displayName}!
            </h1>
            <p className="text-white/80 text-sm sm:text-base">
              You are currently viewing {stadium.name} in {stadium.city}. Let's make your match day experience smooth and enjoyable.
            </p>
          </div>
        </div>

        {/* Stadium Snapshot */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1: Stadium Info */}
          <GlassCard variant="default" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Stadium Venue</h2>
              <MapPin className="text-primary h-5 w-5" />
            </div>
            <div className="aspect-video w-full rounded-lg bg-muted relative overflow-hidden flex items-center justify-center">
              <span className="text-xs text-muted-foreground font-mono">[ Stadium Image Placeholder ]</span>
            </div>
            <div>
              <h3 className="font-bold text-base">{stadium.name}</h3>
              <p className="text-xs text-muted-foreground">{stadium.city}, {stadium.state}, {stadium.country}</p>
              <p className="text-xs mt-2 text-muted-foreground line-clamp-2">{stadium.description}</p>
            </div>
          </GlassCard>

          {/* Card 2: Upcoming Match */}
          <GlassCard variant="default" className="space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Upcoming Match</h2>
                <Calendar className="text-fifa-purple h-5 w-5" />
              </div>
              <div className="space-y-3 bg-muted/50 p-3 rounded-lg border border-border/50 text-center">
                <FifaBadge variant="fifa" className="text-[10px]">GROUP STAGE</FifaBadge>
                <div className="flex items-center justify-center gap-4 py-2">
                  <span className="font-bold text-sm">USA</span>
                  <span className="text-xs text-muted-foreground font-mono">VS</span>
                  <span className="font-bold text-sm">MEXICO</span>
                </div>
                <p className="text-xs text-muted-foreground">Tomorrow • 19:30 Local Time</p>
              </div>
            </div>
            <ActionButton variant="primary" fullWidth onClick={() => router.push('/fan/navigate')}>
              Get Seat Directions
            </ActionButton>
          </GlassCard>

          {/* Card 3: Live Weather / Crowds */}
          <GlassCard variant="default" className="space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Live Conditions</h2>
                <CloudSun className="text-amber-500 h-5 w-5" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 p-3 rounded-lg border border-border/50 text-center">
                  <div className="text-2xl font-bold">24°C</div>
                  <div className="text-[10px] text-muted-foreground">Clear Weather</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg border border-border/50 text-center">
                  <div className="text-2xl font-bold text-emerald-500">Low</div>
                  <div className="text-[10px] text-muted-foreground">Crowd Density</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Stadium gates open at 16:30. Travel via public transit is highly recommended to avoid road closures.
              </p>
            </div>
            <ActionButton variant="outline" fullWidth onClick={() => router.push('/fan/transport')}>
              Transit Directions
            </ActionButton>
          </GlassCard>
        </div>

        {/* AI quick help grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">AI Assistance Shortcuts</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => router.push('/fan/chat')}
              className="text-left focus:outline-none focus:ring-2 focus:ring-ring rounded-xl"
            >
              <GlassCard hover className="flex gap-4 items-start h-full">
                <MessageSquare className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Multilingual Chat</h3>
                  <p className="text-xs text-muted-foreground mt-1">Ask questions or translate phrases in 30+ languages.</p>
                </div>
              </GlassCard>
            </button>

            <button
              onClick={() => router.push('/fan/accessibility')}
              className="text-left focus:outline-none focus:ring-2 focus:ring-ring rounded-xl"
            >
              <GlassCard hover className="flex gap-4 items-start h-full">
                <Accessibility className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Accessibility Support</h3>
                  <p className="text-xs text-muted-foreground mt-1">Request wheelchair navigation or sensory-friendly options.</p>
                </div>
              </GlassCard>
            </button>

            <button
              onClick={() => router.push('/fan/sustainability')}
              className="text-left focus:outline-none focus:ring-2 focus:ring-ring rounded-xl"
            >
              <GlassCard hover className="flex gap-4 items-start h-full">
                <Leaf className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Eco-Score</h3>
                  <p className="text-xs text-muted-foreground mt-1">Calculate your travel carbon footprint and win eco-rewards.</p>
                </div>
              </GlassCard>
            </button>

            <button
              onClick={() => router.push('/emergency')}
              className="text-left focus:outline-none focus:ring-2 focus:ring-ring rounded-xl"
            >
              <GlassCard hover className="flex gap-4 items-start h-full border-red-500/30 bg-red-500/5">
                <AlertTriangle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm text-red-600 dark:text-red-400">Emergency Protocol</h3>
                  <p className="text-xs text-muted-foreground mt-1">Instant medical or safety instructions with active tracking.</p>
                </div>
              </GlassCard>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
