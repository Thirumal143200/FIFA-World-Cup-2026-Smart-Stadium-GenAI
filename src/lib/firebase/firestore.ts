// src/lib/firebase/firestore.ts
// Firestore helper functions for reading/writing stadium, incident, and user data

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  type DocumentData,
  type QueryConstraint,
  type Unsubscribe,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getFirestoreDb } from './config';

type FirestoreData = DocumentData;

/**
 * Get a single document by collection and ID.
 */
export async function getDocument<T extends FirestoreData>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  const docRef = doc(db, collectionName, docId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return ({ id: snapshot.id, ...snapshot.data() } as unknown) as T;
}

/**
 * Query documents from a collection with optional filters.
 */
export async function queryDocuments<T extends FirestoreData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const db = getFirestoreDb();
  if (!db) return [];

  const ref = collection(db, collectionName);
  const q = query(ref, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as unknown) as T);
}

/**
 * Create or overwrite a document.
 */
export async function setDocument(
  collectionName: string,
  docId: string,
  data: FirestoreData
): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  return true;
}

/**
 * Update specific fields on a document.
 */
export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Partial<FirestoreData>
): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  return true;
}

/**
 * Subscribe to real-time updates on a collection.
 */
export function subscribeToCollection<T extends FirestoreData>(
  collectionName: string,
  callback: (docs: T[]) => void,
  constraints: QueryConstraint[] = []
): Unsubscribe | null {
  const db = getFirestoreDb();
  if (!db) return null;

  const ref = collection(db, collectionName);
  const q = query(ref, ...constraints);
  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as unknown) as T);
    callback(docs);
  });
}

/**
 * Subscribe to real-time updates on a single document.
 */
export function subscribeToDocument<T extends FirestoreData>(
  collectionName: string,
  docId: string,
  callback: (doc: T | null) => void
): Unsubscribe | null {
  const db = getFirestoreDb();
  if (!db) return null;

  const docRef = doc(db, collectionName, docId);
  return onSnapshot(docRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    callback(({ id: snapshot.id, ...snapshot.data() } as unknown) as T);
  });
}

// Re-export Firestore query helpers for convenience
export { where, orderBy, limit, Timestamp, serverTimestamp };
