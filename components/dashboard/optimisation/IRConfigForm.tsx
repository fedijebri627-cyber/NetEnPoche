'use client';

import { useDashboard } from '@/contexts/DashboardContext';
import { Settings2 } from 'lucide-react';

export function IRConfigForm() {
    const { config, updateConfig, loading } = useDashboard();

    if (loading) return <div className="h-64 animate-pulse rounded-[12px] bg-slate-100" />;

    return (
        <div className="rounded-[12px] border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center space-x-2 border-b border-slate-100 pb-3">
                <div className="rounded-lg bg-indigo-50 p-2">
                    <Settings2 className="h-5 w-5 text-indigo-500" />
                </div>
                <h2 className="text-[18px] font-medium text-slate-900">Votre Profil Fiscal</h2>
            </div>

            <div className="space-y-5">
                <div>
                    <label className="mb-3 block text-[12px] font-medium text-slate-700">Situation Familiale</label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        {['celibataire', 'marie', 'pacse'].map((status) => (
                            <label
                                key={status}
                                className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl border p-3 transition ${config.situation_familiale === status ? 'border-indigo-200 bg-indigo-50 font-medium text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                            >
                                <input
                                    type="radio"
                                    name="situation_familiale"
                                    value={status}
                                    checked={config.situation_familiale === status}
                                    onChange={() => updateConfig({ situation_familiale: status as never })}
                                    className="sr-only"
                                />
                                <span className="capitalize">{status === 'marie' ? 'Marie(e)' : status === 'pacse' ? 'Pacse(e)' : 'Celibataire'}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-[12px] font-medium text-slate-700">Nombre de parts fiscales</label>
                        <select
                            value={config.parts_fiscales}
                            onChange={(e) => updateConfig({ parts_fiscales: parseFloat(e.target.value) })}
                            className="w-full rounded-[8px] border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-medium text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                            <option value="1">1 part (Solo)</option>
                            <option value="1.5">1.5 parts (1 enfant)</option>
                            <option value="2">2 parts (En couple ou 2 enfants)</option>
                            <option value="2.5">2.5 parts</option>
                            <option value="3">3 parts</option>
                            <option value="3.5">3.5 parts</option>
                            <option value="4">4+ parts</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-[12px] font-medium text-slate-700">Autres revenus du foyer net imposable</label>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                step="1000"
                                value={config.autres_revenus || ''}
                                placeholder="0"
                                onChange={(e) => updateConfig({ autres_revenus: parseFloat(e.target.value) || 0 })}
                                className="w-full rounded-[8px] border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-medium text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-slate-400">EUR / an</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                    <label className="flex cursor-pointer items-center space-x-3 rounded-[10px] border border-indigo-100 bg-white p-4 transition hover:bg-indigo-50/50">
                        <input
                            type="checkbox"
                            checked={config.versement_liberatoire}
                            onChange={(e) => updateConfig({ versement_liberatoire: e.target.checked })}
                            className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div>
                            <span className="block text-[14px] font-medium text-slate-900">Option Versement Liberatoire (IR)</span>
                            <span className="mt-0.5 block text-[12px] text-slate-500">Payez l'impôt en pourcentage fixe chaque mois avec l'URSSAF.</span>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
}
