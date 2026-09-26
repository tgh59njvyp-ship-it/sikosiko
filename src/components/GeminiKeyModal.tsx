import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { getStoredApiKey, setStoredApiKey, verifyApiKey } from '../lib/geminiKey';

interface GeminiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
}

export const GeminiKeyModal: React.FC<GeminiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const current = getStoredApiKey();
      setApiKey(current);
      if (current) {
        setStatus('success');
        setStatusMessage('保存済みのAPIキーが設定されています');
      } else {
        setStatus('idle');
        setStatusMessage('');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setStatus('error');
      setStatusMessage('APIキーを入力してください。');
      return;
    }

    setStatus('testing');
    setStatusMessage('Google Gemini APIにテスト接続中...');

    const res = await verifyApiKey(apiKey.trim());
    if (res.valid) {
      setStatus('success');
      setStatusMessage('接続成功！Gemini Vision AIによる画像解析が利用可能です。');
    } else {
      setStatus('error');
      setStatusMessage(res.error || 'APIキーの検証に失敗しました。キーを確認してください。');
    }
  };

  const handleSave = () => {
    setStoredApiKey(apiKey.trim());
    onKeyUpdated();
    onClose();
  };

  const handleClear = () => {
    setApiKey('');
    setStoredApiKey('');
    setStatus('idle');
    setStatusMessage('APIキーを解除しました。');
    onKeyUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-red-500/20">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                Gemini API キー設定
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                本物のAI画像認識によるリアルタイムカード鑑定
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <p className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>お好みのGemini APIキーを登録できます</span>
            </p>
            Vercel等の外部デプロイ環境でも、ご自身のGoogle Gemini APIキーを設定することで、アップロードされたどんなカードもAIが正確に自動識別・査定します。
          </div>

          {/* Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Google Gemini API キー
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-red-600 dark:text-rose-400 hover:underline flex items-center gap-1"
              >
                <span>無料でAPIキーを取得 (Google AI Studio)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setStatus('idle');
                }}
                placeholder="AIzaSy..."
                className="w-full pl-3.5 pr-24 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-mono text-slate-900 dark:text-white shadow-sm"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title={showKey ? '隠す' : '表示'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={status === 'testing' || !apiKey.trim()}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-[11px] font-bold disabled:opacity-50 flex items-center gap-1"
                >
                  {status === 'testing' ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <span>検証</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Status Alert */}
          {statusMessage && (
            <div
              className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                status === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : status === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
              {status === 'error' && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
              {status === 'testing' && <RefreshCw className="w-4 h-4 text-slate-500 animate-spin shrink-0" />}
              <span className="flex-1">{statusMessage}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
            <span>APIキーはお使いのブラウザ（LocalStorage）にのみ安全に保存されます。</span>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
          {apiKey ? (
            <button
              onClick={handleClear}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>キーを削除</span>
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              閉じる
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/25 active:scale-95 transition-all"
            >
              設定を保存
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
