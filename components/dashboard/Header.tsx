'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { ProfileDropdown } from './ProfileDropdown';
import { useDashboardTour } from '@/components/dashboard/tour/DashboardTourProvider';

export function Header() {
    const { tier, loading } = useSubscription();
    const { hasTour, isOpen, startCurrentTour } = useDashboardTour();

    const getTierBadge = () => {
        if (loading) return null;
        if (tier === 'expert') {
            return <span className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm">Expert</span>;
        }
        if (tier === 'pro') {
            return <span className="rounded-full bg-gradient-to-r from-[#00c875] to-teal-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm">Pro</span>;
        }
        return <span className="rounded-full bg-slate-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-300">Essai gratuit 14j</span>;
    };

    return (
        <header className="sticky top-0 z-50 flex h-[62px] items-center justify-between bg-[#0d1b35] px-6 text-white shadow-md">
            <Link href="/dashboard" className="flex items-center">
                <Image
                    src="/brand/netenpoche-logo-transparent.png"
                    alt="NetEnPoche"
                    width={180}
                    height={46}
                    priority
                    className="h-9 w-auto"
                />
            </Link>

            <div className="rounded-full border border-slate-700/50 bg-[#162848] px-4 py-1.5">
                <span className="text-sm font-medium text-slate-300">Année fiscale : <strong className="text-white">2026</strong></span>
            </div>

            <div className="flex items-center space-x-4">
                {hasTour && (
                    <button
                        type="button"
                        data-tour="tour-guide-button"
                        onClick={startCurrentTour}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${isOpen ? 'border-emerald-400 bg-emerald-500/20 text-white' : 'border-slate-700 bg-[#162848] text-slate-100 hover:border-emerald-400/60 hover:bg-[#1a3159]'}`}
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        Guide
                    </button>
                )}
                {getTierBadge()}
                <ProfileDropdown />
            </div>
        </header>
    );
}

