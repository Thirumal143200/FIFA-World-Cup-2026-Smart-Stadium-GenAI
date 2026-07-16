// src/components/layout/sidebar.tsx
// Core Navigation Sidebar — renders role-specific items dynamically
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/store/user-store';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils';
import {
  Map,
  MessageSquare,
  Bus,
  Accessibility,
  Leaf,
  LayoutDashboard,
  AlertOctagon,
  Users2,
  PieChart,
  BrainCircuit,
  Home,
  Shield,
  LifeBuoy,
} from 'lucide-react';

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: Record<string, SidebarItem[]> = {
  fan: [
    { href: '/fan', label: 'Fan Hub', icon: <Home className="h-5 w-5" /> },
    { href: '/fan/navigate', label: 'AI Navigator', icon: <Map className="h-5 w-5" /> },
    { href: '/fan/chat', label: 'Multilingual AI', icon: <MessageSquare className="h-5 w-5" /> },
    { href: '/fan/transport', label: 'Transit Planner', icon: <Bus className="h-5 w-5" /> },
    { href: '/fan/accessibility', label: 'Accessibility', icon: <Accessibility className="h-5 w-5" /> },
    { href: '/fan/sustainability', label: 'Eco-Dashboard', icon: <Leaf className="h-5 w-5" /> },
  ],
  volunteer: [
    { href: '/volunteer', label: 'Volunteer Hub', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/volunteer/incidents', label: 'Incidents Log', icon: <AlertOctagon className="h-5 w-5" /> },
    { href: '/volunteer/crowd', label: 'Crowd Flow', icon: <Users2 className="h-5 w-5" /> },
  ],
  organizer: [
    { href: '/organizer', label: 'Command Center', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/organizer/analytics', label: 'Analytics', icon: <PieChart className="h-5 w-5" /> },
    { href: '/organizer/crowd', label: 'Crowd Intelligence', icon: <Users2 className="h-5 w-5" /> },
    { href: '/organizer/sustainability', label: 'Sustainability Metrics', icon: <Leaf className="h-5 w-5" /> },
    { href: '/organizer/decisions', label: 'AI Decision Support', icon: <BrainCircuit className="h-5 w-5" /> },
  ],
  security: [
    { href: '/security', label: 'Security Hub', icon: <Shield className="h-5 w-5" /> },
    { href: '/security/incidents', label: 'Active Incidents', icon: <AlertOctagon className="h-5 w-5" /> },
    { href: '/security/crowd', label: 'Crowd Heatmap', icon: <Users2 className="h-5 w-5" /> },
  ],
  admin: [
    { href: '/admin', label: 'Admin Console', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/profile', label: 'System Prefs', icon: <BrainCircuit className="h-5 w-5" /> },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useUserStore();
  const { sidebarOpen } = useUIStore();

  const items = navItems[role] || navItems.fan;

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-border bg-card/60 backdrop-blur-md transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex-1 py-6 px-3 space-y-1 select-none overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <span className="shrink-0">{item.icon}</span>
              <span
                className={cn(
                  'transition-opacity duration-200 whitespace-nowrap',
                  sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Sidebar Footer Support */}
      <div className="p-3 border-t border-border">
        <Link
          href="/emergency"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors bg-red-600/10 text-red-600 hover:bg-red-600/20'
          )}
        >
          <span className="shrink-0">
            <LifeBuoy className="h-5 w-5" />
          </span>
          <span
            className={cn(
              'transition-opacity duration-200 whitespace-nowrap',
              sidebarOpen ? 'opacity-100 font-semibold' : 'opacity-0 w-0 overflow-hidden'
            )}
          >
            Emergency SOS
          </span>
        </Link>
      </div>
    </aside>
  );
}
