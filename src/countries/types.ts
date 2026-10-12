/**
 * COUNTRY PACK - the central extension point of the platform.
 *
 * Everything that differs between countries lives in a Country Pack object and
 * NEVER inside components. Launching in a new country = adding a new pack
 * (see docs/COUNTRY_PACK_GUIDE.md), not rewriting code.
 *
 * All provider names, programs, fees and legal texts in the demo packs are
 * ILLUSTRATIVE and require local legal validation.
 */
import { z } from 'zod';

/** UI locales shipped with the prototype. Add a locale folder in src/i18n/locales to extend. */
export const SUPPORTED_LOCALES = ['en', 'uk', 'pl', 'sw'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Text that is part of country configuration (category names, program names,
 * legal notices). `en` is mandatory as the fallback; add one entry per pack locale.
 * UI chrome strings are NOT stored here - they live in src/i18n/locales.
 */
export type LocalizedText = { en: string } & Partial<Record<Locale, string>>;

export interface CurrencyConfig {
  /** ISO 4217 code, e.g. "UAH". Used with Intl.NumberFormat. */
  code: string;
  /** Display symbol, used only where Intl output is not suitable (e.g. input adornments). */
  symbol: string;
  /** Minor units used for rounding all fee calculations. */
  decimals: number;
}

export interface FeeConfig {
  /** Service fee charged to the customer on top of the job amount (fraction, 0.05 = 5%). */
  customerPct: number;
  /** Service fee deducted from the worker payout (fraction). */
  workerPct: number;
  /** Minimum customer fee per job, in major currency units. */
  minFee: number;
  /** Flat fee per withdrawal to an external payout method, in major units. */
  payoutFee: number;
}

export interface IdentityLevel {
  /** 0 = phone/email, 1 = document + selfie, 2 = state digital ID, 3 = license/permit. */
  level: 0 | 1 | 2 | 3;
  label: LocalizedText;
  /** Ordered steps shown in the verification wizard. */
  steps: LocalizedText[];
}

export interface IdentityConfig {
  /** Plain-text provider name (never a logo). Illustrative. */
  providerName: string;
  levels: IdentityLevel[];
  note: LocalizedText;
  /** Configurable privacy statement shown during verification. */
  privacyNote: LocalizedText;
}

export type PayoutKind = 'card' | 'iban' | 'bank_transfer' | 'instant_bank' | 'mobile_money';

export interface PayoutMethod {
  id: string;
  kind: PayoutKind;
  label: LocalizedText;
  /** Human readable arrival time, e.g. "1-2 business days". */
  eta: LocalizedText;
  /** Extra fee on top of fees.payoutFee for instant methods, in major units. */
  extraFee: number;
}

export interface PaymentsConfig {
  /** Licensed payment partner that holds funds. Plain text, illustrative. */
  partnerName: string;
  /** Wording used everywhere for held funds, e.g. "Protected payment". */
  protectedPaymentLabel: LocalizedText;
  payoutMethods: PayoutMethod[];
  /** Must stay false in all demo packs. Enable only where regulation allows. */
  cryptoEnabled: boolean;
  /** Show mobile-money options first and simplify payout UX. */
  mobileMoneyFirst: boolean;
}

export type DocumentKind = 'agreement' | 'completion_act' | 'invoice' | 'receipt';

export interface DocumentTemplate {
  id: string;
  kind: DocumentKind;
  title: LocalizedText;
  /**
   * Template body with {{placeholders}}. Supported placeholders:
   * {{brand}} {{docNumber}} {{date}} {{city}} {{customerName}} {{workerName}}
   * {{workerStatus}} {{taskTitle}} {{amount}} {{customerFee}} {{workerFee}}
   * {{customerPays}} {{workerReceives}} {{partnerName}} {{protectedPaymentLabel}}
   * {{milestones}} {{autoReleaseDays}}
   */
  body: LocalizedText;
}

export interface WorkerTaxStatus {
  id: string;
  label: LocalizedText;
  hint: LocalizedText;
}

export interface TaxConfig {
  workerStatuses: WorkerTaxStatus[];
  documentTemplates: DocumentTemplate[];
  note: LocalizedText;
}

export interface TaskTemplate {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  /** Typical duration in hours, used by the post wizard. */
  durationHours: number;
}

export interface Category {
  id: string;
  label: LocalizedText;
  /** lucide-react icon name (see src/components/ui/CategoryIcon.tsx). */
  icon: string;
  /** Illustrative price guidance in major units. */
  priceGuide: { min: number; max: number };
  templates: TaskTemplate[];
}

export interface RegulatedTrade {
  /** Category id that requires a permit (L3) to make offers. */
  categoryId: string;
  permitName: LocalizedText;
}

export interface PriorityProgram {
  id: string;
  label: LocalizedText;
  description: LocalizedText;
  /** Where eligibility is confirmed (registry, certificate...). Illustrative. */
  verificationSource: LocalizedText;
  benefits: LocalizedText[];
}

export interface City {
  id: string;
  name: LocalizedText;
  /** Position on the stylized MapStub, 0-100 on each axis. */
  x: number;
  y: number;
  districts: string[];
}

export interface CountryPack {
  /** ISO 3166-1 alpha-2. */
  code: string;
  name: LocalizedText;
  defaultLocale: Locale;
  /** Locales offered in the language switcher for this country. Must include "en". */
  locales: Locale[];
  /** BCP-47 region suffix used with Intl, e.g. "UA" -> "uk-UA". */
  intlRegion: string;
  currency: CurrencyConfig;
  fees: FeeConfig;
  /** Max simultaneous active jobs for accounts younger than 30 days (anti-fraud). */
  newAccountJobCap: number;
  /** Days after delivery when funds auto-release unless disputed. */
  autoReleaseDays: number;
  identity: IdentityConfig;
  payments: PaymentsConfig;
  tax: TaxConfig;
  categories: Category[];
  regulatedTrades: RegulatedTrade[];
  priorityPrograms: PriorityProgram[];
  cities: City[];
  emergencyNumber: string;
  legalNotices: LocalizedText[];
  /** Lighter UI: fewer images/animations, compact lists. */
  lowBandwidthMode: boolean;
  /** Approval threshold suggestion for company accounts, major units. */
  companyApprovalThreshold: number;
}

/* ------------------------------------------------------------------ */
/* Zod schema - validated in the admin "Country Pack inspector".       */
/* ------------------------------------------------------------------ */

const localeSchema = z.enum(SUPPORTED_LOCALES);
const lt = z
  .object({ en: z.string().min(1) })
  .catchall(z.string())
  .superRefine((v, ctx) => {
    for (const k of Object.keys(v)) {
      if (!(SUPPORTED_LOCALES as readonly string[]).includes(k)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Unsupported locale key "${k}"` });
      }
    }
  }) as unknown as z.ZodType<LocalizedText>;

const pct = z.number().min(0).max(0.5);

export const countryPackSchema: z.ZodType<CountryPack> = z
  .object({
    code: z.string().regex(/^[A-Z]{2}$/),
    name: lt,
    defaultLocale: localeSchema,
    locales: z.array(localeSchema).min(1),
    intlRegion: z.string().regex(/^[A-Z]{2}$/),
    currency: z.object({ code: z.string().length(3), symbol: z.string().min(1), decimals: z.number().int().min(0).max(3) }),
    fees: z.object({ customerPct: pct, workerPct: pct, minFee: z.number().min(0), payoutFee: z.number().min(0) }),
    newAccountJobCap: z.number().int().min(1),
    autoReleaseDays: z.number().int().min(1).max(30),
    identity: z.object({
      providerName: z.string().min(1),
      levels: z
        .array(z.object({ level: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]), label: lt, steps: z.array(lt).min(1) }))
        .length(4),
      note: lt,
      privacyNote: lt,
    }),
    payments: z.object({
      partnerName: z.string().min(1),
      protectedPaymentLabel: lt,
      payoutMethods: z
        .array(
          z.object({
            id: z.string().min(1),
            kind: z.enum(['card', 'iban', 'bank_transfer', 'instant_bank', 'mobile_money']),
            label: lt,
            eta: lt,
            extraFee: z.number().min(0),
          }),
        )
        .min(1),
      cryptoEnabled: z.literal(false, { errorMap: () => ({ message: 'Crypto payouts are disabled in all demo packs' }) }) as unknown as z.ZodType<boolean>,
      mobileMoneyFirst: z.boolean(),
    }),
    tax: z.object({
      workerStatuses: z.array(z.object({ id: z.string(), label: lt, hint: lt })).min(1),
      documentTemplates: z
        .array(z.object({ id: z.string(), kind: z.enum(['agreement', 'completion_act', 'invoice', 'receipt']), title: lt, body: lt }))
        .min(3),
      note: lt,
    }),
    categories: z
      .array(
        z.object({
          id: z.string().min(1),
          label: lt,
          icon: z.string(),
          priceGuide: z.object({ min: z.number().positive(), max: z.number().positive() }),
          templates: z.array(z.object({ id: z.string(), title: lt, description: lt, durationHours: z.number().positive() })).min(1),
        }),
      )
      .min(1),
    regulatedTrades: z.array(z.object({ categoryId: z.string(), permitName: lt })),
    priorityPrograms: z.array(
      z.object({ id: z.string(), label: lt, description: lt, verificationSource: lt, benefits: z.array(lt) }),
    ),
    cities: z
      .array(z.object({ id: z.string(), name: lt, x: z.number().min(0).max(100), y: z.number().min(0).max(100), districts: z.array(z.string()) }))
      .min(1),
    emergencyNumber: z.string().min(2),
    legalNotices: z.array(lt),
    lowBandwidthMode: z.boolean(),
    companyApprovalThreshold: z.number().positive(),
  })
  .superRefine((p, ctx) => {
    if (!p.locales.includes('en')) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['locales'], message: 'locales must include "en"' });
    if (!p.locales.includes(p.defaultLocale))
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['defaultLocale'], message: 'defaultLocale must be one of locales' });
    const catIds = new Set(p.categories.map((c) => c.id));
    p.regulatedTrades.forEach((r, i) => {
      if (!catIds.has(r.categoryId))
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['regulatedTrades', i, 'categoryId'], message: `Unknown category "${r.categoryId}"` });
    });
    p.categories.forEach((c, i) => {
      if (c.priceGuide.min > c.priceGuide.max)
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['categories', i, 'priceGuide'], message: 'min must be <= max' });
    });
    for (const kind of ['agreement', 'completion_act'] as const) {
      if (!p.tax.documentTemplates.some((d) => d.kind === kind))
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['tax', 'documentTemplates'], message: `Missing "${kind}" template` });
    }
  }) as unknown as z.ZodType<CountryPack>;

export type PackValidationResult = { ok: true } | { ok: false; issues: { path: string; message: string }[] };

export function validateCountryPack(pack: unknown): PackValidationResult {
  const r = countryPackSchema.safeParse(pack);
  if (r.success) return { ok: true };
  return { ok: false, issues: r.error.issues.map((i) => ({ path: i.path.join('.') || '(root)', message: i.message })) };
}
