import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, LayoutGrid, BarChart3, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/cn';

export const TopModeToggle: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const isGoogleShowcase = path === '/google-showcase';
  const isImpact = path === '/impact-metrics';
  const isAppMode = !isGoogleShowcase && !isImpact;

  return (
    <div className="w-full bg-card/90 backdrop-blur-md border-b border-border py-2 px-3 sm:px-6 sticky top-[var(--demo-bar-h)] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
        {/* Primary 3-Way Top Navigation Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-muted border border-border shadow-inner shrink-0">
          {/* 1. App Mode */}
          <Link
            to="/tasks"
            className={cn(
              'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
              isAppMode
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/60',
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
            <span>App Mode</span>
          </Link>

          {/* 2. Google AI Showcase */}
          <Link
            to="/google-showcase"
            className={cn(
              'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all relative',
              isGoogleShowcase
                ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-400/30'
                : 'text-teal-700 dark:text-teal-300 hover:text-foreground hover:bg-teal-500/10',
            )}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-300" />
            <span>Google AI Showcase</span>
            <span className="hidden sm:inline px-1.5 py-0.5 rounded-full text-[9px] bg-teal-800 text-teal-100 font-extrabold uppercase tracking-wide">
              Evaluator
            </span>
          </Link>

          {/* 3. Impact & Unit Economics */}
          <Link
            to="/impact-metrics"
            className={cn(
              'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
              isImpact
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/60',
            )}
          >
            <BarChart3 className="w-3.5 h-3.5 shrink-0" />
            <span>Impact & Unit Economics</span>
          </Link>
        </div>

        {/* Google Fund Context Badge */}
        <div className="hidden lg:flex items-center gap-2 text-xs shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-semibold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
            <span>Google for Startups Ukraine Support Fund Ready</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">
            $350k GCP Credits Pipeline
          </span>
        </div>
      </div>
    </div>
  );
};
