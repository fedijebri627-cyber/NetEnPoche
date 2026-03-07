'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export function OfflineBanner() {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        // Initial check
        setIsOffline(!navigator.onLine);

        const handleOffline = () => setIsOffline(true);
        const handleOnline = () => setIsOffline(false);

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="bg-amber-500 text-white font-medium text-sm px-4 py-3 flex items-center justify-center gap-3 w-full z-[100] shadow-md relative animate-in slide-in-from-top-4">
            <AlertTriangle size={18} />
            Vous êtes hors ligne — les modifications seront sauvegardées à la reconnexion.
        </div>
    );
}
