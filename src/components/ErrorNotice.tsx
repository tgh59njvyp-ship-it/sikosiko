import React from 'react';
import { AlertCircle, RotateCcw, Camera, HelpCircle, CheckCircle, Key } from 'lucide-react';

interface ErrorNoticeProps {
  errorMessage?: string;
  onRetry: () => void;
  onOpenUpload: () => void;
  onOpenGeminiModal?: () => void;
}

export const ErrorNotice: React.FC<ErrorNoticeProps> = ({
  errorMessage,
  onRetry,
  onOpenUpload,
  onOpenGeminiModal,
}) => {
  const isKeyError = Boolean(
    errorMessage?.includes('Gemini API') ||
    errorMessage?.includes('APIキー') ||
    errorMessage?.includes('API key')
  );

  return (
    <div className="max-w-xl mx-auto px-4 py-12 text-center animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-red-200 dark:border-red-900/60 shadow-xl space-y-6">
        
        {/* Error Icon */}
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-md ${
          isKeyError
            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400'
            : 'bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400'
        }`}>
          {isKeyError ? <Key className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
        </div>

        {/* Mandatory Error Message */}
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {isKeyError ? 'Gemini APIキーの設定が必要です' : 'カードを認識できませんでした'}
          </h2>
          <p className="text-sm font-semibold text-red-600 dark:text-rose-400 mt-2 leading-relaxed">
            {errorMessage || 'カード全体が写っている、明るくピントの合った写真をアップロードしてください。'}
          </p>
        </div>

        {/* API Key CTA if key issue */}
        {isKeyError && onOpenGeminiModal && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/50 rounded-2xl border border-amber-200 dark:border-amber-900/60 text-left space-y-3">
            <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
              Google Gemini APIキー（無料）を設定することで、AI画像認識によりあらゆるポケモンカードが1枚ずつ正確に自動識別・査定されます。
            </p>
            <button
              onClick={onOpenGeminiModal}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/25 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>今すぐGemini APIキーを設定する (無料)</span>
            </button>
          </div>
        )}

        {/* Common Causes Checklist */}
        {!isKeyError && (
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 text-left text-xs space-y-2 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <span className="font-extrabold text-slate-800 dark:text-slate-200 block text-xs flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>以下の点をご確認ください:</span>
            </span>
            <ul className="space-y-1.5 list-disc pl-4 text-slate-500 dark:text-slate-400">
              <li>画像が暗すぎる、または強い光が反射して文字が見えない</li>
              <li>カードが小さすぎる、または斜めになりすぎている</li>
              <li>指などでカードの一部（カード名やナンバー）が隠れている</li>
              <li>複数のカードが重なっている（1枚ずつ撮影してください）</li>
              <li>ポケモンカード以外の被写体である</li>
            </ul>
          </div>
        )}

        {/* Retry Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onRetry}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-600 font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>もう一度試す</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>別の写真を選ぶ</span>
          </button>
        </div>

      </div>
    </div>
  );
};
