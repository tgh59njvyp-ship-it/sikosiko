import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  getDocFromServer,
  deleteDoc,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AppraisalRecord } from '../types/card';
import { CollectionBinder } from './collectionStorage';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth & Firestore with dedicated Database ID
export const auth = getAuth(app);
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Test Connection on Boot
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore client is offline or initializing.');
    }
  }
}
testFirestoreConnection();

/**
 * Sign In with Google Popup
 */
export async function signInWithGoogle(): Promise<{
  success: boolean;
  user?: FirebaseUser;
  error?: string;
}> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Save or update user profile in Firestore
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          id: user.uid,
          name: user.displayName || 'ポケカトレーナー',
          email: user.email || '',
          avatarUrl: user.photoURL || '',
          role: 'user',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }

    return { success: true, user };
  } catch (err: any) {
    console.error('Google Sign-in Error:', err);
    return {
      success: false,
      error: err?.message || 'Googleログインに失敗しました。',
    };
  }
}

/**
 * Sign Out from Firebase
 */
export async function logOutFromFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Sign Out Error:', err);
  }
}

/**
 * Subscribe to Auth state changes
 */
export function onAuthUserChanged(
  callback: (user: FirebaseUser | null) => void
): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

// ---------------- Realtime Market Updates ----------------

export interface MarketUpdateItem {
  id: string;
  title: string;
  category: '相場速報' | '高騰' | '注目カード' | '新弾情報' | '取引成立';
  cardName: string;
  currentPrice: number;
  priceChangePercent: number;
  description: string;
  timestamp: string;
}

const INITIAL_MARKET_UPDATES: MarketUpdateItem[] = [
  {
    id: 'upd_1',
    title: 'リザードンex SAR 相場上昇中',
    category: '高騰',
    cardName: 'リザードンex (黒炎の支配者)',
    currentPrice: 28500,
    priceChangePercent: 4.8,
    description: '大会上位入賞デッキでの採用率向上により、PSA10およびNM品で買い需要が急伸しています。',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'upd_2',
    title: 'ピカチュウ マスターボールミラー 取引成立',
    category: '取引成立',
    cardName: 'ピカチュウ (ポケモンカード151)',
    currentPrice: 42000,
    priceChangePercent: 2.1,
    description: 'フリマおよび専門店にて42,000円での美品取引が成立。コレクション需要が依然として高水準です。',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'upd_3',
    title: 'ナンジャモ SAR 安定水準で推移',
    category: '相場速報',
    cardName: 'ナンジャモ (クレイバースト)',
    currentPrice: 68000,
    priceChangePercent: 0.5,
    description: '68,000円〜71,000円帯で高値安定。状態S（極美品）はプレミア価格で取引されています。',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 'upd_4',
    title: 'ミモザ SAR & イーブイ AR 注目度上昇',
    category: '注目カード',
    cardName: 'ミモザ SAR (バイオレットex)',
    currentPrice: 34000,
    priceChangePercent: 3.2,
    description: '海外コレクターの需要増加に伴い、流通枚数が引き締まりつつあります。',
    timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
  },
];

/**
 * Seed initial market updates if Firestore collection is empty
 */
export async function seedMarketUpdatesIfEmpty() {
  try {
    const colRef = collection(db, 'marketUpdates');
    const snap = await getDocs(query(colRef, limit(1)));
    if (snap.empty) {
      for (const item of INITIAL_MARKET_UPDATES) {
        await setDoc(doc(db, 'marketUpdates', item.id), item);
      }
    }
  } catch (err) {
    console.warn('Market updates seed notice:', err);
  }
}

/**
 * Subscribe to Real-Time Market Updates from Firestore
 */
export function subscribeMarketUpdates(
  callback: (updates: MarketUpdateItem[]) => void
): Unsubscribe {
  seedMarketUpdatesIfEmpty();

  const colRef = collection(db, 'marketUpdates');
  const q = query(colRef, orderBy('timestamp', 'desc'), limit(10));

  return onSnapshot(
    q,
    (snapshot) => {
      if (!snapshot.empty) {
        const items: MarketUpdateItem[] = [];
        snapshot.forEach((d) => {
          items.push({ id: d.id, ...(d.data() as any) });
        });
        callback(items);
      } else {
        callback(INITIAL_MARKET_UPDATES);
      }
    },
    (err) => {
      console.warn('Realtime updates snapshot notice:', err);
      callback(INITIAL_MARKET_UPDATES);
    }
  );
}

// ---------------- Firestore Data Sync for User ----------------

/**
 * Save appraisal record to Firestore
 */
export async function saveAppraisalToFirestore(
  userId: string,
  appraisal: AppraisalRecord
): Promise<void> {
  if (!userId || userId === 'usr_guest') return;
  try {
    const ref = doc(db, 'users', userId, 'appraisals', appraisal.id);
    await setDoc(ref, appraisal, { merge: true });
  } catch (err) {
    console.warn('Firestore appraisal sync warning:', err);
  }
}

/**
 * Delete appraisal record from Firestore
 */
export async function deleteAppraisalFromFirestore(
  userId: string,
  appraisalId: string
): Promise<void> {
  if (!userId || userId === 'usr_guest') return;
  try {
    const ref = doc(db, 'users', userId, 'appraisals', appraisalId);
    await deleteDoc(ref);
  } catch (err) {
    console.warn('Firestore appraisal delete warning:', err);
  }
}

/**
 * Save binder to Firestore
 */
export async function saveBinderToFirestore(
  userId: string,
  binder: CollectionBinder
): Promise<void> {
  if (!userId || userId === 'usr_guest') return;
  try {
    const ref = doc(db, 'users', userId, 'binders', binder.id);
    await setDoc(ref, binder, { merge: true });
  } catch (err) {
    console.warn('Firestore binder sync warning:', err);
  }
}

/**
 * Delete binder from Firestore
 */
export async function deleteBinderFromFirestore(
  userId: string,
  binderId: string
): Promise<void> {
  if (!userId || userId === 'usr_guest') return;
  try {
    const ref = doc(db, 'users', userId, 'binders', binderId);
    await deleteDoc(ref);
  } catch (err) {
    console.warn('Firestore binder delete warning:', err);
  }
}

/**
 * Subscribe to User's Binders from Firestore in Real-Time
 */
export function subscribeUserBinders(
  userId: string,
  callback: (binders: CollectionBinder[]) => void
): Unsubscribe | null {
  if (!userId || userId === 'usr_guest') return null;

  const colRef = collection(db, 'users', userId, 'binders');
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const binders: CollectionBinder[] = [];
        snapshot.forEach((d) => {
          binders.push(d.data() as CollectionBinder);
        });
        callback(binders);
      }
    },
    (err) => {
      console.warn('User binders snapshot listener notice:', err);
    }
  );
}

/**
 * Fetch all user data from Firestore on login
 */
export async function loadUserDataFromFirestore(userId: string): Promise<{
  appraisals: AppraisalRecord[];
  binders: CollectionBinder[];
}> {
  if (!userId || userId === 'usr_guest') {
    return { appraisals: [], binders: [] };
  }

  const appraisals: AppraisalRecord[] = [];
  const binders: CollectionBinder[] = [];

  try {
    // 1. Appraisals
    const appSnap = await getDocs(
      query(collection(db, 'users', userId, 'appraisals'), orderBy('appraisedAt', 'desc'), limit(100))
    );
    appSnap.forEach((d) => {
      appraisals.push(d.data() as AppraisalRecord);
    });

    // 2. Binders
    const binSnap = await getDocs(collection(db, 'users', userId, 'binders'));
    binSnap.forEach((d) => {
      binders.push(d.data() as CollectionBinder);
    });
  } catch (err) {
    console.warn('Firestore load user data notice:', err);
  }

  return { appraisals, binders };
}
