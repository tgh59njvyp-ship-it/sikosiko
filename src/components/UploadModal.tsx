import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  Layers,
  Image as ImageIcon,
  RotateCw,
  Sliders,
  CheckCircle2,
  Trash2,
  Plus,
  RefreshCw,
  Sparkles,
  Info,
  ChevronRight,
  Eye,
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'camera' | 'upload' | 'batch';
  onStartSingleAppraisal: (frontImage: string, backImage?: string) => void;
  onStartBatchAppraisal: (images: string[]) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'upload',
  onStartSingleAppraisal,
  onStartBatchAppraisal,
}) => {
  const [mode, setMode] = useState<'camera' | 'upload' | 'batch'>(initialMode);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [batchImages, setBatchImages] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Preprocessing toggles
  const [autoEnhance, setAutoEnhance] = useState(true);
  const [autoCropCorners, setAutoCropCorners] = useState(true);
  const [brightness, setBrightness] = useState(100); // 80 - 140

  // Camera stream
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const backFileInputRef = useRef<HTMLInputElement | null>(null);
  const batchFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialMode) setMode(initialMode);
  }, [initialMode, isOpen]);

  // Handle camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isOpen && mode === 'camera' && !frontImage) {
      setCameraError(null);
      navigator.mediaDevices
        ?.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
            setIsCameraActive(true);
          }
        })
        .catch((err) => {
          console.warn('Camera access error:', err);
          setCameraError('カメラの起動に失敗しました。ファイル選択をお試しください。');
          setIsCameraActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, mode, frontImage, facingMode]);

  if (!isOpen) return null;

  // Process & convert image via canvas (auto contrast / perspective crop effect)
  const processImageToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimension 1400px to ensure quick API upload
          const maxDim = 1400;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            if (autoEnhance) {
              ctx.filter = `contrast(1.08) brightness(${brightness / 100})`;
            }
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.88));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (autoEnhance) {
        ctx.filter = `contrast(1.08) brightness(${brightness / 100})`;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setFrontImage(dataUrl);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (mode === 'batch') {
      const results: string[] = [...batchImages];
      for (let i = 0; i < files.length; i++) {
        const dataUrl = await processImageToDataUrl(files[i]);
        results.push(dataUrl);
      }
      setBatchImages(results);
    } else {
      const dataUrl = await processImageToDataUrl(files[0]);
      setFrontImage(dataUrl);
    }
  };

  const handleBackFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const dataUrl = await processImageToDataUrl(files[0]);
    setBackImage(dataUrl);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    if (mode === 'batch' || files.length > 1) {
      setMode('batch');
      const results: string[] = [...batchImages];
      for (let i = 0; i < files.length; i++) {
        const dataUrl = await processImageToDataUrl(files[i]);
        results.push(dataUrl);
      }
      setBatchImages(results);
    } else {
      const dataUrl = await processImageToDataUrl(files[0]);
      setFrontImage(dataUrl);
    }
  };

  const handleConfirmAppraisal = () => {
    if (mode === 'batch') {
      if (batchImages.length > 0) {
        onStartBatchAppraisal(batchImages);
      }
    } else {
      if (frontImage) {
        onStartSingleAppraisal(frontImage, backImage || undefined);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                カード画像アップロード
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                JPEG, PNG, WEBP形式 / 斜め向きでも自動認識
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

        {/* Mode Switch Tabs */}
        <div className="px-5 pt-3 flex gap-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => {
              setMode('camera');
              setFrontImage(null);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border-b-2 transition-all ${
              mode === 'camera'
                ? 'border-red-600 text-red-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>カメラ撮影</span>
          </button>

          <button
            onClick={() => setMode('upload')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border-b-2 transition-all ${
              mode === 'upload'
                ? 'border-red-600 text-red-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>画像アップロード</span>
          </button>

          <button
            onClick={() => setMode('batch')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border-b-2 transition-all ${
              mode === 'batch'
                ? 'border-red-600 text-red-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>複数枚まとめて ({batchImages.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* CAMERA MODE */}
          {mode === 'camera' && !frontImage && (
            <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-black rounded-2xl overflow-hidden flex flex-col items-center justify-center">
              {cameraError ? (
                <div className="p-4 text-center">
                  <p className="text-red-400 text-xs font-semibold mb-3">{cameraError}</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs"
                  >
                    ファイルから選択
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Card alignment overlay guide frame */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
                    <div className="w-44 sm:w-56 aspect-[63/88] rounded-xl border-2 border-dashed border-red-500/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] relative flex items-center justify-center">
                      <span className="text-[10px] text-white/90 bg-red-600/90 font-bold px-2 py-0.5 rounded shadow">
                        カード枠を合わせてください
                      </span>
                    </div>
                  </div>

                  {/* Camera Controls Bar */}
                  <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-6 px-4">
                    <button
                      onClick={() =>
                        setFacingMode(facingMode === 'environment' ? 'user' : 'environment')
                      }
                      className="p-3 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80"
                      title="カメラ切り替え"
                    >
                      <RotateCw className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCapturePhoto}
                      className="w-16 h-16 rounded-full bg-white border-4 border-red-600 active:scale-95 shadow-lg flex items-center justify-center cursor-pointer"
                      title="撮影"
                    >
                      <div className="w-12 h-12 rounded-full bg-red-600"></div>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80"
                      title="ライブラリから選択"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* SINGLE CARD PREVIEW OR FILE PICKER */}
          {(mode === 'upload' || (mode === 'camera' && frontImage)) && (
            <div className="space-y-4">
              {!frontImage ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                    isDragOver
                      ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20'
                      : 'border-slate-300 dark:border-slate-700 hover:border-red-400 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 flex items-center justify-center mb-3">
                    <Upload className="w-7 h-7" />
                  </div>
                  <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                    カード表面の写真をアップロード
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                    クリックして選択、またはドラッグ＆ドロップしてください
                  </p>
                  <span className="mt-4 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm">
                    写真を選択
                  </span>
                </div>
              ) : (
                /* Card Previews (Front + Optional Back) */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Front Preview */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center">
                    <div className="flex items-center justify-between w-full mb-2 px-1">
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>カード表面 (必須)</span>
                      </span>
                      <button
                        onClick={() => setFrontImage(null)}
                        className="text-xs text-red-500 hover:text-red-600 font-semibold"
                      >
                        変更
                      </button>
                    </div>
                    <div className="relative aspect-[63/88] w-48 max-w-full rounded-xl overflow-hidden bg-black shadow-md border border-slate-200 dark:border-slate-700">
                      <img
                        src={frontImage}
                        alt="表面プレビュー"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Back Preview (Optional) */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-between">
                    <div className="flex items-center justify-between w-full mb-2 px-1">
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-amber-500" />
                        <span>カード裏面 (任意)</span>
                      </span>
                      {backImage && (
                        <button
                          onClick={() => setBackImage(null)}
                          className="text-xs text-red-500 hover:text-red-600 font-semibold"
                        >
                          削除
                        </button>
                      )}
                    </div>

                    {backImage ? (
                      <div className="relative aspect-[63/88] w-48 max-w-full rounded-xl overflow-hidden bg-black shadow-md border border-slate-200 dark:border-slate-700">
                        <img
                          src={backImage}
                          alt="裏面プレビュー"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => backFileInputRef.current?.click()}
                        className="aspect-[63/88] w-48 max-w-full rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-400 flex flex-col items-center justify-center p-4 text-center cursor-pointer bg-white/50 dark:bg-slate-800/30"
                      >
                        <Plus className="w-6 h-6 text-slate-400 mb-1" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          裏面を追加する
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">
                          白かけ等の完全査定を行えます（なしでも査定可能）
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BATCH MODE */}
          {mode === 'batch' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => batchFileInputRef.current?.click()}
                className="border-2 border-dashed border-amber-300 dark:border-amber-700/60 bg-amber-50/40 dark:bg-amber-950/20 rounded-2xl p-6 text-center cursor-pointer hover:border-amber-400 transition-all flex flex-col items-center justify-center"
              >
                <Layers className="w-8 h-8 text-amber-600 dark:text-amber-400 mb-2" />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  複数のカード画像を選択
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  コレクションやパック開封分を一度にまとめてアップロード
                </p>
                <span className="mt-3 px-3 py-1.5 rounded-lg bg-amber-500 text-white font-bold text-xs shadow-sm">
                  画像を追加する
                </span>
              </div>

              {batchImages.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      アップロード済み: {batchImages.length}枚
                    </span>
                    <button
                      onClick={() => setBatchImages([])}
                      className="text-xs text-red-500 hover:text-red-600 font-semibold"
                    >
                      すべてクリア
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-1">
                    {batchImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-[63/88] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group shadow-sm"
                      >
                        <img src={img} alt={`カード ${idx + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute top-1 left-1 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setBatchImages(batchImages.filter((_, i) => i !== idx));
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Preprocessing & Correction Tools */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-red-500" />
                <span>AI自動前処理（背景除去・傾き補正）</span>
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                有効
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              机の映り込みや多少斜めの角度でも、AIがカード四隅を検出してまっすぐに補正・明度を最適化します。
            </p>
          </div>

        </div>

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={backFileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleBackFileChange}
        />
        <input
          ref={batchFileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Modal Footer CTA */}
        <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            キャンセル
          </button>

          <button
            onClick={handleConfirmAppraisal}
            disabled={mode === 'batch' ? batchImages.length === 0 : !frontImage}
            className={`px-6 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all ${
              (mode === 'batch' && batchImages.length > 0) || (mode !== 'batch' && frontImage)
                ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-red-500/30 cursor-pointer active:scale-95'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {mode === 'batch'
                ? `${batchImages.length}枚をまとめて査定する`
                : 'AI査定を開始する'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
