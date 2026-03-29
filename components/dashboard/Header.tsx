'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { ProfileDropdown } from './ProfileDropdown';
import { useDashboardTour } from '@/components/dashboard/tour/DashboardTourProvider';
import { DeadlinePill } from './DeadlinePill';

export function Header() {
    const { tier, loading } = useSubscription();
    const { hasTour, isOpen, startCurrentTour } = useDashboardTour();

    const getTierBadge = () => {
        if (loading) return null;
        if (tier === 'expert') {
            return <span className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.04em] text-white shadow-sm">Expert</span>;
        }
        if (tier === 'pro') {
            return <span className="rounded-full bg-gradient-to-r from-[#00c875] to-teal-400 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.04em] text-white shadow-sm">Pro</span>;
        }
        return <span className="rounded-full bg-slate-600 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.04em] text-slate-300">Essai gratuit 14j</span>;
    };

    const tierBadge = getTierBadge();
    const guideButton = hasTour ? (
        <button
            type="button"
            data-tour="tour-guide-button"
            onClick={startCurrentTour}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.04em] transition md:px-4 md:py-2 md:text-[11px] ${isOpen ? 'border-emerald-400 bg-emerald-500/20 text-white' : 'border-slate-700 bg-[#162848] text-slate-100 hover:border-emerald-400/60 hover:bg-[#1a3159]'}`}
        >
            <Sparkles className="h-3.5 w-3.5" />
            Guide
        </button>
    ) : null;

    return (
        <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0d1b35] text-white shadow-md">
            <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-3 py-2 md:h-[62px] md:flex-row md:items-center md:justify-between md:px-6 md:py-0">
                <div className="flex items-center justify-between gap-3">
                    <Link href="/dashboard" className="flex min-w-0 items-center">
                        <Image
                            src="/brand/netenpoche-logo-transparent.png"
                            alt="NetEnPoche"
                            width={180}
                            height={46}
                            priority
                            className="h-8 w-auto md:h-9"
                        />
                    </Link>

                    <div className="flex items-center gap-2 md:hidden">
                        {guideButton}
                        {tierBadge}
                        <ProfileDropdown />
                    </div>
                </div>

                <div className="flex items-center gap-2 md:hidden">
                    <div className="shrink-0 rounded-full border border-slate-700/50 bg-[#162848] px-3 py-1.5">
                        <span className="text-[12px] font-medium text-slate-300">
                            Année <strong className="font-medium text-white">2026</strong>
                        </span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <DeadlinePill />
                    </div>
                </div>

                <div className="hidden rounded-full border border-slate-700/50 bg-[#162848] px-4 py-1.5 md:block">
                    <span className="text-[12px] font-medium text-slate-300">
                        Année fiscale : <strong className="font-medium text-white">2026</strong>
                    </span>
                </div>

                <div className="hidden items-center space-x-4 md:flex">
                    <DeadlinePill />
                    {guideButton}
                    {tierBadge}
                    <ProfileDropdown />
                </div>
            </div>
        </header>
    );
}
