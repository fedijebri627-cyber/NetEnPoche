'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

export interface KPICardProps {
    title: string;
    value: number;
    isCurrency?: boolean;
    trend?: number;
    colorType: 'urssaf' | 'net' | 'cfe' | 'projection';
}

export function KPICard({ title, value, isCurrency = true, trend = 0, colorType }: KPICardProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        let startTime: number;
        const duration = 1000;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const ratio = Math.min(progress / duration, 1);
            const ease = 1 - Math.pow(1 - ratio, 4);

            setDisplayValue(value * ease);

            if (ratio < 1) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [value]);

    const colors = {
        urssaf: 'border-l-[#e84040]',
        net: 'border-l-[#00c875]',
        cfe: 'border-l-[#f5a623]',
        projection: 'border-l-[#6366f1]',
    };

    const formattedValue = isCurrency
        ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(displayValue)
        : Math.round(displayValue).toString();

    const getTrendIcon = () => {
        if (trend > 0) return <ArrowUpRight className="h-4 w-4 text-slate-700" />;
        if (trend < 0) return <ArrowDownRight className="h-4 w-4 text-[#e84040]" />;
        return <Minus className="h-4 w-4 text-slate-400" />;
    };

    const getTrendColor = () => {
        if (trend > 0) return 'text-slate-700';
        if (trend < 0) return 'text-[#e84040]';
        return 'text-slate-400';
    };

    return (
        <div className={`rounded-xl border border-slate-100 border-l-4 bg-white p-5 shadow-sm ${colors[colorType]}`}>
            <h3 className="mb-2 text-[11px] font-medium uppercase tracking-[0.04em] text-slate-500">{title}</h3>
            <div className="mb-2 flex items-baseline justify-between">
                <span className="text-[22px] font-medium text-slate-900">{formattedValue}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] font-medium">
                {getTrendIcon()}
                <span className={getTrendColor()}>{Math.abs(trend)}%</span>
                <span className="ml-1 text-slate-400">vs mois prec.</span>
            </div>
        </div>
    );
}
