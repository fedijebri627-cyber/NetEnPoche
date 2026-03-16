'use client';

import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { FeatureLock } from '@/components/dashboard/FeatureLock';
import { InvoiceForm } from '@/components/dashboard/expert/InvoiceForm';
import { ClientList } from '@/components/dashboard/expert/ClientList';
import { AdminPackCard, CollectionsListCard } from '@/components/dashboard/expert/OperationsCards';
import { CollectionsStatBar, CompactClientHealthScoreCard, RiskConcentrationCard } from '@/components/dashboard/SurfaceCards';
import { useEffect, useState } from 'react';
import type { InsightClient, InsightInvoice } from '@/lib/dashboard-insights';

function ExpertDashboardContent() {
    const [clients, setClients] = useState<InsightClient[]>([]);
    const [invoices, setInvoices] = useState<InsightInvoice[]>([]);
    const { year } = useDashboard();

    const fetchCRMData = async () => {
        try {
            const [invoiceResponse, clientResponse] = await Promise.all([
                fetch(`/api/invoices?year=${year}`, { cache: 'no-store' }),
                fetch('/api/clients', { cache: 'no-store' }),
            ]);

            const invoiceRows = await invoiceResponse.json();
            const clientRows = await clientResponse.json();
            const invoiceData = Array.isArray(invoiceRows) ? invoiceRows : [];
            const clientData = Array.isArray(clientRows) ? clientRows : [];

            setInvoices(invoiceData);
            setClients(clientData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        void fetchCRMData();
    }, [year]);

    return (
        <main className="mx-auto flex-1 w-full max-w-7xl overflow-x-hidden p-6">
            <FeatureLock featureName="Clients et facturation automatisee" requiredTier="expert">
                <div className="space-y-5">
                    <CollectionsStatBar invoices={invoices} />

                    <div data-tour="expert-hero" className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[280px_minmax(0,1fr)_260px]">
                        <div className="space-y-5">
                            <div data-tour="expert-portfolio">
                                <ClientList clients={clients} invoices={invoices} onRefresh={fetchCRMData} />
                            </div>
                            <div data-tour="expert-admin-pack">
                                <AdminPackCard year={year} />
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div data-tour="expert-invoice-form">
                                <InvoiceForm clients={clients} onSuccess={fetchCRMData} />
                            </div>
                            <div data-tour="expert-collections">
                                <CollectionsListCard invoices={invoices} onRefresh={fetchCRMData} />
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div data-tour="expert-insights">
                                <RiskConcentrationCard clients={clients} invoices={invoices} />
                            </div>
                            <CompactClientHealthScoreCard clients={clients} />
                        </div>
                    </div>
                </div>
            </FeatureLock>
        </main>
    );
}

export default function ExpertDashboard() {
    return (
        <DashboardProvider>
            <ExpertDashboardContent />
        </DashboardProvider>
    );
}
