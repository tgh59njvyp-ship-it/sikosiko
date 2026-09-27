import React, { useState } from 'react';
import {
  Layers,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Share2,
  BookmarkCheck,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { AppraisalRecord } from '../types/card';
import { ConditionGuideModal } from './ConditionGuideModal';
import {
  addBatchCardsToBinder,
  getActiveBinderId,
  getStoredBinders,
} from '../lib/collectionStorage';
import { playSleeveInsertSound, playHoloShimmerSound } from '../lib/soundFx';

interface BatchResultScreenProps {
  appraisals: AppraisalRecord[];
  grandTotal: number;
  onSelectCard: (appraisal: AppraisalRecord) => void;
  onReAppraise: () => void;
  onNavigateCollection?: () => void;
}

export const BatchResultScreen: React.FC<BatchResultScreenProps> = ({
  appraisals,
  grandTotal,
  onSelectCard,
  onReAppraise,
  onNavigateCollection,
}) => {
  const [addedSuccessCount, setAddedSuccessCount] = useState<number | null>(null);
  const [isConditionGuideOpen, setIsConditionGuideOpen] = useState(false);

  const handleAddAllToBinder = () => {
    const binders = getStoredBinders();
    const activeId = getActiveBinderId();
    const targetBinder = binders.find((b) => b.id === activeId) || binders[0];
    if (!targetBinder) return;

    const res = addBatchCardsToBinder(targetBinder.id, appraisals);
    playSleeveInsertSound();
    playHoloShimmerSound();
    setAddedSuccessCount(res.addedCount);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 md:pb-16">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 text-xs font-bold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>複数枚まとめてAI査定完了 ({appraisals.length}枚)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            一括査定結果サマリー
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsConditionGuideOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-700/80 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>状態判定ガイド</span>
          </button>

          <button
            onClick={handleAddAllToBinder}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>全{appraisals.length}枚をバインダーに収納</span>
          </button>

          <button
            onClick={onReAppraise}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>新しく査定</span>
          </button>
        </div>
      </div>

      {addedSuccessCount !== null && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-bold rounded-2xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{addedSuccessCount}枚のカードをコレクションバインダーに収納しました！</span>
          </div>
          {onNavigateCollection && (
            <button
              onClick={onNavigateCollection}
              className="underline text-emerald-700 dark:text-emerald-300 font-bold ml-2 whitespace-nowrap"
            >
              バインダーを開く →
            </button>
          )}
        </div>
      )}

      {/* Grand Total Estimated Price Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>査定カード {appraisals.length}枚の合計金額</span>
            </span>
            <div className="text-4xl sm:text-6xl font-black tracking-tight mt-1">
              <span className="text-3xl sm:text-4xl font-normal opacity-90 mr-1">合計推定価格:</span>
              ¥{grandTotal.toLocaleString()}
            </div>
            <p className="text-xs text-rose-100 mt-2">
              ※本査定価格は参考値です。AIがカード枠を自動切り抜きし、コレクションに収納しやすい状態で管理されます。
            </p>
          </div>
        </div>
      </div>

      {/* Cards List: カード1, カード2, カード3, カード4... */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          査定カード一覧 ({appraisals.length}件)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {appraisals.map((card, idx) => (
            <div
              key={card.id || idx}
              onClick={() => onSelectCard(card)}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-red-400 dark:hover:border-red-500 transition-all cursor-pointer flex items-center gap-4 group"
            >
              {/* Card Thumbnail */}
              <div className="relative w-20 sm:w-24 aspect-[63/88] rounded-xl overflow-hidden bg-black shrink-0 border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform shadow-md">
                <img
                  src={card.croppedImageUrl || card.frontImageUrl}
                  alt={card.cardName}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1 left-1 bg-black/75 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                  #{idx + 1}
                </span>
              </div>

              {/* Specs & Pricing */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                    カード {idx + 1}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-rose-400">
                    {card.rarity}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 truncate">
                    {card.cardNumber}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                  {card.cardName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {card.expansionSet}
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                      Rank {card.conditionGrade}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-red-600 dark:text-rose-400">
                      ¥{card.estimatedPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 text-slate-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Condition Grading Guide Modal */}
      <ConditionGuideModal
        isOpen={isConditionGuideOpen}
        onClose={() => setIsConditionGuideOpen(false)}
      />

    </div>
  );
};
