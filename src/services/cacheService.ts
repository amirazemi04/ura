import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseClient';

const COLLECTION = 'contentful_cache';

export const getCachedEntries = async (
  contentType: string,
  locale: string
): Promise<any[] | null> => {
  try {
    const ref = doc(db, COLLECTION, `entries__${contentType}__${locale}`);
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data().items ?? [];
    return null;
  } catch {
    return null;
  }
};

export const setCachedEntries = async (
  contentType: string,
  locale: string,
  items: any[]
): Promise<void> => {
  const ref = doc(db, COLLECTION, `entries__${contentType}__${locale}`);
  await setDoc(ref, { items, syncedAt: new Date().toISOString() });
};

export const getCachedEntry = async (
  entryId: string,
  locale: string
): Promise<any | null> => {
  try {
    const ref = doc(db, COLLECTION, `entry__${entryId}__${locale}`);
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data().data ?? null;
    return null;
  } catch {
    return null;
  }
};

export const setCachedEntry = async (
  entryId: string,
  locale: string,
  data: any
): Promise<void> => {
  const ref = doc(db, COLLECTION, `entry__${entryId}__${locale}`);
  await setDoc(ref, { data, syncedAt: new Date().toISOString() });
};

export const getCachedAssetUrl = async (
  assetId: string
): Promise<string | null> => {
  try {
    const ref = doc(db, COLLECTION, `asset__${assetId}`);
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data().url ?? '';
    return null;
  } catch {
    return null;
  }
};

export const setCachedAssetUrl = async (
  assetId: string,
  url: string
): Promise<void> => {
  const ref = doc(db, COLLECTION, `asset__${assetId}`);
  await setDoc(ref, { url, syncedAt: new Date().toISOString() });
};
