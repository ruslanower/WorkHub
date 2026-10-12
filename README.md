# WorkHub — Institutional Trust Layer for Physical On-Site Work

> **Investor & Partner Prototype**  
> *Working Title:* **WorkHub** (configured dynamically via `BRAND_NAME` in `src/config/brand.ts`).  
> *Demo Notice:* All metrics, partner payment providers, national digital IDs, legal templates, and financial simulations are **illustrative** and designed for institutional demonstration purposes.

---

## 1. Executive Summary & Market Problem

The market for informal physical labor (construction, maintenance, repairs, loading, cleaning, electrical work) exceeds **\$100B+ globally**, yet remains plagued by three systemic frictions:

1. **Prepayment Anxiety**: Customers fear losing upfront cash to unverified contractors who might deliver substandard work or abandon the job.
2. **Contractor Vulnerability & Cash Shadow**: Informal laborers face non-payment risks, lack enforceable legal agreements, and operate in cash economies with zero verifiable credit history or social safety nets.
3. **Identity & Accreditation Deficit**: Traditional classifieds lack verified state identity, skill certification checks, or transparent performance ratings.

### The WorkHub Solution

**WorkHub** provides the institutional software and financial trust infrastructure for one-off and project-based physical labor:
* **Escrow-Style Protected Payments**: Customer funds are securely reserved by licensed payment partners before work commences and released only upon bilateral sign-off of completion acts.
* **Tiered Identity & Zero-Retention Verification (L0–L3)**: Progressive verification from phone/email up to state digital ID and regulated trade licensing, retaining only cryptographic verification tokens rather than raw documents.
* **Automated Legal Documentation**: Compliant bilateral service agreements and timestamped photo completion protocols generated dynamically under local legal jurisdictions.
* **Country Pack Architecture**: Zero-hardcoding internationalization where currency, legal frameworks, tax statuses, national ID providers, and fee structures are hot-swappable plugins.
* **Priority Social Access Programs**: Dedicated workflows for veterans, workers 50+, refugees, youth, and women-led crews with preferential fees and partner NGO impact audits.

---

## 2. Key Architecture & Three Structural Layers

WorkHub is structured in three cleanly decoupled layers:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Layer 1: Marketplace Engine                  │
│   Smart Task Templates • Structured Offers • Masked Messaging   │
│            MapStub SVG Visualizer • Recurring Facility Jobs     │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│             Layer 2: Trust & Protected Payments Layer           │
│   L0-L3 Identity Engine • Licensed Escrow Partner Holding Rails │
│         Milestone Protection • Algorithmic Trust Score Ring     │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│             Layer 3: Compliance & Social Programs Layer         │
│   Dynamic Legal Contracts • Bilateral Completion Acts (Protocols)│
│     B2B Invoicing & Tax Statuses • Priority ESG Programs        │
└─────────────────────────────────────────────────────────────────┘
```

1. **Layer 1: Marketplace Engine**:
   - Structured task catalog with pre-filled scope and pricing guidelines.
   - Contact masking that protects communication channels prior to agreement execution.
   - Interactive SVG map stubs rendering approximate geographic coordinates without leaking private residential addresses.
2. **Layer 2: Trust & Protected Payments Layer**:
   - Milestone escrow management with transparent take-rates.
   - 0–100 algorithmic Trust Score combining verification tiers, completion volume, punctuality, and dispute records.
3. **Layer 3: Compliance & Social Programs Layer**:
   - Automated contract generation replacing informal handshakes with legally sound templates.
   - Transparent reporting for accredited institutional and NGO partners.

---

## 3. Dynamic Country Packs

Every jurisdiction-specific rule is isolated in a modular **Country Pack** object (`src/countries/types.ts`):

| Feature | Ukraine (`UA`) | Poland (`PL`) | Kenya (`KE`) |
| :--- | :--- | :--- | :--- |
| **Currency** | UAH (`₴`, 0 decimals) | PLN (`zł`, 2 decimals) | KES (`KSh`, 0 decimals) |
| **Locales** | `uk`, `en` | `pl`, `en`, `uk` | `en`, `sw` |
| **Digital ID Provider** | Diia (illustrative text) | mObywatel / Profil Zaufany | National digital ID |
| **Payment Rails** | Card, IBAN instant rails | BLIK, Elixir, Express Elixir | Mobile money first, Bank |
| **Tax Statuses** | FOP Group 2/3, Self-employed | JDG, Działalność nierejestrowana | Registered sole trader, Tax PIN |
| **Priority Programs** | Veterans, IDPs, 50+, Disability | Newcomers, 50+, Disability | Youth 18-29, Women crews |
| **Flagship Job** | Repaint 24 storage racks | Odmalowanie 24 regałów | Kupaka rangi rafu 24 za karakana |

Country Packs can be toggled in real time without refreshing the page. Core UI components contain zero hard-coded country logic.

---

## 4. Institutional Unit Economics: 1% vs 12%

The prototype features an interactive **Unit Economics Calculator** (`/investor`) illustrating why a naive 1% platform fee model fails in physical labor marketplaces:

* **The 1% Fallacy**: On an average job of \$150, a 1% take-rate generates **\$1.50** in gross revenue. However, fixed direct costs per transaction (payment processor gateway fees, escrow banking reserve costs, identity/KYC verification amortization, dispute mediation, and customer support) exceed **\$5.00 to \$9.00**. Operating at 1% yields an unsustainable **-\$4.50 to -\$7.50 unit contribution margin**.
* **The 12% Sustainable Model**: A blended 12% take-rate (e.g., 5% customer fee + 7% worker service fee) yields **\$18.00** on a \$150 transaction. After deducting direct transaction costs (\$6.50), the platform maintains a healthy **\$11.50 positive unit contribution margin (64% gross margin)**, funding CAC payback within 2–3 repeat jobs.

---

## 5. Technology Stack

* **Framework & Build**: React 18, TypeScript (strict mode), Vite 5.
* **Styling & Tokens**: Tailwind CSS, PostCSS, HSL CSS design variables (`light` and `dark` modes, WCAG AA contrast).
* **State & Navigation**: Zustand reactive store, HashRouter (zero-config static hosting compatibility).
* **Localization**: `react-i18next` with complete dictionaries for `uk`, `en`, `pl`, `sw`.
* **Icons & Visuals**: Lucide React, inline SVG MapStubs, CSS avatar generators (100% self-contained, zero external network dependencies).
* **Data & Analytics Charts**: Recharts, Zod runtime schema validators.
* **Storage Layer**: `StorageAdapter` pattern defaulting to `InMemoryStorageAdapter`.

---

## 6. Getting Started

### Prerequisites

* Node.js 18.x or 20.x
* npm 9.x or later

### Installation & Local Run

```bash
# Clone and enter workspace
git clone <repo-url>
cd WorkHub

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build & Type Verification

```bash
# Run TypeScript compilation check
npm run typecheck

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 7. Presenter Features & Demo Guide

* **Presentation Mode**: Press the **`P`** key anywhere in the application to toggle the **12-slide Pitch Deck overlay**. Navigate with `ArrowRight` / `ArrowLeft` / `Space` and close with `Esc`.
* **Guided Tour**: Click **"Tour"** in the top presenter bar to start the 8-step interactive spotlight walkthrough designed for investors.
* **Demo Controls Drawer**: Click **"Controls"** in the top bar to:
  - Hot-swap Country Packs (`UA`, `PL`, `KE`).
  - Switch personas (`Customer`, `Worker`, `Company`, `Admin`, `Partner`, `Investor`).
  - Fast-forward the Flagship Job through its lifecycle (`offer_accepted` → `funded` → `in_progress` → `approved`).
  - Trigger simulated disputes and test mediation outcomes.
  - Test real-time take-rate sensitivity (1% vs 12%).
  - Reset all state back to seed data with one click.

---

## 8. Documentation Index

Detailed architectural and regulatory documentation is available in the `docs/` folder:

* [`docs/ARCHITECTURE.md`](file:///Users/ruslanbarbutsa/Desktop/Антігравіті/WorkHub/docs/ARCHITECTURE.md): Comprehensive system design, service registry pattern, and Mermaid architecture diagram.
* [`docs/COUNTRY_PACK_GUIDE.md`](file:///Users/ruslanbarbutsa/Desktop/Антігравіті/WorkHub/docs/COUNTRY_PACK_GUIDE.md): 10-step guide for developers to introduce a new country pack.
* [`docs/API_SKETCH.md`](file:///Users/ruslanbarbutsa/Desktop/Антігравіті/WorkHub/docs/API_SKETCH.md): Complete REST endpoint specifications to transition from mock services to a production backend.
* [`docs/DATA_MODEL.md`](file:///Users/ruslanbarbutsa/Desktop/Антігравіті/WorkHub/docs/DATA_MODEL.md): Full data entity models, types, and Mermaid Entity-Relationship diagram.
* [`docs/COMPLIANCE_NOTES.md`](file:///Users/ruslanbarbutsa/Desktop/Антігравіті/WorkHub/docs/COMPLIANCE_NOTES.md): Regulatory notes on escrow segregation, worker classification, DAC7 reporting, and zero-retention identity.

---

## 9. Legal & Demonstration Disclaimer

WorkHub is an institutional technology demonstration prototype.
* All trademarks, state identity references (such as Diia or mObywatel), partner payment provider designations, and financial numbers are used purely for illustrative modeling.
* The prototype does not execute live financial transactions or interface with production banking APIs.
