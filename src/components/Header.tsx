import React from 'react';
import { Camera, Sparkles, Moon, Sun, ShieldCheck, User as UserIcon, Key } from 'lucide-react';
import { User } from '../types/card';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  user: User | null;
  onOpenAuth: () => void;
  onOpenScan: () => void;
  geminiConfigured?: boolean;
  onOpenGeminiModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  darkMode,
  setDarkMode,
  user,
  onOpenAuth,
  onOpenScan,
  geminiConfigured = false,
  onOpenGeminiModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          {/* Pokéball / Scanner icon badge */}
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-red-500 flex items-center justify-center shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
            <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-sans">
                CARD<span className="text-red-600 dark:text-rose-500 ml-0.5">SCANNER</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400">
                AI査定
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
              ポケカ専門 高精度AIカード鑑定・相場査定
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
              currentTab === 'home'
                ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-rose-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            ホーム
          </button>
          <button
            onClick={() => setCurrentTab('search')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
              currentTab === 'search'
                ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-rose-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            カード検索
          </button>
          <button
            onClick={() => setCurrentTab('history')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
              currentTab === 'history'
                ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-rose-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            査定履歴
          </button>
          <button
            onClick={() => setCurrentTab('admin')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
              currentTab === 'admin'
                ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-rose-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            管理画面
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Gemini API Key Settings Button */}
          {onOpenGeminiModal && (
            <button
              onClick={onOpenGeminiModal}
              title="Gemini API設定（タップしてAPIキーを登録・変更）"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm cursor-pointer ${
                geminiConfigured
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                  : 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="hidden sm:inline">
                {geminiConfigured ? 'Gemini 連携中' : 'Gemini API設定'}
              </span>
              <span className={`w-2 h-2 rounded-full shrink-0 ${geminiConfigured ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
            </button>
          )}

          {/* Quick Scan CTA on Desktop */}
          <button
            onClick={onOpenScan}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-red-500/25 transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>カードを査定</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'ライトモードに切替' : 'ダークモードに切替'}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* User Profile / Login */}
          {user ? (
            <button
              onClick={() => setCurrentTab('account')}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-red-500/30"
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden md:block max-w-[100px] truncate">
                {user.name}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <UserIcon className="w-4 h-4 text-slate-500" />
              <span>ログイン</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
