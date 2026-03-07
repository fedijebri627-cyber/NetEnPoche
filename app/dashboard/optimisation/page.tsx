'use client';

import { DashboardProvider } from '@/contexts/DashboardContext';
import { IRConfigForm } from '@/components/dashboard/optimisation/IRConfigForm';
import { VLComparisonCard } from '@/components/dashboard/optimisation/VLComparisonCard';
import { IRWaterfallChart } from '@/components/dashboard/optimisation/IRWaterfallChart';
import { FeatureLock } from '@/components/dashboard/FeatureLock';
import { Lightbulb, Info } from 'lucide-react';

function OptimisationContent() {
    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">

            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                <div className="bg-white p-2 rounded-xl shadow-sm shrink-0">
                    <Lightbulb className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                    <h1 className="text-xl font-bold font-syne text-indigo-950 mb-1">Optimisation & Bilan Fiscal</h1>
                    <p className="text-indigo-800/80 text-sm">
                        Simulez l'impact de l'Impôt sur le Revenu sur votre activité de micro-entrepreneur. Configurez votre foyer fiscal pour calculer votre impôt réel et découvrir s'il est temps d'activer le versement libératoire.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column - Configuration & Quick Wins (Lock this entirely against non-pros except the chart preview) */}
                <div className="lg:col-span-5 flex flex-col space-y-6">
                    <FeatureLock featureName="Projet Fiscal Complet" requiredTier="pro">
                        <>
                            <IRConfigForm />

                            <div className="bg-[#fff8e6] border border-[#f5a623]/30 rounded-2xl p-5 relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 text-[#f5a623]/10">
                                    <Info className="w-24 h-24" />
                                </div>
                                <h3 className="text-[#8c5600] font-bold mb-2 relative z-10 flex items-center gap-2">
                                    Le saviez-vous ?
                                </h3>
                                <p className="text-[#a66a00] text-sm relative z-10">
                                    L'abattement forfaitaire appliqué sur votre Chiffre d'Affaires dépend directement de votre Type d'Activité. Vos frais réels ne sont jamais pris en compte en micro-entreprise.
                                </p>
                            </div>

                            <VLComparisonCard />
                        </>
                    </FeatureLock>
                </div>

                {/* Right Column - Dynamic Visualization */}
                <div className="lg:col-span-7">
                    <IRWaterfallChart />
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

