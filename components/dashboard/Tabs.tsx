'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock, LayoutDashboard, TrendingUp, Users } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

export function Tabs() {
    const pathname = usePathname();
    const { tier } = useSubscription();

    const tabs = [
        { name: 'Tableau de Bord', href: '/dashboard', badge: null },
        { name: 'Optimisation & Bilan', href: '/dashboard/optimisation', badge: 'PRO' },
        { name: 'Expert', href: '/dashboard/expert', badge: 'EXPERT' },
    ];

    return (
        <nav className="flex md:space-x-8 px-2 md:px-6 md:border-b border-t md:border-t-0 border-slate-200 bg-white shadow-sm z-40 fixed md:relative bottom-0 left-0 w-full h-16 md:h-auto items-center justify-around md:justify-start">
            {/* Tableau de Bord */}
            <Link
                href="/dashboard"
                className={`flex flex-col md:flex-row items-center md:space-x-2 py-2 md:py-4 border-t-2 md:border-t-0 md:border-b-2 font-medium text-xs md:text-sm transition-colors ${pathname === '/dashboard'
                    ? 'border-[#00c875] text-[#0d1b35] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                    }`}
            >
                <LayoutDashboard className="w-5 h-5 mb-1 md:mb-0 md:hidden" />
                <span>Tableau de Bord</span>
            </Link>

            {/* Optimisation & BilanFiscal */}
            <Link
                href="/dashboard/optimisation"
                className={`flex flex-col md:flex-row items-center whitespace-nowrap border-t-2 md:border-t-0 md:border-b-2 py-2 md:py-4 px-1 text-xs md:text-sm font-bold transition-all ${pathname === '/dashboard/optimisation' ? 'border-[#00c875] text-[#00c875]' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
            >
                <TrendingUp className="w-5 h-5 mb-1 md:mb-0 md:hidden" />
                <span className="flex items-center">
                    Optimisation
                    {tier === 'free' && <Lock className="w-3 h-3 ml-1 text-slate-400" />}
                </span>
            </Link>

            {/* Clients & Factures */}
            <Link
                href="/dashboard/expert"
                className={`flex flex-col md:flex-row items-center whitespace-nowrap border-t-2 md:border-t-0 md:border-b-2 py-2 md:py-4 px-1 text-xs md:text-sm font-bold transition-all ${pathname === '/dashboard/expert' ? 'border-[#6366f1] text-[#6366f1]' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
            >
                <Users className="w-5 h-5 mb-1 md:mb-0 md:hidden" />
                <span className="flex items-center">
                    Clients
                    {tier !== 'expert' && <Lock className="w-3 h-3 ml-1 text-slate-400" />}
                </span>
            </Link>
        </nav>
    );
}
