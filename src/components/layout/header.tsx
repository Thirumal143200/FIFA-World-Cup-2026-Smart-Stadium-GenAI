// src/components/layout/header.tsx
// Core App Header — handles role switching, theme toggle, and accessibility toggles
'use client';

import { useUserStore } from '@/store/user-store';
import { useStadiumStore } from '@/store/stadium-store';
import { useUIStore } from '@/store/ui-store';
import { stadiums } from '@/data/stadiums';
import { useTheme } from 'next-themes';
import {
  Menu,
  Moon,
  Sun,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { FifaBadge } from '../ui/FifaBadge';
import { ActionButton } from '../ui/ActionButton';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/types';

export function Header() {
  const router = useRouter();
  const { role, setRole } = useUserStore();
  const { selectedStadiumId, setSelectedStadium } = useStadiumStore();
  const { toggleSidebar } = useUIStore();
  const { theme, setTheme } = useTheme();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextRole = e.target.value as UserRole;
    setRole(nextRole);
    router.push(`/${nextRole}`);
  };

  const handleStadiumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const stadium = stadiums.find((s) => s.id === id);
    if (stadium) {
      setSelectedStadium(id, stadium);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md">
      {/* Left: Menu & Brand */}
      <div className="flex items-center gap-3">
        <ActionButton
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          className="hidden md:inline-flex"
        >
          <Menu className="h-5 w-5" />
        </ActionButton>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-fifa-purple to-fifa-red bg-clip-text text-transparent">
            FIFA StadiumOS
          </span>
          <FifaBadge variant="fifa" className="hidden sm:inline-flex text-[10px] py-0">
            2026
          </FifaBadge>
        </div>
      </div>

      {/* Center/Right Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Stadium Selector */}
        <div className="relative hidden sm:block">
          <label htmlFor="stadium-select" className="sr-only">
            Select Stadium
          </label>
          <select
            id="stadium-select"
            value={selectedStadiumId}
            onChange={handleStadiumChange}
            className="h-9 rounded-lg border border-border bg-background px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {stadiums.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.city})
              </option>
            ))}
          </select>
        </div>

        {/* Role Quick Selector */}
        <div className="relative">
          <label htmlFor="role-select" className="sr-only">
            Switch Role
          </label>
          <select
            id="role-select"
            value={role}
            onChange={handleRoleChange}
            className="h-9 rounded-lg border border-border bg-primary/10 text-primary px-3 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="fan">Fan view</option>
            <option value="staff">Staff view</option>
            <option value="organizer">Organizer view</option>
            <option value="security">Security view</option>
          </select>
        </div>

        {/* Theme Toggle */}
        <ActionButton
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle Theme"
          className="h-9 w-9"
        >
          {theme === 'dark' ? (
            <Sun className="h-4.5 w-4.5 text-amber-500" />
          ) : (
            <Moon className="h-4.5 w-4.5 text-slate-700" />
          )}
        </ActionButton>

        {/* High Contrast Quick Link */}
        <ActionButton
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'high-contrast' ? 'dark' : 'high-contrast')}
          aria-label="Toggle High Contrast"
          className="h-9 w-9 text-muted-foreground"
        >
          <Eye className="h-4.5 w-4.5" />
        </ActionButton>

        {/* SOS Critical Quick Access */}
        <ActionButton
          variant="danger"
          size="sm"
          onClick={() => router.push('/emergency')}
          className="h-9 px-3 gap-1"
          aria-label="SOS Emergency Quick Access"
        >
          <AlertTriangle className="h-4 w-4 animate-pulse" />
          <span className="hidden xs:inline">SOS</span>
        </ActionButton>
      </div>
    </header>
  );
}
