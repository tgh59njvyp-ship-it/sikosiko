import React from 'react';
import {
  Camera,
  Upload,
  Layers,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Search,
  CheckCircle2,
  ArrowRight,
  Zap,
  Activity,
  Key,
} from 'lucide-react';
import { SAMPLE_CARDS, SampleCard } from '../lib/sampleCards';

interface HeroHomeProps {
  onOpenScan: (mode?: 'camera' | 'upload' | 'batch') => void;
  onSelectSample: (sample: SampleCard) => void;
  onNavigateSearch: () => void;
  geminiConfigured?: boolean;
  onOpenGeminiModal?: () => void;
}

export const HeroHome: React.FC<HeroHomeProps> = ({
  onOpenScan,
  onSelectSample,
  onNavigateSearch,
  geminiConfigured = false,
  onOpenGeminiModal,
}) => {
  return (
    <div className="w-full pb-20 md:pb-12 space-y-12 sm:space-y-16">
      
      {/* 1. First View / Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20 bg-gradient-to-b from-white via-slate-50/60 to-slate-100/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border-b border-slate-200/70 dark:border-slate-800">
        
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 sm:w-[600px] h-96 sm:h-[400px] bg-gradient-to-tr from-red-500/10 via-rose-500/15 to-amber-500/10 blur-3xl pointer-events-none rounded-full"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200/80 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs sm:text-sm font-bold tracking-wide mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-red-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>ポケモンカード専門 AI画像認識 & 最新相場判定</span>
          </div>

          {/* Catchphrase */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15] sm:leading-[1.15]">
            ポケカを撮るだけ。
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 bg-clip-text text-transparent">
              AIがカードを査定。
            </span>
          </h1>

          {/* Explanation Subtitle */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            カードの写真をアップロードすると、カード名・番号・レアリティ・相場などをAIが自動解析します。
          </p>

          {/* Primary CTA Button */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenScan('upload')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-lg shadow-xl shadow-red-500/30 hover:shadow-red-500/45 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Camera className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span>カードを査定する</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* 3 Entry Cards */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto text-left">
            
            {/* 1: カメラで撮影 */}
            <div
              onClick={() => onOpenScan('camera')}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-red-400 dark:hover:border-red-500 transition-all cursor-pointer group flex items-center sm:flex-col sm:items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  カメラで撮影
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-red-500" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  手元のカードをスマホやWebカメラで直接撮影して瞬時に査定
                </p>
              </div>
            </div>

            {/* 2: 画像をアップロード */}
            <div
              onClick={() => onOpenScan('upload')}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-red-400 dark:hover:border-red-500 transition-all cursor-pointer group flex items-center sm:flex-col sm:items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  画像をアップロード
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-red-500" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  写真ライブラリや保存画像からドラッグ＆ドロップで選ぶ
                </p>
              </div>
            </div>

            {/* 3: 複数枚をまとめて査定 */}
            <div
              onClick={() => onOpenScan('batch')}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-red-400 dark:hover:border-red-500 transition-all cursor-pointer group flex items-center sm:flex-col sm:items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  複数枚をまとめて査定
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-amber-500" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  コレクションやパック開封分を一度にアップロードして合計額を算出
                </p>
              </div>
            </div>

          </div>

          {/* Gemini AI Settings Card */}
          {onOpenGeminiModal && (
            <div className="mt-8 p-4 sm:p-5 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-red-500 flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm sm:text-base text-white">
                      Gemini Vision AI 鑑定エンジン
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        geminiConfigured
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {geminiConfigured ? '● 稼働中' : '● APIキー設定推奨'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    {geminiConfigured
                      ? 'Google Gemini AIが連携中。撮影したあらゆるポケカを自動識別・精密査定します。'
                      : 'お好みのGemini APIキー（無料）をサイト内で設定すると、アップロードしたカードをAIが瞬時に識別します。'}
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenGeminiModal}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shrink-0 shadow-md active:scale-95 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-red-600" />
                <span>{geminiConfigured ? 'API設定を変更' : 'APIキーを設定する (無料)'}</span>
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 2. Quick Test Samples: 即座にお試しできる人気カード */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              <Zap className="w-4 h-4 fill-red-500" />
              <span>ワンクリックですぐにお試し</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              サンプルカードで査定体験
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              手元にカードがなくても、タップするだけで実際のAI解析フローを体験できます。
            </p>
          </div>
          <button
            onClick={onNavigateSearch}
            className="text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 hover:text-red-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>収録カード一覧を見る</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
          {SAMPLE_CARDS.map((card) => (
            <div
              key={card.id}
              onClick={() => onSelectSample(card)}
              className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-3 shadow-sm hover:shadow-xl hover:border-red-400 dark:hover:border-red-500/80 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              {/* Card visual frame */}
              <div className="relative aspect-[63/88] w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700 mb-3 group-hover:scale-[1.02] transition-transform">
                <img
                  src={card.dataUrl}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                  <span className="text-xs font-bold text-white bg-red-600/90 backdrop-blur-sm px-2.5 py-1 rounded-lg w-full text-center">
                    このカードをAI査定
                  </span>
                </div>
              </div>

              {/* Card Specs */}
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {card.rarity}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {card.cardNumber}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                  {card.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {card.expansionSet}
                </p>
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-baseline justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold">参考相場</span>
                  <span className="text-sm font-black text-red-600 dark:text-rose-400">
                    ¥{card.basePrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. How It Works (3ステップ査定フロー) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-extrabold text-red-400 uppercase tracking-widest">
              HOW IT WORKS
            </span>
            <h3 className="text-2xl sm:text-3xl font-black mt-1">
              査定完了まで、わずか3ステップ
            </h3>
            <p className="text-sm text-slate-300 mt-2">
              専門知識は一切不要。AIが画像認識から状態ランク・最新市場価格の照合まで全自動で行います。
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            
            {/* Step 1 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-red-500 text-white font-black flex items-center justify-center text-lg mb-3 shadow-md">
                1
              </div>
              <h4 className="text-base font-bold text-white">カードを撮影・アップ</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                スマホカメラや写真ライブラリからカード画像を読み込み。斜めの写真でも自動補正します。
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white font-black flex items-center justify-center text-lg mb-3 shadow-md">
                2
              </div>
              <h4 className="text-base font-bold text-white">AIが8項目を精密解析</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                カード名、ナンバー、レアリティ、白かけやセンタリング状態を瞬時にスキャンします。
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center text-lg mb-3 shadow-md">
                3
              </div>
              <h4 className="text-base font-bold text-white">査定価格と相場を表示</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                状態ランク（S〜D）、買取想定額、販売相場、価格推移グラフをわかりやすく提示します。
              </p>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>本サービスの査定価格は参考値であり、実際の買取価格を保証するものではありません。</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Activity className="w-4 h-4 text-red-400" />
              <span>対応フォーマット: JPEG / PNG / WEBP</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Features & Technology (ポケカ査定のこだわり) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            信頼されるカード査定のために
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            単なる画像認識ではなく、コレクターやショップ目線の鑑定項目を網羅しています。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 flex items-center justify-center font-bold mb-3">
              SAR
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">特殊レアリティ識別</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              SAR、UR、AR、マスターボールミラー、プロモなどの特殊加工やイラスト違いを高精度判別。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center font-bold mb-3">
              S〜D
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">カード状態AI判定</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              白かけ・擦り傷・へこみ・センタリング比率を多角的に分析し5段階ランクで査定額に反映。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center font-bold mb-3">
              ¥帯
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">推定価格帯 & 信頼度</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              単一の価格だけでなく上限・下限の価格幅と「高・中・低」の価格信頼度を明示します。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center font-bold mb-3">
              7d〜1y
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">相場価格推移グラフ</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              7日・30日・90日・1年の取引価格履歴を可視化し、売り時や買い時の参考にできます。
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
