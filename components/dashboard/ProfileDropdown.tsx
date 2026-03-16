'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

export function ProfileDropdown() {
    const [open, setOpen] = useState(false);
    const [signingOut, setSigningOut] = useState(false);
    const { fullName, user } = useSubscription();
    const ref = useRef<HTMLDivElement>(null);

    const email = user?.email || null;
    const displayName = fullName || email || '...';

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSignOut = () => {
        if (signingOut) return;

        setSigningOut(true);
        setOpen(false);
        window.location.assign('/api/auth/logout');
    };

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((value) => !value)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 transition hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-[#00c875]/50"
                aria-label="Menu utilisateur"
            >
                <UserIcon className="h-4 w-4 text-slate-300" />
            </button>

            {open && (
                <div className="absolute right-0 z-[100] mt-2 w-64 overflow-hidden rounded-xl border border-slate-700/60 bg-[#0d1b35] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="border-b border-slate-700/40 px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00c875] to-teal-400">
                                <UserIcon className="h-4 w-4 text-white" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs leading-tight text-slate-400">Connecté en tant que</p>
                                <p className="truncate text-sm font-medium text-white">{displayName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="py-1">
                        <Link
                            href="/dashboard/settings"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-700/40 hover:text-white"
                        >
                            <Settings className="h-4 w-4" />
                            Réglages du compte
                        </Link>
                    </div>

                    <div className="border-t border-slate-700/40 py-1">
                        <button
                            onClick={handleSignOut}
                            disabled={signingOut}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            <LogOut className="h-4 w-4" />
                            {signingOut ? 'Déconnexion...' : 'Se déconnecter'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
