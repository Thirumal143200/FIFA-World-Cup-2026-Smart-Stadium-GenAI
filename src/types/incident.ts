// src/types/incident.ts
// Type definitions for emergency incidents and responses

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'reported' | 'acknowledged' | 'in-progress' | 'resolved' | 'escalated';
export type IncidentCategory =
  | 'medical'
  | 'security'
  | 'fire'
  | 'weather'
  | 'structural'
  | 'crowd-crush'
  | 'suspicious-item'
  | 'lost-child'
  | 'accessibility'
  | 'other';

export interface Incident {
  id: string;
  stadiumId: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  title: string;
  description: string;
  location: {
    zoneId: string;
    zoneName: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    landmark?: string;
  };
  reportedBy: {
    userId?: string;
    name: string;
    role: string;
    contact?: string;
  };
  assignedTo?: {
    userId: string;
    name: string;
    role: string;
  };
  responses: IncidentResponse[];
  aiRecommendation?: string;
  evacuationRequired: boolean;
  affectedZones: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface IncidentResponse {
  id: string;
  incidentId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  notes?: string;
}

export interface EmergencyProtocol {
  category: IncidentCategory;
  severity: IncidentSeverity;
  steps: string[];
  resources: string[];
  evacuationPlan?: string;
  contactNumbers: string[];
}
