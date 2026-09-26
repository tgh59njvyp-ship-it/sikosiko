import React from 'react';
import {
  Clock,
  Trash2,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { AppraisalRecord } from '../types/card';
import { deleteAppraisal } from '../lib/api';

interface HistoryScreenProps {
  appraisals: AppraisalRecord[];
  onSelectAppraisal: (appraisal: AppraisalRecord) => void;
  onRefresh: () => void;
  onOpenScan: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  appraisals,
  onSelectAppraisal,
  onRefresh,
  onOpenScan,
}) => {
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('この査定履歴を削除しますか？')) {
      await deleteAppraisal(id);
      onRefresh();
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(
        d.getHours()
      ).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24 md:pb-16">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Clock className="w-7 h-7 text-red-600" />
            <span>査定履歴</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            過去にAI査定を行ったポケモンカードの履歴一覧 ({appraisals.length}件)
          </p>
        </div>

        <button
          onClick={onOpenScan}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/20 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>新しいカードを査定</span>
        </button>
      </div>

      {/* History Items */}
      {appraisals.length > 0 ? (
        <div className="space-y-3">
          {appraisals.map((app) => (
            <div
              key={app.id}
              onClick={() => onSelectAppraisal(app)}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-red-400 dark:hover:border-red-500/80 transition-all cursor-pointer flex items-center gap-4 group"
            >
              {/* Card Thumbnail */}
              <div className="relative w-16 sm:w-20 aspect-[63/88] rounded-xl overflow-hidden bg-black shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform">
                <img
                  src={app.frontImageUrl}
                  alt={app.cardName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Meta details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatDate(app.appraisedAt)}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-rose-400 text-[10px] font-black uppercase">
                    {app.rarity}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 truncate">
                    {app.cardNumber}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                  {app.cardName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {app.expansionSet} • {app.series}
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                    Rank {app.conditionGrade}
                  </span>
                  <span className="text-xs text-slate-500">
                    白かけ: {app.conditionAnalysis.edgeWear}
                  </span>
                </div>
              </div>

              {/* Pricing & Actions */}
              <div className="text-right shrink-0 flex flex-col items-end gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">査定価格</span>
                  <span className="text-lg sm:text-xl font-black text-red-600 dark:text-rose-400 block">
                    ¥{app.estimatedPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDelete(e, app.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="履歴を削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="text-slate-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
          <Clock className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-200">
            まだ査定履歴がありません
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            手持ちのポケカを撮影または画像をアップロードしてAI査定をお試しください。
          </p>
          <button
            onClick={onOpenScan}
            className="mt-5 px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/25"
          >
            最初のカードを査定する
          </button>
        </div>
      )}

    </div>
  );
};
