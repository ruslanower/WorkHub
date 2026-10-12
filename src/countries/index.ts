import type { CountryPack } from './types';
import { UA } from './ua';
import { PL } from './pl';
import { KE } from './ke';

/** Registry of available Country Packs. Add new packs here (see docs/COUNTRY_PACK_GUIDE.md). */
export const COUNTRY_PACKS: Record<string, CountryPack> = { UA, PL, KE };
export const DEFAULT_COUNTRY = 'UA';
export * from './types';
