import { create } from 'zustand';
import type { CountryPack, Locale } from '@/countries/types';
import { COUNTRY_PACKS, DEFAULT_COUNTRY } from '@/countries';
import type { Role, User } from '@/services/types';
import { setAppLocale } from '@/i18n';
import { getServices } from '@/services/registry';

interface AppState {
  countryCode: string;
  pack: CountryPack;
  locale: Locale;
  role: Role;
  theme: 'light' | 'dark';
  currentUser: User | null;
  demoDrawerOpen: boolean;
  presentationOpen: boolean;
  tourStep: number | null; // 0..7 or null

  // Actions
  setCountry: (countryCode: string) => void;
  setLocale: (locale: Locale) => void;
  setRole: (role: Role) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setDemoDrawerOpen: (open: boolean) => void;
  setPresentationOpen: (open: boolean) => void;
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;
  refreshCurrentUser: () => Promise<void>;
  updatePackFees: (fees: Partial<CountryPack['fees']>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  countryCode: DEFAULT_COUNTRY,
  pack: COUNTRY_PACKS[DEFAULT_COUNTRY] || COUNTRY_PACKS.UA,
  locale: 'uk',
  role: 'customer',
  theme: 'light',
  currentUser: null,
  demoDrawerOpen: false,
  presentationOpen: false,
  tourStep: null,

  setCountry: (code: string) => {
    const nextPack = COUNTRY_PACKS[code] || COUNTRY_PACKS.UA;
    const currentLocales = nextPack.locales;
    const nextLocale = currentLocales.includes(get().locale) ? get().locale : nextPack.defaultLocale;

    setAppLocale(nextLocale);
    set({
      countryCode: nextPack.code,
      pack: { ...nextPack },
      locale: nextLocale,
    });
    get().refreshCurrentUser();
  },

  setLocale: (locale: Locale) => {
    setAppLocale(locale);
    set({ locale });
  },

  setRole: (role: Role) => {
    set({ role });
    get().refreshCurrentUser();
  },

  setTheme: (theme: 'light' | 'dark') => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    set({ theme });
  },

  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(next);
  },

  setDemoDrawerOpen: (open: boolean) => set({ demoDrawerOpen: open }),
  setPresentationOpen: (open: boolean) => set({ presentationOpen: open }),

  startTour: () => set({ tourStep: 0 }),
  nextTourStep: () => {
    const step = get().tourStep;
    if (step != null && step < 7) {
      set({ tourStep: step + 1 });
    } else {
      set({ tourStep: null });
    }
  },
  prevTourStep: () => {
    const step = get().tourStep;
    if (step != null && step > 0) {
      set({ tourStep: step - 1 });
    }
  },
  endTour: () => set({ tourStep: null }),

  refreshCurrentUser: async () => {
    const { countryCode, role } = get();
    if (role === 'investor') {
      set({ currentUser: null });
      return;
    }
    try {
      const users = await getServices().users.list({ countryCode });
      const filtered = users.filter((u) => {
        if (role === 'customer') return u.accountType === 'customer';
        if (role === 'worker') return u.accountType === 'worker';
        if (role === 'company') return u.accountType === 'company_member' || u.companyId != null;
        if (role === 'admin') return true;
        if (role === 'partner') return true;
        return true;
      });
      set({ currentUser: filtered[0] || users[0] || null });
    } catch {
      // fallback
    }
  },

  updatePackFees: (feePatch: Partial<CountryPack['fees']>) => {
    const current = get().pack;
    const updated = {
      ...current,
      fees: { ...current.fees, ...feePatch },
    };
    COUNTRY_PACKS[current.code] = updated;
    set({ pack: { ...updated } });
  },
}));
