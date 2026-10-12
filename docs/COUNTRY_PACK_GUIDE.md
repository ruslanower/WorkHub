# Country Pack Developer & Implementation Guide

This guide describes the **10-step process** to launch WorkHub in a new country by creating and registering a modular **Country Pack**.

Launching in a new country requires **zero modifications to frontend components, layouts, or database logic**. All jurisdiction-specific parameters are encapsulated in a single, strictly validated configuration file.

---

## Country Pack Schema Overview

Every Country Pack implements the `CountryPack` TypeScript interface and must validate against `countryPackSchema` (defined in `src/countries/types.ts`).

---

## 10-Step Launch Checklist

### Step 1: Define Country Code & Locales
Select the two-letter ISO 3166-1 alpha-2 code (e.g., `DE` for Germany, `BR` for Brazil) and declare supported locales. `en` is mandatory as the universal fallback:
```typescript
code: 'DE',
name: { en: 'Germany', de: 'Deutschland' },
locales: ['de', 'en'],
defaultLocale: 'de',
intlRegion: 'DE',
```

### Step 2: Configure Currency & Minor Units
Specify the ISO 4217 currency code, display symbol, and decimal precision:
```typescript
currency: {
  code: 'EUR',
  symbol: '€',
  decimals: 2, // 2 decimals for EUR/PLN, 0 decimals for UAH/KES
},
```

### Step 3: Establish Local Fee Structures
Define the platform take-rate, minimum fee threshold, and withdrawal fee:
```typescript
fees: {
  customerPct: 0.05, // 5% customer platform fee
  workerPct: 0.07,   // 7% worker service deduction
  minFee: 5,         // Minimum 5 EUR fee per transaction
  payoutFee: 0,      // SEPA withdrawals are fee-free
},
```

### Step 4: Map Digital Identity Provider & Tiers (L0–L3)
Configure the illustrative or production identity partner and define 4 verification tiers:
```typescript
identity: {
  providerName: 'Online-Ausweis (eID) / PostIdent (illustrative)',
  levels: [
    { level: 0, label: { en: 'Basic', de: 'Basis' }, steps: [...] },
    { level: 1, label: { en: 'Photo ID', de: 'Ausweis' }, steps: [...] },
    { level: 2, label: { en: 'State eID', de: 'Online-Ausweis' }, steps: [...] },
    { level: 3, label: { en: 'Trade Guild', de: 'Handwerkskammer' }, steps: [...] },
  ],
  note: { en: 'Verification provided via official digital ID rails.', de: '...' },
  privacyNote: { en: 'We store only cryptographic verification status, never your documents.', de: '...' }
},
```

### Step 5: Configure Escrow Payment Partner & Payout Rails
Specify the local licensed partner payment institution (PSP) and supported cash-out rails:
```typescript
paymentPartner: {
  name: 'Partner PSP Germany (licensed BaFin institution, illustrative)',
  cryptoEnabled: false,
  mobileMoneyFirst: false,
},
payoutMethods: [
  { id: 'sepa', kind: 'bank_transfer', label: 'SEPA Banküberweisung', eta: '1 Werktag', extraFee: 0 },
  { id: 'sepa_instant', kind: 'instant_bank', label: 'SEPA Instant', eta: 'Wenige Minuten', extraFee: 1 },
],
```

### Step 6: Define Local Worker Tax & Employment Statuses
Reflect valid legal operating statuses for independent physical contractors:
```typescript
workerStatuses: [
  { id: 'kleinunternehmer', label: { en: 'Small Business (§19 UStG)', de: 'Kleinunternehmer' }, description: { ... } },
  { id: 'gewerbe', label: { en: 'Registered Business', de: 'Eingetragenes Gewerbe' }, description: { ... } },
],
```

### Step 7: Author Legal Document Templates
Provide jurisdiction-compliant templates with required substitution placeholders:
* Mandatory types: `agreement` (bilateral service contract) and `completion_act` (acceptance protocol).
* Supported placeholders:
  * `{{customer_name}}`, `{{worker_name}}`, `{{task_title}}`
  * `{{agreed_amount}}`, `{{currency}}`, `{{execution_date}}`
  * `{{payout_breakdown}}`, `{{district_name}}`

### Step 8: Define Priority Social Access Programs
Create impact-focused initiatives tailored to local demographic and reintegration needs:
```typescript
priorityPrograms: [
  {
    id: 'seniors50',
    title: { en: 'Craftsmen 50+', de: 'Handwerker 50+' },
    description: { en: 'Subsidized access for senior tradespeople.', de: '...' },
    badge: '50+ Master',
  },
  {
    id: 'newcomers',
    title: { en: 'New Arrivals & Integration', de: 'Integration Fachkräfte' },
    description: { ... },
    badge: 'Integration Partner',
  },
],
```

### Step 9: Populate Cities & SVG Coordinates
Provide key metropolitan hubs with 0–100 coordinate scaling for the inline `MapStub`:
```typescript
cities: [
  {
    id: 'berlin',
    name: { en: 'Berlin', de: 'Berlin' },
    x: 75,
    y: 35,
    districts: ['Mitte', 'Kreuzberg', 'Prenzlauer Berg', 'Charlottenburg'],
  },
  {
    id: 'munich',
    name: { en: 'Munich', de: 'München' },
    x: 60,
    y: 82,
    districts: ['Schwabing', 'Maxvorstadt', 'Bogenhausen', 'Sendling'],
  },
],
```

### Step 10: Register & Validate
Add the new pack file to `src/countries/` (e.g. `de.ts`) and export it in `src/countries/index.ts`:

```typescript
// src/countries/index.ts
import { DE } from './de';

export const COUNTRY_PACKS: Record<string, CountryPack> = {
  UA,
  PL,
  KE,
  DE,
};
```

Run schema validation during test or build:
```typescript
import { validateCountryPack } from '@/countries/types';
import { DE } from '@/countries/de';

const validation = validateCountryPack(DE);
if (!validation.success) {
  console.error('Country Pack validation failed:', validation.error);
}
```
