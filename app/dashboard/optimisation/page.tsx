'use client';

import { DashboardProvider } from '@/contexts/DashboardContext';
import { IRConfigForm } from '@/components/dashboard/optimisation/IRConfigForm';
import { VLComparisonCard } from '@/components/dashboard/optimisation/VLComparisonCard';
import { IRWaterfallChart } from '@/components/dashboard/optimisation/IRWaterfallChart';
import { FeatureLock } from '@/components/dashboard/FeatureLock';
import { DecisionTimelineCard, MultiYearReviewCard, NetChangeExplainerCard, ReservePlannerCard } from '@/components/dashboard/InsightCards';
import { ScenarioSimulatorCard } from '@/components/dashboard/ScenarioSimulatorCard';
import { Lightbulb, Info } from 'lucide-react';

function OptimisationContent() {
    return (
        <div className="mx-auto max-w-7xl space-y-8 p-6">
            <div data-tour="optimisation-hero" className="flex items-start gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-6 shadow-sm">
                <div className="shrink-0 rounded-xl bg-white p-2 shadow-sm">
                    <Lightbulb className="h-6 w-6 text-indigo-500" />
                </div>
                <div>
                    <h1 className="mb-1 font-syne text-xl font-bold text-indigo-950">Optimisation et bilan fiscal</h1>
                    <p className="text-sm text-indigo-800/80">
                        Simulez l'impact reel de votre fiscalite, voyez ce qu'il faut reserver et testez vos scenarios avant de facturer.
                    </p>
                </div>
            </div>

            <div data-tour="optimisation-reserve" className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ReservePlannerCard />
                <NetChangeExplainerCard />
            </div>

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                <div className="flex flex-col space-y-6 lg:col-span-5">
                    <FeatureLock featureName="Projet Fiscal Complet" requiredTier="pro">
                        <>
                            <div data-tour="optimisation-profile">
                                <IRConfigForm />
                            </div>
                            <DecisionTimelineCard />
                            <div className="relative overflow-hidden rounded-2xl border border-[#f5a623]/30 bg-[#fff8e6] p-5">
                                <div className="absolute -right-4 -top-4 text-[#f5a623]/10">
                                    <Info className="h-24 w-24" />
                                </div>
                                <h3 className="relative z-10 mb-2 flex items-center gap-2 font-bold text-[#8c5600]">
                                    Le saviez-vous ?
                                </h3>
                                <p className="relative z-10 text-sm text-[#a66a00]">
                                    En micro-entreprise, la cle n'est pas seulement le taux. Ce qui compte est la combinaison revenus, rythme, TVA et option fiscale.
                                </p>
                            </div>
                            <VLComparisonCard />
                        </>
                    </FeatureLock>
                </div>

                <div className="flex flex-col space-y-6 lg:col-span-7">
                    <div data-tour="optimisation-waterfall">
                        <IRWaterfallChart />
                    </div>
                    <div data-tour="optimisation-scenario">
                        <ScenarioSimulatorCard />
                    </div>
                    <div data-tour="optimisation-history">
                        <MultiYearReviewCard />
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
