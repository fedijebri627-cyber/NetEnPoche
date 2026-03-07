'use client';

import { useDashboard } from '@/contexts/DashboardContext';
import { getUrssafRate, ActivityType } from '@/lib/calculations';
import { Settings2, Percent } from 'lucide-react';
import { TAX_RATES_2026 } from '@/config/tax-rates-2026';

export function ActivityConfigPanel() {
    const { config, updateConfig, loading } = useDashboard();

    if (loading) return <div className="animate-pulse h-24 bg-slate-100 rounded-2xl mb-6"></div>;

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateConfig({ activity_type: e.target.value as ActivityType });
    };

    const currentUrssafRate = getUrssafRate(config.activity_type, config.acre_enabled) * 100;

    let currentIrVLRate = 0;
    if (config.versement_liberatoire) {
        if (config.activity_type === 'services_bic') currentIrVLRate = TAX_RATES_2026.VERSEMENT_LIBERATOIRE.SERVICES_BIC * 100;
        else if (config.activity_type === 'vente') currentIrVLRate = TAX_RATES_2026.VERSEMENT_LIBERATOIRE.VENTE * 100;
        else currentIrVLRate = TAX_RATES_2026.VERSEMENT_LIBERATOIRE.SERVICES_BNC * 100;
    }

    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mb-6">
            <div className="flex items-center space-x-2 mb-4 border-b border-slate-100 pb-4">
                <div className="bg-slate-100 p-2 rounded-lg"><Settings2 className="w-5 h-5 text-slate-600" /></div>
                <h2 className="text-lg font-bold font-syne text-[#0d1b35]">Configuration d'Activité</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Activity Type Dropdown */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Type d'activité principal</label>
                    <select
                        value={config.activity_type}
                        onChange={handleTypeChange}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00c875]/20 focus:border-[#00c875] transition"
                    >
                        <option value="services_bnc">Prestations de services (BNC)</option>
                        <option value="services_bic">Prestations de services (BIC)</option>
                        <option value="liberal">Activité Libérale (BNC)</option>
                        <option value="vente">Achat / Revente (BIC)</option>
                    </select>
                </div>

                {/* Toggles */}
                <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row sm:items-end gap-4">
                    <label className="flex items-center space-x-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition flex-1">
                        <input
                            type="checkbox"
                            checked={config.acre_enabled}
                            onChange={(e) => updateConfig({ acre_enabled: e.target.checked })}
                            className="w-4 h-4 text-[#00c875] rounded focus:ring-[#00c875]"
                        />
                        <span className="text-sm font-medium text-slate-700">Bénéficiaire ACRE (1ère année)</span>
                    </label>

                    <label className="flex items-center space-x-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition flex-1">
                        <input
                            type="checkbox"
                            checked={config.versement_liberatoire}
                            onChange={(e) => updateConfig({ versement_liberatoire: e.target.checked })}
                            className="w-4 h-4 text-[#00c875] rounded focus:ring-[#00c875]"
                        />
                        <span className="text-sm font-medium text-slate-700">Versement Libératoire (IR)</span>
                    </label>
                </div>
            </div>

            {/* Badges Bar */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                <div className="flex items-center space-x-1.5 bg-[#e84040]/10 text-red-800 px-3 py-1 rounded-full text-xs font-bold border border-[#e84040]/20">
                    <Percent className="w-3.5 h-3.5" />
                    <span>URSSAF: {currentUrssafRate}%</span>
                </div>
                {config.versement_liberatoire && (
                    <div className="flex items-center space-x-1.5 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
                        <Percent className="w-3.5 h-3.5" />
                        <span>IR (Libératoire): {currentIrVLRate}%</span>
                    </div>
                )}
            </div>
        </div>
    );
}
