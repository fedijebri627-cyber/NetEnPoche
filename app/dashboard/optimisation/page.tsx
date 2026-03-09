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
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                <div className="bg-white p-2 rounded-xl shadow-sm shrink-0">
                    <Lightbulb className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                    <h1 className="text-xl font-bold font-syne text-indigo-950 mb-1">Optimisation et bilan fiscal</h1>
                    <p className="text-indigo-800/80 text-sm">
                        Simulez l'impact reel de votre fiscalite, voyez ce qu'il faut reserver et testez vos scenarios avant de facturer.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ReservePlannerCard />
                <NetChangeExplainerCard />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 flex flex-col space-y-6">
                    <FeatureLock featureName="Projet Fiscal Complet" requiredTier="pro">
                        <>
                            <IRConfigForm />
                            <DecisionTimelineCard />
                            <div className="bg-[#fff8e6] border border-[#f5a623]/30 rounded-2xl p-5 relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 text-[#f5a623]/10">
                                    <Info className="w-24 h-24" />
                                </div>
                                <h3 className="text-[#8c5600] font-bold mb-2 relative z-10 flex items-center gap-2">
                                    Le saviez-vous ?
                                </h3>
                                <p className="text-[#a66a00] text-sm relative z-10">
                                    En micro-entreprise, la cle n'est pas seulement le taux. Ce qui compte est la combinaison revenus, rythme, TVA et option fiscale.
                                </p>
                            </div>
                            <VLComparisonCard />
                        </>
                    </FeatureLock>
                </div>

                <div className="lg:col-span-7 flex flex-col space-y-6">
                    <IRWaterfallChart />
                    <ScenarioSimulatorCard />
                    <MultiYearReviewCard />
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