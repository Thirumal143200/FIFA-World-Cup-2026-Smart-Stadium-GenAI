// src/components/layout/dashboard-layout.tsx
// Core Dashboard Layout wrapper containing Header, Sidebar, and MobileNav
'use client';

import { Header } from './header';
import { Sidebar } from './sidebar';
import { MobileNav } from './mobile-nav';
import { type ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header at top */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for medium/large viewports */}
        <Sidebar />

        {/* Scrollable Main Content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto pb-16 md:pb-0 focus:outline-none"
          tabIndex={-1}
        >
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Tab bar for mobile viewports */}
      <MobileNav />
    </div>
  );
}
