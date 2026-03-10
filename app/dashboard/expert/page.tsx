'use client';

import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { FeatureLock } from '@/components/dashboard/FeatureLock';
import { ClientForm } from '@/components/dashboard/expert/ClientForm';
import { InvoiceForm } from '@/components/dashboard/expert/InvoiceForm';
import { ClientList } from '@/components/dashboard/expert/ClientList';
import { ClientRevenuePieChart } from '@/components/dashboard/expert/ClientRevenuePieChart';
import { AdminPackCard, ClientInsightsCard, CollectionsCockpitCard } from '@/components/dashboard/expert/OperationsCards';
import { HealthScoreCard } from '@/components/dashboard/InsightCards';
import { useEffect, useState } from 'react';
import { BriefcaseBusiness } from 'lucide-react';
import type { InsightClient, InsightInvoice } from '@/lib/dashboard-insights';

function ExpertDashboardContent() {
    const [clients, setClients] = useState<InsightClient[]>([]);
    const [invoices, setInvoices] = useState<InsightInvoice[]>([]);
    const [loading, setLoading] = useState(true);
    const { year } = useDashboard();

    const fetchCRMData = async () => {
        setLoading(true);
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
            setClients(clientData.map((client: InsightClient) => ({
                ...client,
                invoices: invoiceData.filter((invoice: InsightInvoice) => invoice.client_id === client.id),
            })));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchCRMData();
    }, [year]);

    return (
        <main className="mx-auto flex-1 w-full max-w-7xl overflow-x-hidden p-6">
            <FeatureLock featureName="Clients et facturation automatisee" requiredTier="expert">
                <div data-tour="expert-hero" className="mb-8 flex items-center gap-3">
                    <div className="rounded-xl bg-[#0d1b35] p-3 shadow-sm">
                        <BriefcaseBusiness className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-syne text-2xl font-bold text-[#0d1b35]">Gestion commerciale</h1>
                        <p className="text-slate-500">Gerez vos clients, vos factures et le cash qui en decoule.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
                    <div className="space-y-5 xl:col-span-4">
                        <div data-tour="expert-client-form">
                            <ClientForm onSuccess={fetchCRMData} />
                        </div>
                        <div data-tour="expert-invoice-form">
                            <InvoiceForm clients={clients as any} onSuccess={fetchCRMData} />
                        </div>
                        <div data-tour="expert-admin-pack">
                            <AdminPackCard year={year} />
                        </div>
                    </div>

                    <div className="space-y-5 xl:col-span-8">
                        <div data-tour="expert-portfolio" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-syne text-lg font-bold text-[#0d1b35]">Portefeuille clients</h3>
                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-20 w-full rounded-2xl bg-slate-100"></div>
                                    <div className="h-20 w-full rounded-2xl bg-slate-100"></div>
                                </div>
                            ) : (
                                <ClientList clients={clients as any} />
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-5 2xl:grid-cols-2">
                            <div data-tour="expert-collections">
                                <CollectionsCockpitCard invoices={invoices} onRefresh={fetchCRMData} />
                            </div>
                            <div data-tour="expert-insights">
                                <ClientInsightsCard clients={clients} invoices={invoices} />
                            </div>
                            <ClientRevenuePieChart clients={clients as any} />
                            <HealthScoreCard clients={clients} />
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
