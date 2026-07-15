// src/types/crowd.ts
// Type definitions for crowd management and density tracking

export interface CrowdSnapshot {
  stadiumId: string;
  timestamp: string;
  totalOccupancy: number;
  maxCapacity: number;
  overallDensity: number;
  zones: ZoneCrowdData[];
  alerts: CrowdAlert[];
  flowPatterns: FlowPattern[];
}

export interface ZoneCrowdData {
  zoneId: string;
  zoneName: string;
  currentOccupancy: number;
  maxCapacity: number;
  density: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  riskLevel: CrowdRiskLevel;
  entryRate: number;
  exitRate: number;
  averageDwellTime: number;
}

export type CrowdRiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface CrowdAlert {
  id: string;
  zoneId: string;
  zoneName: string;
  type: CrowdAlertType;
  severity: 'warning' | 'danger' | 'critical';
  message: string;
  timestamp: string;
  acknowledged: boolean;
  recommendation: string;
}

export type CrowdAlertType =
  | 'overcrowding'
  | 'rapid-influx'
  | 'bottleneck'
  | 'unusual-pattern'
  | 'evacuation-needed';

export interface FlowPattern {
  from: string;
  to: string;
  flowRate: number;
  direction: string;
  congestionLevel: 'free' | 'moderate' | 'congested' | 'blocked';
}

export interface CrowdPredictionInput {
  stadiumId: string;
  eventType: string;
  matchImportance: number;
  weatherCondition: string;
  timeOfDay: string;
  dayOfWeek: string;
  historicalData?: {
    averageAttendance: number;
    peakOccupancy: number;
    congestionZones: string[];
  };
}

export interface CrowdHeatmapData {
  zones: {
    id: string;
    name: string;
    density: number;
    color: string;
    coordinates: { lat: number; lng: number };
    radius: number;
  }[];
  lastUpdated: string;
}
