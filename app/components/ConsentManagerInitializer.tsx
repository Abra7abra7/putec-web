"use client";

import { useEffect, useState } from 'react';

declare global {
    interface Window {
        silktideConsentManager: any;
        gtag: any;
        dataLayer: any[];
    }
}

export default function ConsentManagerInitializer() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const initSilktide = () => {
            if (typeof window !== 'undefined' && window.silktideConsentManager && window.silktideConsentManager.init) {
                console.log('Silktide: Initializing...');
                window.silktideConsentManager.init({
                    debug: true,
                    consentTypes: [
                        {
                            id: 'essential',
                            label: 'Nevyhnutné',
                            description: 'Tieto súbory sú potrebné pre základné fungovanie webu a bezpečnosť.',
                            required: true,
                            gtag: ['security_storage', 'functionality_storage']
                        },
                        {
                            id: 'analytics',
                            label: 'Analytické',
                            description: 'Pomáhajú nám pochopiť, ako návštevníci používajú náš web a zlepšovať ho.',
                            gtag: 'analytics_storage'
                        },
                        {
                            id: 'marketing',
                            label: 'Marketingové',
                            description: 'Používajú sa na sledovanie návštevníkov naprieč webovými stránkami a cielenie reklamy.',
                            gtag: ['ad_storage', 'ad_user_data', 'ad_personalization']
                        }
                    ],
                    eventName: 'stcm_consent_update',
                    text: {
                        prompt: {
                            title: 'Súkromie a súbory cookie',
                            description: '<p>Tento web používa cookies na zlepšenie používateľského zážitku a analýzu návštevnosti.</p>',
                            acceptAllButtonText: 'Prijať všetko',
                            rejectNonEssentialButtonText: 'Odmietnuť voliteľné',
                            manageSettingsButtonText: 'Spravovať nastavenia'
                        },
                        preferences: {
                            title: 'Prispôsobenie súborov cookie',
                            description: '<p>Rešpektujeme vaše právo na súkromie. Môžete sa rozhodnúť nepovoliť niektoré typy súborov cookie. Vaše voľby sa uplatnia na celom našom webe.</p>',
                            saveButtonText: 'Uložiť a zavrieť'
                        }
                    }
                });
                return true;
            }
            return false;
        };

        // Skúsime inicializovať hneď
        if (!initSilktide()) {
            // Ak skript ešte nie je načítaný, skúsime to znova v intervale
            const interval = setInterval(() => {
                if (initSilktide()) {
                    console.log('Silktide: Successfully initialized via retry.');
                    clearInterval(interval);
                }
            }, 500);

            // Po 10 sekundách to vzdáme
            setTimeout(() => clearInterval(interval), 10000);

            return () => clearInterval(interval);
        }
    }, []);

    if (!mounted) return null;

    return null;
}
