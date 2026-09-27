import React, { useState } from 'react';
import {
  User as UserIcon,
  Bookmark,
  Bell,
  Moon,
  Sun,
  Shield,
  LogOut,
  LogIn,
  CheckCircle2,
  Trash2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Key,
} from 'lucide-react';
import { CardRecord, User } from '../types/card';
import { loginGoogle, loginUser } from '../lib/api';
import { logOutFromFirebase } from '../lib/firebase';

interface AccountScreenProps {
  user: User | null;
  setUser: (user: User | null) => void;
  favorites: CardRecord[];
  onSelectFavoriteCard: (card: CardRecord) => void;
  onRemoveFavorite: (cardId: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onNavigateTab: (tab: string) => void;
  geminiConfigured?: boolean;
  onOpenGeminiModal?: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  user,
  setUser,
  favorites,
  onSelectFavoriteCard,
  onRemoveFavorite,
  darkMode,
  setDarkMode,
  onNavigateTab,
  geminiConfigured = false,
  onOpenGeminiModal,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [priceAlertsEnabled, setPriceAlertsEnabled] = useState(true);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    try {
      const res = await loginUser(emailInput, nameInput);
      setUser(res.user);
      setShowLoginModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await loginGoogle();
      setUser(res.user);
      setShowLoginModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await logOutFromFirebase();
    } catch {}
    setUser(null);
  };

  const totalFavoritesValue = favorites.reduce((sum, c) => sum + c.baseMarketPrice, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 md:pb-16">
      
      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={
                  user?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                }
                alt="プロフィール"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-red-500/30 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {user ? user.name : 'ゲストトレーナー'}
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-rose-400 text-[10px] font-bold">
                  {user ? (user.role === 'admin' ? '管理者' : '認証メンバー') : 'ゲスト'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {user ? user.email : 'ログインすると査定履歴の永久保存やお気に入りの同期が利用可能です'}
              </p>
            </div>
          </div>

          <div>
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-slate-400" />
                <span>ログアウト</span>
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/25 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>ログイン / 新規登録</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Favorites Collection Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>お気に入りカード ({favorites.length}枚)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              相場ウォッチ中のカードコレクション
            </p>
          </div>
          {favorites.length > 0 && (
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-400 block font-semibold">お気に入り合計参考相場</span>
              <span className="text-lg font-black text-red-600 dark:text-rose-400">
                ¥{totalFavoritesValue.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favorites.map((card) => (
              <div
                key={card.id}
                onClick={() => onSelectFavoriteCard(card)}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all cursor-pointer flex items-center gap-3 group"
              >
                <div className="w-12 aspect-[63/88] rounded-lg overflow-hidden bg-black shrink-0 border border-slate-200 dark:border-slate-600">
                  <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[9px] font-extrabold uppercase px-1 py-0.2 rounded bg-red-100 dark:bg-red-950 text-red-600 dark:text-rose-400">
                      {card.rarity}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 truncate">
                      {card.cardNumber}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {card.name}
                  </h4>
                  <span className="text-xs font-black text-red-600 dark:text-rose-400 mt-1 block">
                    ¥{card.baseMarketPrice.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(card.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"
                  title="お気に入りから削除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            まだお気に入り登録されたカードはありません。検索画面で気になるカードのブックマークボタンを押してください。
          </div>
        )}
      </div>

      {/* Settings List */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
          アプリケーション設定
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
          
          {/* Dark Mode */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs sm:text-sm">
                  ダークモード表示
                </span>
                <span className="text-[11px] text-slate-400">
                  画面の明暗テーマを切り替えます
                </span>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                darkMode ? 'bg-red-600 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-sm"></div>
            </button>
          </div>

          {/* Price Notifications */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs sm:text-sm">
                  価格急変動通知
                </span>
                <span className="text-[11px] text-slate-400">
                  お気に入りカードの相場が15%以上変動した際にお知らせ
                </span>
              </div>
            </div>
            <button
              onClick={() => setPriceAlertsEnabled(!priceAlertsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                priceAlertsEnabled ? 'bg-red-600 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-sm"></div>
            </button>
          </div>

          {/* Gemini API Key Section */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs sm:text-sm flex items-center gap-2">
                  <span>Google Gemini API 設定</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      geminiConfigured
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                    }`}
                  >
                    {geminiConfigured ? '連携中' : '未設定'}
                  </span>
                </span>
                <span className="text-[11px] text-slate-400">
                  AI画像認識鑑定に使用するAPIキー（無料登録可能）
                </span>
              </div>
            </div>
            {onOpenGeminiModal && (
              <button
                onClick={onOpenGeminiModal}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                {geminiConfigured ? '変更 / テスト' : '設定する'}
              </button>
            )}
          </div>

          {/* Admin shortcut */}
          <div
            onClick={() => onNavigateTab('admin')}
            className="py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl px-1"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                <Shield className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs sm:text-sm">
                  管理者ダッシュボード
                </span>
                <span className="text-[11px] text-slate-400">
                  査定回数・ユーザー数・API使用状況を確認
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </div>

        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                アカウントにログイン
              </h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              ログインすると過去の査定結果を無制限に保存でき、別端末でも同期できます。
            </p>

            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-3 shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Googleアカウントでログイン</span>
            </button>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
              <span>またはメールアドレス</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  ニックネーム (任意)
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="サトシ"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="trainer@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md"
              >
                ログインする
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
