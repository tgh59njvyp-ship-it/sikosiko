/**
 * Collection Binder Storage & State Management
 * Supports 9-pocket card sleeves, multi-page binder books, custom binder styling,
 * portfolio valuation stats, and persistent local storage.
 */

import { AppraisalRecord } from '../types/card';
import { auth, saveBinderToFirestore, deleteBinderFromFirestore } from './firebase';

export type BinderCoverColor = 'crimson' | 'obsidian' | 'sapphire' | 'emerald' | 'amber' | 'amethyst';
export type BinderCoverTheme = 'pokeball' | 'luxury_leather' | 'holo_grid' | 'vintage';

export interface BinderSlotCard {
  id: string;
  binderId: string;
  pageIndex: number; // 0, 1, 2, ...
  slotIndex: number; // 0 to 8 (9-pocket sleeve per page)
  cardName: string;
  cardNumber: string;
  rarity: string;
  expansionSet: string;
  series: string;
  conditionGrade: 'S' | 'A' | 'B' | 'C' | 'D';
  estimatedPrice: number;
  imageUrl: string; // Cropped clean card image
  originalImageUrl?: string;
  appraisalId?: string;
  addedAt: string;
  notes?: string;
}

export interface CollectionBinder {
  id: string;
  title: string;
  subtitle: string;
  coverColor: BinderCoverColor;
  coverTheme: BinderCoverTheme;
  totalPages: number;
  cards: BinderSlotCard[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_BINDERS_KEY = 'card_scanner_binders_v2';
const STORAGE_ACTIVE_BINDER_KEY = 'card_scanner_active_binder_id_v2';

// Initial clean, empty binder
function generateDefaultBinders(): CollectionBinder[] {
  const now = new Date().toISOString();

  const primaryBinder: CollectionBinder = {
    id: 'binder_main_collection',
    title: 'マイコレクション',
    subtitle: 'ポケモンカードAI査定コレクション',
    coverColor: 'crimson',
    coverTheme: 'pokeball',
    totalPages: 4, // 4 pages = 36 empty slots ready for filing
    createdAt: now,
    updatedAt: now,
    cards: [], // Starts completely empty
  };

  return [primaryBinder];
}

export const COLLECTION_UPDATED_EVENT = 'card_scanner_collection_updated';

/**
 * Fetch all binders from storage
 */
export function getStoredBinders(): CollectionBinder[] {
  if (typeof window === 'undefined') return generateDefaultBinders();
  try {
    const raw = localStorage.getItem(STORAGE_BINDERS_KEY);
    if (!raw) {
      const initial = generateDefaultBinders();
      localStorage.setItem(STORAGE_BINDERS_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = generateDefaultBinders();
      localStorage.setItem(STORAGE_BINDERS_KEY, JSON.stringify(initial));
      return initial;
    }
    return parsed;
  } catch {
    return generateDefaultBinders();
  }
}

/**
 * Save all binders to storage and broadcast event to all listeners
 */
export function saveStoredBinders(binders: CollectionBinder[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_BINDERS_KEY, JSON.stringify(binders));
    window.dispatchEvent(new CustomEvent(COLLECTION_UPDATED_EVENT, { detail: binders }));

    // Sync to Firestore if authenticated
    if (auth.currentUser?.uid) {
      for (const b of binders) {
        saveBinderToFirestore(auth.currentUser.uid, b).catch(() => {});
      }
    }
  } catch (err) {
    console.warn('Failed to save binders:', err);
  }
}

/**
 * Get total cards count across all binders
 */
export function getTotalCollectionCardCount(): number {
  const binders = getStoredBinders();
  return binders.reduce((acc, b) => acc + (b.cards?.length || 0), 0);
}

/**
 * Get active binder ID
 */
export function getActiveBinderId(): string {
  if (typeof window === 'undefined') return 'binder_main_collection';
  try {
    const id = localStorage.getItem(STORAGE_ACTIVE_BINDER_KEY);
    if (id) return id;
  } catch {}
  return 'binder_main_collection';
}

/**
 * Set active binder ID
 */
export function setActiveBinderId(id: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_ACTIVE_BINDER_KEY, id);
  } catch {}
}

/**
 * Create a new binder
 */
export function createNewBinder(
  title: string,
  subtitle: string = '',
  coverColor: BinderCoverColor = 'crimson',
  coverTheme: BinderCoverTheme = 'pokeball'
): CollectionBinder {
  const binders = getStoredBinders();
  const now = new Date().toISOString();
  const newBinder: CollectionBinder = {
    id: `binder_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: title.trim() || '新規バインダー',
    subtitle: subtitle.trim() || 'マイトレーディングカードコレクション',
    coverColor,
    coverTheme,
    totalPages: 4,
    cards: [],
    createdAt: now,
    updatedAt: now,
  };
  binders.push(newBinder);
  saveStoredBinders(binders);
  setActiveBinderId(newBinder.id);
  return newBinder;
}

/**
 * Merge Cloud Binders with Local Binders to prevent data loss and keep user collections in sync
 */
export function mergeCloudBinders(cloudBinders: CollectionBinder[]): CollectionBinder[] {
  if (!cloudBinders || cloudBinders.length === 0) return getStoredBinders();

  const localBinders = getStoredBinders();
  const binderMap = new Map<string, CollectionBinder>();

  // Add local binders
  localBinders.forEach((b) => binderMap.set(b.id, b));

  // Merge cloud binders
  cloudBinders.forEach((cb) => {
    const existing = binderMap.get(cb.id);
    if (!existing) {
      binderMap.set(cb.id, cb);
    } else {
      // Merge cards
      const cardMap = new Map<string, BinderSlotCard>();
      (existing.cards || []).forEach((c) => cardMap.set(`${c.pageIndex}_${c.slotIndex}`, c));
      (cb.cards || []).forEach((c) => cardMap.set(`${c.pageIndex}_${c.slotIndex}`, c));

      binderMap.set(cb.id, {
        ...existing,
        ...cb,
        totalPages: Math.max(existing.totalPages, cb.totalPages || 4),
        cards: Array.from(cardMap.values()),
        updatedAt: new Date(
          Math.max(
            new Date(existing.updatedAt || 0).getTime(),
            new Date(cb.updatedAt || 0).getTime()
          )
        ).toISOString(),
      });
    }
  });

  const merged = Array.from(binderMap.values());
  saveStoredBinders(merged);
  return merged;
}

/**
 * Delete a binder
 */
export function deleteBinder(binderId: string): boolean {
  const binders = getStoredBinders();
  const filtered = binders.filter((b) => b.id !== binderId);
  if (filtered.length === 0) return false; // Prevent deleting all binders
  saveStoredBinders(filtered);
  if (auth.currentUser?.uid) {
    deleteBinderFromFirestore(auth.currentUser.uid, binderId).catch(() => {});
  }
  if (getActiveBinderId() === binderId) {
    setActiveBinderId(filtered[0].id);
  }
  return true;
}

/**
 * Update binder settings
 */
export function updateBinder(
  binderId: string,
  updates: Partial<Omit<CollectionBinder, 'id' | 'cards' | 'createdAt'>>
): CollectionBinder | null {
  const binders = getStoredBinders();
  const index = binders.findIndex((b) => b.id === binderId);
  if (index === -1) return null;

  binders[index] = {
    ...binders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveStoredBinders(binders);
  return binders[index];
}

/**
 * Find next available slot on a page or across the binder
 */
export function findNextAvailableSlot(
  binder: CollectionBinder
): { pageIndex: number; slotIndex: number } {
  for (let page = 0; page < binder.totalPages; page++) {
    for (let slot = 0; slot < 9; slot++) {
      const occupied = binder.cards.some((c) => c.pageIndex === page && c.slotIndex === slot);
      if (!occupied) {
        return { pageIndex: page, slotIndex: slot };
      }
    }
  }
  // Expand binder if full
  return { pageIndex: binder.totalPages, slotIndex: 0 };
}

/**
 * Add an appraised card into a binder slot
 */
export function addCardToBinder(
  binderId: string,
  appraisal: AppraisalRecord,
  preferredPage?: number,
  preferredSlot?: number,
  customImageUrl?: string
): { success: boolean; binder: CollectionBinder; slotCard: BinderSlotCard } {
  let binders = getStoredBinders();
  if (!binders || binders.length === 0) {
    binders = generateDefaultBinders();
  }

  let binder = binders.find((b) => b.id === binderId);
  if (!binder) {
    binder = binders[0];
  }

  // Ensure binder.cards array is initialized
  if (!Array.isArray(binder.cards)) {
    binder.cards = [];
  }

  let targetPage = preferredPage ?? 0;
  let targetSlot = preferredSlot ?? 0;

  if (preferredPage === undefined || preferredSlot === undefined) {
    const next = findNextAvailableSlot(binder);
    targetPage = next.pageIndex;
    targetSlot = next.slotIndex;
  }

  // If target page exceeds total pages, expand total pages
  if (targetPage >= binder.totalPages) {
    binder.totalPages = targetPage + 1;
  }

  // Remove any existing card in that exact slot
  binder.cards = binder.cards.filter(
    (c) => !(c.pageIndex === targetPage && c.slotIndex === targetSlot)
  );

  const cardImage =
    customImageUrl || appraisal.croppedImageUrl || appraisal.frontImageUrl || '';

  const slotCard: BinderSlotCard = {
    id: `slot_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    binderId: binder.id,
    pageIndex: targetPage,
    slotIndex: targetSlot,
    cardName: appraisal.cardName || 'ポケモンカード',
    cardNumber: appraisal.cardNumber || '---/---',
    rarity: appraisal.rarity || 'Normal',
    expansionSet: appraisal.expansionSet || 'ポケモンカード',
    series: appraisal.series || 'スカーレット&バイオレット',
    conditionGrade: appraisal.conditionGrade || 'A',
    estimatedPrice: appraisal.estimatedPrice || 0,
    imageUrl: cardImage,
    originalImageUrl: appraisal.frontImageUrl || cardImage,
    appraisalId: appraisal.id,
    addedAt: new Date().toISOString(),
    notes:
      appraisal.notes ||
      `${appraisal.conditionGrade || 'A'}ランク AI査定済み (¥${(appraisal.estimatedPrice || 0).toLocaleString()})`,
  };

  binder.cards.push(slotCard);
  binder.updatedAt = new Date().toISOString();

  saveStoredBinders(binders);
  return { success: true, binder, slotCard };
}

/**
 * Batch add multiple appraised cards into the binder in consecutive slots
 */
export function addBatchCardsToBinder(
  binderId: string,
  appraisals: AppraisalRecord[]
): { success: boolean; addedCount: number; binder: CollectionBinder } {
  let binders = getStoredBinders();
  if (!binders || binders.length === 0) {
    binders = generateDefaultBinders();
  }

  let binder = binders.find((b) => b.id === binderId);
  if (!binder) {
    binder = binders[0];
  }

  if (!Array.isArray(binder.cards)) {
    binder.cards = [];
  }

  let addedCount = 0;
  for (const item of appraisals) {
    const next = findNextAvailableSlot(binder);
    if (next.pageIndex >= binder.totalPages) {
      binder.totalPages = next.pageIndex + 1;
    }

    const cardImage = item.croppedImageUrl || item.frontImageUrl || '';

    const slotCard: BinderSlotCard = {
      id: `slot_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${addedCount}`,
      binderId: binder.id,
      pageIndex: next.pageIndex,
      slotIndex: next.slotIndex,
      cardName: item.cardName || 'ポケモンカード',
      cardNumber: item.cardNumber || '---/---',
      rarity: item.rarity || 'Normal',
      expansionSet: item.expansionSet || 'ポケモンカード',
      series: item.series || 'スカーレット&バイオレット',
      conditionGrade: item.conditionGrade || 'A',
      estimatedPrice: item.estimatedPrice || 0,
      imageUrl: cardImage,
      originalImageUrl: item.frontImageUrl || cardImage,
      appraisalId: item.id,
      addedAt: new Date().toISOString(),
      notes: `${item.conditionGrade || 'A'}ランク AI一括査定追加`,
    };

    binder.cards.push(slotCard);
    addedCount++;
  }

  binder.updatedAt = new Date().toISOString();
  saveStoredBinders(binders);
  return { success: true, addedCount, binder };
}

/**
 * Remove a card from a binder
 */
export function removeCardFromBinder(binderId: string, slotCardId: string): CollectionBinder | null {
  const binders = getStoredBinders();
  const binder = binders.find((b) => b.id === binderId);
  if (!binder) return null;

  binder.cards = binder.cards.filter((c) => c.id !== slotCardId);
  binder.updatedAt = new Date().toISOString();
  saveStoredBinders(binders);
  return binder;
}

/**
 * Swap or move a card between slots
 */
export function moveCardSlot(
  binderId: string,
  slotCardId: string,
  toPage: number,
  toSlot: number
): CollectionBinder | null {
  const binders = getStoredBinders();
  const binder = binders.find((b) => b.id === binderId);
  if (!binder) return null;

  const card = binder.cards.find((c) => c.id === slotCardId);
  if (!card) return null;

  // Check if destination slot has a card (swap)
  const existingAtDest = binder.cards.find(
    (c) => c.pageIndex === toPage && c.slotIndex === toSlot && c.id !== slotCardId
  );

  if (existingAtDest) {
    existingAtDest.pageIndex = card.pageIndex;
    existingAtDest.slotIndex = card.slotIndex;
  }

  card.pageIndex = toPage;
  card.slotIndex = toSlot;
  binder.updatedAt = new Date().toISOString();

  saveStoredBinders(binders);
  return binder;
}

export interface CollectionAnalytics {
  totalValue: number;
  totalCards: number;
  topCard: BinderSlotCard | null;
  rarityCounts: Record<string, number>;
  gradeCounts: Record<string, number>;
  binderCount: number;
}

/**
 * Calculate full portfolio statistics across all binders or single binder
 */
export function getCollectionAnalytics(binders: CollectionBinder[]): CollectionAnalytics {
  let totalValue = 0;
  let totalCards = 0;
  let topCard: BinderSlotCard | null = null;
  const rarityCounts: Record<string, number> = {};
  const gradeCounts: Record<string, number> = { S: 0, A: 0, B: 0, C: 0, D: 0 };

  binders.forEach((binder) => {
    binder.cards.forEach((card) => {
      totalValue += card.estimatedPrice;
      totalCards += 1;

      if (!topCard || card.estimatedPrice > topCard.estimatedPrice) {
        topCard = card;
      }

      rarityCounts[card.rarity] = (rarityCounts[card.rarity] || 0) + 1;
      if (card.conditionGrade) {
        gradeCounts[card.conditionGrade] = (gradeCounts[card.conditionGrade] || 0) + 1;
      }
    });
  });

  return {
    totalValue,
    totalCards,
    topCard,
    rarityCounts,
    gradeCounts,
    binderCount: binders.length,
  };
}
