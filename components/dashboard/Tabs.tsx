'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock, LayoutDashboard, TrendingUp, Users } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useState } from 'react';
import { UpgradeModal } from './UpgradeModal';

export function Tabs() {
    const pathname = usePathname();
    const { tier, loading } = useSubscription();
    const [showModal, setShowModal] = useState(false);

    const openUpgrade = () => setShowModal(true);

    return (
        <>
            <nav className="fixed bottom-0 left-0 z-40 flex h-16 w-full items-center justify-around border-t border-slate-200 bg-white px-2 shadow-sm md:relative md:h-auto md:justify-start md:space-x-8 md:border-b md:border-t-0 md:px-6">
                <Link
                    href="/dashboard"
                    className={`flex flex-col items-center border-t-2 py-2 text-[11px] font-medium transition-colors md:flex-row md:space-x-2 md:border-b-2 md:border-t-0 md:py-4 md:text-[13px] ${pathname === '/dashboard'
                        ? 'border-[#00c875] text-slate-900'
                        : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
                        }`}
                >
                    <LayoutDashboard className="mb-1 h-5 w-5 md:mb-0 md:hidden" />
                    <span>Tableau de Bord</span>
                </Link>

                {!loading && tier === 'free' ? (
                    <button
                        type="button"
                        onClick={openUpgrade}
                        className={`flex flex-col items-center whitespace-nowrap border-t-2 px-1 py-2 text-[11px] font-medium transition-all md:flex-row md:border-b-2 md:border-t-0 md:py-4 md:text-[13px] ${pathname === '/dashboard/optimisation' ? 'border-[#00c875] text-[#00c875]' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
                    >
                        <TrendingUp className="mb-1 h-5 w-5 md:mb-0 md:hidden" />
                        <span className="flex items-center">
                            Optimisation
                            <Lock className="ml-1 h-3 w-3 text-slate-400" />
                        </span>
                    </button>
                ) : (
                    <Link
                        href="/dashboard/optimisation"
                        className={`flex flex-col items-center whitespace-nowrap border-t-2 px-1 py-2 text-[11px] font-medium transition-all md:flex-row md:border-b-2 md:border-t-0 md:py-4 md:text-[13px] ${pathname === '/dashboard/optimisation' ? 'border-[#00c875] text-[#00c875]' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
                    >
                        <TrendingUp className="mb-1 h-5 w-5 md:mb-0 md:hidden" />
                        <span className="flex items-center">Optimisation</span>
                    </Link>
                )}

                {!loading && tier !== 'expert' ? (
                    <button
                        type="button"
                        onClick={openUpgrade}
                        className={`flex flex-col items-center whitespace-nowrap border-t-2 px-1 py-2 text-[11px] font-medium transition-all md:flex-row md:border-b-2 md:border-t-0 md:py-4 md:text-[13px] ${pathname === '/dashboard/expert' ? 'border-[#6366f1] text-[#6366f1]' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
                    >
                        <Users className="mb-1 h-5 w-5 md:mb-0 md:hidden" />
                        <span className="flex items-center">
                            Clients
                            <Lock className="ml-1 h-3 w-3 text-slate-400" />
                        </span>
                    </button>
                ) : (
                    <Link
                        href="/dashboard/expert"
                        className={`flex flex-col items-center whitespace-nowrap border-t-2 px-1 py-2 text-[11px] font-medium transition-all md:flex-row md:border-b-2 md:border-t-0 md:py-4 md:text-[13px] ${pathname === '/dashboard/expert' ? 'border-[#6366f1] text-[#6366f1]' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
                    >
                        <Users className="mb-1 h-5 w-5 md:mb-0 md:hidden" />
                        <span className="flex items-center">Clients</span>
                    </Link>
                )}
            </nav>
            <UpgradeModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
}
