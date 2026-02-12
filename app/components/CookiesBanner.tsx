'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookiesBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowBanner(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('cookiesAccepted', 'false');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md bg-white/95 backdrop-blur-xl border border-accent/20 shadow-2xl z-[100] rounded-2xl p-6 animate-fade-in">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Súbory cookies
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Táto webová stránka používa súbory cookies na zlepšenie vašich skúseností a analýzu návštevnosti.
            Pokračovaním v používaní stránky súhlasíte s našimi{' '}
            <Link href="/zasady-ochrany-osobnych-udajov" className="text-accent hover:underline font-medium">
              zásadami ochrany osobných údajov
            </Link>.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={acceptCookies}
            className="flex-1 px-4 py-2.5 text-sm bg-accent text-white hover:bg-accent-dark transition-all rounded-xl font-bold shadow-lg shadow-accent/20 active:scale-95"
          >
            Súhlasiť
          </button>
          <button
            onClick={rejectCookies}
            className="px-4 py-2.5 text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all rounded-xl font-medium active:scale-95"
          >
            Odmietnuť
          </button>
        </div>
        <div className="flex gap-4 text-[10px] text-gray-400 font-medium uppercase tracking-widest border-t border-gray-100 pt-4">
          <Link href="/nastroje-ochrany-sukromia" className="hover:text-accent transition-colors">
            Nástroje
          </Link>
          <Link href="/reklamacny-poriadok" className="hover:text-accent transition-colors">
            Poriadok
          </Link>
        </div>
      </div>
    </div>
  );
}
