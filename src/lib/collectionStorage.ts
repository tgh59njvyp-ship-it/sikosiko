/**
 * Collection Binder Storage & State Management
 * Supports 9-pocket card sleeves, multi-page binder books, custom binder styling,
 * portfolio valuation stats, and persistent local storage.
 */

import { AppraisalRecord } from '../types/card';
import { SAMPLE_CARDS } from './sampleCards';

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

const STORAGE_BINDERS_KEY = 'card_scanner_binders_v1';
const STORAGE_ACTIVE_BINDER_KEY = 'card_scanner_active_binder_id';

// Initial seed binders
function generateDefaultBinders(): CollectionBinder[] {
  const charizard = SAMPLE_CARDS[0];
  const pikachu = SAMPLE_CARDS[1];
  const nanjamo = SAMPLE_CARDS[2];
  const mimosa = SAMPLE_CARDS[3];

  const now = new Date().toISOString();

  const primaryBinder: CollectionBinder = {
    id: 'binder_sar_collection',
    title: 'SAR・スペシャルアート特選',
    subtitle: '最高ランク鑑定＆お気に入りコレクション',
    coverColor: 'crimson',
    coverTheme: 'pokeball',
    totalPages: 4, // 4 pages = 36 slots
    createdAt: now,
    updatedAt: now,
    cards: [
      {
        id: 'slot_1',
        binderId: 'binder_sar_collection',
        pageIndex: 0,
        slotIndex: 0,
        cardName: charizard.name,
        cardNumber: charizard.cardNumber,
        rarity: charizard.rarity,
        expansionSet: charizard.expansionSet,
        series: 'スカーレット&バイオレット',
        conditionGrade: 'S',
        estimatedPrice: charizard.basePrice,
        imageUrl: charizard.dataUrl,
        addedAt: now,
        notes: 'AI査定 Sランク・白かけなし完全美品',
      },
      {
        id: 'slot_2',
        binderId: 'binder_sar_collection',
        pageIndex: 0,
        slotIndex: 1,
        cardName: pikachu.name,
        cardNumber: pikachu.cardNumber,
        rarity: pikachu.rarity,
        expansionSet: pikachu.expansionSet,
        series: 'スカーレット&バイオレット',
        conditionGrade: 'S',
        estimatedPrice: pikachu.basePrice,
        imageUrl: pikachu.dataUrl,
        addedAt: now,
        notes: 'マスターボールミラー仕様 センタリング50:50',
      },
      {
        id: 'slot_3',
        binderId: 'binder_sar_collection',
        pageIndex: 0,
        slotIndex: 2,
        cardName: nanjamo.name,
        cardNumber: nanjamo.cardNumber,
        rarity: nanjamo.rarity,
        expansionSet: nanjamo.expansionSet,
        series: 'スカーレット&バイオレット',
        conditionGrade: 'A',
        estimatedPrice: nanjamo.basePrice,
        imageUrl: nanjamo.dataUrl,
        addedAt: now,
        notes: '大人気サポートSAR 微小初期傷あり',
      },
      {
        id: 'slot_4',
        binderId: 'binder_sar_collection',
        pageIndex: 0,
        slotIndex: 4, // Center pocket
        cardName: mimosa.name,
        cardNumber: mimosa.cardNumber,
        rarity: mimosa.rarity,
        expansionSet: mimosa.expansionSet,
        series: 'スカーレット&バイオレット',
        conditionGrade: 'S',
        estimatedPrice: mimosa.basePrice,
        imageUrl: mimosa.dataUrl,
        addedAt: now,
        notes: 'バイオレットex 最高峰サポート',
      },
    ],
  };

  const investmentBinder: CollectionBinder = {
    id: 'binder_vault_investment',
    title: '資産価値・ガチホ保管庫',
    subtitle: '長期保有・PSA候補カード',
    coverColor: 'obsidian',
    coverTheme: 'luxury_leather',
    totalPages: 2,
    createdAt: now,
    updatedAt: now,
    cards: [
      {
        id: 'slot_inv_1',
        binderId: 'binder_vault_investment',
        pageIndex: 0,
        slotIndex: 0,
        cardName: pikachu.name,
        cardNumber: pikachu.cardNumber,
        rarity: pikachu.rarity,
        expansionSet: pikachu.expansionSet,
        series: 'スカーレット&バイオレット',
        conditionGrade: 'S',
        estimatedPrice: pikachu.basePrice,
        imageUrl: pikachu.dataUrl,
        addedAt: now,
      },
    ],
  };

  return [primaryBinder, investmentBinder];
}

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
    return JSON.parse(raw);
  } catch {
    return generateDefaultBinders();
  }
}

/**
 * Save all binders to storage
 */
export function saveStoredBinders(binders: CollectionBinder[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_BINDERS_KEY, JSON.stringify(binders));
  } catch (err) {
    console.warn('Failed to save binders:', err);
  }
}

/**
 * Get active binder ID
 */
export function getActiveBinderId(): string {
  if (typeof window === 'undefined') return 'binder_sar_collection';
  try {
    const id = localStorage.getItem(STORAGE_ACTIVE_BINDER_KEY);
    if (id) return id;
  } catch {}
  return 'binder_sar_collection';
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
 * Delete a binder
 */
export function deleteBinder(binderId: string): boolean {
  const binders = getStoredBinders();
  const filtered = binders.filter((b) => b.id !== binderId);
  if (filtered.length === 0) return false; // Prevent deleting all binders
  saveStoredBinders(filtered);
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
  const binders = getStoredBinders();
  let binder = binders.find((b) => b.id === binderId) || binders[0];

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

  const slotCard: BinderSlotCard = {
    id: `slot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    binderId: binder.id,
    pageIndex: targetPage,
    slotIndex: targetSlot,
    cardName: appraisal.cardName,
    cardNumber: appraisal.cardNumber,
    rarity: appraisal.rarity,
    expansionSet: appraisal.expansionSet,
    series: appraisal.series,
    conditionGrade: appraisal.conditionGrade,
    estimatedPrice: appraisal.estimatedPrice,
    imageUrl: customImageUrl || appraisal.frontImageUrl,
    originalImageUrl: appraisal.frontImageUrl,
    appraisalId: appraisal.id,
    addedAt: new Date().toISOString(),
    notes: appraisal.notes || `${appraisal.conditionGrade}ランク AI査定済み (¥${appraisal.estimatedPrice.toLocaleString()})`,
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
  const binders = getStoredBinders();
  const binder = binders.find((b) => b.id === binderId) || binders[0];

  let addedCount = 0;
  for (const item of appraisals) {
    const next = findNextAvailableSlot(binder);
    if (next.pageIndex >= binder.totalPages) {
      binder.totalPages = next.pageIndex + 1;
    }

    const slotCard: BinderSlotCard = {
      id: `slot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}_${addedCount}`,
      binderId: binder.id,
      pageIndex: next.pageIndex,
      slotIndex: next.slotIndex,
      cardName: item.cardName,
      cardNumber: item.cardNumber,
      rarity: item.rarity,
      expansionSet: item.expansionSet,
      series: item.series,
      conditionGrade: item.conditionGrade,
      estimatedPrice: item.estimatedPrice,
      imageUrl: item.frontImageUrl,
      originalImageUrl: item.frontImageUrl,
      appraisalId: item.id,
      addedAt: new Date().toISOString(),
      notes: `${item.conditionGrade}ランク AI一括査定追加`,
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
