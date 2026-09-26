/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HeroHome } from './components/HeroHome';
import { UploadModal } from './components/UploadModal';
import { AnalysisScreen } from './components/AnalysisScreen';
import { ResultScreen } from './components/ResultScreen';
import { BatchResultScreen } from './components/BatchResultScreen';
import { SearchScreen } from './components/SearchScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { CollectionScreen } from './components/CollectionScreen';
import { AccountScreen } from './components/AccountScreen';
import { AdminScreen } from './components/AdminScreen';
import { ErrorNotice } from './components/ErrorNotice';
import { GeminiKeyModal } from './components/GeminiKeyModal';

import {
  AppraisalRecord,
  CardRecord,
  PriceHistoryPoint,
  User,
} from './types/card';
import {
  appraiseCardImage,
  appraiseBatchImages,
  fetchAppraisals,
  fetchFavorites,
  toggleFavorite,
  fetchHealth,
} from './lib/api';
import { getStoredApiKey } from './lib/geminiKey';
import { SampleCard } from './lib/sampleCards';

export default function App() {
  // Navigation & Screen View State
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [analysisState, setAnalysisState] = useState<
    'idle' | 'analyzing' | 'result' | 'batch_result' | 'error'
  >('idle');

  // Active Appraisal Session Data
  const [activeAppraisal, setActiveAppraisal] = useState<AppraisalRecord | null>(null);
  const [batchAppraisals, setBatchAppraisals] = useState<AppraisalRecord[]>([]);
  const [batchGrandTotal, setBatchGrandTotal] = useState<number>(0);
  const [priceHistory, setPriceHistory] = useState<
    Record<string, PriceHistoryPoint[]> | undefined
  >();
  const [analyzingImage, setAnalyzingImage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<'camera' | 'upload' | 'batch'>('upload');

  // Gemini API Configuration Modal State
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
  const [geminiConfigured, setGeminiConfigured] = useState(false);

  // App Theme & User Auth
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [user, setUser] = useState<User | null>({
    id: 'usr_guest',
    name: 'ゲストトレーナー',
    email: 'guest@cardscanner.jp',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    role: 'user',
    createdAt: new Date().toISOString(),
  });

  // Favorites & Appraisals Cache
  const [favorites, setFavorites] = useState<CardRecord[]>([]);
  const [appraisalsList, setAppraisalsList] = useState<AppraisalRecord[]>([]);

  // Dark mode effect on HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Check Gemini Status
  const checkGeminiStatus = async () => {
    const localKey = getStoredApiKey();
    if (localKey) {
      setGeminiConfigured(true);
      return;
    }
    try {
      const health = await fetchHealth();
      setGeminiConfigured(health.geminiConfigured);
    } catch {
      setGeminiConfigured(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadAppraisals();
    loadFavorites();
    checkGeminiStatus();
  }, []);

  const loadAppraisals = async () => {
    try {
      const data = await fetchAppraisals();
      setAppraisalsList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadFavorites = async () => {
    try {
      const data = await fetchFavorites();
      setFavorites(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenScan = (mode: 'camera' | 'upload' | 'batch' = 'upload') => {
    setUploadMode(mode);
    setIsUploadOpen(true);
  };

  // Start Single Card Appraisal Flow
  const handleStartSingleAppraisal = async (frontImage: string, backImage?: string) => {
    setIsUploadOpen(false);
    setAnalyzingImage(frontImage);
    setAnalysisState('analyzing');
    setErrorMessage('');

    try {
      const result = await appraiseCardImage(frontImage, 'image/jpeg', backImage);
      // Wait for the 8-step animation to naturally finish
      setActiveAppraisal(result.appraisal);
      setPriceHistory(result.priceHistory);
      loadAppraisals();
    } catch (err: any) {
      console.error(err);
      const msg = err.message || 'カードを認識できませんでした。カード全体が写っている、明るくピントの合った写真をアップロードしてください。';
      setErrorMessage(msg);
      setAnalysisState('error');

      // If user needs to set API key, open modal to assist them
      if (err?.needsApiKey) {
        setIsGeminiModalOpen(true);
      }
    }
  };

  // Start Batch Card Appraisal Flow
  const handleStartBatchAppraisal = async (images: string[]) => {
    setIsUploadOpen(false);
    setAnalyzingImage(images[0] || '');
    setAnalysisState('analyzing');
    setErrorMessage('');

    try {
      const payload = images.map((img) => ({
        imageBase64: img,
        mimeType: 'image/jpeg',
      }));
      const result = await appraiseBatchImages(payload);
      setBatchAppraisals(result.appraisals);
      setBatchGrandTotal(result.grandTotal);
      loadAppraisals();
    } catch (err: any) {
      console.error(err);
      setErrorMessage('一括査定の処理中にエラーが発生しました。もう一度お試しください。');
      setAnalysisState('error');
    }
  };

  // Instant Sample Testing
  const handleSelectSample = (sample: SampleCard) => {
    handleStartSingleAppraisal(sample.dataUrl);
  };

  // Animation Step Finished Callback
  const handleAnalysisCompleted = () => {
    if (batchAppraisals.length > 0) {
      setAnalysisState('batch_result');
    } else if (activeAppraisal) {
      setAnalysisState('result');
    } else if (!errorMessage) {
      setAnalysisState('result');
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = async (cardId?: string) => {
    if (!cardId) return;
    const isFav = favorites.some((f) => f.id === cardId);
    try {
      await toggleFavorite(cardId, isFav);
      loadFavorites();
    } catch (err) {
      console.error(err);
    }
  };

  // Reset to Home
  const handleResetAppraisal = () => {
    setAnalysisState('idle');
    setActiveAppraisal(null);
    setBatchAppraisals([]);
    setCurrentTab('home');
  };

  // Open past appraisal from history
  const handleSelectPastAppraisal = (item: AppraisalRecord) => {
    setActiveAppraisal(item);
    setPriceHistory(undefined);
    setAnalysisState('result');
    setCurrentTab('home');
  };

  // Select card from batch to inspect details
  const handleSelectBatchCard = (item: AppraisalRecord) => {
    setActiveAppraisal(item);
    setAnalysisState('result');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Global App Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'home') {
            setAnalysisState('idle');
          }
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        onOpenAuth={() => setCurrentTab('account')}
        onOpenScan={() => handleOpenScan('upload')}
        geminiConfigured={geminiConfigured}
        onOpenGeminiModal={() => setIsGeminiModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full">
        {analysisState === 'analyzing' ? (
          <AnalysisScreen
            cardImageUrl={analyzingImage}
            onAnalysisDone={handleAnalysisCompleted}
          />
        ) : analysisState === 'error' ? (
          <ErrorNotice
            errorMessage={errorMessage}
            onRetry={() => handleStartSingleAppraisal(analyzingImage)}
            onOpenUpload={() => handleOpenScan('upload')}
            onOpenGeminiModal={() => setIsGeminiModalOpen(true)}
          />
        ) : analysisState === 'result' && activeAppraisal ? (
          <ResultScreen
            appraisal={activeAppraisal}
            priceHistory={priceHistory}
            isFavorite={
              activeAppraisal.cardId
                ? favorites.some((f) => f.id === activeAppraisal.cardId)
                : false
            }
            onToggleFavorite={handleToggleFavorite}
            onReAppraise={() => handleOpenScan('upload')}
            onNavigateCollection={() => {
              setCurrentTab('collection');
              setAnalysisState('idle');
            }}
          />
        ) : analysisState === 'batch_result' && batchAppraisals.length > 0 ? (
          <BatchResultScreen
            appraisals={batchAppraisals}
            grandTotal={batchGrandTotal}
            onSelectCard={handleSelectBatchCard}
            onReAppraise={() => handleOpenScan('batch')}
            onNavigateCollection={() => {
              setCurrentTab('collection');
              setAnalysisState('idle');
            }}
          />
        ) : currentTab === 'collection' ? (
          <CollectionScreen
            onOpenScan={() => handleOpenScan('upload')}
            onSelectCardDetail={(name, num) => {
              setCurrentTab('search');
            }}
          />
        ) : currentTab === 'search' ? (
          <SearchScreen
            onSelectCardForAppraisal={(c) => handleStartSingleAppraisal(c.imageUrl)}
            favorites={favorites.map((f) => f.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : currentTab === 'history' ? (
          <HistoryScreen
            appraisals={appraisalsList}
            onSelectAppraisal={handleSelectPastAppraisal}
            onRefresh={loadAppraisals}
            onOpenScan={() => handleOpenScan('upload')}
          />
        ) : currentTab === 'account' ? (
          <AccountScreen
            user={user}
            setUser={setUser}
            favorites={favorites}
            onSelectFavoriteCard={(c) => handleStartSingleAppraisal(c.imageUrl)}
            onRemoveFavorite={(id) => handleToggleFavorite(id)}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onNavigateTab={setCurrentTab}
            geminiConfigured={geminiConfigured}
            onOpenGeminiModal={() => setIsGeminiModalOpen(true)}
          />
        ) : currentTab === 'admin' ? (
          <AdminScreen onBack={() => setCurrentTab('home')} />
        ) : (
          <HeroHome
            onOpenScan={handleOpenScan}
            onSelectSample={handleSelectSample}
            onNavigateSearch={() => setCurrentTab('search')}
            onNavigateCollection={() => setCurrentTab('collection')}
            geminiConfigured={geminiConfigured}
            onOpenGeminiModal={() => setIsGeminiModalOpen(true)}
          />
        )}
      </main>

      {/* Upload & Camera Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        initialMode={uploadMode}
        onStartSingleAppraisal={handleStartSingleAppraisal}
        onStartBatchAppraisal={handleStartBatchAppraisal}
        geminiConfigured={geminiConfigured}
        onOpenGeminiModal={() => setIsGeminiModalOpen(true)}
      />

      {/* Gemini API Key Configuration Modal */}
      <GeminiKeyModal
        isOpen={isGeminiModalOpen}
        onClose={() => setIsGeminiModalOpen(false)}
        onKeyUpdated={() => {
          checkGeminiStatus();
        }}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setAnalysisState('idle');
        }}
        onOpenScan={() => handleOpenScan('camera')}
      />

    </div>
  );
}
