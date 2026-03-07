'use client';

import { useDashboard } from '@/contexts/DashboardContext';
import { Settings2 } from 'lucide-react';

export function IRConfigForm() {
    const { config, updateConfig, loading } = useDashboard();

    if (loading) return <div className="animate-pulse h-64 bg-slate-100 rounded-3xl" />;

    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-4">
                <div className="bg-indigo-50 p-2 rounded-lg">
                    <Settings2 className="w-5 h-5 text-indigo-500" />
                </div>
                <h2 className="text-xl font-bold font-syne text-[#0d1b35]">Votre Profil Fiscal</h2>
            </div>

            <div className="space-y-6">
                {/* Situation Familiale Radio */}
                <div>
                    <label className="text-sm font-bold text-slate-700 block mb-3">Situation Familiale</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {['celibataire', 'marie', 'pacse'].map((status) => (
                            <label
                                key={status}
                                className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition ${config.situation_familiale === status ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                <input
                                    type="radio"
                                    name="situation_familiale"
                                    value={status}
                                    checked={config.situation_familiale === status}
                                    onChange={() => updateConfig({ situation_familiale: status as any })}
                                    className="sr-only"
                                />
                                <span className="capitalize">{status === 'marie' ? 'Marié(e)' : status === 'pacse' ? 'Pacsé(e)' : 'Célibataire'}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Parts Fiscales Select */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Nombre de parts fiscales</label>
                        <select
                            value={config.parts_fiscales}
                            onChange={(e) => updateConfig({ parts_fiscales: parseFloat(e.target.value) })}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition font-medium"
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

                    {/* Autres Revenus Input */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Autres revenus du foyer net imposable</label>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                step="1000"
                                value={config.autres_revenus || ''}
                                placeholder="0"
                                onChange={(e) => updateConfig({ autres_revenus: parseFloat(e.target.value) || 0 })}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition font-medium"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€ / an</span>
                        </div>
                    </div>
                </div>

                {/* Versement Libératoire Toggle (Synced) */}
                <div className="pt-6 border-t border-slate-100">
                    <label className="flex items-center space-x-3 bg-white border border-indigo-100 p-4 rounded-xl cursor-pointer hover:bg-indigo-50/50 transition shadow-sm">
                        <input
                            type="checkbox"
                            checked={config.versement_liberatoire}
                            onChange={(e) => updateConfig({ versement_liberatoire: e.target.checked })}
                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                        />
                        <div>
                            <span className="block text-sm font-bold text-[#0d1b35]">Option Versement Libératoire (IR)</span>
                            <span className="block text-xs text-slate-500 mt-0.5">Payez l'impôt en pourcentage fixe chaque mois avec l'URSSAF.</span>
                        </div>
                    </label>
                </div>

            </div>
        </div>
    );
}
