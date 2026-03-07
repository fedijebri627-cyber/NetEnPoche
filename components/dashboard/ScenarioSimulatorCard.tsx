'use client';

import { useState } from 'react';
import { FeatureLock } from './FeatureLock';
import { useDashboard } from '@/contexts/DashboardContext';
import { calculateUrssaf, getTVAStatus } from '@/lib/calculations';
import { TrendingUp, ArrowRight } from 'lucide-react';

export function ScenarioSimulatorCard() {
    const { entries, config, loading } = useDashboard();
    const [extraAmountStr, setExtraAmountStr] = useState('');

    if (loading) return <div className="animate-pulse h-40 bg-slate-100 rounded-3xl" />;

    const extraAmount = parseFloat(extraAmountStr) || 0;

    // Current State
    const currentTotalCA = entries.reduce((acc, curr) => acc + curr.ca_amount, 0);
    const currentUrssaf = calculateUrssaf(currentTotalCA, config.activity_type, config.acre_enabled);
    const currentTVA = getTVAStatus(currentTotalCA, config.activity_type);

    // New Simulated State
    const simulatedTotalCA = currentTotalCA + extraAmount;
    const simulatedUrssaf = calculateUrssaf(simulatedTotalCA, config.activity_type, config.acre_enabled);
    const simulatedTVA = getTVAStatus(simulatedTotalCA, config.activity_type);

    // Deltas
    const urssafDelta = simulatedUrssaf - currentUrssaf;
    const netDelta = extraAmount - urssafDelta; // Simplified net for the simulator

    return (
        <FeatureLock featureName="Simulateur de Scénarios" requiredTier="pro">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-bold font-syne text-[#0d1b35] flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-[#6366f1]" />
                    Simulation (Et si...?)
                </h3>

                <div className="mb-6">
                    <label className="text-sm font-medium text-slate-600 block mb-2">
                        "Et si je facturais <strong className="text-slate-900">X €</strong> de plus ?"
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            min="0"
                            step="100"
                            placeholder="0"
                            value={extraAmountStr}
                            onChange={(e) => setExtraAmountStr(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-medium text-[#0d1b35] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium font-syne text-lg pointer-events-none">€</span>
                    </div>
                </div>

                {extraAmount > 0 ? (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <ul className="space-y-3">
                            <li className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Nouveau Net Gagné</span>
                                <span className="font-bold text-[#00c875] flex items-center gap-1">
                                    +{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(netDelta)}
                                </span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">URSSAF Supplémentaire</span>
                                <span className="font-bold text-[#e84040]">
                                    -{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(urssafDelta)}
                                </span>
                            </li>
                            <li className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm">
                                <span className="text-slate-600 font-medium">Statut TVA</span>
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${currentTVA.status === 'safe' ? 'bg-[#00c875]' : currentTVA.status === 'warning' ? 'bg-[#f5a623]' : 'bg-[#e84040]'}`} />
                                    <ArrowRight className="w-3 h-3 text-slate-300" />
                                    <span className={`w-2 h-2 rounded-full ${simulatedTVA.status === 'safe' ? 'bg-[#00c875]' : simulatedTVA.status === 'warning' ? 'bg-[#f5a623]' : 'bg-[#e84040]'}`} />
                                </div>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 border-dashed text-center">
                        <p className="text-sm text-slate-400">Entrez un montant pour simuler l'impact sur vos cotisations et votre plafond TVA.</p>
                    </div>
                )}
            </div>
        </FeatureLock>
    );
}
