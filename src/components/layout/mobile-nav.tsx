// src/components/layout/mobile-nav.tsx
// Mobile bottom navigation bar — provides accessible tab-bar interface
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/store/user-store';
import { cn } from '@/lib/utils';
import {
  Map,
  MessageSquare,
  Bus,
  Home,
  LayoutDashboard,
  AlertOctagon,
  Users2,
  PieChart,
  Shield,
} from 'lucide-react';

interface TabItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const tabItems: Record<string, TabItem[]> = {
  fan: [
    { href: '/fan', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { href: '/fan/navigate', label: 'Nav', icon: <Map className="h-5 w-5" /> },
    { href: '/fan/chat', label: 'AI Chat', icon: <MessageSquare className="h-5 w-5" /> },
    { href: '/fan/transport', label: 'Transit', icon: <Bus className="h-5 w-5" /> },
  ],
  volunteer: [
    { href: '/volunteer', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/volunteer/incidents', label: 'Incidents', icon: <AlertOctagon className="h-5 w-5" /> },
    { href: '/volunteer/crowd', label: 'Crowd Flow', icon: <Users2 className="h-5 w-5" /> },
  ],
  organizer: [
    { href: '/organizer', label: 'Command', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/organizer/analytics', label: 'Analytics', icon: <PieChart className="h-5 w-5" /> },
    { href: '/organizer/crowd', label: 'Crowd', icon: <Users2 className="h-5 w-5" /> },
  ],
  security: [
    { href: '/security', label: 'Security', icon: <Shield className="h-5 w-5" /> },
    { href: '/security/incidents', label: 'Incidents', icon: <AlertOctagon className="h-5 w-5" /> },
    { href: '/security/crowd', label: 'Crowd', icon: <Users2 className="h-5 w-5" /> },
  ],
  admin: [
    { href: '/admin', label: 'Admin', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/profile', label: 'Profile', icon: <Home className="h-5 w-5" /> },
  ],
};

export function MobileNav() {
  const pathname = usePathname();
  const { role } = useUserStore();

  const items = tabItems[role] || tabItems.fan;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-border bg-background/90 px-4 pb-2 backdrop-blur-md flex items-center justify-around">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center flex-1 h-full text-xs font-medium transition-colors gap-1',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
