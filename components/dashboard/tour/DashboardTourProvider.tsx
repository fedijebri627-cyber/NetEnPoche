'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bot, ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react';
import { getTourForPath, type TourPlacement } from './tours';

interface DashboardTourContextValue {
    hasTour: boolean;
    isOpen: boolean;
    startCurrentTour: () => void;
    closeTour: () => void;
}

const DashboardTourContext = createContext<DashboardTourContextValue | undefined>(undefined);
const STORAGE_KEY = 'nep_guided_tour_seen_v1';

type TooltipStyle = {
    top: number;
    left: number;
};

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

function computeTooltipStyle(targetRect: DOMRect | null, placement: TourPlacement | undefined): TooltipStyle {
    if (typeof window === 'undefined') {
        return { top: 24, left: 24 };
    }

    const panelWidth = Math.min(264, window.innerWidth - 20);
    const estimatedHeight = 168;
    const margin = 10;

    if (!targetRect || placement === 'center') {
        return {
            top: Math.max(12, (window.innerHeight - estimatedHeight) / 2),
            left: Math.max(12, (window.innerWidth - panelWidth) / 2),
        };
    }

    let top = targetRect.bottom + margin;
    let left = clamp(targetRect.left, 12, window.innerWidth - panelWidth - 12);

    if (placement === 'top') {
        top = targetRect.top - estimatedHeight - margin;
    } else if (placement === 'left') {
        left = targetRect.left - panelWidth - margin;
        top = clamp(targetRect.top, 12, window.innerHeight - estimatedHeight - 12);
    } else if (placement === 'right') {
        left = targetRect.right + margin;
        top = clamp(targetRect.top, 12, window.innerHeight - estimatedHeight - 12);
    }

    const fitsRight = targetRect.right + panelWidth + margin <= window.innerWidth - 12;
    const fitsLeft = targetRect.left - panelWidth - margin >= 12;

    if (top + estimatedHeight > window.innerHeight - 12) {
        if ((placement === 'bottom' || placement === undefined) && fitsRight) {
            left = targetRect.right + margin;
            top = clamp(targetRect.top, 12, window.innerHeight - estimatedHeight - 12);
        } else if ((placement === 'bottom' || placement === undefined) && fitsLeft) {
            left = targetRect.left - panelWidth - margin;
            top = clamp(targetRect.top, 12, window.innerHeight - estimatedHeight - 12);
        } else {
            top = Math.max(12, targetRect.top - estimatedHeight - margin);
        }
    }

    if (left + panelWidth > window.innerWidth - 12) {
        left = window.innerWidth - panelWidth - 12;
    }

    if (left < 12) {
        left = 12;
    }

    return { top, left };
}

export function DashboardTourProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const currentTour = useMemo(() => getTourForPath(pathname), [pathname]);
    const [isOpen, setIsOpen] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const activeElementRef = useRef<HTMLElement | null>(null);
    const currentStep = currentTour?.steps[stepIndex] ?? null;

    const clearActiveTarget = () => {
        if (activeElementRef.current) {
            activeElementRef.current.removeAttribute('data-tour-active');
            activeElementRef.current = null;
        }
    };

    const closeTour = () => {
        clearActiveTarget();
        setIsOpen(false);
        setStepIndex(0);
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, 'true');
        }
    };

    const startCurrentTour = () => {
        if (!currentTour) return;
        setStepIndex(0);
        setIsOpen(true);
    };

    useEffect(() => {
        clearActiveTarget();
        if (!currentTour) {
            setIsOpen(false);
            setStepIndex(0);
        }
    }, [currentTour, pathname]);

    useEffect(() => {
        if (!currentTour || typeof window === 'undefined') return;
        const hasSeenTour = localStorage.getItem(STORAGE_KEY);
        if (hasSeenTour) return;

        const timeout = window.setTimeout(() => {
            setStepIndex(0);
            setIsOpen(true);
        }, 700);

        return () => window.clearTimeout(timeout);
    }, [currentTour, pathname]);

    useEffect(() => {
        if (!isOpen || !currentStep) {
            clearActiveTarget();
            return;
        }

        let frame = 0;

        const updateTarget = () => {
            const nextTarget = document.querySelector(`[data-tour="${currentStep.target}"]`) as HTMLElement | null;
            clearActiveTarget();

            if (!nextTarget) {
                setTargetRect(null);
                return;
            }

            nextTarget.setAttribute('data-tour-active', 'true');
            activeElementRef.current = nextTarget;
            nextTarget.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            frame = window.requestAnimationFrame(() => {
                setTargetRect(nextTarget.getBoundingClientRect());
            });
        };

        updateTarget();
        const handleViewportChange = () => updateTarget();
        const interval = window.setInterval(updateTarget, 400);
        window.addEventListener('resize', handleViewportChange);
        window.addEventListener('scroll', handleViewportChange, true);

        return () => {
            window.cancelAnimationFrame(frame);
            window.clearInterval(interval);
            window.removeEventListener('resize', handleViewportChange);
            window.removeEventListener('scroll', handleViewportChange, true);
            clearActiveTarget();
        };
    }, [isOpen, currentStep]);

    const tooltipStyle = useMemo(
        () => computeTooltipStyle(targetRect, currentStep?.placement),
        [currentStep?.placement, targetRect]
    );

    const contextValue = useMemo<DashboardTourContextValue>(
        () => ({
            hasTour: Boolean(currentTour),
            isOpen,
            startCurrentTour,
            closeTour,
        }),
        [currentTour, isOpen]
    );

    return (
        <DashboardTourContext.Provider value={contextValue}>
            {children}

            {isOpen && currentTour && currentStep && (
                <>
                    <div className="fixed inset-0 z-[45] bg-slate-950/60 backdrop-blur-[1px]" />
                    <div
                        className="fixed z-[95] flex max-h-[calc(100vh-20px)] w-[min(76vw,264px)] flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.38)]"
                        style={tooltipStyle}
                    >
                        <div className="relative shrink-0 border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,_rgba(0,200,117,0.18),_transparent_35%),linear-gradient(135deg,#0d1b35_0%,#12244a_100%)] px-3.5 py-3 text-white">
                            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-100">
                                <Bot className="h-3.5 w-3.5" />
                                Guide NetEnPoche
                            </div>
                            <div className="min-w-0 pr-11">
                                <h3 className="font-syne text-[0.9rem] font-bold leading-tight sm:text-[0.95rem]">{currentStep.title}</h3>
                                <p className="mt-2 text-[12px] leading-[1.45] text-slate-200">{currentStep.description}</p>
                            </div>
                            <button
                                type="button"
                                onClick={closeTour}
                                className="absolute right-3 top-[2.65rem] rounded-full border border-white/10 bg-white/10 p-1.5 text-slate-100 transition hover:bg-white/15"
                                aria-label="Fermer le guide"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <div className="shrink-0 space-y-3 px-3.5 py-3">
                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
                                    <Sparkles className="h-4 w-4 text-emerald-500" />
                                    {currentTour.label}
                                </span>
                                <span>Etape {stepIndex + 1} / {currentTour.steps.length}</span>
                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300"
                                    style={{ width: `${((stepIndex + 1) / currentTour.steps.length) * 100}%` }}
                                />
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
                                    disabled={stepIndex === 0}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Precedent
                                </button>

                                {stepIndex === currentTour.steps.length - 1 ? (
                                    <button
                                        type="button"
                                        onClick={closeTour}
                                        className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-3 py-2 text-[13px] font-bold text-white transition hover:bg-emerald-600"
                                    >
                                        Terminer
                                        <Sparkles className="h-4 w-4" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setStepIndex((current) => Math.min(currentTour.steps.length - 1, current + 1))}
                                        className="inline-flex items-center gap-2 rounded-2xl bg-[#0d1b35] px-3 py-2 text-[13px] font-bold text-white transition hover:bg-[#13264a]"
                                    >
                                        Suivant
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style jsx global>{`
                [data-tour-active='true'],
                [data-tour-pulse='true'] {
                    position: relative !important;
                    z-index: 80 !important;
                    border-radius: 24px !important;
                }

                [data-tour-active='true'] {
                    box-shadow:
                        0 0 0 3px rgba(16, 185, 129, 0.9),
                        0 24px 60px rgba(15, 23, 42, 0.45) !important;
                    transition: box-shadow 180ms ease;
                }

                [data-tour-pulse='true'] {
                    animation: nep-tour-pulse 1.8s ease-out;
                    box-shadow:
                        0 0 0 3px rgba(56, 189, 248, 0.95),
                        0 18px 48px rgba(15, 23, 42, 0.28) !important;
                }

                @keyframes nep-tour-pulse {
                    0% {
                        box-shadow:
                            0 0 0 0 rgba(56, 189, 248, 0.55),
                            0 18px 48px rgba(15, 23, 42, 0.18);
                    }
                    35% {
                        box-shadow:
                            0 0 0 8px rgba(56, 189, 248, 0.16),
                            0 18px 48px rgba(15, 23, 42, 0.24);
                    }
                    100% {
                        box-shadow:
                            0 0 0 3px rgba(56, 189, 248, 0.95),
                            0 18px 48px rgba(15, 23, 42, 0.28);
                    }
                }
            `}</style>
        </DashboardTourContext.Provider>
    );
}

export function useDashboardTour() {
    const context = useContext(DashboardTourContext);
    if (!context) {
        throw new Error('useDashboardTour must be used within DashboardTourProvider');
    }
    return context;
}