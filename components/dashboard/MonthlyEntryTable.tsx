'use client';

import React, { useState, useEffect } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { getTVAStatus, calculateUrssaf } from '@/lib/calculations';
import { Loader2, AlertTriangle, AlertCircle } from 'lucide-react';

const MONTHS = [
    'Janvier', 'F\u00e9vrier', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Ao\u00fbt', 'Septembre', 'Octobre', 'Novembre', 'D\u00e9cembre'
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
    let rowBgClass = 'bg-white transition hover:bg-slate-50';

    if (tva.status === 'warning' && caAmount > 0) rowBgClass = 'bg-[#f5a623]/5 hover:bg-[#f5a623]/10';
    if (tva.status === 'danger' && caAmount > 0) rowBgClass = 'bg-[#e84040]/5 hover:bg-[#e84040]/10';

    const hasData = caAmount > 0;
    const urssafEst = calculateUrssaf(caAmount, activityType, acreEnabled);

    return (
        <tr className={`border-b border-slate-100 ${rowBgClass}`}>
            <td className={`p-4 text-sm font-medium ${hasData ? 'text-[#0d1b35]' : 'text-slate-500'}`}>
                {MONTHS[monthIndex]}
            </td>
            <td className="p-4">
                <div className="relative flex max-w-[150px] items-center">
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={localValue === '0' ? '' : localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        onBlur={handleBlur}
                        placeholder="0.00"
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-right font-medium text-slate-800 transition focus:border-[#00c875] focus:outline-none focus:ring-2 focus:ring-[#00c875]/20"
                    />
                    <span className="pointer-events-none absolute right-3 text-slate-400">{'\u20ac'}</span>
                    {isSaving && <Loader2 className="absolute -right-6 h-4 w-4 animate-spin text-[#00c875]" />}
                </div>
            </td>
            <td className={`p-4 text-right text-sm font-medium ${hasData && tva.status !== 'safe' ? 'text-amber-600' : hasData ? 'text-slate-600' : 'text-slate-400'}`}>
                {hasData ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cumulativeCA) : '\u2013'}
            </td>
            <td className="p-4 text-right text-sm text-slate-400">
                {hasData ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(urssafEst) : '\u2013'}
            </td>
        </tr>
    );
}

export function MonthlyEntryTable() {
    const { entries, config, updateEntry, loading } = useDashboard();

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
                <Loader2 className="h-8 w-8 animate-spin text-[#00c875]" />
            </div>
        );
    }

    let runningTotal = 0;
    let totalUrssaf = 0;
    const sortedEntries = [...entries].sort((a, b) => a.month - b.month);
    const isCompletelyEmpty = entries.every((entry) => entry.ca_amount === 0);

    return (
        <div className="relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {isCompletelyEmpty && (
                <div className="pointer-events-none absolute left-1/2 top-[140px] z-10 flex -translate-x-1/2 animate-bounce items-center gap-3 whitespace-nowrap rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-xl">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-emerald-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    </div>
                    Saisissez votre premier CA dans Janvier pour commencer
                </div>
            )}

            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-6">
                <div>
                    <h2 className="font-syne text-xl font-bold text-[#0d1b35]">Chiffre d'Affaires Mensuel</h2>
                    <p className="mt-1 text-sm text-slate-500">Saisissez vos encaissements HT.</p>
                </div>
            </div>

            <div className="overflow-hidden">
                <div className="max-h-[520px] overflow-auto xl:max-h-[430px]">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="sticky top-0 z-[1] border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                                <th className="p-4 font-medium">Mois</th>
                                <th className="p-4 text-right font-medium">{'CA Encaiss\u00e9 (\u20ac)'}</th>
                                <th className="p-4 text-right font-medium">Cumul Annuel</th>
                                <th className="p-4 text-right font-medium">Est. URSSAF</th>
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
                                <td className="rounded-bl-3xl p-4 font-bold">Total Annuel</td>
                                <td className="p-4 text-right font-syne text-lg font-bold">
                                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(runningTotal)}
                                </td>
                                <td className="p-4"></td>
                                <td className="rounded-br-3xl p-4 text-right font-bold text-red-300">
                                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalUrssaf)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {(() => {
                const tva = getTVAStatus(runningTotal, config.activity_type);
                if (tva.status === 'safe') return null;
                return (
                    <div className={`flex items-center justify-center space-x-2 p-4 text-sm font-bold ${tva.status === 'danger' ? 'bg-[#e84040]/10 text-red-700' : 'bg-[#f5a623]/10 text-amber-700'}`}>
                        {tva.status === 'danger' ? <AlertCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                        <span>{`Attention : Seuil de franchise en base de TVA ${tva.status === 'danger' ? 'd\u00e9pass\u00e9' : 'bient\u00f4t atteint'} !`}</span>
                    </div>
                );
            })()}
        </div>
    );
}