// src/store/user-store.ts
// Zustand store for user profile, role, accessibility, and preferences

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole, AccessibilityProfile, UserPreferences } from '@/types';
import { DEFAULT_ACCESSIBILITY, DEFAULT_PREFERENCES } from '@/types/user';

interface UserState {
  role: UserRole;
  displayName: string;
  language: string;
  accessibility: AccessibilityProfile;
  preferences: UserPreferences;
  isAuthenticated: boolean;

  // Actions
  setRole: (role: UserRole) => void;
  setDisplayName: (name: string) => void;
  setLanguage: (lang: string) => void;
  updateAccessibility: (updates: Partial<AccessibilityProfile>) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  setAuthenticated: (value: boolean) => void;
  resetUser: () => void;
}

const initialState = {
  role: 'fan' as UserRole,
  displayName: 'Guest',
  language: 'en',
  accessibility: DEFAULT_ACCESSIBILITY,
  preferences: DEFAULT_PREFERENCES,
  isAuthenticated: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,

      setRole: (role) => set({ role }),
      setDisplayName: (displayName) => set({ displayName }),
      setLanguage: (language) => set({ language }),

      updateAccessibility: (updates) =>
        set((state) => ({
          accessibility: { ...state.accessibility, ...updates },
        })),

      updatePreferences: (updates) =>
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        })),

      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      resetUser: () => set(initialState),
    }),
    {
      name: 'stadiumos-user',
    }
  )
);
