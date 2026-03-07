'use client';

import React, { useState, useEffect } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { getTVAStatus, calculateUrssaf, calculateCFEProvision } from '@/lib/calculations';
import { Loader2, AlertTriangle, AlertCircle } from 'lucide-react';

const MONTHS = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

interface MonthlyRowProps {
    monthIndex: number;
    caAmount: number;
    cumulativeCA: number;
    onSave: (month: number, val: number) => Promise<void>;
    activityType: any;
    acreEnabled: boolean;
}

function MonthlyRow({ monthIndex, caAmount, cumulativeCA, onSave, activityType, acreEnabled }: MonthlyRowProps) {
    const [localValue, setLocalValue] = useState(caAmount.toString());
    const [isSaving, setIsSaving] = useState(false);

    // Sync local state if external state changes
    useEffect(() => {
        setLocalValue(caAmount.toString());
    }, [caAmount]);

    const handleBlur = async () => {
        const numVal = parseFloat(localValue) || 0;
        if (numVal !== caAmount) {
            setIsSaving(true);
            await onSave(monthIndex + 1, numVal);
            setIsSaving(false);
        }
    };

    const tva = getTVAStatus(cumulativeCA, activityType);
    let rowBgClass = 'bg-white hover:bg-slate-50 transition';

    if (tva.status === 'warning' && caAmount > 0) rowBgClass = 'bg-[#f5a623]/5 hover:bg-[#f5a623]/10';
    if (tva.status === 'danger' && caAmount > 0) rowBgClass = 'bg-[#e84040]/5 hover:bg-[#e84040]/10';

    const hasData = caAmount > 0;

    const urssafEst = calculateUrssaf(caAmount, activityType, acreEnabled);

    return (
        <tr className={`border-b border-slate-100 ${rowBgClass}`}>
            <td className={`p-4 font-medium text-sm ${hasData ? 'text-[#0d1b35]' : 'text-slate-500'}`}>
                {MONTHS[monthIndex]}
            </td>
            <td className="p-4">
                <div className="relative flex items-center max-w-[150px]">
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={localValue === '0' ? '' : localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        onBlur={handleBlur}
                        placeholder="0.00"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-[#00c875]/20 focus:border-[#00c875] transition font-medium text-slate-800"
                    />
                    <span className="absolute right-3 text-slate-400 pointer-events-none">€</span>
                    {isSaving && <Loader2 className="absolute -right-6 w-4 h-4 text-[#00c875] animate-spin" />}
                </div>
            </td>
            <td className={`p-4 text-right font-medium text-sm ${hasData && tva.status !== 'safe' ? 'text-amber-600' : hasData ? 'text-slate-600' : 'text-slate-400'}`}>
                {hasData ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cumulativeCA) : '–'}
            </td>
            <td className="p-4 text-right text-sm text-slate-400">
                {hasData ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(urssafEst) : '–'}
            </td>
        </tr>
    );
}

export function MonthlyEntryTable() {
    const { entries, config, updateEntry, loading } = useDashboard();

    if (loading) {
        return <div className="border border-slate-200 rounded-3xl min-h-[400px] flex items-center justify-center bg-white shadow-sm">
            <Loader2 className="w-8 h-8 text-[#00c875] animate-spin" />
        </div>;
    }

    let runningTotal = 0;
    let totalUrssaf = 0;

    // Sort entries 1-12
    const sortedEntries = [...entries].sort((a, b) => a.month - b.month);

    const isCompletelyEmpty = entries.every(e => e.ca_amount === 0);

    return (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col relative">
            {isCompletelyEmpty && (
                <div className="absolute top-[140px] left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-3 shadow-xl animate-bounce pointer-events-none z-10 whitespace-nowrap">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-emerald-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    </div>
                    Saisissez votre premier CA dans Janvier pour commencer
                </div>
            )}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                    <h2 className="text-xl font-bold font-syne text-[#0d1b35]">Chiffre d'Affaires Mensuel</h2>
                    <p className="text-sm text-slate-500 mt-1">Saisissez vos encaissements HT.</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                            <th className="p-4 font-medium">Mois</th>
                            <th className="p-4 font-medium text-right">CA Encaissé (€)</th>
                            <th className="p-4 font-medium text-right">Cumul Annuel</th>
                            <th className="p-4 font-medium text-right">Est. URSSAF</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedEntries.map((entry, index) => {
                            runningTotal += entry.ca_amount;
                            totalUrssaf += calculateUrssaf(entry.ca_amount, config.activity_type, config.acre_enabled);
                            return (
                                <MonthlyRow
                                    key={entry.month}
                                    monthIndex={index}
                                    caAmount={entry.ca_amount}
                                    cumulativeCA={runningTotal}
                                    onSave={updateEntry}
                                    activityType={config.activity_type}
                                    acreEnabled={config.acre_enabled}
                                />
                            );
                        })}
                    </tbody>
                    <tfoot className="bg-[#0d1b35] text-white">
                        <tr>
                            <td className="p-4 font-bold rounded-bl-3xl">Total Annuel</td>
                            <td className="p-4 font-bold text-right text-lg font-syne">
                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(runningTotal)}
                            </td>
                            <td className="p-4"></td>
                            <td className="p-4 font-bold text-right text-red-300 rounded-br-3xl">
                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalUrssaf)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* TVA Warning System Base on Runnning Total */}
            {(() => {
                const tva = getTVAStatus(runningTotal, config.activity_type);
                if (tva.status === 'safe') return null;
                return (
                    <div className={`p-4 flex items-center justify-center space-x-2 text-sm font-bold ${tva.status === 'danger' ? 'bg-[#e84040]/10 text-red-700' : 'bg-[#f5a623]/10 text-amber-700'}`}>
                        {tva.status === 'danger' ? <AlertCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                        <span>Attention : Seuil de franchise en base de TVA {tva.status === 'danger' ? 'dépassé' : 'bientôt atteint'} !</span>
                    </div>
                );
            })()}
        </div>
    );
}
