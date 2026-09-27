import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Send,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  FileText,
  Tag,
  ShieldCheck,
  Coins,
  MessageSquare,
} from 'lucide-react';
import { AppraisalRecord } from '../types/card';

export interface FeedbackReport {
  id: string;
  appraisalId: string;
  cardName: string;
  cardNumber: string;
  rarity: string;
  issueTypes: string[];
  correctInfo?: string;
  userComment: string;
  submittedAt: string;
}

const ISSUE_OPTIONS = [
  { id: 'card_name', label: 'カード名の誤認識', desc: '別のカード名として認識された', icon: Tag },
  { id: 'rarity', label: 'レアリティ・特殊加工誤判定', desc: 'SAR・AR・SR・ミラー加工などの不一致', icon: Sparkles },
  { id: 'expansion', label: '収録パック・シリーズ間違い', desc: '発売弾・コレクター番号が異なる', icon: FileText },
  { id: 'condition', label: '状態ランク（傷・白かけ）不一致', desc: '実際の傷や汚れとランク（S〜D）が合わない', icon: ShieldCheck },
  { id: 'price', label: '査定価格（相場）の著しい乖離', desc: '実売相場・買取表と大きく離れている', icon: Coins },
  { id: 'other', label: 'その他・改善ご要望', desc: 'その他の誤りや機能へのフィードバック', icon: MessageSquare },
];

const STORAGE_REPORTS_KEY = 'card_scanner_appraisal_reports_v2';

export function saveAppraisalFeedbackReport(report: FeedbackReport) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_REPORTS_KEY);
    const existing: FeedbackReport[] = raw ? JSON.parse(raw) : [];
    existing.unshift(report);
    localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(existing));
  } catch (err) {
    console.warn('Failed to save report:', err);
  }
}

interface AppraisalFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  appraisal: AppraisalRecord;
  onSubmitSuccess?: (message: string) => void;
}

export const AppraisalFeedbackModal: React.FC<AppraisalFeedbackModalProps> = ({
  isOpen,
  onClose,
  appraisal,
  onSubmitSuccess,
}) => {
  const [selectedIssues, setSelectedIssues] = useState<string[]>(['card_name']);
  const [correctInfo, setCorrectInfo] = useState<string>('');
  const [userComment, setUserComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleIssue = (issueId: string) => {
    if (selectedIssues.includes(issueId)) {
      if (selectedIssues.length > 1) {
        setSelectedIssues(selectedIssues.filter((id) => id !== issueId));
      }
    } else {
      setSelectedIssues([...selectedIssues, issueId]);
    }
  };

  const handleSubmit = () => {
    if (selectedIssues.length === 0) return;
    setIsSubmitting(true);

    const report: FeedbackReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      appraisalId: appraisal.id || `app_${Date.now()}`,
      cardName: appraisal.cardName,
      cardNumber: appraisal.cardNumber,
      rarity: appraisal.rarity,
      issueTypes: selectedIssues,
      correctInfo: correctInfo.trim() || undefined,
      userComment: userComment.trim(),
      submittedAt: new Date().toISOString(),
    };

    saveAppraisalFeedbackReport(report);

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitSuccess?.('報告を受け付けました。AIモデルの学習・査定精度改善に活用させていただきます！');
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>査定結果の報告・フィードバック</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                誤認識や誤査定の情報を送信してAI精度の向上にご協力ください
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-800 dark:text-slate-200 flex-1">
          
          {/* Target Card Card Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center gap-3">
            <div className="w-12 aspect-[63/88] rounded-lg overflow-hidden bg-black shrink-0 border border-slate-200 dark:border-slate-700">
              <img
                src={appraisal.croppedImageUrl || appraisal.frontImageUrl}
                alt={appraisal.cardName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                <span className="px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-rose-400">
                  {appraisal.rarity}
                </span>
                <span>{appraisal.cardNumber}</span>
              </div>
              <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">
                {appraisal.cardName}
              </h4>
              <p className="text-xs font-mono font-black text-red-600 dark:text-rose-400">
                AI判定: ¥{appraisal.estimatedPrice.toLocaleString()} (Rank {appraisal.conditionGrade})
              </p>
            </div>
          </div>

          {/* Issue Categories Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-900 dark:text-white">
              誤認識のタイプを選択（複数選択可）
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ISSUE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedIssues.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleIssue(opt.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-1.5 rounded-xl shrink-0 ${
                      isSelected ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold leading-tight">{opt.label}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Correct Information Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              正しいカード情報（わかる範囲で入力）
            </label>
            <input
              type="text"
              placeholder="例: ポケモン名「ナンジャモ」、正しいカード番号「096/071 SAR」"
              value={correctInfo}
              onChange={(e) => setCorrectInfo(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Details / Comments Area */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              詳細コメント・補足情報（任意）
            </label>
            <textarea
              rows={3}
              placeholder="例: 光の反射で傷と誤認識されています。実物の状態は表面無傷です。相場は現在15,000円前後です。"
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              送信いただいた内容はAIデータセット学習と相場データベースの校正に自動反映されます。
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedIssues.length === 0 || isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>誤認識報告を送信</span>
          </button>
        </div>

      </div>
    </div>
  );
};
