import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        template: '%s - NetEnPoche',
        default: 'Authentification',
    },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center p-4 selection:bg-brand-green/30">
            <div className="mb-10 flex flex-col items-center">
                <Link href="/" className="flex flex-col items-center group transition-transform hover:scale-105">
                    <Image
                        src="/brand/netenpoche-icon-1024.png"
                        alt="NetEnPoche"
                        width={80}
                        height={80}
                        className="rounded-2xl shadow-2xl shadow-green-500/20 mb-4"
                        priority
                    />
                    <Image
                        src="/brand/netenpoche-logo-horizontal.png"
                        alt="NetEnPoche"
                        width={200}
                        height={52}
                        className="h-10 w-auto"
                        priority
                    />
                </Link>
            </div>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 transform transition-all">
                {children}
            </div>

            <div className="mt-8 text-slate-400 text-sm">
                &copy; {new Date().getFullYear()} NetEnPoche. Tous droits reserves.
            </div>
        </div>
    );
}

