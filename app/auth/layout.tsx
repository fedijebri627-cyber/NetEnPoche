import React from 'react';
import { Shield } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center p-4 selection:bg-brand-green/30">

            <div className="mb-8 flex items-center justify-center space-x-2">
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="bg-brand-green/10 p-2 rounded-xl group-hover:bg-brand-green/20 transition">
                        <Shield className="w-8 h-8 text-brand-green" />
                    </div>
                    <span className="text-2xl font-bold font-syne text-white tracking-tight">NetEnPoche</span>
                </Link>
            </div>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 transform transition-all">
                {children}
            </div>

            <div className="mt-8 text-slate-400 text-sm">
                &copy; {new Date().getFullYear()} NetEnPoche. Tous droits réservés.
            </div>
        </div>
    );
}
