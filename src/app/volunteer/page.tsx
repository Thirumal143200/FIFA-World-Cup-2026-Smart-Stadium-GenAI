// src/app/volunteer/page.tsx
// Volunteer Dashboard Hub — Shift briefs, guidelines, and task reports

'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useStadiumStore } from '@/store/stadium-store';
import { useUserStore } from '@/store/user-store';
import { stadiums } from '@/data/stadiums';
import { GlassCard } from '@/components/ui/GlassCard';
import { FifaBadge } from '@/components/ui/FifaBadge';
import { ActionButton } from '@/components/ui/ActionButton';
import { useRouter } from 'next/navigation';
import { ClipboardList, Sparkles, BookOpen, Clock, MapPin, CheckCircle } from 'lucide-react';

export default function VolunteerHub() {
  const router = useRouter();
  const { selectedStadiumId } = useStadiumStore();
  const { displayName } = useUserStore();
  const stadium = stadiums.find((s) => s.id === selectedStadiumId) || stadiums[0];

  const [loadingBrief, setLoadingBrief] = useState(false);
  const [volunteerBrief, setVolunteerBrief] = useState<string | null>(null);
  const [tasks, setTasks] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: '1', text: 'Verify accessibility path markers at Section 108 corridor', done: false },
    { id: '2', text: 'Check hand sanitizer levels at main food court entry', done: true },
    { id: '3', text: 'Assist guest wayfinding around MetLife Gate B', done: false },
    { id: '4', text: 'Ensure lost-and-found forms are stocked at kiosk C', done: false },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const getAiVolunteerBriefing = async () => {
    setLoadingBrief(true);
    setVolunteerBrief(null);
    try {
      const res = await fetch('/api/ai/operational', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stadiumId: selectedStadiumId,
          currentStaffCount: 120, // volunteer shift specific
          activeIncidentsCount: 2,
          matchStage: 'gates-opening',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setVolunteerBrief(data.insights);
      } else {
        throw new Error(data.error || 'Failed to generate briefing');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setVolunteerBrief(`❌ Briefing Error: ${errMsg}. Stand by for dispatcher radio briefing.`);
    } finally {
      setLoadingBrief(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Hero */}
        <div className="rounded-2xl gradient-fifa p-6 text-white relative overflow-hidden shadow-lg">
          <div className="max-w-2xl space-y-2">
            <FifaBadge variant="outline" className="text-white border-white/30 bg-white/10">
              Volunteer Console
            </FifaBadge>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome, {displayName}!
            </h1>
            <p className="text-white/80 text-xs sm:text-sm">
              Your shift is active at {stadium.name}. Ready to assist fans and support operations.
            </p>
          </div>
        </div>

        {/* Shift Details and Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Shift info Card */}
          <GlassCard variant="default" className="space-y-4">
            <h2 className="font-semibold text-base flex items-center gap-2">
              <Clock className="text-primary h-5 w-5" />
              Your Active Shift
            </h2>
            <div className="space-y-3 text-xs bg-muted/40 p-3 rounded-lg border border-border/40">
              <div className="flex items-center justify-between">
                <span>Duty Assignment</span>
                <strong className="text-primary">Guest Services / Wayfinding</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Shift Duration</span>
                <strong>15:30 - 23:30</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Assigned Sector</span>
                <strong>Level 1 Concourse Gate A</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Supervisor Contact</span>
                <strong className="font-mono">Ext. 402</strong>
              </div>
            </div>
            <div className="grid gap-2 grid-cols-2 pt-2">
              <ActionButton variant="outline" size="sm" fullWidth onClick={() => router.push('/volunteer/incidents')}>
                Log Incident
              </ActionButton>
              <ActionButton variant="outline" size="sm" fullWidth onClick={() => router.push('/volunteer/crowd')}>
                Crowd Flow
              </ActionButton>
            </div>
          </GlassCard>

          {/* Task List Checkbox Card */}
          <GlassCard variant="default" className="space-y-4">
            <h2 className="font-semibold text-base flex items-center gap-2">
              <ClipboardList className="text-primary h-5 w-5" />
              Shift Checklists
            </h2>
            <div className="space-y-2 text-xs">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="w-full flex items-start gap-2.5 text-left p-2 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors border border-border/20 cursor-pointer"
                >
                  <CheckCircle className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${task.done ? 'text-emerald-500 fill-emerald-500/10' : 'text-muted-foreground'}`} />
                  <span className={task.done ? 'line-through text-muted-foreground' : 'font-medium'}>
                    {task.text}
                  </span>
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Guidelines Card */}
          <GlassCard variant="default" className="space-y-4">
            <h2 className="font-semibold text-base flex items-center gap-2">
              <BookOpen className="text-primary h-5 w-5" />
              Volunteer Code
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ensure all attendees receive welcoming, respectful, and prompt assistance. Review safety logs regularly and coordinate high-severity incidents directly with the Command Center.
            </p>
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 flex gap-2 items-start text-xs text-primary">
              <MapPin className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>Sensory & first aid maps are accessible in your navigation console.</span>
            </div>
          </GlassCard>
        </div>

        {/* AI Briefing Panel */}
        <GlassCard variant="glass" className="space-y-4 border-primary/20 bg-primary/5">
          <div className="flex justify-between items-center border-b border-primary/10 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-base">AI Volunteer Shift Briefing</h3>
            </div>
            <ActionButton variant="fifa" size="sm" onClick={getAiVolunteerBriefing} loading={loadingBrief}>
              Fetch Shift Briefing
            </ActionButton>
          </div>

          {volunteerBrief ? (
            <div className="text-sm prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
              {volunteerBrief}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Click the button above to receive real-time, AI-summarized insights on stadium crowd projections, pending incidents, and task focus recommendations for your active zone.
            </p>
          )}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
