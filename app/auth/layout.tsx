import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        template: '%s | NetEnPoche',
        default: 'Accès sécurisé',
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#07162d] selection:bg-brand-green/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,200,117,0.16),transparent_32%),linear-gradient(180deg,#07162d_0%,#0d1b35_55%,#08162d_100%)]" />
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
                <div className="mb-8 flex w-full max-w-md flex-col items-center md:mb-10">
                    <Link href="/" className="group flex flex-col items-center rounded-[28px] border border-white/10 bg-white/5 px-8 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur transition-transform hover:scale-[1.02]">
                        <Image
                            src="/brand/netenpoche-icon-1024.png"
                            alt="NetEnPoche"
                            width={80}
                            height={80}
                            className="mb-4 rounded-2xl shadow-2xl shadow-green-500/20"
                            priority
                        />
                        <Image
                            src="/brand/netenpoche-logo-transparent.png"
                            alt="NetEnPoche"
                            width={200}
                            height={52}
                            className="h-10 w-auto"
                            priority
                        />
                    </Link>
                </div>

                <div className="w-full max-w-md rounded-3xl bg-white/98 p-8 shadow-2xl ring-1 ring-slate-200/70 backdrop-blur">
                    {children}
                </div>

                <div className="mt-8 text-center text-sm text-slate-400">
                    &copy; {new Date().getFullYear()} NetEnPoche. Tous droits réservés.
                </div>
            </div>
        </div>
    );
}
