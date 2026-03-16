'use client';

import { Download, FileText, ArrowRight, Building2 } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import { calculateCompositeNetBreakdown } from '@/lib/dashboard-insights';
import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradeModal } from './UpgradeModal';

export function TableActions() {
    const { entries, config, year } = useDashboard();
    const { tier } = useSubscription();
    const [isGenerating, setIsGenerating] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const generateCSV = () => {
        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'Mois,CA Encaissé (EUR),URSSAF Estimé (EUR),Net Estimé (EUR)\n';

        const sortedEntries = [...entries].sort((a, b) => a.month - b.month);
        sortedEntries.forEach((entry) => {
            const breakdown = calculateCompositeNetBreakdown(entry.ca_amount, config);
            csvContent += `${entry.month},${entry.ca_amount},${breakdown.urssaf.toFixed(2)},${breakdown.netReel.toFixed(2)}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `netenpoche_export_${year}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadPDF = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/pdf/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entries, config }),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => null);
                throw new Error(payload?.error || 'Erreur de génération PDF');
            }

            const arrayBuffer = await response.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i += 1) {
                binary += String.fromCharCode(bytes[i]);
            }
            const base64 = window.btoa(binary);
            const dataUrl = `data:application/pdf;base64,${base64}`;

            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `NetEnPoche-Bilan-${config.year || new Date().getFullYear()}.pdf`;
            link.click();
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : 'Erreur lors de la génération du PDF.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <button
                onClick={generateCSV}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition font-medium shadow-sm active:scale-[0.98]"
            >
                <Download className="w-4 h-4" />
                <span>Exporter CSV</span>
            </button>

            <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition font-medium shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
                <FileText className="w-4 h-4" />
                <span>{isGenerating ? 'Génération...' : `Bilan PDF (${tier === 'free' ? 'Basique' : 'Complet'})`}</span>
            </button>

            <button
                onClick={() => { window.location.href = '/dashboard/settings'; }}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white border border-slate-200 text-slate-500 px-6 py-3 rounded-xl hover:bg-slate-50 hover:text-slate-700 transition font-medium shadow-sm active:scale-[0.98]"
            >
                <Building2 className="w-4 h-4" />
                <span>Infos Entreprise (SIRET)</span>
            </button>

            {tier === 'free' && (
                <div className="w-full sm:w-auto sm:ml-auto">
                    <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition font-bold active:scale-[0.98]"
                    >
                        <span>Passer Pro</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}
            <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
        </div>
    );
}
