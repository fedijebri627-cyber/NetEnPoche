'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Settings, LogOut, ChevronDown } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';

export function ProfileDropdown() {
    const [open, setOpen] = useState(false);
    const { fullName, user, loading } = useSubscription();
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const email = user?.email || null;
    const displayName = fullName || email || '...';

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSignOut = async () => {
        const supabase = createBrowserClient();
        await supabase.auth.signOut();
        router.push('/auth/login');
    };

    return (
        <div ref={ref} className="relative">
            {/* Trigger */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-slate-600 transition focus:outline-none focus:ring-2 focus:ring-[#00c875]/50"
                aria-label="Menu utilisateur"
            >
                <UserIcon className="w-4 h-4 text-slate-300" />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0d1b35] border border-slate-700/60 rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-slate-700/40">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00c875] to-teal-400 flex items-center justify-center flex-shrink-0">
                                <UserIcon className="w-4 h-4 text-white" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-slate-400 leading-tight">Connecté en tant que</p>
                                <p className="text-sm font-medium text-white truncate">{displayName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                        <Link
                            href="/dashboard/settings"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/40 hover:text-white transition"
                        >
                            <Settings className="w-4 h-4" />
                            Réglages du Compte
                        </Link>
                    </div>

                    {/* Sign Out */}
                    <div className="border-t border-slate-700/40 py-1">
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
                        >
                            <LogOut className="w-4 h-4" />
                            Se déconnecter
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
