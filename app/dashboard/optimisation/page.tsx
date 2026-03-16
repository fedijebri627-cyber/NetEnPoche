'use client';

import { useEffect } from 'react';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { IRConfigForm } from '@/components/dashboard/optimisation/IRConfigForm';
import { VLComparisonCard } from '@/components/dashboard/optimisation/VLComparisonCard';
import { IRWaterfallChart } from '@/components/dashboard/optimisation/IRWaterfallChart';
import { FeatureLock } from '@/components/dashboard/FeatureLock';
import { FiscalActionsCard } from '@/components/dashboard/SurfaceCards';
import { MultiYearReviewCard, NetChangeExplainerCard } from '@/components/dashboard/InsightCards';
import { ScenarioSimulatorCard } from '@/components/dashboard/ScenarioSimulatorCard';

function OptimisationContent() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const currentUrl = new URL(window.location.href);
        const focusTargetId = currentUrl.searchParams.get('focus');
        if (!focusTargetId) return;

        const target = document.getElementById(focusTargetId);
        if (!target) return;

        const existingOverlay = document.getElementById('nep-dashboard-focus-overlay');
        existingOverlay?.remove();
        const timeouts: number[] = [];
        const topOffset = 116;

        const scrollTargetIntoView = (behavior: ScrollBehavior) => {
            const liveTarget = document.getElementById(focusTargetId);
            if (!liveTarget) return;

            const targetTop = liveTarget.getBoundingClientRect().top + window.scrollY;
            const destination = Math.max(0, targetTop - topOffset);
            window.scrollTo({ top: destination, behavior });
        };

        [80, 260, 520, 900].forEach((delay, index) => {
            const timeoutId = window.setTimeout(() => {
                scrollTargetIntoView(index === 0 ? 'auto' : 'smooth');
            }, delay);
            timeouts.push(timeoutId);
        });

        const spotlightTimeout = window.setTimeout(() => {
            const liveTarget = document.getElementById(focusTargetId);
            if (!liveTarget) return;

            scrollTargetIntoView('smooth');

            const overlay = document.createElement('div');
            overlay.id = 'nep-dashboard-focus-overlay';
            overlay.className = 'pointer-events-none fixed inset-0 z-[70] bg-slate-950/50 backdrop-blur-[1px]';
            document.body.appendChild(overlay);

            liveTarget.setAttribute('data-tour-pulse', 'true');

            currentUrl.searchParams.delete('focus');
            currentUrl.hash = '';
            window.history.replaceState({}, '', `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);

            const cleanupTimeout = window.setTimeout(() => {
                liveTarget.removeAttribute('data-tour-pulse');
                overlay.remove();
            }, 1800);
            timeouts.push(cleanupTimeout);
        }, 1150);
        timeouts.push(spotlightTimeout);

        return () => {
            timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
        };
    }, []);

    return (
        <div data-tour="optimisation-hero" className="mx-auto max-w-7xl space-y-5 p-6">
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <div data-tour="optimisation-waterfall">
                    <IRWaterfallChart />
                </div>
                <div id="why-net">
                    <NetChangeExplainerCard />
                </div>
            </div>

            <FeatureLock featureName="Projet Fiscal Complet" requiredTier="pro">
                <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
                    <div data-tour="optimisation-profile">
                        <IRConfigForm />
                    </div>
                    <div>
                        <VLComparisonCard />
                    </div>
                </div>
            </FeatureLock>

            <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div data-tour="optimisation-scenario" id="scenario-lab">
                    <ScenarioSimulatorCard />
                </div>

                <div className="space-y-5">
                    <div data-tour="optimisation-history">
                        <MultiYearReviewCard />
                    </div>
                    <div id="optimisation-actions-fiscales">
                        <FiscalActionsCard />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OptimisationPage() {
    return (
        <DashboardProvider>
            <OptimisationContent />
        </DashboardProvider>
    );
}
