// src/types/stadium.ts
// Type definitions for FIFA World Cup 2026 stadiums, zones, facilities, and events

export interface Stadium {
  id: string;
  name: string;
  city: string;
  state: string;
  country: 'USA' | 'Mexico' | 'Canada';
  capacity: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  timezone: string;
  image: string;
  description: string;
  facilities: StadiumFacility[];
  accessibilityFeatures: AccessibilityFeature[];
  transportOptions: TransportOption[];
  zones: StadiumZone[];
}

export interface StadiumZone {
  id: string;
  name: string;
  type: ZoneType;
  level: number;
  section?: string;
  capacity: number;
  currentOccupancy: number;
  status: ZoneStatus;
  coordinates: {
    lat: number;
    lng: number;
  };
  facilities: string[];
  accessibleEntry: boolean;
  exits: string[];
}

export type ZoneType =
  | 'seating'
  | 'concourse'
  | 'gate'
  | 'concession'
  | 'restroom'
  | 'medical'
  | 'vip'
  | 'press'
  | 'parking'
  | 'field'
  | 'exit';

export type ZoneStatus =
  | 'open'
  | 'crowded'
  | 'at-capacity'
  | 'closed'
  | 'restricted'
  | 'emergency';

export interface StadiumFacility {
  id: string;
  name: string;
  type: FacilityType;
  location: string;
  zoneId: string;
  accessible: boolean;
  operatingHours?: string;
  description?: string;
}

export type FacilityType =
  | 'restroom'
  | 'food'
  | 'beverage'
  | 'merchandise'
  | 'first-aid'
  | 'information'
  | 'atm'
  | 'charging-station'
  | 'prayer-room'
  | 'family-zone'
  | 'sensory-room'
  | 'lost-found';

export interface AccessibilityFeature {
  type: AccessibilityType;
  description: string;
  locations: string[];
}

export type AccessibilityType =
  | 'wheelchair-ramp'
  | 'elevator'
  | 'accessible-seating'
  | 'accessible-restroom'
  | 'hearing-loop'
  | 'braille-signage'
  | 'sensory-room'
  | 'service-animal-area'
  | 'companion-seating'
  | 'tactile-paving';

export interface TransportOption {
  type: TransportType;
  name: string;
  description: string;
  estimatedTime?: string;
  cost?: string;
  schedule?: string;
  ecoFriendly: boolean;
  accessible: boolean;
  directions?: string;
}

export type TransportType =
  | 'metro'
  | 'bus'
  | 'train'
  | 'shuttle'
  | 'rideshare'
  | 'taxi'
  | 'parking'
  | 'bicycle'
  | 'walking';

export interface StadiumEvent {
  id: string;
  stadiumId: string;
  type: 'group-stage' | 'round-of-32' | 'round-of-16' | 'quarter-final' | 'semi-final' | 'third-place' | 'final';
  teamA: string;
  teamB: string;
  date: string;
  kickoff: string;
  status: 'scheduled' | 'live' | 'completed' | 'postponed';
  attendance?: number;
}

export interface CrowdDensity {
  zoneId: string;
  stadiumId: string;
  currentOccupancy: number;
  maxCapacity: number;
  percentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  predictedIn15Min: number;
  predictedIn30Min: number;
  lastUpdated: string;
}

export interface SustainabilityMetrics {
  stadiumId: string;
  date: string;
  energy: {
    consumed: number;
    renewable: number;
    unit: string;
  };
  water: {
    consumed: number;
    recycled: number;
    unit: string;
  };
  waste: {
    generated: number;
    diverted: number;
    recycled: number;
    unit: string;
  };
  carbon: {
    emissions: number;
    offset: number;
    unit: string;
  };
  score: number;
}
