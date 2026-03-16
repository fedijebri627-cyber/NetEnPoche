'use client';

import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { AlertBanner } from '@/components/dashboard/AlertBanner';
import { MonthlyEntryTable } from '@/components/dashboard/MonthlyEntryTable';
import { TableActions } from '@/components/dashboard/TableActions';
import { ScenarioSimulatorCard } from '@/components/dashboard/ScenarioSimulatorCard';
import { OnboardingModal } from '@/components/dashboard/OnboardingModal';
import { HealthScoreCard, ReservePlannerCard, UpgradeOverviewBanner } from '@/components/dashboard/InsightCards';
import { DashboardStatBar, PendingActionsCard, PriorityActionCenterCard, UrssafDeadlineCard } from '@/components/dashboard/SurfaceCards';
import { Loader2 } from 'lucide-react';

function DashboardContent() {
    const { loading } = useDashboard();

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#00c875]" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-5 p-6">
            <OnboardingModal />
            <AlertBanner
                id="dashboard_welcome"
                type="info"
                message="Bienvenue sur la nouvelle version de NetEnPoche ! Vos données sont sauvegardées automatiquement."
                dismissable
            />

            <DashboardStatBar />

            <UpgradeOverviewBanner />

            <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-5">
                    <div id="dashboard-priorities">
                        <PriorityActionCenterCard />
                    </div>

                    <div id="monthly-entries" data-tour="monthly-entries">
                        <MonthlyEntryTable />
                    </div>
                    <TableActions />

                    <div id="scenario-lab" data-tour="scenario-lab">
                        <ScenarioSimulatorCard />
                    </div>
                </div>

                <div className="space-y-5">
                    <div id="urssaf-calendar">
                        <UrssafDeadlineCard />
                    </div>
                    <div id="health-score-card">
                        <HealthScoreCard />
                    </div>
                    <div id="reserve-card">
                        <ReservePlannerCard />
                    </div>
                    <div id="actions-timeline" data-tour="actions-timeline">
                        <PendingActionsCard />
                    </div>
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
