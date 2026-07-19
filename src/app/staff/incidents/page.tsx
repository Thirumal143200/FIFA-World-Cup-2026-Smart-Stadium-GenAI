// src/app/staff/incidents/page.tsx
// Incident Log Management — allows reporting, claiming, and notes logging
'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useStadiumStore } from '@/store/stadium-store';
import { useUserStore } from '@/store/user-store';
import { stadiums } from '@/data/stadiums';
import { GlassCard } from '@/components/ui/GlassCard';
import { FifaBadge } from '@/components/ui/FifaBadge';
import { ActionButton } from '@/components/ui/ActionButton';
import { AlertTriangle, Plus, ShieldCheck } from 'lucide-react';
import type { Incident } from '@/types';
import { useIncidents } from '@/hooks/useIncidents';

export default function StaffIncidents() {
  const { selectedStadiumId } = useStadiumStore();
  const { displayName, role } = useUserStore();
  const stadium = stadiums.find((s) => s.id === selectedStadiumId) || stadiums[0];

  const { incidents, loading, reportIncident, updateIncidentStatus } = useIncidents(selectedStadiumId);

  // Report form state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<'medical' | 'security' | 'fire' | 'weather' | 'structural' | 'other'>('medical');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [zoneId, setZoneId] = useState(stadium.zones[0]?.id || '');
  const [landmark, setLandmark] = useState('');
  const [reporting, setReporting] = useState(false);

  interface AISummary {
    priority?: string;
    recommendedStaff?: string;
    suggestedResponse?: string;
    operationalSummary?: string;
  }

  const [loadingAI, setLoadingAI] = useState(false);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);

  const handleAISummarize = async () => {
    if (!desc.trim() || loadingAI) return;
    setLoadingAI(true);
    setAiSummary(null);
    try {
      const res = await fetch('/api/ai/incident-summarizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: desc }),
      });
      const contentType = res.headers.get('content-type') ?? '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.summary) {
          setTitle(data.summary.title || '');
          setCategory(data.summary.category || 'other');
          setSeverity(data.summary.severity || 'medium');
          setAiSummary(data.summary);
        }
      }
    } catch (err) {
      console.error('Incident AI Summary error:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  // Response / notes form
  const [activeNotesId, setActiveNotesId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim() || reporting) return;

    setReporting(true);
    const selectedZoneName = stadium.zones.find((z) => z.id === zoneId)?.name || 'Stadium Zone';

    try {
      const success = await reportIncident({
        category,
        severity,
        title,
        description: desc,
        location: {
          zoneId,
          zoneName: selectedZoneName,
          landmark,
        },
        reportedBy: {
          name: displayName,
          role,
        },
      });

      if (success) {
        setTitle('');
        setDesc('');
        setLandmark('');
        setShowForm(false);
        setAiSummary(null);
      }
    } finally {
      setReporting(false);
    }
  };

  const handleUpdateStatus = async (id: string, nextStatus: 'acknowledged' | 'in-progress' | 'resolved', appendNote?: string) => {
    setUpdating(true);
    try {
      const success = await updateIncidentStatus(id, nextStatus, {
        userId: 'current-user-id',
        name: displayName,
        role,
        notes: appendNote,
      });

      if (success) {
        setNotes('');
        setActiveNotesId(null);
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Incident Management Log</h1>
            <p className="text-xs text-muted-foreground">Report new incidents, assign response units, and resolve active stadium emergency logs</p>
          </div>
          <ActionButton variant="primary" className="gap-1.5" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" />
            Report Incident
          </ActionButton>
        </div>

        {/* Report form dropdown */}
        {showForm && (
          <GlassCard variant="default" className="space-y-4">
            <h2 className="font-semibold text-base flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Report New Incident
            </h2>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">INCIDENT TITLE</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Water spill, Medical support required"
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">LOCATION ZONE</label>
                <select
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {stadium.zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">CATEGORY</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as 'medical' | 'security' | 'fire' | 'weather' | 'structural' | 'other')}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="medical">Medical / First Aid</option>
                  <option value="security">Security / Dispute</option>
                  <option value="fire">Fire / Smoke</option>
                  <option value="weather">Severe Weather</option>
                  <option value="structural">Structural / Facilities</option>
                  <option value="other">Other / Support</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">SEVERITY LEVEL</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as 'low' | 'medium' | 'high' | 'critical')}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="low">Low (Spills, light fixes)</option>
                  <option value="medium">Medium (Disputes, guidance)</option>
                  <option value="high">High (Fights, heat exhaustion)</option>
                  <option value="critical">Critical (Unconscious, structural danger)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">LANDMARK / DETAILS</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g., Near concession stand B4, lower entry corridor"
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-muted-foreground">DESCRIPTION</label>
                  <button
                    type="button"
                    onClick={handleAISummarize}
                    disabled={!desc.trim() || loadingAI}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 disabled:opacity-50 transition-colors uppercase"
                  >
                    ✨ AI Structure Report
                  </button>
                </div>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="e.g., There are too many people near Gate B."
                  className="w-full p-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-20"
                  required
                />
              </div>

              {/* AI Structured Outputs */}
              {aiSummary && (
                <div className="sm:col-span-2 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-400">
                    <span>✨ AI Structured Recommendation:</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3 text-xs">
                    <div className="p-2.5 bg-background/50 rounded-lg border border-border/40">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">Priority</span>
                      <strong className="text-emerald-400 capitalize">{aiSummary.priority || 'Medium'}</strong>
                    </div>
                    <div className="p-2.5 bg-background/50 rounded-lg border border-border/40">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">Recommended Staff</span>
                      <strong className="text-slate-200">{aiSummary.recommendedStaff || 'Security Patrol'}</strong>
                    </div>
                    <div className="p-2.5 bg-background/50 rounded-lg border border-border/40">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">Suggested Response</span>
                      <p className="text-slate-300 font-medium leading-relaxed mt-0.5">{aiSummary.suggestedResponse}</p>
                    </div>
                  </div>
                  <div className="text-xs border-t border-border/20 pt-2 text-slate-300 leading-relaxed">
                    <strong>Operational Summary:</strong> {aiSummary.operationalSummary}
                  </div>
                </div>
              )}

              <div className="sm:col-span-2 flex justify-end gap-2.5">
                <ActionButton variant="outline" type="button" onClick={() => { setShowForm(false); setAiSummary(null); }}>
                  Cancel
                </ActionButton>
                <ActionButton variant="primary" type="submit" loading={reporting}>
                  Submit Report
                </ActionButton>
              </div>
            </form>
          </GlassCard>
        )}

        {/* Incident Logs List */}
        <div className="space-y-4">
          <h2 className="text-base font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Active Stadium Log
          </h2>

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />
              ))
            ) : incidents.length === 0 ? (
              <GlassCard variant="default" className="text-center p-8 text-muted-foreground">
                No reported incidents found.
              </GlassCard>
            ) : (
              incidents.map((inc) => (
                <GlassCard key={inc.id} variant="default" className="space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-base">{inc.title}</span>
                      <FifaBadge variant="default" className="text-[10px] uppercase font-bold bg-muted/80 text-foreground">
                        {inc.category}
                      </FifaBadge>
                      <FifaBadge variant={inc.severity === 'critical' || inc.severity === 'high' ? 'danger' : 'warning'} className="text-[10px]">
                        {inc.severity.toUpperCase()}
                      </FifaBadge>
                      <FifaBadge variant={inc.status === 'resolved' ? 'success' : 'info'} className="text-[10px] uppercase">
                        {inc.status.replace('-', ' ')}
                      </FifaBadge>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      Reported: {new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">{inc.description}</p>

                  <div className="text-xs text-muted-foreground flex flex-wrap gap-4 border-t border-border/30 pt-2.5">
                    <span>📍 Zone: <strong>{inc.location.zoneName}</strong></span>
                    {inc.location.landmark && <span>📍 Landmark: <strong>{inc.location.landmark}</strong></span>}
                    <span>👤 Reported By: <strong>{inc.reportedBy.name} ({inc.reportedBy.role})</strong></span>
                  </div>

                  {/* Actions Bar */}
                  {inc.status !== 'resolved' && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border/20 justify-end items-center">
                      {inc.status === 'reported' && (
                        <ActionButton
                          variant="outline"
                          size="sm"
                          loading={updating}
                          onClick={() => handleUpdateStatus(inc.id, 'acknowledged', 'Incident claimed by responder.')}
                        >
                          Acknowledge
                        </ActionButton>
                      )}
                      {inc.status === 'acknowledged' && (
                        <ActionButton
                          variant="accent"
                          size="sm"
                          loading={updating}
                          onClick={() => handleUpdateStatus(inc.id, 'in-progress', 'Dispatched response units.')}
                        >
                          Dispatch Units
                        </ActionButton>
                      )}
                      {inc.status === 'in-progress' && (
                        <div className="w-full sm:w-auto flex items-center gap-2">
                          <input
                            type="text"
                            value={activeNotesId === inc.id ? notes : ''}
                            onChange={(e) => { setActiveNotesId(inc.id); setNotes(e.target.value); }}
                            placeholder="Add action notes to resolve..."
                            className="h-8 px-2 flex-1 sm:w-60 rounded border border-border bg-background text-xs"
                          />
                          <ActionButton
                            variant="primary"
                            size="sm"
                            loading={updating}
                            disabled={!notes.trim()}
                            onClick={() => handleUpdateStatus(inc.id, 'resolved', notes)}
                          >
                            Resolve
                          </ActionButton>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Responder Updates list */}
                  {inc.responses.length > 0 && (
                    <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border/40 space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Action Updates</div>
                      {inc.responses.map((resp) => (
                        <div key={resp.id} className="text-xs flex gap-2 items-start justify-between">
                          <div>
                            <span className="font-semibold">{resp.performedBy}:</span> {resp.action}
                          </div>
                          <span className="text-[10px] text-muted-foreground/80 shrink-0">
                            {new Date(resp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
