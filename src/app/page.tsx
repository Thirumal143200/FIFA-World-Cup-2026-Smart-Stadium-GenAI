// src/app/page.tsx
// Landing page — FIFA StadiumOS role selection hub
'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users,
  Shield,
  Headset,
  BarChart3,
  MapPin,
  Globe,
  Accessibility,
  AlertTriangle,
  Zap,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { FifaBadge } from '@/components/ui/FifaBadge';
import { useUserStore } from '@/store/user-store';
import type { UserRole } from '@/types';

const roleCards: {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  color: string;
  gradient: string;
}[] = [
  {
    role: 'fan',
    title: 'Fan Experience',
    description: 'Navigate the stadium, get AI assistance in your language, and enjoy a seamless match day.',
    icon: <Users className="h-7 w-7" />,
    features: ['AI Navigator', 'Multilingual Chat', 'Transport Guide', 'Accessibility'],
    color: 'text-blue-500',
    gradient: 'from-blue-500/20 to-cyan-500/10',
  },
  {
    role: 'volunteer',
    title: 'Stadium Volunteer',
    description: 'Access checklists, support wayfinding, review crowd flows, and report incidents.',
    icon: <Headset className="h-7 w-7" />,
    features: ['Volunteer Checklists', 'AI Incident Logs', 'Crowd flow tracking', 'Volunteer briefings'],
    color: 'text-emerald-500',
    gradient: 'from-emerald-500/20 to-green-500/10',
  },
  {
    role: 'organizer',
    title: 'Event Organizer',
    description: 'Access operational intelligence, analytics dashboards, and AI-powered decision support.',
    icon: <BarChart3 className="h-7 w-7" />,
    features: ['Analytics Dashboard', 'AI Decision Support', 'Sustainability', 'Staffing AI'],
    color: 'text-purple-500',
    gradient: 'from-purple-500/20 to-pink-500/10',
  },
  {
    role: 'security',
    title: 'Security Team',
    description: 'Real-time threat monitoring, crowd density alerts, and emergency coordination tools.',
    icon: <Shield className="h-7 w-7" />,
    features: ['Threat Detection', 'Crowd Heatmap', 'Emergency Response', 'Incident Logs'],
    color: 'text-red-500',
    gradient: 'from-red-500/20 to-orange-500/10',
  },
  {
    role: 'admin',
    title: 'System Administrator',
    description: 'Full infrastructure control, database bindings, diagnostic tools, and AI telemetry logs.',
    icon: <Sparkles className="h-7 w-7 text-primary" />,
    features: ['AI Telemetry logs', 'Diagnostics tool', 'Active Sessions directory', 'Security overrides'],
    color: 'text-indigo-500',
    gradient: 'from-indigo-500/20 to-purple-500/10',
  },
];

const aiCapabilities = [
  { icon: <MapPin className="h-5 w-5" />, label: 'Smart Navigation' },
  { icon: <Users className="h-5 w-5" />, label: 'Crowd Intelligence' },
  { icon: <Globe className="h-5 w-5" />, label: '30+ Languages' },
  { icon: <Accessibility className="h-5 w-5" />, label: 'Full Accessibility' },
  { icon: <AlertTriangle className="h-5 w-5" />, label: 'Emergency AI' },
  { icon: <Zap className="h-5 w-5" />, label: 'Real-Time Decisions' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  const router = useRouter();
  const setRole = useUserStore((s) => s.setRole);

  function handleRoleSelect(role: UserRole) {
    setRole(role);
    router.push(`/${role}`);
  }

  return (
    <div className="min-h-screen gradient-hero" id="main-content">
      {/* ===== Hero Section ===== */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-fifa opacity-5" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <FifaBadge variant="fifa" size="md" className="mb-6">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Powered by Google Gemini AI
            </FifaBadge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="block text-foreground">FIFA</span>
              <span className="block bg-gradient-to-r from-fifa-purple via-primary to-fifa-teal bg-clip-text text-transparent">
                StadiumOS
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              AI-Powered Smart Stadium Assistant for the{' '}
              <span className="font-semibold text-foreground">FIFA World Cup 2026™</span>
            </p>

            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Serving 16 stadiums across USA, Mexico & Canada — intelligent navigation,
              crowd analytics, multilingual support, and real-time operations.
            </p>
          </motion.div>

          {/* AI Capabilities Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-5"
          >
            {aiCapabilities.map((cap) => (
              <div
                key={cap.label}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <span className="text-primary" aria-hidden="true">{cap.icon}</span>
                <span>{cap.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* ===== Role Selection ===== */}
      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 text-center"
        >
          <h2 className="text-2xl font-semibold text-foreground">
            Select Your Role
          </h2>
          <p className="mt-1 text-muted-foreground">
            Choose how you&apos;re experiencing the World Cup today
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5"
        >
          {roleCards.map((card) => (
            <motion.div key={card.role} variants={item}>
              <button
                onClick={() => handleRoleSelect(card.role)}
                className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
                aria-label={`Enter as ${card.title}`}
              >
                <GlassCard
                  variant="elevated"
                  hover
                  padding="lg"
                  className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} h-full`}
                >
                  {/* Icon */}
                  <div className={`mb-4 ${card.color}`} aria-hidden="true">
                    {card.icon}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-semibold text-foreground">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>

                  {/* Feature Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {card.features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-md bg-muted/80 px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-5 flex items-center gap-1 text-sm font-medium text-primary">
                    Enter Dashboard
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </div>
                </GlassCard>
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Emergency Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => router.push('/emergency')}
            className="inline-flex items-center gap-2 rounded-full border-2 border-destructive/30 bg-destructive/5 px-6 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
            aria-label="Emergency assistance — quick access"
          >
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            Emergency Assistance
          </button>
        </motion.div>

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-center text-sm text-muted-foreground"
        >
          <div>
            <div className="text-2xl font-bold text-foreground">16</div>
            <div>Stadiums</div>
          </div>
          <div className="h-8 w-px bg-border" aria-hidden="true" />
          <div>
            <div className="text-2xl font-bold text-foreground">3</div>
            <div>Countries</div>
          </div>
          <div className="h-8 w-px bg-border" aria-hidden="true" />
          <div>
            <div className="text-2xl font-bold text-foreground">48</div>
            <div>Teams</div>
          </div>
          <div className="h-8 w-px bg-border" aria-hidden="true" />
          <div>
            <div className="text-2xl font-bold text-foreground">104</div>
            <div>Matches</div>
          </div>
          <div className="h-8 w-px bg-border" aria-hidden="true" />
          <div>
            <div className="text-2xl font-bold text-foreground">30+</div>
            <div>Languages</div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
