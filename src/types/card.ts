export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface CardRecord {
  id: string;
  name: string;
  cardNumber: string;
  rarity: string;
  expansionSet: string;
  series: string;
  cardType: string;
  hp: number | null;
  cardCategory: string;
  language: string;
  specialFinish: string;
  isAlternateArt: boolean;
  isPromo: boolean;
  imageUrl: string;
  croppedImageUrl?: string;
  backImageUrl?: string;
  baseMarketPrice: number;
  conditionPrices: {
    s: number;
    a: number;
    b: number;
    c: number;
    d: number;
  };
  buybackPrice: number;
  retailPrice: number;
  priceConfidence: '高' | '中' | '低';
  hasMarketData: boolean;
}

export interface ConditionAnalysis {
  edgeWear: 'なし' | '微小' | '小' | '中' | '大';
  scratches: 'なし' | '極小' | '小' | '中' | '大';
  dents: 'なし' | '微小' | 'あり';
  creases: 'なし' | 'あり';
  stains: 'なし' | '微小' | 'あり';
  centeringRatio: string;
  surfaceCondition: string;
  backConditionNotice?: string;
  hasBackImage: boolean;
}

export interface PriceBreakdown {
  marketAverage: number;
  nearMintS: number;
  playedC: number;
  estimatedBuyback: number;
  estimatedRetail: number;
}

export interface AppraisalRecord {
  id: string;
  userId: string;
  cardId?: string;
  cardName: string;
  cardNumber: string;
  rarity: string;
  expansionSet: string;
  series: string;
  cardType: string;
  hp?: number;
  language: string;
  specialFinish: string;
  isAlternateArt: boolean;
  isPromo: boolean;
  frontImageUrl: string;
  croppedImageUrl?: string;
  backImageUrl?: string;
  estimatedPrice: number;
  priceRange: { min: number; max: number };
  priceConfidence: '高' | '中' | '低';
  conditionGrade: 'S' | 'A' | 'B' | 'C' | 'D';
  conditionAnalysis: ConditionAnalysis;
  priceBreakdown: PriceBreakdown;
  candidates?: Array<{ name: string; cardNumber: string; rarity: string; set: string }>;
  appraisedAt: string;
  notes?: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  volume?: number;
}

export type AppraisalStep = 
  | 'idle'
  | 'uploading'
  | 'image_processing'
  | 'name_detection'
  | 'number_verification'
  | 'rarity_grading'
  | 'set_matching'
  | 'market_lookup'
  | 'condition_analysis'
  | 'price_calculation'
  | 'complete';
