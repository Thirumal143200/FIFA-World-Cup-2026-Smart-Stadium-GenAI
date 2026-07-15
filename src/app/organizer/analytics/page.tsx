// src/app/organizer/analytics/page.tsx
// Operational Analytics — Displays logistic graphs, volunteer counts, and response speeds
'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useStadiumStore } from '@/store/stadium-store';
import { stadiums } from '@/data/stadiums';
import { GlassCard } from '@/components/ui/GlassCard';
import { FifaBadge } from '@/components/ui/FifaBadge';
import { BarChart3, Clock, ShieldAlert } from 'lucide-react';

export default function OrganizerAnalytics() {
  const { selectedStadiumId } = useStadiumStore();
  const stadium = stadiums.find((s) => s.id === selectedStadiumId) || stadiums[0];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Operations Analytics</h1>
          <p className="text-xs text-muted-foreground">Historical data log summaries, logistics efficiency, and safety response speeds at {stadium.name}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1: Gate queue speeds */}
          <GlassCard variant="default" className="space-y-4">
            <h2 className="font-semibold text-sm flex items-center justify-between">
              Gate Queue Times
              <Clock className="h-4 w-4 text-primary" />
            </h2>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span>Gate A</span>
                <span className="font-mono font-bold text-yellow-500">2.1m wait</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Gate B</span>
                <span className="font-mono font-bold text-emerald-500">1.2m wait</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>VIP Gate</span>
                <span className="font-mono font-bold text-emerald-500">45s wait</span>
              </div>
            </div>
          </GlassCard>

          {/* Card 2: Incident Response Delay */}
          <GlassCard variant="default" className="space-y-4">
            <h2 className="font-semibold text-sm flex items-center justify-between">
              Incident Response
              <ShieldAlert className="h-4 w-4 text-red-500" />
            </h2>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span>Avg Dispatch Time</span>
                <span className="font-mono font-bold">42 seconds</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Avg Resolution Time</span>
                <span className="font-mono font-bold">4.8 minutes</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Units Active</span>
                <span className="font-mono font-bold text-primary">12 crews</span>
              </div>
            </div>
          </GlassCard>

          {/* Card 3: Transit Share */}
          <GlassCard variant="default" className="space-y-4">
            <h2 className="font-semibold text-sm flex items-center justify-between">
              Transit Selection
              <BarChart3 className="h-4 w-4 text-primary" />
            </h2>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span>Meadowlands Rail</span>
                <span className="font-mono font-bold">54% share</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Fan Shuttles</span>
                <span className="font-mono font-bold">28% share</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Private Drive / Rideshare</span>
                <span className="font-mono font-bold">18% share</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Historical match summary details */}
        <GlassCard variant="default" className="space-y-4">
          <h2 className="font-semibold text-base">Match Operations Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-muted-foreground uppercase font-bold">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Match Event</th>
                  <th className="py-2.5 px-3">Attendance</th>
                  <th className="py-2.5 px-3">Incidents Resolved</th>
                  <th className="py-2.5 px-3">Eco Score</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-3 px-3 font-mono">2026-06-11</td>
                  <td className="py-3 px-3">Group Stage • USA vs Mexico</td>
                  <td className="py-3 px-3">72,450</td>
                  <td className="py-3 px-3">4</td>
                  <td className="py-3 px-3">
                    <FifaBadge variant="success">87</FifaBadge>
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-3 px-3 font-mono">2026-06-18</td>
                  <td className="py-3 px-3">Group Stage • Canada vs Brazil</td>
                  <td className="py-3 px-3">68,200</td>
                  <td className="py-3 px-3">2</td>
                  <td className="py-3 px-3">
                    <FifaBadge variant="success">89</FifaBadge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
