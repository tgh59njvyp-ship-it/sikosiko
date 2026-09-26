import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Share2,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  Eye,
  BookOpen,
  Crop,
  Check,
} from 'lucide-react';
import { AppraisalRecord, PriceHistoryPoint } from '../types/card';
import { AddToBinderModal } from './AddToBinderModal';
import { CardCropModal } from './CardCropModal';
import { CollectionBinder } from '../lib/collectionStorage';

interface ResultScreenProps {
  appraisal: AppraisalRecord;
  priceHistory?: Record<string, PriceHistoryPoint[]>;
  isFavorite: boolean;
  onToggleFavorite: (cardId?: string) => void;
  onReAppraise: () => void;
  onSelectCandidate?: (candidate: { name: string; cardNumber: string; rarity: string; set: string }) => void;
  onNavigateCollection?: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  appraisal,
  priceHistory,
  isFavorite,
  onToggleFavorite,
  onReAppraise,
  onSelectCandidate,
  onNavigateCollection,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isHoloActive, setIsHoloActive] = useState(false);
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'condition' | 'chart'>('overview');

  // Collection & Auto-crop Modal States
  const [isAddToBinderOpen, setIsAddToBinderOpen] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [useCroppedView, setUseCroppedView] = useState(true);
  const [currentCroppedImg, setCurrentCroppedImg] = useState<string>(
    appraisal.croppedImageUrl || appraisal.frontImageUrl
  );
  const [addedToBinderSuccess, setAddedToBinderSuccess] = useState<string | null>(null);

  const historyPoints = priceHistory ? priceHistory[selectedPeriod] || [] : [];

  // Grade color badges
  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'S':
        return {
          bg: 'bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500 text-white',
          label: 'Sランク (極美品 / 未使用相当)',
        };
      case 'A':
        return {
          bg: 'bg-emerald-500 text-white',
          label: 'Aランク (美品 / 微小な初期傷程度)',
        };
      case 'B':
        return {
          bg: 'bg-blue-500 text-white',
          label: 'Bランク (良品 / わずかな白かけ・スレ)',
        };
      case 'C':
        return {
          bg: 'bg-amber-600 text-white',
          label: 'Cランク (プレイ用 / 目立つ白かけ・小傷)',
        };
      default:
        return {
          bg: 'bg-red-600 text-white',
          label: 'Dランク (傷あり / 凹み・折れ等のダメージ)',
        };
    }
  };

  const gradeInfo = getGradeBadge(appraisal.conditionGrade);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `【CARD SCANNER査定結果】${appraisal.cardName} (${appraisal.rarity})`,
        text: `AI査定価格: ¥${appraisal.estimatedPrice.toLocaleString()} (状態ランク ${appraisal.conditionGrade})`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `【CARD SCANNER査定結果】\nカード名: ${appraisal.cardName}\n番号: ${appraisal.cardNumber} (${appraisal.rarity})\n推定査定価格: ¥${appraisal.estimatedPrice.toLocaleString()}\n状態ランク: ${appraisal.conditionGrade}`
      );
      setShowShareNotification(true);
      setTimeout(() => setShowShareNotification(false), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 md:pb-16">
      
      {/* Top Banner Navigation & Quick Actions */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onReAppraise}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>別のカードを査定する</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Add to Collection Binder CTA Button */}
          <button
            onClick={() => setIsAddToBinderOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white flex items-center gap-1.5 text-xs sm:text-sm font-bold shadow-md shadow-red-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>コレクションに追加</span>
          </button>

          {/* Favorite button */}
          <button
            onClick={() => onToggleFavorite(appraisal.cardId)}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
              isFavorite
                ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-400'
                : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            <span className="hidden sm:inline">
              {isFavorite ? 'お気に入り中' : 'お気に入り'}
            </span>
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="p-2 sm:px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 text-xs font-bold transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">結果をシェア</span>
          </button>
        </div>
      </div>

      {addedToBinderSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>「{addedToBinderSuccess}」にカードを収納しました！</span>
          </div>
          {onNavigateCollection && (
            <button
              onClick={onNavigateCollection}
              className="text-xs text-emerald-700 dark:text-emerald-300 underline font-bold"
            >
              バインダーを開く →
            </button>
          )}
        </div>
      )}

      {showShareNotification && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>査定結果テキストをクリップボードにコピーしました！</span>
        </div>
      )}

      {/* Main Grid: Card Visual + Primary Appraisal Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Big Card Visual with Interactive Tilt & Crop Switcher */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div
            onMouseEnter={() => setIsHoloActive(true)}
            onMouseLeave={() => setIsHoloActive(false)}
            className="relative w-64 sm:w-72 lg:w-80 aspect-[63/88] rounded-3xl overflow-hidden shadow-2xl bg-black border-2 border-slate-800 ring-4 ring-slate-100 dark:ring-slate-800 cursor-pointer group select-none transition-transform hover:scale-[1.02]"
          >
            <img
              src={useCroppedView ? currentCroppedImg : appraisal.frontImageUrl}
              alt={appraisal.cardName}
              className="w-full h-full object-cover transition-all"
            />

            {/* Holographic light reflection */}
            <div
              className={`absolute inset-0 holo-shine transition-opacity duration-500 ${
                isHoloActive ? 'opacity-90 holo-active' : 'opacity-25'
              }`}
            ></div>

            {/* Live Condition badge pinned on card image */}
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 text-white flex items-center gap-1.5 shadow-lg">
              <span className="text-[10px] text-slate-300 font-bold">状態判定</span>
              <span className="text-sm font-black text-amber-400">
                Rank {appraisal.conditionGrade}
              </span>
            </div>

            {/* Rarity Watermark */}
            <div className="absolute bottom-3 right-3 bg-red-600/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-xs font-black shadow-md uppercase tracking-wider">
              {appraisal.rarity}
            </div>
          </div>

          {/* AI Auto-Crop Switcher & Fine-tune Controls */}
          <div className="mt-3 flex flex-col items-center gap-2 w-full max-w-xs">
            <div className="flex items-center justify-between w-full bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setUseCroppedView(true)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 ${
                    useCroppedView
                      ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-rose-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>AI自動切り抜き</span>
                </button>
                <button
                  onClick={() => setUseCroppedView(false)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    !useCroppedView
                      ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-rose-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <span>元写真</span>
                </button>
              </div>

              <button
                onClick={() => setIsCropModalOpen(true)}
                title="切り抜き微調整"
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-900 transition-colors"
              >
                <Crop className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>AIが背景を除去してカード枠を最適化済み</span>
            </p>
          </div>

          {/* If Back Image was provided, display back thumbnail */}
          {appraisal.backImageUrl && (
            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 w-full max-w-xs">
              <div className="w-12 aspect-[63/88] rounded-lg overflow-hidden bg-black shrink-0 border border-slate-300">
                <img src={appraisal.backImageUrl} alt="裏面" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>裏面画像照合済み</span>
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  裏面全体の白かけ・擦れも査定に反映されています
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Appraisal Breakdown & Pricing */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card Identification Header */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-rose-400 text-xs font-black uppercase">
                {appraisal.rarity}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono font-bold">
                {appraisal.cardNumber}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {appraisal.language}
              </span>
              {appraisal.hp && (
                <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold">
                  HP {appraisal.hp}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {appraisal.cardName}
            </h1>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {appraisal.expansionSet}
              </span>
              <span>•</span>
              <span>{appraisal.series}</span>
              {appraisal.specialFinish && (
                <>
                  <span>•</span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    {appraisal.specialFinish}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Primary Appraisal Price Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-red-50 via-white to-rose-50/60 dark:from-slate-800/90 dark:via-slate-800 dark:to-slate-800/60 border-2 border-red-200/90 dark:border-red-900/60 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-red-500" />
                  <span>推定査定価格 (AI総合判定)</span>
                </span>
                <div className="text-4xl sm:text-5xl font-black text-red-600 dark:text-rose-500 mt-1 tracking-tight">
                  ¥{appraisal.estimatedPrice.toLocaleString()}
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                  <span>
                    推定価格帯: <strong className="font-bold text-slate-900 dark:text-white">¥{appraisal.priceRange.min.toLocaleString()} 〜 ¥{appraisal.priceRange.max.toLocaleString()}</strong>
                  </span>
                </div>
              </div>

              {/* Price Confidence Badge */}
              <div className="sm:text-right shrink-0">
                <span className="text-[11px] text-slate-400 font-medium block">
                  価格の信頼度
                </span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm mt-1">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      appraisal.priceConfidence === '高'
                        ? 'bg-emerald-500 animate-pulse'
                        : appraisal.priceConfidence === '中'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                  ></span>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                    信頼度: {appraisal.priceConfidence}
                  </span>
                </div>
              </div>
            </div>

            {/* Reference Market Notice */}
            <div className="mt-4 pt-4 border-t border-red-200/60 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed space-y-1">
              <p className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>
                  本サービスの査定価格は参考値であり、実際の買取価格を保証するものではありません。
                </span>
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                現在の市場相場データ（メルカリ・ヤフオク・専門店買取表）をもとに自動算出しています。
              </p>
            </div>
          </div>

          {/* Quick Collection Add Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-300" />
                <h3 className="font-black text-sm sm:text-base text-white">
                  このカードをバインダーに収納
                </h3>
              </div>
              <p className="text-xs text-rose-100 font-medium">
                AIが綺麗に枠を切り抜いたカード画像をスリーブにファイリングして大切に管理
              </p>
            </div>
            <button
              onClick={() => setIsAddToBinderOpen(true)}
              className="px-5 py-3 rounded-xl bg-white text-red-600 hover:bg-rose-50 text-xs sm:text-sm font-black shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>バインダーに収納する</span>
            </button>
          </div>

          {/* Detailed Price Breakdown Table */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              価格内訳 & 状態別参考相場
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50">
                <span className="text-[10px] font-bold text-slate-400 block">現在の相場 (平均)</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                  ¥{appraisal.priceBreakdown.marketAverage.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block">美品 (Sランク)</span>
                <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-300 mt-0.5 block">
                  ¥{appraisal.priceBreakdown.nearMintS.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50">
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 block">傷あり (Cランク)</span>
                <span className="text-base font-extrabold text-amber-700 dark:text-amber-300 mt-0.5 block">
                  ¥{appraisal.priceBreakdown.playedC.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50">
                <span className="text-[10px] font-bold text-slate-400 block">ショップ買取想定</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                  ¥{appraisal.priceBreakdown.estimatedBuyback.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50">
                <span className="text-[10px] font-bold text-slate-400 block">フリマ販売相場</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                  ¥{appraisal.priceBreakdown.estimatedRetail.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Card Condition AI Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>カード状態AI判定</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  高解像度画像解析による傷・白かけ・センタリングの総合評価
                </p>
              </div>

              {/* Status Grade Badge */}
              <div className={`px-3 py-1 rounded-xl text-xs font-black shadow-sm ${gradeInfo.bg}`}>
                Rank {appraisal.conditionGrade}
              </div>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <span className="text-[10px] text-slate-400 block">白かけ</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {appraisal.conditionAnalysis.edgeWear}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <span className="text-[10px] text-slate-400 block">傷 / スレ</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {appraisal.conditionAnalysis.scratches}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <span className="text-[10px] text-slate-400 block">へこみ</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {appraisal.conditionAnalysis.dents}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <span className="text-[10px] text-slate-400 block">折れ</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {appraisal.conditionAnalysis.creases}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <span className="text-[10px] text-slate-400 block">汚れ</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {appraisal.conditionAnalysis.stains}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <span className="text-[10px] text-slate-400 block">センタリング</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {appraisal.conditionAnalysis.centeringRatio}
                </span>
              </div>

              <div className="col-span-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <span className="text-[10px] text-slate-400 block">表面状態コメント</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 block truncate">
                  {appraisal.conditionAnalysis.surfaceCondition}
                </span>
              </div>
            </div>

            {/* Back image notice if omitted */}
            {appraisal.conditionAnalysis.backConditionNotice && (
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{appraisal.conditionAnalysis.backConditionNotice}</span>
              </div>
            )}

            <p className="text-[10px] text-slate-400">
              ※画像による参考判定です。実物の状態によって査定額が変動します。
            </p>
          </div>

          {/* Alternative Candidates (If recognition confidence is modest) */}
          {appraisal.candidates && appraisal.candidates.length > 0 && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                他のカード候補（別のバージョンの可能性）:
              </span>
              <div className="flex flex-wrap gap-2">
                {appraisal.candidates.map((cand, i) => (
                  <button
                    key={i}
                    onClick={() => onSelectCandidate?.(cand)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-red-400 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{cand.name}</span>
                    <span className="text-[10px] text-slate-400">({cand.cardNumber})</span>
                    <ArrowRight className="w-3 h-3 text-red-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price History Chart Section */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  <span>相場価格推移グラフ</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  直近の取引価格履歴データ
                </p>
              </div>

              {/* Period Tabs: 7d, 30d, 90d, 1y */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-700/60 p-1 self-start sm:self-auto">
                {(['7d', '30d', '90d', '1y'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPeriod(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedPeriod === p
                        ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-rose-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {p === '7d' ? '7日' : p === '30d' ? '30日' : p === '90d' ? '90日' : '1年'}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Chart */}
            {historyPoints.length > 0 ? (
              <div className="space-y-3">
                <div className="h-44 sm:h-52 w-full pt-4">
                  {(() => {
                    const prices = historyPoints.map((p) => p.price);
                    const min = Math.min(...prices) * 0.95;
                    const max = Math.max(...prices) * 1.05;
                    const range = max - min || 1;

                    const width = 600;
                    const height = 180;
                    const stepX = width / (historyPoints.length - 1 || 1);

                    const points = historyPoints.map((p, i) => {
                      const x = i * stepX;
                      const y = height - ((p.price - min) / range) * (height - 30) - 15;
                      return `${x},${y}`;
                    });

                    const pathStr = `M ${points.join(' L ')}`;
                    const areaStr = `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;

                    return (
                      <svg
                        viewBox={`0 0 ${width} ${height}`}
                        className="w-full h-full overflow-visible"
                      >
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Background guideline */}
                        <line
                          x1="0"
                          y1={height / 2}
                          x2={width}
                          y2={height / 2}
                          stroke="#e2e8f0"
                          strokeDasharray="4 4"
                          strokeWidth="1"
                        />

                        {/* Area fill */}
                        <path d={areaStr} fill="url(#chartGradient)" />

                        {/* Line */}
                        <path
                          d={pathStr}
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Data dots */}
                        {historyPoints.map((p, i) => {
                          const x = i * stepX;
                          const y = height - ((p.price - min) / range) * (height - 30) - 15;
                          if (i === 0 || i === historyPoints.length - 1 || i % 4 === 0) {
                            return (
                              <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#ffffff"
                                stroke="#ef4444"
                                strokeWidth="2.5"
                              />
                            );
                          }
                          return null;
                        })}
                      </svg>
                    );
                  })()}
                </div>

                {/* Date axis labels */}
                <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>{historyPoints[0]?.date}</span>
                  <span>{historyPoints[Math.floor(historyPoints.length / 2)]?.date}</span>
                  <span>{historyPoints[historyPoints.length - 1]?.date}</span>
                </div>
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-xs text-slate-400">
                価格推移データはありません
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Add To Binder Modal */}
      <AddToBinderModal
        isOpen={isAddToBinderOpen}
        onClose={() => setIsAddToBinderOpen(false)}
        appraisal={appraisal}
        customCroppedImage={useCroppedView ? currentCroppedImg : appraisal.frontImageUrl}
        onSuccess={(binder) => {
          setAddedToBinderSuccess(binder.title);
          setTimeout(() => setAddedToBinderSuccess(null), 6000);
        }}
      />

      {/* Card Crop Adjustment Modal */}
      <CardCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        originalImage={appraisal.frontImageUrl}
        currentCroppedImage={currentCroppedImg}
        onApplyCrop={(newCrop) => {
          setCurrentCroppedImg(newCrop);
          setUseCroppedView(true);
        }}
      />

    </div>
  );
};
