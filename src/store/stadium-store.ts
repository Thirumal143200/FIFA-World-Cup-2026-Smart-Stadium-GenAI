// src/store/stadium-store.ts
// Zustand store for stadium selection, crowd data, and zone state

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Stadium, CrowdDensity } from '@/types';

interface StadiumState {
  selectedStadiumId: string;
  selectedStadium: Stadium | null;
  crowdData: Map<string, CrowdDensity>;
  activeZone: string | null;

  // Actions
  setSelectedStadium: (id: string, stadium: Stadium) => void;
  updateCrowdDensity: (zoneId: string, data: CrowdDensity) => void;
  setActiveZone: (zoneId: string | null) => void;
  getZoneDensity: (zoneId: string) => number;
  getZoneStatus: (zoneId: string) => string;
}

export const useStadiumStore = create<StadiumState>()(
  persist(
    (set, get) => ({
      selectedStadiumId: 'metlife',
      selectedStadium: null,
      crowdData: new Map(),
      activeZone: null,

      setSelectedStadium: (id, stadium) =>
        set({ selectedStadiumId: id, selectedStadium: stadium }),

      updateCrowdDensity: (zoneId, data) =>
        set((state) => {
          const newMap = new Map(state.crowdData);
          newMap.set(zoneId, data);
          return { crowdData: newMap };
        }),

      setActiveZone: (zoneId) => set({ activeZone: zoneId }),

      getZoneDensity: (zoneId) => {
        const data = get().crowdData.get(zoneId);
        return data ? data.percentage : 0;
      },

      getZoneStatus: (zoneId) => {
        const density = get().getZoneDensity(zoneId);
        if (density <= 0.3) return 'low';
        if (density <= 0.5) return 'moderate';
        if (density <= 0.7) return 'high';
        if (density <= 0.9) return 'very-high';
        return 'critical';
      },
    }),
    {
      name: 'stadiumos-stadium',
      partialize: (state) => ({
        selectedStadiumId: state.selectedStadiumId,
      }),
    }
  )
);
