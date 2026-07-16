// src/types/user.ts
// Type definitions for users, accessibility profiles, and preferences

export type UserRole = 'fan' | 'volunteer' | 'organizer' | 'security' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  language: string;
  accessibility: AccessibilityProfile;
  preferences: UserPreferences;
  selectedStadium?: string;
  createdAt: string;
  lastActive: string;
}

export interface AccessibilityProfile {
  enabled: boolean;
  mobility: MobilityNeeds;
  visual: VisualNeeds;
  auditory: AuditoryNeeds;
  cognitive: CognitiveNeeds;
}

export interface MobilityNeeds {
  wheelchairUser: boolean;
  limitedMobility: boolean;
  requiresElevator: boolean;
  serviceAnimal: boolean;
  assistiveDevice?: string;
}

export interface VisualNeeds {
  lowVision: boolean;
  blind: boolean;
  colorBlind: boolean;
  highContrastRequired: boolean;
  largeTextRequired: boolean;
  screenReaderUser: boolean;
}

export interface AuditoryNeeds {
  deaf: boolean;
  hardOfHearing: boolean;
  hearingAidUser: boolean;
  captionsRequired: boolean;
  signLanguage?: string;
}

export interface CognitiveNeeds {
  simplifiedInterface: boolean;
  reducedAnimations: boolean;
  stepByStepInstructions: boolean;
  quietEnvironmentPreferred: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'normal' | 'large' | 'extra-large';
  notifications: boolean;
  voiceGuidance: boolean;
  hapticFeedback: boolean;
  measurementUnit: 'metric' | 'imperial';
  autoTranslate: boolean;
}

export const DEFAULT_ACCESSIBILITY: AccessibilityProfile = {
  enabled: false,
  mobility: {
    wheelchairUser: false,
    limitedMobility: false,
    requiresElevator: false,
    serviceAnimal: false,
  },
  visual: {
    lowVision: false,
    blind: false,
    colorBlind: false,
    highContrastRequired: false,
    largeTextRequired: false,
    screenReaderUser: false,
  },
  auditory: {
    deaf: false,
    hardOfHearing: false,
    hearingAidUser: false,
    captionsRequired: false,
  },
  cognitive: {
    simplifiedInterface: false,
    reducedAnimations: false,
    stepByStepInstructions: false,
    quietEnvironmentPreferred: false,
  },
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  fontSize: 'normal',
  notifications: true,
  voiceGuidance: false,
  hapticFeedback: true,
  measurementUnit: 'metric',
  autoTranslate: true,
};
