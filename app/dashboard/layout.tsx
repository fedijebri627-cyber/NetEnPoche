import { Header } from '@/components/dashboard/Header';
import { Tabs } from '@/components/dashboard/Tabs';
import { OfflineBanner } from '@/components/dashboard/OfflineBanner';
import { DashboardTourProvider } from '@/components/dashboard/tour/DashboardTourProvider';
import { Toaster } from 'sonner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        template: '%s | NetEnPoche',
        default: 'Tableau de bord 2026',
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <Toaster position="top-right" duration={5000} />
            <DashboardTourProvider>
                <OfflineBanner />
                <Header />
                <Tabs />
                <main className="flex-1 overflow-x-hidden">
                    {children}
                </main>
            </DashboardTourProvider>
        </div>
    );
}
