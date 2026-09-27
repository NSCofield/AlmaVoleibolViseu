import React, { useState } from 'react';
import { usePWAInstall } from '../lib/usePWAInstall';
import { Download, X, Share2, PlusSquare } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // If already running as an installed PWA or manually dismissed, hide the banner
  if (isInstalled || dismissed) {
    return null;
  }

  const Banner = ({ children, onInstall }: { children: React.ReactNode, onInstall: () => void }) => (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:w-80 z-50 bg-neutral-900 border border-primary/30 rounded-2xl shadow-2xl p-4 animate-fade-in-up backdrop-blur-lg">
      <button 
        onClick={() => setDismissed(true)} 
        className="absolute top-2 right-2 text-neutral-500 hover:text-white transition"
      >
        <X size={16} />
      </button>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-black font-black italic shadow-lg">
          ALMA
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white">Instalar ALMA Viseu</h4>
          <p className="text-[10px] text-neutral-400">Acede mais rápido às notícias e jogos.</p>
        </div>
      </div>
      <div className="mt-4">
        {children}
      </div>
    </div>
  );

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <Banner onInstall={install}>
        <button
          onClick={install}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-orange-600 transition transform active:scale-95"
        >
          <Download size={14} />
          Instalar Aplicação
        </button>
      </Banner>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <Banner onInstall={() => setShowIOSGuide(true)}>
          <button
            onClick={() => setShowIOSGuide(true)}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-black shadow-lg hover:bg-neutral-200 transition transform active:scale-95"
          >
            <PlusSquare size={14} />
            Como Instalar no iPhone
          </button>
        </Banner>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowIOSGuide(false)}>
            <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 p-8 shadow-2xl animate-fade-in text-center" onClick={e => e.stopPropagation()}>
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-black font-black italic mx-auto mb-6 shadow-xl text-xl">
                ALMA
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Instalar no iPhone / iPad</h3>
              <div className="space-y-6 text-left mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-neutral-800 p-2 rounded-lg text-primary"><Share2 size={20} /></div>
                  <p className="text-sm text-neutral-300">1. Toca no botão de <strong>Partilhar</strong> na barra do Safari.</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-neutral-800 p-2 rounded-lg text-primary"><PlusSquare size={20} /></div>
                  <p className="text-sm text-neutral-300">2. Desliza para baixo e toca em <strong>Ecrã Principal</strong>.</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-neutral-800 py-3 text-sm font-bold text-white hover:bg-neutral-700 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
