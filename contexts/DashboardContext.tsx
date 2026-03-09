'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';
import type { InsightConfig, HouseholdStatus } from '@/lib/dashboard-insights';

export interface ActivityConfig extends InsightConfig {
    id: string;
}

export interface MonthlyEntry {
    month: number;
    ca_amount: number;
    notes: string | null;
}

interface DashboardContextProps {
    year: number;
    setYear: (y: number) => void;
    config: ActivityConfig;
    updateConfig: (newConfig: Partial<ActivityConfig>) => Promise<void>;
    entries: MonthlyEntry[];
    updateEntry: (month: number, value: number) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

function getDefaultConfig(year: number): ActivityConfig {
    return {
        id: `temp-${year}`,
        year,
        activity_type: 'services_bnc',
        secondary_activity_type: null,
        secondary_activity_share: null,
        acre_enabled: false,
        versement_liberatoire: false,
        annual_ca_goal: null,
        situation_familiale: 'celibataire' satisfies HouseholdStatus,
        parts_fiscales: 1,
        autres_revenus: 0,
    };
}

export function DashboardProvider({ children }: { children: ReactNode }) {
    const [year, setYear] = useState(new Date().getFullYear());
    const [config, setConfigState] = useState<ActivityConfig>(getDefaultConfig(new Date().getFullYear()));
    const [entries, setEntriesState] = useState<MonthlyEntry[]>(
        Array.from({ length: 12 }, (_, i) => ({ month: i + 1, ca_amount: 0, notes: null }))
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [configRes, entriesRes] = await Promise.all([
                fetch(`/api/config?year=${year}`),
                fetch(`/api/entries?year=${year}`),
            ]);

            if (configRes.ok) {
                const configData = await configRes.json();
                setConfigState({
                    ...getDefaultConfig(year),
                    ...configData,
                    id: configData.id || `temp-${year}`,
                    year,
                    secondary_activity_type: configData.secondary_activity_type || null,
                    secondary_activity_share:
                        configData.secondary_activity_share === null || configData.secondary_activity_share === undefined
                            ? null
                            : Number(configData.secondary_activity_share),
                });
            } else if (configRes.status === 401 || configRes.status === 403) {
                toast.error('Votre session a expire.');
                window.location.href = '/auth/login';
                return;
            }

            if (entriesRes.ok) {
                const entriesData: MonthlyEntry[] = await entriesRes.json();
                const mergedEntries = Array.from({ length: 12 }, (_, i) => {
                    const month = i + 1;
                    const found = entriesData.find((entry) => entry.month === month);
                    return {
                        month,
                        ca_amount: found ? Number(found.ca_amount) : 0,
                        notes: found?.notes || null,
                    };
                });
                setEntriesState(mergedEntries);
            } else if (entriesRes.status === 401 || entriesRes.status === 403) {
                toast.error('Votre session a expire.');
                window.location.href = '/auth/login';
                return;
            }
        } catch (err: any) {
            setError(err.message);
            toast.error('Erreur de connexion avec le serveur.');
        } finally {
            setLoading(false);
        }
    }, [year]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateConfig = async (newConfig: Partial<ActivityConfig>) => {
        const updatedConfig = { ...config, ...newConfig, year };
        setConfigState(updatedConfig);
        try {
            const res = await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedConfig),
            });
            if (!res.ok) throw new Error('Failed to save configuration');
            toast.success('Configuration sauvegardee');
        } catch (err: any) {
            console.error('Failed to save config:', err);
            toast.error('Erreur lors de la sauvegarde.');
            setError('Failed to save configuration.');
            fetchData();
        }
    };

    const updateEntry = async (month: number, value: number) => {
        const updatedEntries = entries.map((entry) => entry.month === month ? { ...entry, ca_amount: value } : entry);
        setEntriesState(updatedEntries);

        try {
            const res = await fetch('/api/entries', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ year, month, ca_amount: value }),
            });
            if (!res.ok) throw new Error('Erreur de sauvegarde');
            toast.success('CA mis a jour');
        } catch (err: any) {
            console.error(`Failed to save entry for month ${month}:`, err);
            toast.error('Sauvegarde echouee. Annulation...');
            setError(`Error saving month ${month}`);
            fetchData();
        }
    };

    return (
        <DashboardContext.Provider value={{
            year,
            setYear,
            config,
            updateConfig,
            entries,
            updateEntry,
            loading,
            error,
        }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (!context) throw new Error('useDashboard must be used within DashboardProvider');
    return context;
}