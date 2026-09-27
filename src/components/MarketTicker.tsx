import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Sparkles,
  Flame,
  ChevronRight,
  RefreshCw,
  Zap,
  Tag,
  Radio,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
} from 'lucide-react';
import { MarketUpdateItem, subscribeMarketUpdates } from '../lib/firebase';

interface MarketTickerProps {
  onSelectCardName?: (cardName: string) => void;
}

export const MarketTicker: React.FC<MarketTickerProps> = ({ onSelectCardName }) => {
  const [updates, setUpdates] = useState<MarketUpdateItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedUpdate, setSelectedUpdate] = useState<MarketUpdateItem | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeMarketUpdates((newUpdates) => {
      if (newUpdates && newUpdates.length > 0) {
        setUpdates(newUpdates);
      }
    });
    return () => unsubscribe();
  }, []);

  // Auto-rotate ticker items every 4.5 seconds
  useEffect(() => {
    if (updates.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % updates.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [updates.length, isPaused]);

  if (updates.length === 0) return null;

  const currentItem = updates[currentIndex] || updates[0];

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case '高騰':
        return 'bg-rose-500 text-white';
      case '取引成立':
        return 'bg-emerald-500 text-white';
      case '注目カード':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <>
      {/* Realtime Ticker Strip */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="w-full bg-gradient-to-r from-slate-900 via-neutral-900 to-slate-900 text-white border-b border-slate-800 text-xs px-3 sm:px-6 py-2 flex items-center justify-between gap-3 overflow-hidden shadow-sm"
      >
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-extrabold text-[11px] tracking-wider uppercase text-red-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-red-400" />
            <span className="hidden sm:inline">リアルタイム相場速報</span>
            <span className="sm:hidden">速報</span>
          </span>
          <span className="text-slate-700 dark:text-slate-700 hidden sm:inline">|</span>
        </div>

        {/* Scrolling item */}
        <div
          onClick={() => setSelectedUpdate(currentItem)}
          className="flex-1 min-w-0 flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-black shrink-0 ${getCategoryBadge(
              currentItem.category
            )}`}
          >
            {currentItem.category}
          </span>
          <span className="font-bold text-slate-100 truncate text-[11px] sm:text-xs">
            {currentItem.title}
          </span>
          <span className="font-mono text-amber-400 font-bold shrink-0 text-[11px] sm:text-xs hidden md:inline">
            ¥{currentItem.currentPrice.toLocaleString()}
          </span>
          {currentItem.priceChangePercent !== 0 && (
            <span
              className={`text-[10px] font-bold shrink-0 hidden sm:inline-flex items-center gap-0.5 ${
                currentItem.priceChangePercent > 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {currentItem.priceChangePercent > 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {currentItem.priceChangePercent > 0 ? '+' : ''}
              {currentItem.priceChangePercent}%
            </span>
          )}
        </div>

        {/* View all button */}
        <button
          onClick={() => setSelectedUpdate(currentItem)}
          className="shrink-0 text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-semibold transition-colors cursor-pointer"
        >
          <span>詳細</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Detail Modal */}
      {selectedUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-black ${getCategoryBadge(
                    selectedUpdate.category
                  )}`}
                >
                  {selectedUpdate.category}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Firebase リアルタイム配信
                </span>
              </div>
              <button
                onClick={() => setSelectedUpdate(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {selectedUpdate.title}
              </h3>
              <p className="text-xs font-bold text-red-600 dark:text-rose-400 mt-1">
                対象カード: {selectedUpdate.cardName}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                  現在の平均市場相場
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  ¥{selectedUpdate.currentPrice.toLocaleString()}
                </span>
              </div>
              <div
                className={`px-3 py-1.5 rounded-xl font-black text-sm flex items-center gap-1 ${
                  selectedUpdate.priceChangePercent >= 0
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                    : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {selectedUpdate.priceChangePercent >= 0 ? '+' : ''}
                {selectedUpdate.priceChangePercent}%
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedUpdate.description}
            </p>

            {/* List of other recent updates */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                他のリアルタイム速報
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {updates.map((upd) => (
                  <div
                    key={upd.id}
                    onClick={() => setSelectedUpdate(upd)}
                    className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      upd.id === selectedUpdate.id
                        ? 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 font-bold text-red-700 dark:text-rose-300'
                        : 'bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="truncate pr-2">{upd.title}</span>
                    <span className="font-mono font-bold shrink-0">
                      ¥{upd.currentPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedUpdate(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs cursor-pointer"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
