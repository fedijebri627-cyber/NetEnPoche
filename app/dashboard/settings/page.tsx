'use client';

import { AlertPreferencesPanel } from '@/components/dashboard/settings/AlertPreferencesPanel';
import { Settings } from 'lucide-react';
import { DashboardProvider } from '@/contexts/DashboardContext';

export default function SettingsPage() {
    return (
        <main className="flex-1 overflow-x-hidden p-6 max-w-7xl mx-auto w-full space-y-8">

            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200">
                    <Settings className="w-6 h-6 text-[#0d1b35]" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold font-syne text-[#0d1b35]">Réglages du Compte</h1>
                    <p className="text-slate-500">Gérez vos informations et vos préférences de notification.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Sidebar nav for settings (stubbed for future profiling pages) */}
                <div className="lg:col-span-3">
                    <nav className="space-y-1">
                        <span className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold bg-[#162848] text-white">
                            <Settings className="w-4 h-4" /> Alertes Emails
                        </span>
                        <span className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-500 hover:bg-white transition opacity-50 cursor-not-allowed">
                            Profil Fiscal (Bientôt)
                        </span>
                    </nav>
                </div>

                {/* Main Content Pane */}
                <div className="lg:col-span-9">
                    <DashboardProvider>
                        <AlertPreferencesPanel />
                    </DashboardProvider>
                </div>

            </div>

        </main>
    );
}

