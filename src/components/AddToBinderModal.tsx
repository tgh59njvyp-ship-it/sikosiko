import React, { useState, useEffect } from 'react';
import { BookOpen, Check, Plus, Sparkles, Layers, ChevronRight, X } from 'lucide-react';
import { AppraisalRecord } from '../types/card';
import {
  CollectionBinder,
  getStoredBinders,
  addCardToBinder,
  createNewBinder,
  findNextAvailableSlot,
} from '../lib/collectionStorage';
import { playSleeveInsertSound, playHoloShimmerSound } from '../lib/soundFx';

interface AddToBinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  appraisal: AppraisalRecord;
  customCroppedImage?: string;
  onSuccess: (binder: CollectionBinder) => void;
}

export const AddToBinderModal: React.FC<AddToBinderModalProps> = ({
  isOpen,
  onClose,
  appraisal,
  customCroppedImage,
  onSuccess,
}) => {
  const [binders, setBinders] = useState<CollectionBinder[]>([]);
  const [selectedBinderId, setSelectedBinderId] = useState<string>('');
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTheme, setNewTheme] = useState<'crimson' | 'obsidian' | 'sapphire' | 'emerald'>('crimson');
  const [isSuccessAnim, setIsSuccessAnim] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredBinders();
      setBinders(stored);
      if (stored.length > 0) {
        setSelectedBinderId(stored[0].id);
      }
      setIsSuccessAnim(false);
      setIsCreatingNew(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentBinder = binders.find((b) => b.id === selectedBinderId) || binders[0];
  const nextSlot = currentBinder ? findNextAvailableSlot(currentBinder) : { pageIndex: 0, slotIndex: 0 };
  const displayImage = customCroppedImage || appraisal.croppedImageUrl || appraisal.frontImageUrl;

  const handleCreateBinder = () => {
    if (!newTitle.trim()) return;
    const created = createNewBinder(newTitle.trim(), '', newTheme, 'pokeball');
    const updated = getStoredBinders();
    setBinders(updated);
    setSelectedBinderId(created.id);
    setIsCreatingNew(false);
    setNewTitle('');
  };

  const handleAdd = () => {
    if (!selectedBinderId && binders.length === 0) return;
    const targetId = selectedBinderId || binders[0]?.id;

    const res = addCardToBinder(
      targetId,
      appraisal,
      undefined,
      undefined,
      displayImage
    );

    playSleeveInsertSound();
    playHoloShimmerSound();

    setIsSuccessAnim(true);
    setTimeout(() => {
      onSuccess(res.binder);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Success Overlay Animation */}
        {isSuccessAnim && (
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="relative w-24 aspect-[63/88] rounded-xl overflow-hidden shadow-2xl ring-4 ring-emerald-500 mb-4 animate-bounce">
              <img src={displayImage} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-full mb-2">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-white">コレクションに収納完了！</h4>
            <p className="text-xs text-slate-300 mt-1">
              {currentBinder?.title} のスリーブに大切に保管されました
            </p>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                コレクションバインダーに追加
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI査定済みカードをアルバムにファイリング
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

        {/* Card Summary Card */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="relative w-14 aspect-[63/88] rounded-lg overflow-hidden bg-black shrink-0 shadow-md ring-1 ring-slate-300 dark:ring-slate-700">
            <img src={displayImage} alt={appraisal.cardName} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-rose-400 text-[10px] font-black">
                {appraisal.rarity}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {appraisal.cardNumber}
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate mt-0.5">
              {appraisal.cardName}
            </h4>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
              <span className="text-red-600 dark:text-rose-400 font-black">
                ¥{appraisal.estimatedPrice.toLocaleString()}
              </span>
              <span>·</span>
              <span className="text-amber-500 font-bold">
                Rank {appraisal.conditionGrade}
              </span>
            </div>
          </div>
        </div>

        {/* Binder Selector */}
        {!isCreatingNew ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                収納先バインダーを選択
              </label>
              <button
                onClick={() => setIsCreatingNew(true)}
                className="text-xs font-bold text-red-600 dark:text-rose-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新規バインダー</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {binders.map((binder) => {
                const isSelected = binder.id === selectedBinderId;
                const count = binder.cards.length;
                const totalValue = binder.cards.reduce((acc, c) => acc + c.estimatedPrice, 0);

                return (
                  <div
                    key={binder.id}
                    onClick={() => setSelectedBinderId(binder.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-red-50 dark:bg-red-950/40 border-red-400 dark:border-red-800 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                          isSelected ? 'border-red-600 bg-red-600' : 'border-slate-400'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {binder.title}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {count}枚収納中 · 推定総額 ¥{totalValue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                      Page {nextSlot.pageIndex + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Create New Binder Form */
          <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              新しいバインダーを作成
            </h4>
            <input
              type="text"
              placeholder="例: リザードン特選コレクション"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex items-center gap-2">
              {(['crimson', 'obsidian', 'sapphire', 'emerald'] as const).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewTheme(color)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === 'crimson'
                      ? 'bg-red-600'
                      : color === 'obsidian'
                      ? 'bg-slate-900'
                      : color === 'sapphire'
                      ? 'bg-blue-600'
                      : 'bg-emerald-600'
                  } ${newTheme === color ? 'ring-2 ring-offset-2 ring-red-500 scale-110' : 'opacity-70'}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300"
              >
                戻る
              </button>
              <button
                type="button"
                onClick={handleCreateBinder}
                disabled={!newTitle.trim()}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-[11px] font-bold disabled:opacity-50"
              >
                作成して選択
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            閉じる
          </button>
          <button
            onClick={handleAdd}
            disabled={!currentBinder}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-500/25 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>スリーブに収納する</span>
          </button>
        </div>

      </div>
    </div>
  );
};
