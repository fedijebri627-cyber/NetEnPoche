'use client';

import { useEffect, useMemo, useState } from 'react';
import { formatCurrency, getUpcomingUrssafDeadline, type InsightConfig, type InsightMonthlyEntry } from '@/lib/dashboard-insights';

function getDefaultConfig(year: number): InsightConfig {
    return {
        year,
        activity_type: 'services_bnc',
        secondary_activity_type: null,
        secondary_activity_share: null,
        acre_enabled: false,
        versement_liberatoire: false,
        annual_ca_goal: null,
        situation_familiale: 'celibataire',
        parts_fiscales: 1,
        autres_revenus: 0,
    };
}

export function DeadlinePill() {
    const currentYear = new Date().getFullYear();
    const [config, setConfig] = useState<InsightConfig>(getDefaultConfig(currentYear));
    const [entries, setEntries] = useState<InsightMonthlyEntry[]>([]);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let ignore = false;

        async function load() {
            try {
                const [configRes, entriesRes] = await Promise.all([
                    fetch(`/api/config?year=${currentYear}`),
                    fetch(`/api/entries?year=${currentYear}`),
                ]);

                if (!configRes.ok || !entriesRes.ok) {
                    if (!ignore) setReady(true);
                    return;
                }

                const [configData, entriesData] = await Promise.all([configRes.json(), entriesRes.json()]);

                if (ignore) return;

                setConfig({
                    ...getDefaultConfig(currentYear),
                    ...configData,
                    year: currentYear,
                });
                setEntries(
                    Array.isArray(entriesData)
                        ? entriesData.map((entry) => ({
                            month: Number(entry.month || 0),
                            ca_amount: Number(entry.ca_amount || 0),
                            notes: entry.notes || null,
                        }))
                        : []
                );
            } catch {
                // Keep pill hidden on fetch failure.
            } finally {
                if (!ignore) setReady(true);
            }
        }

        void load();

        return () => {
            ignore = true;
        };
    }, [currentYear]);

    const upcoming = useMemo(() => getUpcomingUrssafDeadline(entries, config, 60), [entries, config]);

    if (!ready || !upcoming) return null;

    const isRed = upcoming.daysLeft <= 30;
    const classes = isRed
        ? {
            wrapper: 'border border-[#f09595] bg-[#fcebeb] text-[#791f1f]',
            dot: 'bg-[#e24b4a]',
        }
        : {
            wrapper: 'border border-[#f1d29c] bg-[#faeeda] text-[#633806]',
            dot: 'bg-[#ef9f27]',
        };

    return (
        <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium ${classes.wrapper}`}>
            <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${classes.dot}`} />
            <span className="whitespace-nowrap">
                Échéance URSSAF - {formatCurrency(upcoming.amount)} {`dans ${upcoming.daysLeft} jours`}
            </span>
        </div>
    );
}
