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
import { DecisionTimelineCard, HealthScoreCard, NetChangeExplainerCard, PriorityActionCenterCard, ReservePlannerCard, UpgradeOverviewBanner } from '@/components/dashboard/InsightCards';
import { calculateAnnualProjection } from '@/lib/calculations';
import { calculateCompositeNetBreakdown } from '@/lib/dashboard-insights';
import { Loader2 } from 'lucide-react';

function DashboardContent() {
    const { entries, config, loading, year } = useDashboard();

    if (loading) {
        return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-[#00c875]" /></div>;
    }

    const totalCA = entries.reduce((acc, curr) => acc + curr.ca_amount, 0);
    const totals = calculateCompositeNetBreakdown(totalCA, config);
    const currentMonth = year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;
    const projection = calculateAnnualProjection(entries, Math.max(currentMonth, 1));

    const recentMonths = [...entries]
        .sort((a, b) => a.month - b.month)
        .filter((entry) => entry.ca_amount > 0)
        .slice(-2);
    const previousMonth = recentMonths.length > 1 ? recentMonths[recentMonths.length - 2] : null;
    const currentMonthEntry = recentMonths.length > 0 ? recentMonths[recentMonths.length - 1] : null;

    const previousNet = previousMonth ? calculateCompositeNetBreakdown(previousMonth.ca_amount, config).netReel : 0;
    const currentNet = currentMonthEntry ? calculateCompositeNetBreakdown(currentMonthEntry.ca_amount, config).netReel : 0;
    const netTrend = previousNet > 0 ? Math.round(((currentNet - previousNet) / previousNet) * 100) : 0;
    const previousUrssaf = previousMonth ? calculateCompositeNetBreakdown(previousMonth.ca_amount, config).urssaf : 0;
    const currentUrssaf = currentMonthEntry ? calculateCompositeNetBreakdown(currentMonthEntry.ca_amount, config).urssaf : 0;
    const urssafTrend = previousUrssaf > 0 ? Math.round(((currentUrssaf - previousUrssaf) / previousUrssaf) * 100) : 0;

    return (
        <div className="mx-auto max-w-7xl space-y-5 p-6">
            <OnboardingModal />
            <AlertBanner
                id="dashboard_welcome"
                type="info"
                message="Bienvenue sur la nouvelle version de NetEnPoche ! Vos donnees sont sauvegardees automatiquement."
                dismissable
            />

            <div data-tour="dashboard-priorities">
                <PriorityActionCenterCard />
            </div>

            <div data-tour="dashboard-kpis" className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <KPICard title="URSSAF a payer" value={totals.urssaf} colorType="urssaf" trend={urssafTrend} />
                <KPICard title="Net en poche" value={totals.netReel} colorType="net" trend={netTrend} />
                <KPICard title="CFE Provision" value={totals.cfe} colorType="cfe" />
                <KPICard title="Projection Annuelle" value={projection} colorType="projection" />
            </div>

            <UpgradeOverviewBanner />

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:auto-rows-fr">
                <div id="health-score-card" className="h-full">
                    <HealthScoreCard />
                </div>
                <div id="reserve-card" className="h-full">
                    <ReservePlannerCard />
                </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
                <div className="space-y-5 xl:col-span-7">
                    <div id="activity-config" data-tour="activity-config">
                        <ActivityConfigPanel />
                    </div>
                    <div id="monthly-entries" data-tour="monthly-entries">
                        <MonthlyEntryTable />
                    </div>
                    <TableActions />
                </div>

                <div className="space-y-5 xl:col-span-5">
                    <InvoiceDashboardWidget />
                    <div id="actions-timeline" data-tour="actions-timeline">
                        <DecisionTimelineCard />
                    </div>
                    <div id="tva-card" data-tour="tva-card">
                        <TVAProgressCard />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-12 xl:auto-rows-fr">
                <div id="why-net" className="h-full xl:col-span-7">
                    <NetChangeExplainerCard />
                </div>
                <div id="urssaf-calendar" className="h-full xl:col-span-5">
                    <URSSAFCalendarCard />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
                <div id="scenario-lab" data-tour="scenario-lab">
                    <ScenarioSimulatorCard />
                </div>
                <div id="revenue-chart" data-tour="revenue-chart">
                    <MonthlyChargesChart />
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
