import * as React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAppStore } from './store';
import { DemoBar } from './DemoBar';
import { TopModeToggle } from './TopModeToggle';
import { BRAND_NAME } from '@/config/brand';
import {
  Compass,
  PlusCircle,
  Briefcase,
  LayoutDashboard,
  Wallet,
  User,
  Building2,
  ShieldAlert,
  BarChart3,
  TrendingUp,
  Home,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';

export const Shell: React.FC = () => {
  const { role, pack, currentUser } = useAppStore();
  const { t } = useTranslation();
  const location = useLocation();

  // Navigation items dynamically adapted to active role
  const getNavLinks = () => {
    switch (role) {
      case 'worker':
        return [
          { to: '/', labelKey: 'nav.home', icon: Home },
          { to: '/tasks', labelKey: 'nav.browse', icon: Compass },
          { to: '/jobs', labelKey: 'nav.myJobs', icon: Briefcase },
          { to: '/dashboard/worker', labelKey: 'nav.dashboard', icon: LayoutDashboard },
          { to: '/wallet', labelKey: 'nav.wallet', icon: Wallet },
          { to: '/profile', labelKey: 'nav.profile', icon: User },
        ];
      case 'company':
        return [
          { to: '/', labelKey: 'nav.home', icon: Home },
          { to: '/company', labelKey: 'nav.company', icon: Building2 },
          { to: '/tasks', labelKey: 'nav.browse', icon: Compass },
          { to: '/tasks/new', labelKey: 'nav.postTask', icon: PlusCircle },
          { to: '/jobs', labelKey: 'nav.myJobs', icon: Briefcase },
        ];
      case 'admin':
        return [
          { to: '/admin', labelKey: 'nav.admin', icon: ShieldAlert },
          { to: '/tasks', labelKey: 'nav.browse', icon: Compass },
          { to: '/jobs', labelKey: 'nav.myJobs', icon: Briefcase },
          { to: '/investor', labelKey: 'nav.investor', icon: TrendingUp },
        ];
      case 'partner':
        return [
          { to: '/partner', labelKey: 'nav.partner', icon: BarChart3 },
          { to: '/tasks', labelKey: 'nav.browse', icon: Compass },
          { to: '/investor', labelKey: 'nav.investor', icon: TrendingUp },
        ];
      case 'investor':
        return [
          { to: '/investor', labelKey: 'nav.investor', icon: TrendingUp },
          { to: '/', labelKey: 'nav.home', icon: Home },
          { to: '/tasks', labelKey: 'nav.browse', icon: Compass },
          { to: '/partner', labelKey: 'nav.partner', icon: BarChart3 },
        ];
      case 'customer':
      default:
        return [
          { to: '/', labelKey: 'nav.home', icon: Home },
          { to: '/tasks', labelKey: 'nav.browse', icon: Compass },
          { to: '/tasks/new', labelKey: 'nav.postTask', icon: PlusCircle },
          { to: '/jobs', labelKey: 'nav.myJobs', icon: Briefcase },
          { to: '/dashboard/customer', labelKey: 'nav.dashboard', icon: LayoutDashboard },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* 1. Global Presenter Demo Bar */}
      <DemoBar />

      {/* 2. Top Navigation Toggle: App Mode | Google AI Showcase | Impact & Unit Economics */}
      <TopModeToggle />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* 2. Desktop Left Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-border p-4 shrink-0 justify-between">
          <div className="space-y-6">
            {/* Brand Logo header */}
            <div className="px-3 pt-2">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-base shadow-sm">
                  W
                </div>
                <div>
                  <span className="font-bold text-lg tracking-tight text-foreground block group-hover:text-primary transition-colors">
                    {BRAND_NAME}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono block -mt-1">
                    {t('common.brandWorkingTitle')}
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{t(link.labelKey)}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Google Evaluator Showcase Links */}
            <div className="pt-2 border-t border-border/60">
              <span className="px-3 text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block mb-1">
                Google for Startups
              </span>
              <nav className="space-y-1">
                <Link
                  to="/google-showcase"
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors',
                    location.pathname === '/google-showcase'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-teal-700 dark:text-teal-300 hover:bg-teal-500/10',
                  )}
                >
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-300" />
                  <span>Google AI Showcase</span>
                </Link>

                <Link
                  to="/impact-metrics"
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors',
                    location.pathname === '/impact-metrics'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <BarChart3 className="w-4 h-4 shrink-0" />
                  <span>Impact & Unit Econ</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* User profile snippet in sidebar */}
          {currentUser && (
            <div className="p-3 rounded-xl bg-card border border-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                {currentUser.initials}
              </div>
              <div className="truncate">
                <span className="font-semibold text-xs text-foreground block truncate">
                  {currentUser.name.en}
                </span>
                <span className="text-[11px] text-muted-foreground capitalize block truncate">
                  {currentUser.accountType.replace('_', ' ')}
                </span>
              </div>
            </div>
          )}
        </aside>

        {/* 3. Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* 4. Mobile Bottom Tab Bar (360px up) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border flex items-center justify-around h-16 px-2 text-[11px] shadow-lifted">
        {navLinks.slice(0, 5).map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-2 rounded-lg gap-1 transition-colors',
                isActive ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="truncate max-w-[64px]">{t(link.labelKey)}</span>
            </Link>
          );
        })}
      </nav>

      {/* 5. Persistent Investor Prototype Footer Note */}
      <footer className="w-full py-2 bg-slate-950 text-slate-400 text-center text-[11px] tracking-wide border-t border-slate-900 select-none">
        {t('common.prototypeNote')} • {t('common.illustrativeNote')}
      </footer>
    </div>
  );
};
