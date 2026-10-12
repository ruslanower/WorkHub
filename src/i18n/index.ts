import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { uk } from './locales/uk';
import { pl } from './locales/pl';
import { sw } from './locales/sw';
import type { Locale } from '@/countries/types';

export const resources = {
  en: { translation: en },
  uk: { translation: uk },
  pl: { translation: pl },
  sw: { translation: sw },
} as const;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'uk', // Ukraine default for UA initial pack
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    returnNull: false,
  });

export function setAppLocale(locale: Locale): void {
  i18n.changeLanguage(locale);
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale;
  }
}

export default i18n;
export * from './formatters';
