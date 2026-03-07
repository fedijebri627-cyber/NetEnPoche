'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type AlertType = 'info' | 'warning' | 'danger';

export interface AlertBannerProps {
    id: string; // Used for localStorage dismissal
    type: AlertType;
    message: string;
    ctaLabel?: string;
    ctaAction?: () => void;
    dismissable?: boolean;
}

export function AlertBanner({ id, type, message, ctaLabel, ctaAction, dismissable = true }: AlertBannerProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem(`alert_dismissed_${id}`);
        if (!dismissed) {
            setIsVisible(true);
        }
    }, [id]);

    if (!isVisible) return null;

    const handleDismiss = () => {
        localStorage.setItem(`alert_dismissed_${id}`, Date.now().toString());
        setIsVisible(false);
    };

    const styles = {
        info: 'bg-blue-50 text-blue-800 border-blue-200',
        warning: 'bg-[#f5a623]/10 text-amber-800 border-[#f5a623]/20',
        danger: 'bg-[#e84040]/10 text-red-800 border-[#e84040]/20',
    };

    const icons = {
        info: <Info className="w-5 h-5 text-blue-600" />,
        warning: <AlertTriangle className="w-5 h-5 text-[#f5a623]" />,
        danger: <AlertCircle className="w-5 h-5 text-[#e84040]" />
    };

    return (
        <div className={`flex items-center justify-between p-4 border-l-4 rounded-r-lg mb-6 ${styles[type]}`}>
            <div className="flex items-center space-x-3">
                {icons[type]}
                <span className="text-sm font-medium">{message}</span>
                {ctaLabel && ctaAction && (
                    <button onClick={ctaAction} className="ml-4 font-bold underline hover:no-underline text-sm">
                        {ctaLabel}
                    </button>
                )}
            </div>
            {dismissable && (
                <button onClick={handleDismiss} className="text-slate-500 hover:text-slate-800 transition p-1">
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
