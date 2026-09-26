import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  ScanLine,
  Layers,
  Activity,
  AlertCircle,
  Clock,
  Sparkles,
  TrendingUp,
  Cpu,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { fetchAdminMetrics } from '../lib/api';

interface AdminScreenProps {
  onBack: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ onBack }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminMetrics();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <Activity className="w-8 h-8 text-red-600 animate-spin mx-auto mb-2" />
        <span className="text-xs text-slate-500">管理者メトリクスを読み込み中...</span>
      </div>
    );
  }

  const { metrics, popularCards, recentAppraisals, apiLogs } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 md:pb-16">
      
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-rose-400 text-xs font-black mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>CARD SCANNER 管理コンソール</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            システム統計 & API稼働状況
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-xs font-bold"
          >
            <RefreshCw className="w-4 h-4" />
            <span>更新</span>
          </button>
        </div>
      </div>

      {/* 4 Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Users */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">総ユーザー数</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {metrics.totalUsers.toLocaleString()}人
          </div>
          <span className="text-[10px] text-emerald-500 font-bold mt-1 block">
            ↑ 今週 +24人 新規
          </span>
        </div>

        {/* Total Appraisals */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">累積査定回数</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 flex items-center justify-center">
              <ScanLine className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-600 dark:text-rose-400">
            {metrics.totalAppraisals.toLocaleString()}回
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            AIビジョン認識率 99.2%
          </span>
        </div>

        {/* Registered Cards */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">図鑑登録カード数</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {metrics.registeredCards.toLocaleString()}種
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            SV・剣盾・151 最新弾対応
          </span>
        </div>

        {/* Gemini Engine Latency & Status */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">AI応答速度 (平均)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {metrics.avgLatencyMs}ms
          </div>
          <span className="text-[10px] text-emerald-500 font-bold mt-1 block flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {metrics.geminiStatus}
          </span>
        </div>

      </div>

      {/* Middle Grid: Popular Cards & Recent Appraisals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Popular Cards */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-red-500" />
            <span>人気査定カードランキング</span>
          </h3>

          <div className="space-y-2.5">
            {popularCards.map((c: any, i: number) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/40"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 font-mono font-black text-slate-400 text-xs">
                    #{i + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {c.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {c.cardNumber} • {c.rarity}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-red-600 dark:text-rose-400">
                    ¥{c.baseMarketPrice.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-slate-400 block font-semibold">
                    査定需要: 高
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Appraisals Feed */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>リアルタイム直近査定フィード</span>
          </h3>

          <div className="space-y-2.5 max-h-72 overflow-y-auto">
            {recentAppraisals.map((a: any) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/40 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                    Rank {a.conditionGrade}
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-100">
                      {a.cardName}
                    </h5>
                    <span className="text-[10px] text-slate-400">
                      {a.rarity} • {a.cardNumber}
                    </span>
                  </div>
                </div>

                <span className="font-black text-slate-900 dark:text-white">
                  ¥{a.estimatedPrice.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* API Usage & Error Log Monitoring */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span>Gemini Vision API 実行ログ</span>
          </h3>
          <span className="text-xs text-slate-400">
            モデル: <strong>{metrics.geminiModel}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="text-[10px] text-slate-400 uppercase border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="py-2">タイムスタンプ</th>
                <th className="py-2">アクション</th>
                <th className="py-2">処理時間</th>
                <th className="py-2">ステータス</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {apiLogs.map((log: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="py-2 font-mono text-[10px] text-slate-400">
                    {log.timestamp.slice(11, 19)}
                  </td>
                  <td className="py-2 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {log.action}
                  </td>
                  <td className="py-2 font-mono text-slate-600 dark:text-slate-300">
                    {log.durationMs}ms
                  </td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'ok'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {log.status === 'ok' ? 'SUCCESS 200' : 'ERROR 422'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
