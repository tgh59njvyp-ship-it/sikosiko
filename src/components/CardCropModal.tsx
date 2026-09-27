import React, { useState } from 'react';
import { Crop, RotateCw, Check, X, Sparkles, RefreshCw } from 'lucide-react';
import { rotateImage90, detectAndCropCard, cropImageWithBounds } from '../lib/cardCropper';
import { preprocessCardImage } from '../lib/imagePreprocessor';
import { playSleeveInsertSound } from '../lib/soundFx';

interface CardCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalImage: string;
  currentCroppedImage: string;
  onApplyCrop: (newCroppedImage: string) => void;
}

export const CardCropModal: React.FC<CardCropModalProps> = ({
  isOpen,
  onClose,
  originalImage,
  currentCroppedImage,
  onApplyCrop,
}) => {
  const [workingImage, setWorkingImage] = useState<string>(originalImage);
  const [previewImage, setPreviewImage] = useState<string>(currentCroppedImage);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [insetPercent, setInsetPercent] = useState<number>(4);

  if (!isOpen) return null;

  const handleRotate = async () => {
    setIsProcessing(true);
    try {
      const rotated = await rotateImage90(workingImage);
      setWorkingImage(rotated);
      const cropRes = await detectAndCropCard(rotated);
      setPreviewImage(cropRes.croppedBase64);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAutoDetect = async () => {
    setIsProcessing(true);
    try {
      const cropRes = await detectAndCropCard(workingImage);
      setPreviewImage(cropRes.croppedBase64);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOptimizeLighting = async () => {
    setIsProcessing(true);
    try {
      const prep = await preprocessCardImage(previewImage, { autoOptimize: true });
      setPreviewImage(prep.processedBase64);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInsetChange = async (newInset: number) => {
    setInsetPercent(newInset);
    setIsProcessing(true);
    try {
      const margin = newInset / 100;
      const cropped = await cropImageWithBounds(workingImage, {
        x: margin,
        y: margin,
        width: 1 - margin * 2,
        height: 1 - margin * 2,
      });
      setPreviewImage(cropped);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    playSleeveInsertSound();
    onApplyCrop(previewImage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                カード画像・切り抜き微調整
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AIがカード枠を自動検出。枠線の余白や向きを微調整できます
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Comparison */}
        <div className="flex items-center justify-center gap-4 py-2">
          {/* Cropped Output View */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold text-red-600 dark:text-rose-400 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>AI切り抜きプレビュー (バインダー用)</span>
            </span>
            <div className="relative w-44 sm:w-48 aspect-[63/88] rounded-2xl overflow-hidden bg-black shadow-xl ring-2 ring-red-500/50">
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-10">
                  <RefreshCw className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
              <img
                src={previewImage}
                alt="AI切り抜きプレビュー"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          {/* Border margin trim slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>余白トリミング調整</span>
              <span className="font-mono text-red-600 dark:text-rose-400">{insetPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={insetPercent}
              onChange={(e) => handleInsetChange(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleRotate}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCw className="w-4 h-4 text-slate-500" />
              <span>90° 回転</span>
            </button>

            <button
              onClick={handleOptimizeLighting}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>画質・明暗最適化</span>
            </button>

            <button
              onClick={handleAutoDetect}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-red-500" />
              <span>AI枠再検出</span>
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-500/25 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>切り抜きを適用</span>
          </button>
        </div>

      </div>
    </div>
  );
};
