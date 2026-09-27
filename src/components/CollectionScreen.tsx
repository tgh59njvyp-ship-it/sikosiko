import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Sparkles,
  Plus,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Layers,
  Search,
  Trash2,
  Share2,
  CheckCircle2,
  Grid,
  Camera,
  ArrowRight,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  CollectionBinder,
  BinderSlotCard,
  BinderCoverColor,
  getStoredBinders,
  getActiveBinderId,
  setActiveBinderId,
  createNewBinder,
  deleteBinder,
  updateBinder,
  removeCardFromBinder,
  getCollectionAnalytics,
  COLLECTION_UPDATED_EVENT,
} from '../lib/collectionStorage';
import {
  playPageFlipSound,
  playHoloShimmerSound,
  playBinderOpenSound,
} from '../lib/soundFx';

interface CollectionScreenProps {
  onOpenScan: () => void;
  onSelectCardDetail?: (cardName: string, cardNumber: string) => void;
}

export const CollectionScreen: React.FC<CollectionScreenProps> = ({
  onOpenScan,
}) => {
  const [binders, setBinders] = useState<CollectionBinder[]>([]);
  const [activeBinderId, setCurrentActiveId] = useState<string>('');
  const [isBookOpen, setIsBookOpen] = useState<boolean>(true);
  const [currentPageSpread, setCurrentPageSpread] = useState<number>(0);
  const [flipDirection, setFlipDirection] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'book' | 'grid'>('book');
  const [selectedCardForModal, setSelectedCardForModal] = useState<BinderSlotCard | null>(null);
  const [isCreateBinderModalOpen, setIsCreateBinderModalOpen] = useState<boolean>(false);
  const [newBinderTitle, setNewBinderTitle] = useState<string>('');
  const [newBinderColor, setNewBinderColor] = useState<BinderCoverColor>('crimson');
  const [mouseHoloPos, setMouseHoloPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Sync state from storage
  const syncBindersFromStorage = useCallback(() => {
    const loaded = getStoredBinders();
    setBinders(loaded);
    const activeId = getActiveBinderId();
    const match = loaded.find((b) => b.id === activeId);
    setCurrentActiveId(match ? match.id : loaded[0]?.id || '');
  }, []);

  useEffect(() => {
    syncBindersFromStorage();

    const handleStorageUpdate = () => {
      syncBindersFromStorage();
    };

    window.addEventListener(COLLECTION_UPDATED_EVENT, handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener(COLLECTION_UPDATED_EVENT, handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [syncBindersFromStorage]);

  const activeBinder = binders.find((b) => b.id === activeBinderId) || binders[0];
  const analytics = getCollectionAnalytics(binders);

  // Sound and page turning
  const handleNextPage = () => {
    if (!activeBinder) return;
    const maxSpreads = Math.ceil(activeBinder.totalPages / 2);
    if (currentPageSpread < maxSpreads - 1) {
      setFlipDirection(1);
      playPageFlipSound();
      setCurrentPageSpread((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageSpread > 0) {
      setFlipDirection(-1);
      playPageFlipSound();
      setCurrentPageSpread((prev) => prev - 1);
    }
  };

  const handleToggleBookOpen = () => {
    if (!isBookOpen) {
      playBinderOpenSound();
    } else {
      playPageFlipSound();
    }
    setIsBookOpen(!isBookOpen);
  };

  // Framer Motion Page Flip Variants
  const pageSpreadVariants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 32 : -32,
      opacity: 0.15,
      scale: 0.96,
      transition: { duration: 0.45, ease: 'easeOut' as const },
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.48, ease: 'easeOut' as const },
    },
    exit: (direction: number) => ({
      rotateY: direction > 0 ? -32 : 32,
      opacity: 0.15,
      scale: 0.96,
      transition: { duration: 0.4, ease: 'easeIn' as const },
    }),
  };

  const handleCreateNewBinder = () => {
    if (!newBinderTitle.trim()) return;
    const created = createNewBinder(newBinderTitle.trim(), '', newBinderColor, 'pokeball');
    syncBindersFromStorage();
    setCurrentActiveId(created.id);
    setActiveBinderId(created.id);
    setIsCreateBinderModalOpen(false);
    setNewBinderTitle('');
    playBinderOpenSound();
  };

  const handleDeleteActiveBinder = (id: string) => {
    if (binders.length <= 1) return;
    if (confirm('このバインダーを削除してもよろしいですか？')) {
      deleteBinder(id);
      syncBindersFromStorage();
    }
  };

  const handleRemoveCard = (slotCardId: string) => {
    if (!activeBinder) return;
    removeCardFromBinder(activeBinder.id, slotCardId);
    syncBindersFromStorage();
    setSelectedCardForModal(null);
  };

  const handleAddPage = () => {
    if (!activeBinder) return;
    const newTotal = activeBinder.totalPages + 2;
    updateBinder(activeBinder.id, { totalPages: newTotal });
    syncBindersFromStorage();
    playPageFlipSound();
  };

  const handleShareBinder = () => {
    if (!activeBinder) return;
    const totalVal = activeBinder.cards.reduce((sum, c) => sum + c.estimatedPrice, 0);
    const text = `【CARD SCANNER バインダー】\n📖 ${activeBinder.title}\n🃏 収録枚数: ${activeBinder.cards.length}枚\n💰 推定コレクション総額: ¥${totalVal.toLocaleString()}`;
    if (navigator.share) {
      navigator.share({ title: activeBinder.title, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 3000);
    }
  };

  // Card Holo mouse movement effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMouseHoloPos({ x, y });
  };

  // Color theme helpers
  const getBinderThemeClasses = (color: BinderCoverColor) => {
    switch (color) {
      case 'obsidian':
        return {
          leather: 'from-slate-900 via-zinc-900 to-black text-slate-100 border-slate-700 shadow-slate-900/50',
          spine: 'bg-zinc-950 border-zinc-700 text-amber-400',
          accent: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
          badge: 'bg-zinc-800 text-zinc-200 border-zinc-700',
        };
      case 'sapphire':
        return {
          leather: 'from-blue-950 via-indigo-900 to-slate-950 text-blue-50 border-blue-800 shadow-blue-950/50',
          spine: 'bg-blue-950 border-blue-700 text-cyan-300',
          accent: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
          badge: 'bg-blue-900 text-blue-200 border-blue-700',
        };
      case 'emerald':
        return {
          leather: 'from-emerald-950 via-teal-900 to-slate-950 text-emerald-50 border-emerald-800 shadow-emerald-950/50',
          spine: 'bg-emerald-950 border-emerald-700 text-emerald-300',
          accent: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
          badge: 'bg-emerald-900 text-emerald-200 border-emerald-700',
        };
      case 'amber':
        return {
          leather: 'from-amber-950 via-yellow-900 to-stone-950 text-amber-50 border-amber-800 shadow-amber-950/50',
          spine: 'bg-stone-950 border-amber-700 text-amber-300',
          accent: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
          badge: 'bg-amber-900 text-amber-200 border-amber-700',
        };
      case 'amethyst':
        return {
          leather: 'from-purple-950 via-fuchsia-950 to-slate-950 text-purple-50 border-purple-800 shadow-purple-950/50',
          spine: 'bg-purple-950 border-purple-700 text-fuchsia-300',
          accent: 'text-fuchsia-400 border-fuchsia-500/40 bg-fuchsia-500/10',
          badge: 'bg-purple-900 text-purple-200 border-purple-700',
        };
      default: // crimson
        return {
          leather: 'from-red-950 via-rose-950 to-neutral-950 text-red-50 border-red-800 shadow-red-950/50',
          spine: 'bg-neutral-950 border-red-700 text-red-400',
          accent: 'text-red-400 border-red-500/40 bg-red-500/10',
          badge: 'bg-red-900/80 text-red-200 border-red-700',
        };
    }
  };

  const themeStyle = getBinderThemeClasses(activeBinder?.coverColor || 'crimson');

  // Filtered cards for grid view
  const allCollectionCards = activeBinder
    ? activeBinder.cards.filter((c) => {
        const matchesQuery =
          !searchQuery ||
          c.cardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.cardNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.expansionSet.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRarity = rarityFilter === 'all' || c.rarity.toLowerCase() === rarityFilter.toLowerCase();
        return matchesQuery && matchesRarity;
      })
    : [];

  const leftPageIndex = currentPageSpread * 2;
  const rightPageIndex = currentPageSpread * 2 + 1;

  const leftPageCards = activeBinder?.cards?.filter((c) => c.pageIndex === leftPageIndex) || [];
  const rightPageCards = activeBinder?.cards?.filter((c) => c.pageIndex === rightPageIndex) || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-28 md:pb-16 animate-fadeIn">
      
      {/* 1. Header & Portfolio Value Statistics Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-md shadow-red-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                カードコレクション バインダー
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                本を開くように直感的に鑑賞・管理できる9ポケット公式カードアルバム
              </p>
            </div>
          </div>
        </div>

        {/* Global Action CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsCreateBinderModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>新規バインダー</span>
          </button>

          <button
            onClick={onOpenScan}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>カードを査定して追加</span>
          </button>
        </div>
      </div>

      {/* 2. Portfolio High-Contrast Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Value */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            <span>コレクション総推定額</span>
            <div className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-600 dark:text-rose-400 tracking-tight font-mono">
            ¥{analytics.totalValue.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-1">
            全{binders.length}冊のバインダー合計
          </span>
        </div>

        {/* Total Cards in Binder */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            <span>バインダー収納枚数</span>
            <div className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {activeBinder?.cards?.length || 0} <span className="text-sm font-bold text-slate-400">/ {((activeBinder?.totalPages || 4) * 9)} 枚</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-1">
            スロット充足率 {Math.round(((activeBinder?.cards?.length || 0) / ((activeBinder?.totalPages || 4) * 9)) * 100)}%
          </span>
        </div>

        {/* Top Valued Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            <span>最高額カード</span>
            <div className="p-1 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
            {analytics.topCard ? analytics.topCard.cardName : 'カード未収納'}
          </div>
          <span className="text-xs text-red-600 dark:text-rose-400 font-bold mt-1 font-mono">
            {analytics.topCard ? `¥${analytics.topCard.estimatedPrice.toLocaleString()}` : '―'}
          </span>
        </div>

        {/* S-Grade Count */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            <span>Sランク極美品</span>
            <div className="p-1 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight">
            {analytics.gradeCounts['S'] || 0} <span className="text-xs text-slate-400 font-bold">枚</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Aランク: {analytics.gradeCounts['A'] || 0}枚 · B以下: {(analytics.gradeCounts['B'] || 0) + (analytics.gradeCounts['C'] || 0)}枚
          </span>
        </div>
      </div>

      {/* 3. Binder Tabs & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Binder Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {binders.map((b) => {
            const isActive = b.id === activeBinder?.id;
            return (
              <button
                key={b.id}
                onClick={() => {
                  setCurrentActiveId(b.id);
                  setActiveBinderId(b.id);
                  setCurrentPageSpread(0);
                  playPageFlipSound();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{b.title}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {b.cards?.length || 0}枚
                </span>
              </button>
            );
          })}
        </div>

        {/* View Mode & Share Actions */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleShareBinder}
            title="バインダーをシェア"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Book / Grid Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('book')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'book'
                  ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>本・見開き</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>一覧</span>
            </button>
          </div>
        </div>
      </div>

      {copiedNotification && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>バインダー情報をクリップボードにコピーしました！</span>
        </div>
      )}

      {/* 4. MAIN BINDER DISPLAY */}
      {viewMode === 'book' ? (
        <div className="space-y-6">
          
          {/* Top binder status & Open/Close button */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleToggleBookOpen}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-black text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-red-600" />
              <span>{isBookOpen ? 'バインダー表紙を閉じる' : 'バインダーを開く'}</span>
            </button>

            {isBookOpen && (
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-bold">
                <span className="font-mono text-red-600 dark:text-rose-400 font-black">
                  Page {leftPageIndex + 1} - {rightPageIndex + 1}
                </span>
                <span>/ {activeBinder?.totalPages || 4} ページ</span>
              </div>
            )}
          </div>

          {/* 3D Binder Showcase Container */}
          <div
            onMouseMove={handleMouseMove}
            style={{ perspective: 1400 }}
            className="select-none min-h-[480px]"
          >
            <AnimatePresence mode="wait">
              {!isBookOpen ? (
                /* CLOSED BINDER COVER */
                <motion.div
                  key="closed-cover"
                  initial={{ rotateY: -75, opacity: 0, scale: 0.92 }}
                  animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                  exit={{ rotateY: -80, opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.55, ease: 'easeOut' as const }}
                  onClick={handleToggleBookOpen}
                  className={`relative mx-auto max-w-md aspect-[3/4] rounded-3xl p-8 shadow-2xl border-4 cursor-pointer group transition-all transform hover:scale-[1.02] bg-gradient-to-br ${themeStyle.leather}`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Spine Ribs Effect on Left Side */}
                  <div className="absolute top-0 bottom-0 left-0 w-8 bg-black/40 border-r-2 border-amber-400/30 rounded-l-3xl flex flex-col justify-around py-8">
                    {[0, 1, 2, 3].map((rib) => (
                      <div key={rib} className="w-full h-3 bg-gradient-to-r from-amber-400/20 via-white/20 to-transparent"></div>
                    ))}
                  </div>

                  {/* 3D Gold Corner Guards */}
                  <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-amber-400 rounded-tl-xl opacity-90 shadow-md"></div>
                  <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-amber-400 rounded-tr-xl opacity-90 shadow-md"></div>
                  <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-amber-400 rounded-bl-xl opacity-90 shadow-md"></div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-amber-400 rounded-br-xl opacity-90 shadow-md"></div>

                  <div className="h-full flex flex-col items-center justify-between text-center relative z-10 py-6 pl-4">
                    {/* Top Crest */}
                    <div className="w-20 h-20 rounded-full border-2 border-amber-400/80 bg-black/50 backdrop-blur-md flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-transform">
                      <div className="w-10 h-10 rounded-full border border-amber-300 flex items-center justify-center bg-gradient-to-tr from-amber-500/20 to-transparent">
                        <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                      </div>
                    </div>

                    {/* Embossed Gold Title */}
                    <div className="space-y-2 px-2">
                      <span className="text-[11px] uppercase font-mono font-black tracking-widest text-amber-300 drop-shadow-sm block">
                        TCG MASTER BINDER
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
                        {activeBinder?.title}
                      </h2>
                      <p className="text-xs text-slate-300 font-semibold">
                        {activeBinder?.subtitle || 'ポケモンカードAI査定コレクション'}
                      </p>
                    </div>

                    {/* Footer Tag */}
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 border border-amber-400/50 text-amber-300 text-xs font-black shadow-lg">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>収納 {activeBinder?.cards?.length || 0}枚 · 総額 ¥{activeBinder?.cards?.reduce((sum, c) => sum + c.estimatedPrice, 0).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-amber-200 font-bold flex items-center justify-center gap-1.5 group-hover:translate-x-1 transition-transform">
                        <span>タップしてバインダーを開く</span>
                        <ArrowRight className="w-4 h-4 animate-bounce" />
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* OPENED BINDER SPREAD (2-Page Spread with Center Ring Binder Clamps & 9-Pocket Sleeves) */
                <motion.div
                  key="opened-binder"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="relative rounded-3xl p-3 sm:p-6 lg:p-8 bg-slate-900 dark:bg-slate-950 border-4 border-slate-700 dark:border-slate-800 shadow-2xl overflow-hidden"
                >
                  
                  {/* Empty State Banner Tip */}
                  {(!activeBinder?.cards || activeBinder.cards.length === 0) && (
                    <div className="mb-4 p-3.5 bg-red-950/60 border border-red-800/80 rounded-2xl text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-red-200 animate-fadeIn">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>現在バインダーは空です。スロット（+）または「カードを査定して追加」から撮影したカードを収納できます！</span>
                      </div>
                      <button
                        onClick={onOpenScan}
                        className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-sm whitespace-nowrap cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>今すぐ査定する</span>
                      </button>
                    </div>
                  )}

                  {/* Center 3-Ring Binder Spine & Metal Ring Clamps */}
                  <div className="hidden md:flex absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-10 flex-col items-center justify-around z-20 pointer-events-none">
                    {[0, 1, 2].map((ringIdx) => (
                      <div key={ringIdx} className="w-6 h-12 rounded-full border-4 border-slate-300 shadow-xl bg-gradient-to-r from-slate-400 via-slate-100 to-slate-500 opacity-90 -rotate-3"></div>
                    ))}
                    <div className="absolute top-0 bottom-0 w-1 bg-black/90 shadow-2xl"></div>
                  </div>

                  {/* 2-Page Grid Spread with Page Flip Animated Transition */}
                  <AnimatePresence custom={flipDirection} mode="wait">
                    <motion.div
                      key={`spread-${currentPageSpread}-${activeBinderId}`}
                      custom={flipDirection}
                      variants={pageSpreadVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      style={{ transformStyle: 'preserve-3d' }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
                    >
                      {/* Left Page (9-Pocket Sleeve) */}
                      <div className="bg-slate-950/90 rounded-2xl p-3 sm:p-4 border border-slate-800 shadow-inner relative overflow-hidden">
                        {/* Page Edge Highlight */}
                        <div className="absolute top-0 right-0 bottom-0 w-3 bg-gradient-to-l from-black/60 to-transparent pointer-events-none"></div>

                        <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-mono font-bold px-1">
                          <span className="text-red-400 font-black">PAGE {leftPageIndex + 1}</span>
                          <span className="text-[10px] text-slate-500">9-POCKET VINYL SLEEVE</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((slotIdx) => {
                            const card = leftPageCards.find((c) => c.slotIndex === slotIdx);
                            return (
                              <PocketSlot
                                key={`left_${slotIdx}`}
                                slotIndex={slotIdx}
                                pageIndex={leftPageIndex}
                                card={card}
                                mouseHoloPos={mouseHoloPos}
                                onCardClick={(c) => {
                                  playHoloShimmerSound();
                                  setSelectedCardForModal(c);
                                }}
                                onEmptyClick={() => onOpenScan()}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Right Page (9-Pocket Sleeve) */}
                      <div className="bg-slate-950/90 rounded-2xl p-3 sm:p-4 border border-slate-800 shadow-inner relative overflow-hidden">
                        {/* Page Edge Highlight */}
                        <div className="absolute top-0 left-0 bottom-0 w-3 bg-gradient-to-r from-black/60 to-transparent pointer-events-none"></div>

                        <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-mono font-bold px-1">
                          <span className="text-red-400 font-black">PAGE {rightPageIndex + 1}</span>
                          <span className="text-[10px] text-slate-500">9-POCKET VINYL SLEEVE</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((slotIdx) => {
                            const card = rightPageCards.find((c) => c.slotIndex === slotIdx);
                            return (
                              <PocketSlot
                                key={`right_${slotIdx}`}
                                slotIndex={slotIdx}
                                pageIndex={rightPageIndex}
                                card={card}
                                mouseHoloPos={mouseHoloPos}
                                onCardClick={(c) => {
                                  playHoloShimmerSound();
                                  setSelectedCardForModal(c);
                                }}
                                onEmptyClick={() => onOpenScan()}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Page Flip Navigation Buttons & Fast Jump */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 mt-6">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePrevPage}
                      disabled={currentPageSpread === 0}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-black transition-all cursor-pointer shadow-md"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>前のページをめくる</span>
                    </motion.button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleAddPage}
                        className="px-3.5 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-400" />
                        <span>ページを追加</span>
                      </button>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNextPage}
                      disabled={currentPageSpread >= Math.ceil((activeBinder?.totalPages || 4) / 2) - 1}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-black transition-all cursor-pointer shadow-md"
                    >
                      <span>次のページをめくる</span>
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      ) : (
        /* GRID LIST VIEW */
        <div className="space-y-6">
          
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="カード名・番号・パック名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {(['all', 'SAR', 'AR', 'SR', 'UR', 'RR'] as const).map((rarity) => (
                <button
                  key={rarity}
                  onClick={() => setRarityFilter(rarity)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-colors cursor-pointer ${
                    rarityFilter === rarity
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {rarity === 'all' ? 'すべて' : rarity}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allCollectionCards.map((card) => (
              <div
                key={card.id}
                onClick={() => setSelectedCardForModal(card)}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2.5 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-[63/88] rounded-xl overflow-hidden bg-black mb-2.5 ring-1 ring-slate-200 dark:ring-slate-800 group-hover:scale-105 transition-transform">
                  <img src={card.imageUrl} alt={card.cardName} className="w-full h-full object-cover" />
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[10px] font-black text-amber-400">
                    Rank {card.conditionGrade}
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-red-600 text-[10px] font-black text-white">
                    {card.rarity}
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-bold">
                    {card.cardNumber}
                  </p>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                    {card.cardName}
                  </h4>
                  <p className="text-xs font-black text-red-600 dark:text-rose-400 font-mono">
                    ¥{card.estimatedPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {allCollectionCards.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  カードがまだ収納されていません
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  カメラでカードを査定すると、AIが綺麗に枠を切り抜いてバインダーに収納できます。
                </p>
              </div>
              <button
                onClick={onOpenScan}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-lg shadow-red-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>カードを査定して収納する</span>
              </button>
            </div>
          )}

        </div>
      )}

      {/* 5. Card Inspection Detail Modal */}
      {selectedCardForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-rose-400 text-xs font-black">
                  {selectedCardForModal.rarity}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {selectedCardForModal.cardNumber}
                </span>
              </div>
              <button
                onClick={() => setSelectedCardForModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Card Image with Holo Tilt */}
              <div className="relative aspect-[63/88] rounded-2xl overflow-hidden bg-black shadow-2xl ring-2 ring-red-500/30 group">
                <img
                  src={selectedCardForModal.imageUrl}
                  alt={selectedCardForModal.cardName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 holo-shine opacity-60 pointer-events-none"></div>
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-black/80 text-amber-400 text-xs font-black shadow-md">
                  Rank {selectedCardForModal.conditionGrade}
                </div>
              </div>

              {/* Card Specs */}
              <div className="space-y-4 text-left">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {selectedCardForModal.cardName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                    {selectedCardForModal.expansionSet} ({selectedCardForModal.series})
                  </p>
                </div>

                <div className="p-3.5 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/60">
                  <span className="text-[10px] text-red-600 dark:text-red-400 font-black block">
                    AI推定相場価格
                  </span>
                  <span className="text-2xl font-black text-red-600 dark:text-rose-400 font-mono">
                    ¥{selectedCardForModal.estimatedPrice.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-200 font-semibold">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 font-normal">保管場所</span>
                    <span className="font-mono font-black">Page {selectedCardForModal.pageIndex + 1} · Slot {selectedCardForModal.slotIndex + 1}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 font-normal">状態評価</span>
                    <span className="font-black text-amber-500">{selectedCardForModal.conditionGrade}ランク (AI判定済み)</span>
                  </div>
                  {selectedCardForModal.notes && (
                    <p className="text-[11px] text-slate-500 italic pt-1">
                      {selectedCardForModal.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleRemoveCard(selectedCardForModal.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>スリーブから取り出す</span>
              </button>

              <button
                onClick={() => setSelectedCardForModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black shadow-md cursor-pointer"
              >
                閉じる
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. Create Binder Modal */}
      {isCreateBinderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-red-600" />
                <span>新しいバインダーを作成</span>
              </h3>
              <button
                onClick={() => setIsCreateBinderModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  バインダー名
                </label>
                <input
                  type="text"
                  placeholder="例: SAR特選コレクション, 歴代ピカチュウ"
                  value={newBinderTitle}
                  onChange={(e) => setNewBinderTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  表紙レザーカラー
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {(['crimson', 'obsidian', 'sapphire', 'emerald', 'amber', 'amethyst'] as const).map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewBinderColor(col)}
                      className={`h-10 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                        col === 'crimson'
                          ? 'bg-red-700'
                          : col === 'obsidian'
                          ? 'bg-zinc-900'
                          : col === 'sapphire'
                          ? 'bg-blue-700'
                          : col === 'emerald'
                          ? 'bg-emerald-700'
                          : col === 'amber'
                          ? 'bg-amber-600'
                          : 'bg-purple-700'
                      } ${newBinderColor === col ? 'ring-4 ring-red-500 scale-105' : 'opacity-70 hover:opacity-100'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsCreateBinderModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                キャンセル
              </button>
              <button
                onClick={handleCreateNewBinder}
                disabled={!newBinderTitle.trim()}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-lg shadow-red-500/25 disabled:opacity-50 transition-all cursor-pointer"
              >
                バインダーを作成
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Sub-component for individual 9-pocket card sleeve
interface PocketSlotProps {
  slotIndex: number;
  pageIndex: number;
  card?: BinderSlotCard;
  mouseHoloPos: { x: number; y: number };
  onCardClick: (card: BinderSlotCard) => void;
  onEmptyClick: () => void;
}

const PocketSlot: React.FC<PocketSlotProps> = ({
  slotIndex,
  card,
  mouseHoloPos,
  onCardClick,
  onEmptyClick,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -3, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
      whileTap={{ scale: 0.97 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative aspect-[63/88] rounded-xl overflow-hidden bg-slate-900 border-2 border-slate-700/80 shadow-lg group cursor-pointer"
    >
      {/* Glossy Plastic Sleeve Sheen Over Pocket */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 via-transparent to-white/15 z-10"></div>
      
      {/* Top Sleeve Opening tab reflection */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-white/30 z-10"></div>

      {card ? (
        <div
          onClick={() => onCardClick(card)}
          className="relative w-full h-full select-none"
        >
          {/* Card Clean Cropped Image */}
          <img
            src={card.imageUrl}
            alt={card.cardName}
            className="w-full h-full object-cover"
          />

          {/* Holographic light foil reflection shifting with mouse */}
          <div
            className={`absolute inset-0 holo-shine transition-opacity duration-300 pointer-events-none ${
              isHovered ? 'opacity-90' : 'opacity-25'
            }`}
            style={{
              backgroundPosition: `${mouseHoloPos.x}% ${mouseHoloPos.y}%`,
            }}
          ></div>

          {/* Condition Grade badge pinned on sleeve */}
          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/85 backdrop-blur-xs text-[9px] sm:text-[10px] font-black text-amber-400 z-10 shadow-md">
            Rank {card.conditionGrade}
          </div>

          {/* Card Info Tag on Bottom (Always visible for clarity) */}
          <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black via-black/80 to-transparent text-center z-10">
            <p className="text-[10px] sm:text-[11px] font-bold text-white truncate drop-shadow-sm">
              {card.cardName}
            </p>
            <p className="text-[9px] sm:text-[10px] font-mono font-black text-amber-400 block truncate">
              ¥{card.estimatedPrice.toLocaleString()}
            </p>
          </div>
        </div>
      ) : (
        /* EMPTY POCKET SLOT (High contrast, clearly visible) */
        <div
          onClick={onEmptyClick}
          className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-slate-400 hover:text-red-400 hover:bg-slate-800/60 transition-colors"
        >
          <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-500 flex items-center justify-center mb-1.5 group-hover:border-red-400 group-hover:scale-110 transition-all bg-slate-800/40">
            <Plus className="w-4 h-4 text-slate-300 group-hover:text-red-400" />
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-red-300">
            SLOT {slotIndex + 1}
          </span>
          <span className="text-[9px] text-slate-500 font-medium hidden sm:block">
            + カードを収納
          </span>
        </div>
      )}
    </motion.div>
  );
};
