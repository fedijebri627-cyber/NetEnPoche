'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { ProfileDropdown } from './ProfileDropdown';

export function Header() {
    const { tier, loading } = useSubscription();

    const getTierBadge = () => {
        if (loading) return null;
        if (tier === 'expert') {
            return <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-bold uppercase tracking-wide rounded-full shadow-sm">Expert</span>;
        }
        if (tier === 'pro') {
            return <span className="px-3 py-1 bg-gradient-to-r from-[#00c875] to-teal-400 text-white text-xs font-bold uppercase tracking-wide rounded-full shadow-sm">Pro</span>;
        }
        return <span className="px-3 py-1 bg-slate-600 text-slate-300 text-xs font-bold uppercase tracking-wide rounded-full">Essai Libre</span>;
    };

    return (
        <header className="sticky top-0 z-50 h-[62px] bg-[#0d1b35] text-white flex items-center justify-between px-6 shadow-md">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="bg-[#00c875]/20 p-1.5 rounded-lg">
                    <Shield className="w-5 h-5 text-[#00c875]" />
                </div>
                <span className="font-syne font-bold text-lg tracking-tight">NetEnPoche</span>
            </Link>

            {/* Center Year Selector */}
            <div className="flex items-center bg-[#162848] px-4 py-1.5 rounded-full border border-slate-700/50">
                <span className="text-sm font-medium text-slate-300">Année fiscale : <strong className="text-white">2026</strong></span>
            </div>

            {/* Right side Profile & Badge */}
            <div className="flex items-center space-x-4">
                {getTierBadge()}
                <ProfileDropdown />
            </div>
        </header>
    );
}
