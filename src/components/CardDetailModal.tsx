import React, { useState } from 'react';
import {
  X,
  Bookmark,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Info,
} from 'lucide-react';
import { CardRecord, PriceHistoryPoint } from '../types/card';

interface CardDetailModalProps {
  card: CardRecord | null;
  priceHistory?: Record<string, PriceHistoryPoint[]>;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (cardId: string) => void;
  onAppraiseThisCard: (card: CardRecord) => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  priceHistory,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onAppraiseThisCard,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  if (!isOpen || !card) return null;

  const historyPoints = priceHistory ? priceHistory[selectedPeriod] || [] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-rose-400 font-extrabold text-xs">
              {card.rarity}
            </span>
            <span className="font-mono text-xs text-slate-400 font-bold">
              {card.cardNumber}
            </span>
            <span className="text-xs text-slate-500 font-semibold truncate max-w-xs">
              {card.expansionSet}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(card.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isFavorite
                  ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950 dark:border-rose-900'
                  : 'border-slate-300 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            
            {/* Thumbnail */}
            <div className="sm:col-span-5 flex flex-col items-center">
              <div className="relative w-56 aspect-[63/88] rounded-2xl overflow-hidden bg-black shadow-xl border border-slate-200 dark:border-slate-700">
                <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
              </div>
              <button
                onClick={() => {
                  onClose();
                  onAppraiseThisCard(card);
                }}
                className="mt-4 w-full px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>手元のカードで査定する</span>
              </button>
            </div>

            {/* Details */}
            <div className="sm:col-span-7 space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {card.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {card.series} • {card.language} • {card.cardCategory}
                </p>
              </div>

              {/* Price card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-400 block">参考市場相場</span>
                <span className="text-3xl font-black text-red-600 dark:text-rose-500 block mt-0.5">
                  ¥{card.baseMarketPrice.toLocaleString()}
                </span>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>ショップ買取想定: <strong>¥{card.buybackPrice.toLocaleString()}</strong></span>
                  <span>店頭販売相場: <strong>¥{card.retailPrice.toLocaleString()}</strong></span>
                </div>
              </div>

              {/* Condition Prices */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  状態別相場ガイド
                </span>
                <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
                    <span className="font-black text-amber-700 dark:text-amber-400 block text-[11px]">S</span>
                    <span className="font-bold text-slate-900 dark:text-white text-[10px] mt-0.5 block">
                      ¥{card.conditionPrices.s.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                    <span className="font-black text-emerald-700 dark:text-emerald-400 block text-[11px]">A</span>
                    <span className="font-bold text-slate-900 dark:text-white text-[10px] mt-0.5 block">
                      ¥{card.conditionPrices.a.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                    <span className="font-black text-blue-700 dark:text-blue-400 block text-[11px]">B</span>
                    <span className="font-bold text-slate-900 dark:text-white text-[10px] mt-0.5 block">
                      ¥{card.conditionPrices.b.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
                    <span className="font-black text-amber-700 dark:text-amber-400 block text-[11px]">C</span>
                    <span className="font-bold text-slate-900 dark:text-white text-[10px] mt-0.5 block">
                      ¥{card.conditionPrices.c.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
                    <span className="font-black text-rose-700 dark:text-rose-400 block text-[11px]">D</span>
                    <span className="font-bold text-slate-900 dark:text-white text-[10px] mt-0.5 block">
                      ¥{card.conditionPrices.d.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Price Chart */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-red-500" />
                <span>相場推移</span>
              </span>
              <div className="flex rounded-lg bg-slate-200 dark:bg-slate-700 p-0.5">
                {(['7d', '30d', '90d', '1y'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPeriod(p)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedPeriod === p
                        ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-rose-400 shadow-sm'
                        : 'text-slate-500'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {historyPoints.length > 0 ? (
              <div className="h-32 w-full pt-2">
                {(() => {
                  const prices = historyPoints.map((p) => p.price);
                  const min = Math.min(...prices) * 0.95;
                  const max = Math.max(...prices) * 1.05;
                  const range = max - min || 1;
                  const width = 500;
                  const height = 110;
                  const stepX = width / (historyPoints.length - 1 || 1);

                  const points = historyPoints.map((p, i) => {
                    const x = i * stepX;
                    const y = height - ((p.price - min) / range) * (height - 20) - 10;
                    return `${x},${y}`;
                  });

                  return (
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                      <path
                        d={`M ${points.join(' L ')}`}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  );
                })()}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">価格推移データはありません</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
