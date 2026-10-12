import type { CountryPack, Locale, LocalizedText } from '@/countries/types';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { uk as ukLocale, pl as plLocale, enUS } from 'date-fns/locale';

const dateFnsLocales: Record<string, typeof enUS> = {
  en: enUS,
  uk: ukLocale,
  pl: plLocale,
  sw: enUS, // date-fns fallback for Swahili
};

/**
 * Resolves a LocalizedText object into string for the active locale,
 * falling back to English.
 */
export function getLocalizedText(text: LocalizedText | string | undefined, locale: Locale): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[locale] || text.en || Object.values(text)[0] || '';
}

/**
 * Format currency using standard Intl.NumberFormat according to the country's settings.
 */
export function formatCurrency(
  amount: number,
  pack: Pick<CountryPack, 'currency' | 'intlRegion'>,
  locale: Locale = 'en',
): string {
  try {
    const langTag = `${locale}-${pack.intlRegion}`;
    return new Intl.NumberFormat(langTag, {
      style: 'currency',
      currency: pack.currency.code,
      minimumFractionDigits: pack.currency.decimals,
      maximumFractionDigits: pack.currency.decimals,
    }).format(amount);
  } catch {
    return `${amount.toFixed(pack.currency.decimals)} ${pack.currency.symbol}`;
  }
}

/**
 * Format percentage (e.g. 0.05 -> 5%).
 */
export function formatPercent(value: number, decimals: number = 0, locale: Locale = 'en'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch {
    return `${(value * 100).toFixed(decimals)}%`;
  }
}

/**
 * Format date nicely with Intl or date-fns.
 */
export function formatDate(isoDate: string, formatStr: string = 'PP', locale: Locale = 'en'): string {
  try {
    const d = typeof isoDate === 'string' ? parseISO(isoDate) : (isoDate as Date);
    const dateLocale = dateFnsLocales[locale] || enUS;
    return format(d, formatStr, { locale: dateLocale });
  } catch {
    return isoDate;
  }
}

/**
 * Relative time from now (e.g. "3 days ago").
 */
export function formatRelativeTime(isoDate: string, locale: Locale = 'en'): string {
  try {
    const d = typeof isoDate === 'string' ? parseISO(isoDate) : (isoDate as Date);
    const dateLocale = dateFnsLocales[locale] || enUS;
    return formatDistanceToNow(d, { addSuffix: true, locale: dateLocale });
  } catch {
    return isoDate;
  }
}
