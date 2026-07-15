// src/types/ai.ts
// Type definitions for AI interactions across all Gemini-powered modules

export type AIModuleType =
  | 'chat'
  | 'navigation'
  | 'crowd-prediction'
  | 'translation'
  | 'emergency'
  | 'accessibility'
  | 'transport'
  | 'sustainability'
  | 'operational';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  language?: string;
  metadata?: AIMessageMetadata;
}

export interface AIMessageMetadata {
  module: AIModuleType;
  stadiumId?: string;
  zoneId?: string;
  intent?: string;
  confidence?: number;
  processingTime?: number;
  sources?: string[];
  actions?: AIAction[];
}

export interface AIAction {
  type: 'navigate' | 'alert' | 'call' | 'translate' | 'show-map' | 'show-route' | 'show-info';
  label: string;
  data: Record<string, unknown>;
}

export interface AIChatRequest {
  message: string;
  language: string;
  stadiumId: string;
  module: AIModuleType;
  context?: {
    userRole: string;
    accessibilityNeeds?: string[];
    previousMessages?: AIMessage[];
    currentZone?: string;
    currentLocation?: { lat: number; lng: number };
  };
}

export interface AIChatResponse {
  message: string;
  language: string;
  originalLanguage?: string;
  module: AIModuleType;
  actions?: AIAction[];
  suggestions?: string[];
  metadata?: {
    intent: string;
    confidence: number;
    processingTime: number;
    tokensUsed?: number;
  };
}

export interface AINavigationRequest {
  from: string;
  to: string;
  stadiumId: string;
  accessibilityNeeds?: string[];
  avoidCrowded?: boolean;
  preferElevator?: boolean;
}

export interface AINavigationResponse {
  route: NavigationStep[];
  estimatedTime: string;
  distance: string;
  accessibilityNotes?: string[];
  alternativeRoutes?: {
    description: string;
    estimatedTime: string;
    reason: string;
  }[];
  crowdWarnings?: string[];
}

export interface NavigationStep {
  instruction: string;
  landmark?: string;
  distance?: string;
  duration?: string;
  direction: 'straight' | 'left' | 'right' | 'up' | 'down' | 'elevator' | 'escalator' | 'ramp';
  zoneId?: string;
  coordinates?: { lat: number; lng: number };
}

export interface AICrowdPrediction {
  stadiumId: string;
  timestamp: string;
  zones: {
    zoneId: string;
    zoneName: string;
    currentDensity: number;
    predictedDensity15: number;
    predictedDensity30: number;
    predictedDensity60: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    recommendation: string;
  }[];
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  recommendations: string[];
}

export interface AITranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  context?: 'stadium' | 'emergency' | 'navigation' | 'general';
}

export interface AITranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
  culturalNotes?: string;
}

export interface AIOperationalInsight {
  stadiumId: string;
  date: string;
  staffingRecommendation: {
    zone: string;
    currentStaff: number;
    recommendedStaff: number;
    reason: string;
  }[];
  riskAssessment: {
    overall: 'low' | 'medium' | 'high';
    factors: { factor: string; level: string; details: string }[];
  };
  resourceAllocation: {
    resource: string;
    currentLocation: string;
    recommendedLocation: string;
    priority: string;
  }[];
  summary: string;
}

export interface AISustainabilityInsight {
  stadiumId: string;
  currentMetrics: {
    energyEfficiency: number;
    wasteRate: number;
    waterUsage: number;
    carbonFootprint: number;
  };
  recommendations: {
    area: string;
    currentValue: string;
    targetValue: string;
    action: string;
    impact: string;
    priority: 'low' | 'medium' | 'high';
  }[];
  ecoScore: number;
  summary: string;
}
