'use client';

import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { KPICard } from '@/components/dashboard/KPICard';
import { AlertBanner } from '@/components/dashboard/AlertBanner';
import { ActivityConfigPanel } from '@/components/dashboard/ActivityConfigPanel';
import { MonthlyEntryTable } from '@/components/dashboard/MonthlyEntryTable';
import { TableActions } from '@/components/dashboard/TableActions';
import { TVAProgressCard } from '@/components/dashboard/TVAProgressCard';
import { URSSAFCalendarCard } from '@/components/dashboard/URSSAFCalendarCard';
import { MonthlyChargesChart } from '@/components/dashboard/MonthlyChargesChart';
import { ScenarioSimulatorCard } from '@/components/dashboard/ScenarioSimulatorCard';
import { InvoiceDashboardWidget } from '@/components/dashboard/InvoiceDashboardWidget';
import { OnboardingModal } from '@/components/dashboard/OnboardingModal';
import { calculateUrssaf, calculateCFEProvision, calculateAnnualProjection, calculateIR } from '@/lib/calculations';
import { Loader2 } from 'lucide-react';

function DashboardContent() {
    const { entries, config, loading } = useDashboard();

    if (loading) {
        return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="w-10 h-10 text-[#00c875] animate-spin" /></div>;
    }

    // Calculate live global values for the KPI Bar
    const totalCA = entries.reduce((acc, curr) => acc + curr.ca_amount, 0);
    const totalUrssaf = calculateUrssaf(totalCA, config.activity_type, config.acre_enabled);
    const cfeProvision = calculateCFEProvision(totalCA, config.activity_type);

    // Simplified Net: CA - URSSAF - CFE - VL (if selected)
    let totalNet = totalCA - totalUrssaf - cfeProvision;

    if (config.versement_liberatoire) {
        const irResult = calculateIR({
            ca: totalCA,
            activityType: config.activity_type,
            versementLiberatoire: true,
            situationFamiliale: 'celibataire', // baseline default for quick calc
            parts: 1,
            autresRevenus: 0
        });
        totalNet -= irResult.irEstime;
    }

    const currentMonth = new Date().getMonth() + 1; // 1-12
    const projection = calculateAnnualProjection(entries, currentMonth);

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <OnboardingModal />
            <AlertBanner
                id="dashboard_welcome"
                type="info"
                message="Bienvenue sur la nouvelle version de NetEnPoche ! Vos données sont sauvegardées automatiquement."
                dismissable
            />

            {/* KPI Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <KPICard title="URSSAF à payer" value={totalUrssaf} colorType="urssaf" />
                <KPICard title="Net en poche" value={totalNet} colorType="net" />
                <KPICard title="CFE Provision" value={cfeProvision} colorType="cfe" />
                <KPICard title="Projection Annuelle" value={projection} colorType="projection" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column (Main Data Entry) - Takes up approx 7/12 (58%) scale */}
                <div className="lg:col-span-7 flex flex-col space-y-6">
                    <ActivityConfigPanel />
                    <MonthlyEntryTable />
                    <TableActions />
                </div>

                {/* Right Flexible Column (Charts, Ads, Extra info) - Takes up approx 5/12 (42%) scale */}
                <div className="lg:col-span-5 flex flex-col space-y-6">
                    <InvoiceDashboardWidget />
                    <TVAProgressCard />
                    <MonthlyChargesChart />
                    <URSSAFCalendarCard />
                    <ScenarioSimulatorCard />
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <DashboardProvider>
            <DashboardContent />
        </DashboardProvider>
    );
}
