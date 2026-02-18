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

        if (typeof window !== 'undefined' && window.silktideConsentManager) {
            window.silktideConsentManager.init({
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
                    modal: {
                        title: 'Nastavenia súkromia',
                        description: '<p>Vyberte, ktoré kategórie súborov cookie chcete povoliť.</p>',
                        saveSettingsButtonText: 'Uložiť nastavenia'
                    }
                }
            });
        }
    }, []);

    if (!mounted) return null;

    return null;
}
