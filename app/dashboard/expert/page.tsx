'use client';

import { FeatureLock } from '@/components/dashboard/FeatureLock';
import { ClientForm } from '@/components/dashboard/expert/ClientForm';
import { InvoiceForm } from '@/components/dashboard/expert/InvoiceForm';
import { ClientList, ClientData } from '@/components/dashboard/expert/ClientList';
import { ClientRevenuePieChart } from '@/components/dashboard/expert/ClientRevenuePieChart';
import { useState, useEffect } from 'react';
import { BriefcaseBusiness } from 'lucide-react';

export default function ExpertDashboard() {
    const [clients, setClients] = useState<ClientData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCRMData = async () => {
        setLoading(true);
        try {
            // First fetch invoices to group them 
            const invRes = await fetch('/api/invoices');
            const invoicesData = await invRes.json();

            // Then fetch clients
            const cliRes = await fetch('/api/clients');
            const clientsData = await cliRes.json();

            if (Array.isArray(clientsData)) {
                // Map invoices onto their owner clients
                const mappedClients = clientsData.map((c: any) => {
                    const mappedInvoices = Array.isArray(invoicesData) ? invoicesData.filter((i: any) => i.client_id === c.id) : [];
                    return { ...c, invoices: mappedInvoices };
                });
                setClients(mappedClients);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCRMData();
    }, []);

    return (
        <main className="flex-1 overflow-x-hidden p-6 max-w-7xl mx-auto w-full">
            <FeatureLock featureName="Clients & Facturations Automatisées" requiredTier="expert">

                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-[#0d1b35] rounded-xl shadow-sm">
                        <BriefcaseBusiness className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold font-syne text-[#0d1b35]">Gestion Commerciale</h1>
                        <p className="text-slate-500">Gérez vos clients, facturez, et auto-synchronisez votre Chiffre d'Affaires.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Data Entry */}
                    <div className="xl:col-span-4 space-y-6">
                        <ClientForm onSuccess={fetchCRMData} />
                        <InvoiceForm clients={clients} onSuccess={fetchCRMData} />
                    </div>

                    {/* Right Column: Tracking & Reporting */}
                    <div className="xl:col-span-8 space-y-6">
                        <ClientRevenuePieChart clients={clients} />

                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="font-syne font-bold text-lg text-[#0d1b35] mb-4">Portefeuille Clients</h3>
                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-20 bg-slate-100 rounded-2xl w-full"></div>
                                    <div className="h-20 bg-slate-100 rounded-2xl w-full"></div>
                                </div>
                            ) : (
                                <ClientList clients={clients} />
                            )}
                        </div>
                    </div>

                </div>
            </FeatureLock>
        </main>
    );
}

