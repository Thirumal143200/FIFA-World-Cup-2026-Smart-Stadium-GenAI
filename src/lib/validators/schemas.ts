// src/lib/validators/schemas.ts
// Zod validation schemas for all API endpoints

import { z } from 'zod/v4';

/**
 * AI Chat request validation.
 */
export const AIChatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(2000, 'Message too long'),
  language: z.string().min(2).max(5).default('en'),
  stadiumId: z.string().min(1).max(50).default('metlife'),
  module: z.enum([
    'chat',
    'navigation',
    'crowd-prediction',
    'translation',
    'emergency',
    'accessibility',
    'transport',
    'sustainability',
    'operational',
  ]).default('chat'),
  context: z
    .object({
      userRole: z.string().optional(),
      accessibilityNeeds: z.array(z.string()).optional(),
      currentZone: z.string().optional(),
      currentLocation: z
        .object({
          lat: z.number().min(-90).max(90),
          lng: z.number().min(-180).max(180),
        })
        .optional(),
    })
    .optional(),
});

/**
 * AI Navigation request validation.
 */
export const AINavigationSchema = z.object({
  from: z.string().min(1).max(200),
  to: z.string().min(1).max(200),
  stadiumId: z.string().min(1).max(50),
  accessibilityNeeds: z.array(z.string()).optional(),
  avoidCrowded: z.boolean().optional(),
  preferElevator: z.boolean().optional(),
});

/**
 * AI Translation request validation.
 */
export const AITranslationSchema = z.object({
  text: z.string().min(1).max(5000),
  sourceLanguage: z.string().min(2).max(5),
  targetLanguage: z.string().min(2).max(5),
  context: z.enum(['stadium', 'emergency', 'navigation', 'general']).optional(),
});

/**
 * Incident creation validation.
 */
export const IncidentCreateSchema = z.object({
  stadiumId: z.string().min(1).max(50),
  category: z.enum([
    'medical',
    'security',
    'fire',
    'weather',
    'structural',
    'crowd-crush',
    'suspicious-item',
    'lost-child',
    'accessibility',
    'other',
  ]),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  location: z.object({
    zoneId: z.string().min(1),
    zoneName: z.string().min(1),
    coordinates: z
      .object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
      })
      .optional(),
    landmark: z.string().optional(),
  }),
  reportedBy: z.object({
    name: z.string().min(1).max(100),
    role: z.string().min(1).max(50),
    contact: z.string().optional(),
  }),
});

/**
 * Incident update validation (partial).
 */
export const IncidentUpdateSchema = z.object({
  status: z.enum(['reported', 'acknowledged', 'in-progress', 'resolved', 'escalated']).optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  assignedTo: z
    .object({
      userId: z.string(),
      name: z.string(),
      role: z.string(),
    })
    .optional(),
  notes: z.string().max(2000).optional(),
});

/**
 * Crowd prediction request validation.
 */
export const CrowdPredictionSchema = z.object({
  stadiumId: z.string().min(1).max(50),
  eventType: z.string().optional(),
  matchImportance: z.number().min(1).max(10).optional(),
  weatherCondition: z.string().optional(),
});

/**
 * Sustainability query validation.
 */
export const SustainabilitySchema = z.object({
  stadiumId: z.string().min(1).max(50),
  date: z.string().optional(),
  includeRecommendations: z.boolean().optional(),
});

/**
 * Transport route request validation.
 */
export const TransportRouteSchema = z.object({
  stadiumId: z.string().min(1).max(50),
  origin: z.string().min(1).max(500),
  destination: z.string().min(1).max(500).optional(),
  mode: z.enum(['walking', 'driving', 'transit', 'cycling', 'rideshare', 'shuttle']).optional(),
  accessible: z.boolean().optional(),
  ecoFriendly: z.boolean().optional(),
});

export type AIChatInput = z.infer<typeof AIChatSchema>;
export type AINavigationInput = z.infer<typeof AINavigationSchema>;
export type AITranslationInput = z.infer<typeof AITranslationSchema>;
export type IncidentCreateInput = z.infer<typeof IncidentCreateSchema>;
export type IncidentUpdateInput = z.infer<typeof IncidentUpdateSchema>;
export type CrowdPredictionInput = z.infer<typeof CrowdPredictionSchema>;
export type SustainabilityInput = z.infer<typeof SustainabilitySchema>;
export type TransportRouteInput = z.infer<typeof TransportRouteSchema>;
