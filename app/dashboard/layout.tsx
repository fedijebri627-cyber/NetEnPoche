import { Header } from '@/components/dashboard/Header';
import { Tabs } from '@/components/dashboard/Tabs';
import { OfflineBanner } from '@/components/dashboard/OfflineBanner';
import { Toaster } from 'sonner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        template: '%s — NetEnPoche',
        default: 'Tableau de Bord 2026',
    },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Toaster position="top-right" duration={5000} />
            <OfflineBanner />
            <Header />
            <Tabs />
            <main className="flex-1 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
