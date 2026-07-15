// src/types/transport.ts
// Type definitions for transportation and routing

export interface TransportRoute {
  id: string;
  stadiumId: string;
  type: TransportMode;
  name: string;
  origin: string;
  destination: string;
  estimatedDuration: string;
  distance: string;
  cost: string;
  frequency?: string;
  accessible: boolean;
  ecoFriendly: boolean;
  carbonEmission: number;
  steps: TransportStep[];
  realTimeStatus?: TransportStatus;
}

export type TransportMode =
  | 'walking'
  | 'driving'
  | 'transit'
  | 'cycling'
  | 'rideshare'
  | 'shuttle';

export interface TransportStep {
  mode: TransportMode;
  instruction: string;
  duration: string;
  distance: string;
  transitLine?: string;
  transitStop?: string;
}

export type TransportStatus = 'on-time' | 'delayed' | 'cancelled' | 'crowded';

export interface ParkingInfo {
  id: string;
  stadiumId: string;
  name: string;
  type: 'general' | 'vip' | 'accessible' | 'ev-charging';
  totalSpaces: number;
  availableSpaces: number;
  cost: string;
  distance: string;
  walkingTime: string;
  coordinates: { lat: number; lng: number };
  accessible: boolean;
  evCharging: boolean;
}

export interface TransportRecommendation {
  mode: TransportMode;
  route: TransportRoute;
  reason: string;
  ecoImpact: string;
  crowdLevel: 'low' | 'medium' | 'high';
  recommended: boolean;
}
