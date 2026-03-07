'use client';

import { useState, useEffect } from 'react';
import { Bell, Mail, Clock, ShieldAlert, Target, Play } from 'lucide-react';
import { FeatureLock } from '@/components/dashboard/FeatureLock';

interface AlertPref {
    alert_type: string;
    enabled: boolean;
    threshold_value: number;
}

export function AlertPreferencesPanel() {
    const [prefs, setPrefs] = useState<AlertPref[]>([]);
    const [loading, setLoading] = useState(true);
    const [testingId, setTestingId] = useState<string | null>(null);

    // Default configuration blueprint
    const alertTypes = [
        { id: 'urssaf_reminder', title: 'Rappel URSSAF', desc: 'Jours avant échéance', icon: Clock, defaultThreshold: 14, min: 1, max: 30, unit: 'jours' },
        { id: 'tva_threshold', title: 'Plafond TVA', desc: '% du plafond', icon: ShieldAlert, defaultThreshold: 80, min: 10, max: 100, unit: '%' },
        { id: 'monthly_drop', title: 'Baisse de CA', desc: 'Baisse vs mois M-1', icon: Bell, defaultThreshold: 30, min: 5, max: 100, unit: '%' },
        { id: 'annual_goal', title: 'Objectif Annuel', desc: '% de l\'objectif CA', icon: Target, defaultThreshold: 75, min: 10, max: 100, unit: '%' },
        { id: 'missing_entry', title: 'Oubli de saisie', desc: 'Rappel le 10 du mois', icon: Mail, defaultThreshold: 10, min: 10, max: 20, unit: 'du mois', hideInput: true }
    ];

    useEffect(() => {
        fetch('/api/alerts')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setPrefs(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleToggle = async (id: string, currentEnabled: boolean, defaultThreshold: number) => {
        // Optimistic UI
        const existing = prefs.find(p => p.alert_type === id);
        const newStatus = !currentEnabled;
        const threshold = existing ? existing.threshold_value : defaultThreshold;

        const newPrefs = existing
            ? prefs.map(p => p.alert_type === id ? { ...p, enabled: newStatus } : p)
            : [...prefs, { alert_type: id, enabled: newStatus, threshold_value: threshold }];

        setPrefs(newPrefs);

        await fetch('/api/alerts', {
            method: 'POST',
            body: JSON.stringify({ alert_type: id, enabled: newStatus, threshold_value: threshold })
        });
    };

    const handleThresholdChange = async (id: string, value: number, isEnabled: boolean) => {
        const newPrefs = prefs.map(p => p.alert_type === id ? { ...p, threshold_value: value } : p);
        if (!prefs.find(p => p.alert_type === id)) {
            newPrefs.push({ alert_type: id, enabled: isEnabled, threshold_value: value });
        }
        setPrefs(newPrefs);

        await fetch('/api/alerts', {
            method: 'POST',
            body: JSON.stringify({ alert_type: id, enabled: isEnabled, threshold_value: value })
        });
    };

    const handleTestAlert = async (id: string) => {
        setTestingId(id);
        try {
            await fetch('/api/alerts/test', {
                method: 'POST',
                body: JSON.stringify({ alert_type: id })
            });
            alert('Email de test envoyé avec succès ! Vérifiez votre boîte de réception.');
        } catch {
            alert('Erreur lors de l\'envoi du test.');
        }
        setTestingId(null);
    };

    const getPref = (id: string, defaultThreshold: number) => {
        const pref = prefs.find(p => p.alert_type === id);
        return {
            enabled: pref ? pref.enabled : false,
            threshold: pref ? pref.threshold_value : defaultThreshold
        };
    };

    if (loading) return <div className="animate-pulse h-96 bg-slate-100 rounded-3xl" />;

    return (
        <FeatureLock featureName="Alertes & Notifications" requiredTier="pro">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold font-syne text-[#0d1b35] flex items-center gap-2">
                        <Bell className="w-5 h-5 text-indigo-500" />
                        Configurations des Alertes Emails
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Recevez des notifications automatiques dès que des événements comptables importants surviennent.
                    </p>
                </div>

                <div className="divide-y divide-slate-100">
                    {alertTypes.map(type => {
                        const { enabled, threshold } = getPref(type.id, type.defaultThreshold);
                        const Icon = type.icon;

                        return (
                            <div key={type.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                                {/* Info Box */}
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={`p-2.5 rounded-xl ${enabled ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{type.title}</h3>
                                        {/* Status Chip */}
                                        <div className="mt-1.5 flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${enabled ? 'bg-[#00c875]' : 'bg-slate-300'}`} />
                                            <span className="text-xs font-medium text-slate-500">
                                                {enabled ? `Surveillance active (Seuil: ${threshold}${type.unit})` : 'Désactivé'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center gap-4">
                                    {!type.hideInput && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <input
                                                type="number"
                                                min={type.min}
                                                max={type.max}
                                                value={threshold}
                                                disabled={!enabled}
                                                onChange={(e) => handleThresholdChange(type.id, parseInt(e.target.value) || type.min, enabled)}
                                                className="w-16 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-2 py-1.5 text-center focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                                            />
                                            <span className="text-slate-500 font-medium">{type.unit}</span>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                                        <button
                                            onClick={() => handleTestAlert(type.id)}
                                            disabled={testingId === type.id}
                                            className="text-slate-400 hover:text-indigo-600 transition-colors"
                                            title="Tester l'alerte par email"
                                        >
                                            <Play className={`w-5 h-5 ${testingId === type.id ? 'animate-pulse text-indigo-500' : ''}`} />
                                        </button>

                                        {/* Toggle Switch Concept */}
                                        <button
                                            onClick={() => handleToggle(type.id, enabled, type.defaultThreshold)}
                                            className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-[#00c875]' : 'bg-slate-300'}`}
                                        >
                                            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </FeatureLock>
    );
}
