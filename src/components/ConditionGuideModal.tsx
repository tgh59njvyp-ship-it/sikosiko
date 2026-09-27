import React, { useState } from 'react';
import {
  ShieldCheck,
  X,
  HelpCircle,
  Sparkles,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Info,
  Maximize2,
  Award,
  Layers,
} from 'lucide-react';

interface ConditionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConditionGuideModal: React.FC<ConditionGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'ranks' | 'inspection' | 'tips'>('ranks');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xs shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-md shadow-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>カード状態判定ガイド</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  PSA/BGS基準準拠
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Google Gemini Vision AIによるカード状態評価ランクの判断基準
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 pt-3 bg-white dark:bg-slate-900 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('ranks')}
            className={`pb-2.5 px-3.5 text-xs font-black transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'ranks'
                ? 'border-red-600 text-red-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>状態ランク基準 (S〜D)</span>
          </button>

          <button
            onClick={() => setActiveTab('inspection')}
            className={`pb-2.5 px-3.5 text-xs font-black transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'inspection'
                ? 'border-red-600 text-red-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>AI解析チェック項目</span>
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={`pb-2.5 px-3.5 text-xs font-black transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'tips'
                ? 'border-red-600 text-red-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>高精度査定のコツ</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          
          {/* TAB 1: RANKS */}
          {activeTab === 'ranks' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  当サービスのAI鑑定は、米国PSA (Professional Sports Authenticator) およびBGSの評価基準をベースに状態ランクを算出しています。
                </span>
              </div>

              {/* Rank S */}
              <div className="p-4 rounded-2xl border border-amber-300 dark:border-amber-800/80 bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-transparent space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500 text-white font-black text-sm shadow-sm">
                      Rank S
                    </span>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      極美品 / 未使用品クラス
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                    PSA 10 〜 9.5 相当
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  パック開封直後の完全未使用状態。白かけ・スレ傷・凹み・汚れが一切なく、角や外フチも非常にシャープです。
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 font-medium">
                    ・白かけ: なし
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 font-medium">
                    ・スレ傷: なし
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 font-medium">
                    ・買取査定: 満額100%〜プレミア相場
                  </span>
                </div>
              </div>

              {/* Rank A */}
              <div className="p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-emerald-500 text-white font-black text-sm shadow-sm">
                      Rank A
                    </span>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      美品 (コレクター向け)
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    PSA 9 〜 8 相当
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  コレクション用途に耐えうる大変良好なコンディション。肉眼で注視してわかる程度の極小白かけ（1箇所程度）や微細な初期加工スレのみ。
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 font-medium">
                    ・白かけ: 微小（1箇所程度）
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 font-medium">
                    ・スレ傷: 極めて軽微
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 font-medium">
                    ・買取査定: 満額の90%〜100%
                  </span>
                </div>
              </div>

              {/* Rank B */}
              <div className="p-4 rounded-2xl border border-blue-300 dark:border-blue-800/80 bg-blue-50/50 dark:bg-blue-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-blue-500 text-white font-black text-sm shadow-sm">
                      Rank B
                    </span>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      良品 / わずかな傷あり
                    </span>
                  </div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                    PSA 7 〜 6 相当
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  若干の白かけや光にかざすと確認できる表面スレがある状態。スリーブ着用でのプレイや鑑賞用バインダー保管に十分なコンディション。
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 font-medium">
                    ・白かけ: 数箇所あり
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 font-medium">
                    ・スレ傷: 浅いスレあり
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 font-medium">
                    ・買取査定: 美品相場の70%〜85%
                  </span>
                </div>
              </div>

              {/* Rank C */}
              <div className="p-4 rounded-2xl border border-amber-400 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-amber-600 text-white font-black text-sm shadow-sm">
                      Rank C
                    </span>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      プレイ用 / 中度傷あり
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                    PSA 5 〜 4 相当
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  はっきりと確認できる白かけ、表面の小スレ、小さなへこみや角の甘さが見られる状態。対戦プレイ用途に適しています。
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 font-medium">
                    ・白かけ: 複数・目立つ
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 font-medium">
                    ・へこみ・小傷: あり
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 font-medium">
                    ・買取査定: 美品相場の40%〜60%
                  </span>
                </div>
              </div>

              {/* Rank D */}
              <div className="p-4 rounded-2xl border border-rose-300 dark:border-rose-900/80 bg-rose-50/50 dark:bg-rose-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-rose-600 text-white font-black text-sm shadow-sm">
                      Rank D
                    </span>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      重度ダメージ / 傷あり
                    </span>
                  </div>
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
                    PSA 3 〜 1 相当
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  折れ目、水濡れ痕、大きなへこみ、目立つ引っかき傷、めくれ、著しい汚れなど明確なダメージがある状態。
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 font-medium">
                    ・折れ・水濡れ: あり
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 font-medium">
                    ・買取査定: 美品相場の10%〜30%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI INSPECTION POINTS */}
          {activeTab === 'inspection' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Google Gemini Vision AIは、高解像度画像のピクセル特徴量から以下の6つの主要視点を並列で自動判定しています。
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-rose-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="font-black text-xs text-slate-900 dark:text-white">
                      1. 白かけ (Edge Wear)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal pl-8">
                    カード外周の黒枠やカラー枠の擦れ剥げ。白い紙地が見えている部分の長さと個数をカウントします。
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="font-black text-xs text-slate-900 dark:text-white">
                      2. スレ傷 (Surface Scratches)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal pl-8">
                    表面クリアホイル層の微小な引っかき傷や線傷。反射光の連続性の歪みから検出します。
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <span className="font-black text-xs text-slate-900 dark:text-white">
                      3. へこみ (Dents & Imprints)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal pl-8">
                    押し痕や重みによるカード基板の局所的なくぼみ・陰影ピクセルを検出します。
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <span className="font-black text-xs text-slate-900 dark:text-white">
                      4. 折れ・シワ (Creases)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal pl-8">
                    カード表面・裏面の屈曲痕やシワ模様。大きな減額要因となります。
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                      <Info className="w-4 h-4" />
                    </div>
                    <span className="font-black text-xs text-slate-900 dark:text-white">
                      5. 汚れ・付着物 (Stains & Smudges)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal pl-8">
                    指紋痕や水分の染み、ホコリによる変色を色空間解析で識別します。
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                    <span className="font-black text-xs text-slate-900 dark:text-white">
                      6. センタリング (Centering Ratio)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal pl-8">
                    左右および上下の外枠幅の比率。黄金比50:50〜60:40が高評価となります。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PHOTO TIPS */}
          {activeTab === 'tips' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 rounded-2xl text-xs text-red-900 dark:text-rose-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
                <span>
                  少しのコツでAIの輪郭抽出と状態判定の精度が大幅に向上します！
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    01
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                      スリーブ・インナースリーブを外して撮影する
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      スリーブ表面の擦り傷や光の反射・気泡を「カード本体の傷」とAIが誤認するのを防ぐため、撮影時のみ裸の状態で撮影するのがベストです。
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    02
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                      黒や濃い色のマットの上で撮影する（コントラスト最大化）
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      白いテーブルや明るい背景では白かけの検出が難しくなります。プレイマットや黒い紙の上に置くとカード外枠の白かけ判定が格段に高精度になります。
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    03
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                      真上から直角に影が入らない明るい場所で撮影する
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      斜めからの撮影は遠近感によりセンタリング比率の誤判定につながります。カメラを平行に保ち、自分の影が落とし込まない位置で撮影してください。
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    04
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                      裏面画像も併せて追加指定する
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      ポケモンカードは裏面の紺色フチの白かけが重要な評価ポイントです。裏面画像もアップロードすることで完璧な鑑定結果が得られます。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xs flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-400 font-medium">
            ※ 実際の店舗買取・PSA鑑定時は鑑定環境の照明等により前後する場合があります。
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black shadow-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors cursor-pointer"
          >
            理解しました
          </button>
        </div>

      </div>
    </div>
  );
};
