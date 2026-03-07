'use client';
import { useEffect, useState, useRef } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface KPICardProps {
    title: string;
    value: number;
    isCurrency?: boolean;
    trend?: number; // percentage change vs last month
    colorType: 'urssaf' | 'net' | 'cfe' | 'projection';
}

export function KPICard({ title, value, isCurrency = true, trend = 0, colorType }: KPICardProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const animationRef = useRef<number | null>(null); // Type explicitly set

    useEffect(() => {
        let startTime: number;
        const duration = 1000; // 1 second animation

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const ratio = Math.min(progress / duration, 1);

            // Easing function (easeOutQuart)
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
        projection: 'border-l-[#6366f1]'
    };

    const formattedValue = isCurrency
        ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(displayValue)
        : Math.round(displayValue).toString();

    const getTrendIcon = () => {
        if (trend > 0) return <ArrowUpRight className="w-4 h-4 text-[#00c875]" />;
        if (trend < 0) return <ArrowDownRight className="w-4 h-4 text-[#e84040]" />;
        return <Minus className="w-4 h-4 text-slate-400" />;
    };

    const getTrendColor = () => {
        if (trend > 0) return 'text-[#00c875]';
        if (trend < 0) return 'text-[#e84040]';
        return 'text-slate-400';
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-5 border-l-4 ${colors[colorType]}`}>
            <h3 className="text-slate-500 text-sm font-medium mb-2">{title}</h3>
            <div className="flex items-baseline justify-between mb-2">
                <span className="text-2xl font-bold font-syne text-[#0d1b35]">{formattedValue}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-medium">
                {getTrendIcon()}
                <span className={getTrendColor()}>
                    {Math.abs(trend)}%
                </span>
                <span className="text-slate-400 font-normal ml-1">vs mois préc.</span>
            </div>
        </div>
    );
}
