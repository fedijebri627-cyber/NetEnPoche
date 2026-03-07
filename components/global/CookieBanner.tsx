/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const isConsentGiven = localStorage.getItem('nep_cookie_consent');
        if (!isConsentGiven) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('nep_cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 md:bottom-6 left-0 right-0 z-[100] md:max-w-xl md:mx-auto bg-slate-900 text-white p-4 md:rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-8">
            <p className="text-sm text-slate-300 leading-relaxed text-center sm:text-left">
                Ce site utilise uniquement des cookies fonctionnels essentiels.
                <span className="font-bold text-white"> Aucun cookie publicitaire.</span>
            </p>
            <button
                onClick={handleAccept}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors whitespace-nowrap"
            >
                Compris
            </button>
        </div>
    );
}
