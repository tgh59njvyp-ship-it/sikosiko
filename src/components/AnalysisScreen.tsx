import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Loader2,
  Scan,
  Sparkles,
  ShieldCheck,
  Search,
  Layers,
  Coins,
} from 'lucide-react';

interface AnalysisScreenProps {
  cardImageUrl: string;
  onAnalysisDone: () => void;
}

const ANALYSIS_STEPS = [
  { id: 1, label: 'カード画像を解析', desc: '傾き補正・輪郭抽出・画像鮮明度の自動最適化' },
  { id: 2, label: 'カード名を認識', desc: 'ポケモン名・トレーナーズ・エネルギー種別を特定' },
  { id: 3, label: 'カード番号を確認', desc: 'エキスパンションコード・コレクター番号を照合' },
  { id: 4, label: 'レアリティを判定', desc: 'SAR・UR・AR・SR・マスボミラー・プロモ加工の検出' },
  { id: 5, label: '収録シリーズを確認', desc: '発売弾・パック名称・バージョン情報の特定' },
  { id: 6, label: '市場価格を取得', desc: 'メルカリ・晴れる屋2・カードラッシュ最新相場と照合' },
  { id: 7, label: 'カード状態を分析', desc: '白かけ・傷・へこみ・センタリング比率のAI鑑定' },
  { id: 8, label: '査定価格を計算', desc: '状態ランク別（S〜D）推定買取・販売相場を算出' },
];

export const AnalysisScreen: React.FC<AnalysisScreenProps> = ({
  cardImageUrl,
  onAnalysisDone,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    // Progress through the 8 steps dynamically
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          // Wait briefly after final step then move to result
          setTimeout(() => {
            onAnalysisDone();
          }, 600);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [onAnalysisDone]);

  const progressPercent = Math.round(
    ((activeStepIndex + 1) / ANALYSIS_STEPS.length) * 100
  );

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 max-w-4xl mx-auto">
      
      {/* Title & Badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Google Gemini Vision AI 鑑定中</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          カードを解析しています…
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          画像特徴量からカード情報と最新中古取引データを照合しています
        </p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Central Card with Laser Scanner Overlay */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-56 sm:w-64 aspect-[63/88] rounded-2xl overflow-hidden shadow-2xl bg-black border-2 border-red-500/80 ring-4 ring-red-500/20 group">
            <img
              src={cardImageUrl}
              alt="解析中のカード"
              className="w-full h-full object-cover filter contrast-105"
            />

            {/* Glowing Laser Scan Line */}
            <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-red-500 via-rose-300 to-red-500 shadow-[0_0_15px_#ef4444] scan-laser-line z-20"></div>

            {/* Scanning Grid effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(239,68,68,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(239,68,68,0.1)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            {/* Corner Targeting Brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-red-500 pointer-events-none"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-red-500 pointer-events-none"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-red-500 pointer-events-none"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-red-500 pointer-events-none"></div>

            {/* Overlay Tag */}
            <div className="absolute bottom-3 inset-x-3 bg-black/75 backdrop-blur-md rounded-lg py-1.5 px-3 flex items-center justify-between text-[11px] text-white">
              <span className="font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                SCANNING
              </span>
              <span className="font-bold text-red-400">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* 8-Step Interactive Checklist */}
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              ANALYSIS PROGRESS
            </span>
            <span className="text-xs font-black text-red-600 dark:text-rose-400">
              {activeStepIndex + 1} / {ANALYSIS_STEPS.length} 完了
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-red-600 to-rose-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* 8 Steps */}
          <div className="space-y-2.5">
            {ANALYSIS_STEPS.map((step, idx) => {
              const isFinished = idx < activeStepIndex;
              const isCurrent = idx === activeStepIndex;

              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-3 p-2 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-red-50/80 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/60 scale-[1.01]'
                      : isFinished
                      ? 'opacity-85'
                      : 'opacity-40'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isFinished ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-red-600 dark:text-rose-400 animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[9px] font-bold text-slate-400">
                        {step.id}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs font-extrabold ${
                          isCurrent
                            ? 'text-red-700 dark:text-rose-300'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {step.id}. {step.label}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-red-600 dark:text-red-400 animate-pulse">
                          照合中...
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
