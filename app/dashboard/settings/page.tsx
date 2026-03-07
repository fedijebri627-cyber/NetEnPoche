'use client';

import { useState } from 'react';
import { AlertPreferencesPanel } from '@/components/dashboard/settings/AlertPreferencesPanel';
import { BusinessProfilePanel } from '@/components/dashboard/settings/BusinessProfilePanel';
import { Settings, Building2 } from 'lucide-react';
import { DashboardProvider } from '@/contexts/DashboardContext';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'alerts' | 'profile'>('profile');

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

                {/* Sidebar nav */}
                <div className="lg:col-span-3">
                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'profile' ? 'bg-[#162848] text-white' : 'text-slate-500 hover:bg-white'}`}
                        >
                            <Building2 className="w-4 h-4" /> Profil Entreprise
                        </button>
                        <button
                            onClick={() => setActiveTab('alerts')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'alerts' ? 'bg-[#162848] text-white' : 'text-slate-500 hover:bg-white'}`}
                        >
                            <Settings className="w-4 h-4" /> Alertes Emails
                        </button>
                    </nav>
                </div>

                {/* Main Content Pane */}
                <div className="lg:col-span-9">
                    {activeTab === 'profile' && <BusinessProfilePanel />}
                    {activeTab === 'alerts' && (
                        <DashboardProvider>
                            <AlertPreferencesPanel />
                        </DashboardProvider>
                    )}
                </div>

            </div>

        </main>
    );
}
