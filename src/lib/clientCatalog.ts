import { CardRecord, AppraisalRecord, PriceHistoryPoint } from '../types/card';

export const CLIENT_CARDS_DATABASE: CardRecord[] = [
  {
    id: 'card_charizard_sar',
    name: 'リザードンex',
    cardNumber: '134/108',
    rarity: 'SAR',
    expansionSet: '黒炎の支配者',
    series: 'スカーレット&バイオレット',
    cardType: '悪',
    hp: 330,
    cardCategory: '2進化 ex',
    language: '日本語',
    specialFinish: 'スペシャルアートレア加工 / ホイル',
    isAlternateArt: true,
    isPromo: false,
    imageUrl: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80',
    baseMarketPrice: 28500,
    conditionPrices: { s: 31000, a: 28500, b: 23000, c: 17500, d: 11000 },
    buybackPrice: 23000,
    retailPrice: 29800,
    priceConfidence: '高',
    hasMarketData: true,
  },
  {
    id: 'card_pikachu_masterball',
    name: 'ピカチュウ (マスターボールミラー)',
    cardNumber: '025/165',
    rarity: 'C (マスターボールミラー)',
    expansionSet: 'ポケモンカード151',
    series: 'スカーレット&バイオレット',
    cardType: '雷',
    hp: 60,
    cardCategory: 'たね',
    language: '日本語',
    specialFinish: 'マスターボールミラー加工',
    isAlternateArt: false,
    isPromo: false,
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    baseMarketPrice: 42000,
    conditionPrices: { s: 45000, a: 42000, b: 35000, c: 26000, d: 18000 },
    buybackPrice: 35000,
    retailPrice: 44000,
    priceConfidence: '高',
    hasMarketData: true,
  },
  {
    id: 'card_nanjamo_sar',
    name: 'ナンジャモ',
    cardNumber: '096/071',
    rarity: 'SAR',
    expansionSet: 'クレイバースト',
    series: 'スカーレット&バイオレット',
    cardType: 'サポート',
    hp: null,
    cardCategory: 'トレーナーズ',
    language: '日本語',
    specialFinish: 'SARレリーフ加工',
    isAlternateArt: true,
    isPromo: false,
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    baseMarketPrice: 68000,
    conditionPrices: { s: 74000, a: 68000, b: 54000, c: 41000, d: 25000 },
    buybackPrice: 56000,
    retailPrice: 71000,
    priceConfidence: '高',
    hasMarketData: true,
  },
  {
    id: 'card_mimosa_sar',
    name: 'ミモザ',
    cardNumber: '105/078',
    rarity: 'SAR',
    expansionSet: 'バイオレットex',
    series: 'スカーレット&バイオレット',
    cardType: 'サポート',
    hp: null,
    cardCategory: 'トレーナーズ',
    language: '日本語',
    specialFinish: 'SARホログラム加工',
    isAlternateArt: true,
    isPromo: false,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    baseMarketPrice: 34000,
    conditionPrices: { s: 37000, a: 34000, b: 27000, c: 20000, d: 12000 },
    buybackPrice: 28000,
    retailPrice: 35500,
    priceConfidence: '高',
    hasMarketData: true,
  },
  {
    id: 'card_mewtwo_vstar_sar',
    name: 'ミュウツーVSTAR',
    cardNumber: '221/172',
    rarity: 'SAR',
    expansionSet: 'VSTARユニバース',
    series: 'ソード&シールド',
    cardType: '超',
    hp: 280,
    cardCategory: 'VSTAR',
    language: '日本語',
    specialFinish: 'SAR特殊レリーフ',
    isAlternateArt: true,
    isPromo: false,
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    baseMarketPrice: 8500,
    conditionPrices: { s: 9500, a: 8500, b: 6800, c: 5000, d: 3200 },
    buybackPrice: 6500,
    retailPrice: 8900,
    priceConfidence: '高',
    hasMarketData: true,
  },
  {
    id: 'card_eevee_ar',
    name: 'イーブイ',
    cardNumber: '078/066',
    rarity: 'AR',
    expansionSet: 'クリムゾンヘイズ',
    series: 'スカーレット&バイオレット',
    cardType: '無色',
    hp: 70,
    cardCategory: 'たね',
    language: '日本語',
    specialFinish: 'フルアートイラスト加工',
    isAlternateArt: true,
    isPromo: false,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    baseMarketPrice: 3200,
    conditionPrices: { s: 3600, a: 3200, b: 2400, c: 1700, d: 1000 },
    buybackPrice: 2400,
    retailPrice: 3400,
    priceConfidence: '高',
    hasMarketData: true,
  },
  {
    id: 'card_giratina_v_sa',
    name: 'ギラティナV',
    cardNumber: '111/100',
    rarity: 'SR (SA)',
    expansionSet: 'ロストアビス',
    series: 'ソード&シールド',
    cardType: 'ドラゴン',
    hp: 220,
    cardCategory: 'たね V',
    language: '日本語',
    specialFinish: 'SA特殊フルイラスト',
    isAlternateArt: true,
    isPromo: false,
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    baseMarketPrice: 58000,
    conditionPrices: { s: 64000, a: 58000, b: 46000, c: 33000, d: 20000 },
    buybackPrice: 47000,
    retailPrice: 61000,
    priceConfidence: '高',
    hasMarketData: true,
  },
  {
    id: 'card_terapagos_ex_sar',
    name: 'テラパゴスex',
    cardNumber: '130/102',
    rarity: 'SAR',
    expansionSet: 'ステラミラクル',
    series: 'スカーレット&バイオレット',
    cardType: '無色',
    hp: 230,
    cardCategory: 'たね ステラex',
    language: '日本語',
    specialFinish: 'ステラSARホロ加工',
    isAlternateArt: true,
    isPromo: false,
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    baseMarketPrice: 9800,
    conditionPrices: { s: 11000, a: 9800, b: 7800, c: 5600, d: 3500 },
    buybackPrice: 7600,
    retailPrice: 10200,
    priceConfidence: '高',
    hasMarketData: true,
  },
];

export function generateClientPriceHistory(basePrice: number): Record<string, PriceHistoryPoint[]> {
  const now = new Date('2026-09-26T00:00:00Z');
  const makeHistory = (days: number, stepDays: number, volatility: number) => {
    const list: PriceHistoryPoint[] = [];
    let curPrice = basePrice * (1 - volatility * (days / 100));
    for (let i = days; i >= 0; i -= stepDays) {
      const d = new Date(now.getTime() - i * 86400000);
      const change = (Math.sin(i * 0.4) * 0.04 + (Math.random() * 0.05 - 0.02)) * curPrice;
      curPrice = Math.max(100, Math.round(curPrice + change));
      list.push({
        date: d.toISOString().slice(5, 10).replace('-', '/'),
        price: curPrice,
        volume: Math.floor(Math.random() * 20) + 5,
      });
    }
    if (list.length > 0) {
      list[list.length - 1].price = basePrice;
    }
    return list;
  };

  return {
    '7d': makeHistory(7, 1, 0.05),
    '30d': makeHistory(30, 2, 0.12),
    '90d': makeHistory(90, 5, 0.22),
    '1y': makeHistory(365, 15, 0.45),
  };
}

export function evaluateClientAppraisal(data: {
  cardName: string;
  cardNumber?: string;
  rarity?: string;
  expansionSet?: string;
  series?: string;
  cardType?: string;
  hp?: number;
  conditionGrade?: 'S' | 'A' | 'B' | 'C' | 'D';
  edgeWear?: string;
  scratches?: string;
  dents?: string;
  creases?: string;
  stains?: string;
  centeringRatio?: string;
  hasBackImage?: boolean;
  notes?: string;
  confidenceScore?: number;
  estimatedPriceSuggestion?: number;
  isAlternateArt?: boolean;
  isPromo?: boolean;
  specialFinish?: string;
  language?: string;
  candidates?: Array<{ name: string; cardNumber: string; rarity: string; set: string }>;
  frontImageUrl: string;
  backImageUrl?: string;
}): AppraisalRecord {
  const normName = (data.cardName || '').trim();
  const matched = normName.length >= 2 ? CLIENT_CARDS_DATABASE.find(
    (c) =>
      c.name === normName ||
      (data.cardNumber && c.cardNumber === data.cardNumber.trim()) ||
      c.name.toLowerCase() === normName.toLowerCase()
  ) : undefined;

  let basePrice = data.estimatedPriceSuggestion || (matched ? matched.baseMarketPrice : 3800);
  let confidence: '高' | '中' | '低' = (data.confidenceScore && data.confidenceScore > 80) ? '高' : (matched ? '高' : '中');
  const grade: 'S' | 'A' | 'B' | 'C' | 'D' = data.conditionGrade || 'A';

  let conditionMultiplier = 1.0;
  if (grade === 'S') conditionMultiplier = 1.1;
  else if (grade === 'A') conditionMultiplier = 1.0;
  else if (grade === 'B') conditionMultiplier = 0.8;
  else if (grade === 'C') conditionMultiplier = 0.58;
  else if (grade === 'D') conditionMultiplier = 0.35;

  const estimatedPrice = Math.round((basePrice * conditionMultiplier) / 100) * 100;
  const minRange = Math.round((estimatedPrice * 0.88) / 100) * 100;
  const maxRange = Math.round((estimatedPrice * 1.12) / 100) * 100;

  const sPrice = Math.round((basePrice * 1.1) / 100) * 100;
  const cPrice = Math.round((basePrice * 0.58) / 100) * 100;
  const buybackPrice = Math.round((estimatedPrice * 0.78) / 100) * 100;
  const retailPrice = Math.round((estimatedPrice * 1.05) / 100) * 100;

  const hasBack = Boolean(data.hasBackImage || data.backImageUrl);

  return {
    id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId: 'usr_guest',
    cardId: matched?.id,
    cardName: data.cardName || (matched ? matched.name : '不明なカード'),
    cardNumber: data.cardNumber || (matched ? matched.cardNumber : '不明/プロモ'),
    rarity: data.rarity || (matched ? matched.rarity : '不明/ノーマル'),
    expansionSet: data.expansionSet || (matched ? matched.expansionSet : 'ポケットモンスターカードゲーム'),
    series: data.series || (matched ? matched.series : 'スカーレット&バイオレット'),
    cardType: data.cardType || (matched ? matched.cardType : '無色'),
    hp: data.hp ?? (matched ? matched.hp || undefined : undefined),
    language: data.language || '日本語',
    specialFinish: data.specialFinish || (matched ? matched.specialFinish : '通常'),
    isAlternateArt: data.isAlternateArt ?? (matched ? matched.isAlternateArt : false),
    isPromo: data.isPromo ?? (matched ? matched.isPromo : false),
    frontImageUrl: data.frontImageUrl,
    backImageUrl: data.backImageUrl,
    estimatedPrice,
    priceRange: { min: minRange, max: maxRange },
    priceConfidence: confidence,
    conditionGrade: grade,
    conditionAnalysis: {
      edgeWear: (data.edgeWear as any) || (grade === 'S' ? 'なし' : grade === 'A' ? '微小' : '小'),
      scratches: (data.scratches as any) || (grade === 'S' ? 'なし' : grade === 'A' ? '極小' : '小'),
      dents: (data.dents as any) || 'なし',
      creases: (data.creases as any) || 'なし',
      stains: (data.stains as any) || 'なし',
      centeringRatio: data.centeringRatio || '50:50',
      surfaceCondition: data.notes || (grade === 'S' ? '極めて良好。目立った傷なし' : '全体的に良好な状態です'),
      backConditionNotice: hasBack ? undefined : '裏面画像がないため、裏面状態は判定できません。',
      hasBackImage: hasBack,
    },
    priceBreakdown: {
      marketAverage: basePrice,
      nearMintS: sPrice,
      playedC: cPrice,
      estimatedBuyback: buybackPrice,
      estimatedRetail: retailPrice,
    },
    candidates: data.candidates,
    appraisedAt: new Date().toISOString(),
    notes: data.notes,
  };
}
