import React from 'react';
import { Home, ScanLine, Search, Clock, BookOpen, User as UserIcon } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenScan: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  onOpenScan,
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 pb-safe">
      <div className="flex items-center justify-around h-16 px-2 relative">
        
        {/* ホーム */}
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'home'
              ? 'text-red-600 dark:text-rose-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">ホーム</span>
        </button>

        {/* コレクション (バインダー) */}
        <button
          onClick={() => setCurrentTab('collection')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'collection'
              ? 'text-red-600 dark:text-rose-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">コレクション</span>
        </button>

        {/* 査定 (中央の目立つボタン) */}
        <div className="relative -top-4 flex flex-col items-center flex-1">
          <button
            onClick={onOpenScan}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/40 ring-4 ring-white dark:ring-slate-900 active:scale-90 transition-transform cursor-pointer"
            aria-label="カードを査定する"
          >
            <ScanLine className="w-7 h-7 animate-pulse" />
          </button>
          <span className="text-[10px] font-bold text-red-600 dark:text-rose-400 mt-1">
            査定
          </span>
        </div>

        {/* 検索 */}
        <button
          onClick={() => setCurrentTab('search')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'search'
              ? 'text-red-600 dark:text-rose-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">検索</span>
        </button>

        {/* 履歴 */}
        <button
          onClick={() => setCurrentTab('history')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'history'
              ? 'text-red-600 dark:text-rose-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <Clock className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">履歴</span>
        </button>

      </div>
    </div>
  );
};
