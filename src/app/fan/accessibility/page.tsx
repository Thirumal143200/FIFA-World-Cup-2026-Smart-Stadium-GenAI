// src/app/fan/accessibility/page.tsx
// Accessibility Support — Modifies visual / mobility options and details accommodations
'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useUserStore } from '@/store/user-store';
import { useStadiumStore } from '@/store/stadium-store';
import { stadiums } from '@/data/stadiums';
import { GlassCard } from '@/components/ui/GlassCard';
import { ActionButton } from '@/components/ui/ActionButton';
import { Accessibility, Eye, Star } from 'lucide-react';
import { useState } from 'react';

export default function FanAccessibility() {
  const { selectedStadiumId } = useStadiumStore();
  const stadium = stadiums.find((s) => s.id === selectedStadiumId) || stadiums[0];

  const { accessibility, updateAccessibility } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);

  const toggleA11y = () => {
    updateAccessibility({ enabled: !accessibility.enabled });
  };

  const handleCheckboxChange = (category: 'mobility' | 'visual' | 'auditory' | 'cognitive', field: string, value: boolean) => {
    const subProfile = { ...(accessibility[category] as unknown as Record<string, unknown>), [field]: value };
    updateAccessibility({ [category]: subProfile });
  };

  const requestSupport = async () => {
    setLoading(true);
    setAiTip(null);
    try {
      const activeNeeds = [
        ...Object.entries(accessibility.mobility).filter(([, v]) => v === true).map(([k]) => k),
        ...Object.entries(accessibility.visual).filter(([, v]) => v === true).map(([k]) => k),
        ...Object.entries(accessibility.auditory).filter(([, v]) => v === true).map(([k]) => k),
        ...Object.entries(accessibility.cognitive).filter(([, v]) => v === true).map(([k]) => k),
      ];

      const res = await fetch('/api/ai/accessibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stadiumId: selectedStadiumId,
          userNeeds: activeNeeds,
          question: 'What are the best navigation practices and available facilities for my selected needs?',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAiTip(data.answer);
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
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Accessibility & Support</h1>
          <p className="text-xs text-muted-foreground">Tailor your app display and find specialized accommodations inside the venue</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Settings Card */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard variant="default" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-base flex items-center gap-2">
                  <Accessibility className="h-5 w-5 text-primary" />
                  Profile Configuration
                </h2>
                <ActionButton
                  variant={accessibility.enabled ? 'accent' : 'outline'}
                  size="sm"
                  onClick={toggleA11y}
                >
                  {accessibility.enabled ? 'ACTIVE' : 'OFF'}
                </ActionButton>
              </div>

              {accessibility.enabled && (
                <div className="space-y-4 pt-2 border-t border-border">
                  {/* Mobility needs */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase">Mobility & Seniors</h3>
                    <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accessibility.mobility.wheelchairUser}
                        onChange={(e) => handleCheckboxChange('mobility', 'wheelchairUser', e.target.checked)}
                        className="rounded border-border h-4 w-4"
                      />
                      <span>Wheelchair User</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accessibility.mobility.limitedMobility}
                        onChange={(e) => handleCheckboxChange('mobility', 'limitedMobility', e.target.checked)}
                        className="rounded border-border h-4 w-4"
                      />
                      <span>Senior / Limited Mobility</span>
                    </label>
                  </div>

                  {/* Visual needs */}
                  <div className="space-y-2 pt-2 border-t border-border/40">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase">Blind & Low Vision</h3>
                    <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accessibility.visual.blind}
                        onChange={(e) => handleCheckboxChange('visual', 'blind', e.target.checked)}
                        className="rounded border-border h-4 w-4"
                      />
                      <span>Blind / Screen Reader User</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accessibility.visual.lowVision}
                        onChange={(e) => handleCheckboxChange('visual', 'lowVision', e.target.checked)}
                        className="rounded border-border h-4 w-4"
                      />
                      <span>Low Vision / High Contrast</span>
                    </label>
                  </div>

                  {/* Auditory / Families */}
                  <div className="space-y-2 pt-2 border-t border-border/40">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase">Hearing & Families</h3>
                    <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accessibility.auditory.deaf || accessibility.auditory.hardOfHearing}
                        onChange={(e) => handleCheckboxChange('auditory', 'deaf', e.target.checked)}
                        className="rounded border-border h-4 w-4"
                      />
                      <span>Hearing Impairment</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accessibility.cognitive.simplifiedInterface}
                        onChange={(e) => handleCheckboxChange('cognitive', 'simplifiedInterface', e.target.checked)}
                        className="rounded border-border h-4 w-4"
                      />
                      <span>Family / Stroller Friendly</span>
                    </label>
                  </div>

                  <ActionButton variant="primary" fullWidth loading={loading} onClick={requestSupport}>
                    Get AI Recommendations
                  </ActionButton>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Accommodation info & results */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Custom Advice */}
            {aiTip && (
              <GlassCard variant="glass" className="space-y-3 bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-sm text-primary">Your Accessibility Guide</h3>
                </div>
                <div className="text-sm prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                  {aiTip}
                </div>
              </GlassCard>
            )}

            {/* General Stadium Accommodations list */}
            <GlassCard variant="default" className="space-y-4">
              <h2 className="font-bold text-base flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Stadium Accommodations
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                {stadium.accessibilityFeatures.map((feat, i) => (
                  <div key={i} className="p-3 bg-muted/40 rounded-xl border border-border/50 space-y-1">
                    <div className="font-semibold text-xs uppercase tracking-wider text-primary">{feat.type.replace('-', ' ')}</div>
                    <p className="text-xs text-muted-foreground">{feat.description}</p>
                    <div className="text-[10px] text-muted-foreground/80 font-mono">Location: {feat.locations.join(', ')}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
