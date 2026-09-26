import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { CardRecord, PriceHistoryPoint } from '../types/card';
import { fetchCards, fetchCardById } from '../lib/api';
import { CardDetailModal } from './CardDetailModal';

interface SearchScreenProps {
  onSelectCardForAppraisal: (card: CardRecord) => void;
  favorites: string[];
  onToggleFavorite: (cardId: string) => void;
}

const RARITIES = ['ALL', 'SAR', 'UR', 'AR', 'SR', 'MASTER', 'RR'];

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onSelectCardForAppraisal,
  favorites,
  onToggleFavorite,
}) => {
  const [query, setQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('ALL');
  const [cards, setCards] = useState<CardRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Selected card for detail modal
  const [detailCard, setDetailCard] = useState<CardRecord | null>(null);
  const [detailPriceHistory, setDetailPriceHistory] = useState<Record<string, PriceHistoryPoint[]> | undefined>();

  useEffect(() => {
    loadCards();
  }, [selectedRarity]);

  const loadCards = async () => {
    setLoading(true);
    try {
      const rarityFilter = selectedRarity === 'ALL' ? undefined : selectedRarity;
      const res = await fetchCards(query, rarityFilter);
      setCards(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCards();
  };

  const handleCardClick = async (card: CardRecord) => {
    try {
      const full = await fetchCardById(card.id);
      setDetailCard(full.card);
      setDetailPriceHistory(full.priceHistory);
    } catch (err) {
      setDetailCard(card);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 md:pb-16">
      
      {/* Title & Search Bar */}
      <div className="max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          カード検索 & 相場図鑑
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          カード名やエキスパンション番号からポケカの最新参考相場を検索できます
        </p>

        {/* Input */}
        <form onSubmit={handleSearchSubmit} className="mt-4 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="カード名（リザードン、ナンジャモ等）または番号..."
            className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-slate-900 dark:text-white shadow-sm"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
          >
            検索
          </button>
        </form>
      </div>

      {/* Rarity Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {RARITIES.map((r) => (
          <button
            key={r}
            onClick={() => setSelectedRarity(r)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedRarity === r
                ? 'bg-red-600 text-white shadow-md shadow-red-500/25'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-red-400'
            }`}
          >
            {r === 'ALL' ? 'すべて' : r}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="aspect-[63/88] rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
          ))}
        </div>
      ) : cards.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className="bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-red-400 dark:hover:border-red-500 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="relative aspect-[63/88] w-full rounded-xl overflow-hidden bg-black mb-3 border border-slate-200 dark:border-slate-700 group-hover:scale-102 transition-transform">
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-black uppercase px-1.5 py-0.5 rounded shadow">
                  {card.rarity}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-0.5">
                  <span>{card.cardNumber}</span>
                  <span className="truncate max-w-[100px]">{card.expansionSet}</span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                  {card.name}
                </h3>
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold">参考相場</span>
                  <span className="text-sm font-black text-red-600 dark:text-rose-400">
                    ¥{card.baseMarketPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-slate-400 text-sm">
          一致するカードが見つかりませんでした。検索条件を変更してお試しください。
        </div>
      )}

      {/* Card Detail Modal */}
      <CardDetailModal
        card={detailCard}
        priceHistory={detailPriceHistory}
        isOpen={Boolean(detailCard)}
        onClose={() => setDetailCard(null)}
        isFavorite={detailCard ? favorites.includes(detailCard.id) : false}
        onToggleFavorite={onToggleFavorite}
        onAppraiseThisCard={onSelectCardForAppraisal}
      />

    </div>
  );
};
