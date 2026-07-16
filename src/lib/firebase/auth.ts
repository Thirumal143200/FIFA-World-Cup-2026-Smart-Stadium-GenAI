// src/lib/firebase/auth.ts
// Firebase Authentication wrapper with robust mock fallback for local development

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification as firebaseSendEmailVerification,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from './config';
import { setDocument, getDocument } from './firestore';
import type { UserRole } from '@/types';

// Mock user representation stored in local storage
export interface AuthenticatedUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  emailVerified: boolean;
  language?: string;
  photoURL?: string;
  createdAt: string;
}

// Memory-based listener registry for mock authentication changes
type AuthListener = (user: AuthenticatedUser | null) => void;
const listeners = new Set<AuthListener>();

// Helper to get/set mock state from localStorage
const MOCK_USERS_KEY = 'stadiumos_mock_users';
const CURRENT_USER_KEY = 'stadiumos_current_user';

function getMockUsers(): AuthenticatedUser[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(MOCK_USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveMockUsers(users: AuthenticatedUser[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

function getCurrentMockUser(): AuthenticatedUser | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
}

function setCurrentMockUser(user: AuthenticatedUser | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
  // Notify all active listeners
  listeners.forEach((listener) => listener(user));
}

/**
 * Register a user with email, password, name, and role.
 */
export async function registerUser(
  email: string,
  password: string,
  displayName: string,
  role: UserRole
): Promise<AuthenticatedUser> {
  const isConfigured = isFirebaseConfigured();

  if (isConfigured) {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase Auth failed to initialize.');

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update Firebase Auth profile
    await updateProfile(firebaseUser, { displayName });

    // Store custom role & metadata in Firestore
    const userProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName,
      role,
      emailVerified: firebaseUser.emailVerified,
      language: 'en',
      createdAt: new Date().toISOString(),
    };

    await setDocument('users', firebaseUser.uid, userProfile);
    return userProfile as AuthenticatedUser;
  } else {
    // Mock Registration Flow
    const users = getMockUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: AuthenticatedUser = {
      uid: `mock-uid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: email.toLowerCase(),
      displayName,
      role,
      emailVerified: false,
      language: 'en',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveMockUsers(users);
    setCurrentMockUser(newUser);
    return newUser;
  }
}

/**
 * Login a user with email and password.
 */
export async function loginUser(email: string, password: string): Promise<AuthenticatedUser> {
  const isConfigured = isFirebaseConfigured();

  if (isConfigured) {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase Auth failed to initialize.');

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Retrieve custom role from Firestore user profile
    const profile = await getDocument<AuthenticatedUser>('users', firebaseUser.uid);
    if (!profile) {
      // Fallback profile if Firestore lookup fails
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'User',
        role: 'fan',
        emailVerified: firebaseUser.emailVerified,
        createdAt: new Date().toISOString(),
      };
    }
    return profile;
  } else {
    // Mock Login Flow
    const users = getMockUsers();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!foundUser) {
      throw new Error('Invalid email or password.');
    }

    // Passwords are simulated as passing in mock mode
    setCurrentMockUser(foundUser);
    return foundUser;
  }
}

/**
 * Sign out the current authenticated user.
 */
export async function logoutUser(): Promise<void> {
  const isConfigured = isFirebaseConfigured();

  if (isConfigured) {
    const auth = getFirebaseAuth();
    if (auth) {
      await firebaseSignOut(auth);
    }
  } else {
    setCurrentMockUser(null);
  }
}

/**
 * Send a password reset email.
 */
export async function sendPasswordReset(email: string): Promise<void> {
  const isConfigured = isFirebaseConfigured();

  if (isConfigured) {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase Auth failed to initialize.');
    await sendPasswordResetEmail(auth, email);
  } else {
    // Simulating password reset success
    const users = getMockUsers();
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!foundUser) {
      throw new Error('No user registered with this email.');
    }
  }
}

/**
 * Send verification email to current user.
 */
export async function sendVerificationEmail(): Promise<void> {
  const isConfigured = isFirebaseConfigured();

  if (isConfigured) {
    const auth = getFirebaseAuth();
    if (auth?.currentUser) {
      await firebaseSendEmailVerification(auth.currentUser);
    }
  } else {
    // Mock verification trigger
    const currentUser = getCurrentMockUser();
    if (currentUser) {
      currentUser.emailVerified = true;
      const users = getMockUsers().map((u) =>
        u.uid === currentUser.uid ? { ...u, emailVerified: true } : u
      );
      saveMockUsers(users);
      setCurrentMockUser(currentUser);
    }
  }
}

/**
 * Listen to auth state transitions.
 */
export function onAuthChanged(callback: (user: AuthenticatedUser | null) => void): () => void {
  const isConfigured = isFirebaseConfigured();

  if (isConfigured) {
    const auth = getFirebaseAuth();
    if (!auth) {
      callback(null);
      return () => {};
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Retrieve custom role from Firestore
        const profile = await getDocument<AuthenticatedUser>('users', firebaseUser.uid);
        if (profile) {
          callback(profile);
        } else {
          callback({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'User',
            role: 'fan',
            emailVerified: firebaseUser.emailVerified,
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        callback(null);
      }
    });
  } else {
    // Add callback to memory listeners
    listeners.add(callback);

    // Immediate initial sync
    const initialUser = getCurrentMockUser();
    callback(initialUser);

    // Return unsubscriber function
    return () => {
      listeners.delete(callback);
    };
  }
}
