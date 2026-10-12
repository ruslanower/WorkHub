import * as React from 'react';
import { useAppStore } from './store';
import { COUNTRY_PACKS } from '@/countries';
import type { Role } from '@/services/types';
import type { Locale } from '@/countries/types';
import {
  Globe,
  SlidersHorizontal,
  Moon,
  Sun,
  Presentation,
  PlayCircle,
  UserCheck,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const DemoBar: React.FC = () => {
  const {
    countryCode,
    pack,
    locale,
    role,
    theme,
    setCountry,
    setLocale,
    setRole,
    toggleTheme,
    setDemoDrawerOpen,
    setPresentationOpen,
    startTour,
  } = useAppStore();

  const { t } = useTranslation();

  const roles: { key: Role; labelKey: string }[] = [
    { key: 'customer', labelKey: 'roles.customer' },
    { key: 'worker', labelKey: 'roles.worker' },
    { key: 'company', labelKey: 'roles.company' },
    { key: 'admin', labelKey: 'roles.admin' },
    { key: 'partner', labelKey: 'roles.partner' },
    { key: 'investor', labelKey: 'roles.investor' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 text-slate-100 border-b border-slate-800 text-xs select-none shadow-md">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 h-[var(--demo-bar-h)] flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {/* Left: Country Pack Switcher & Indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Globe className="w-3.5 h-3.5 text-teal-400" />
          <span className="font-semibold text-slate-300 hidden sm:inline">Country:</span>
          <select
            value={countryCode}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-slate-800 text-slate-100 border border-slate-700 rounded-md px-2 py-1 text-xs font-medium focus:ring-2 focus:ring-teal-400 focus:outline-none cursor-pointer"
            aria-label="Select Country Pack"
          >
            {Object.keys(COUNTRY_PACKS).map((cc) => (
              <option key={cc} value={cc}>
                {cc} - {COUNTRY_PACKS[cc].name.en} ({COUNTRY_PACKS[cc].currency.code})
              </option>
            ))}
          </select>
        </div>

        {/* Center: Role Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 shrink-0">
          {roles.map((r) => {
            const isActive = role === r.key;
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
                title={t(`roles.roleDesc.${r.key}`)}
              >
                {t(r.labelKey)}
              </button>
            );
          })}
        </div>

        {/* Right: Language, Presentation (P), Tour, Theme, Controls Drawer */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Language Switcher */}
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-md px-1.5 py-1 text-xs uppercase font-medium focus:outline-none cursor-pointer"
            aria-label="Change language"
          >
            {pack.locales.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* Presentation Mode Button */}
          <button
            type="button"
            onClick={() => setPresentationOpen(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 transition-colors font-medium"
            title="Open 12-slide Pitch Presentation (Shortcut: P)"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Deck (P)</span>
          </button>

          {/* Guided Tour Button */}
          <button
            type="button"
            onClick={startTour}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-teal-800/70 hover:bg-teal-700 text-teal-100 border border-teal-600/50 transition-colors font-medium"
            title="Start Interactive Guided Tour"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tour</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
            aria-label="Toggle color theme"
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          {/* Demo Controls Drawer button */}
          <button
            type="button"
            onClick={() => setDemoDrawerOpen(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Demo Simulator & State Advancer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Controls</span>
          </button>
        </div>
      </div>
    </header>
  );
};
