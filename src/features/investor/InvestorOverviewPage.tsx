import * as React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatPercent } from '@/i18n/formatters';
import { UnitEconomicsCalculator } from './UnitEconomicsCalculator';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  TrendingUp,
  ShieldCheck,
  Building,
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  Globe2,
  Lock,
  Compass,
} from 'lucide-react';

export const InvestorOverviewPage: React.FC = () => {
  const { pack, locale, setRole, startTour } = useAppStore();
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto space-y-16 py-6 animate-fade-in text-foreground">
      {/* 1. Header Hero */}
      <section className="text-center space-y-4">
        <Badge variant="verify" className="px-3 py-1 font-semibold text-xs">
          Executive Briefing & International Expansion
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          {t('investor.title')}
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t('investor.subtitle')}
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="primary" size="md" onClick={startTour}>
            Start 8-Step Product Tour
          </Button>

          <Link to="/tasks">
            <Button variant="outline" size="md">
              <Compass className="w-4 h-4 mr-1.5" />
              Explore Live Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* 2. Section 1: Problem & Market Timing */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
            1
          </span>
          <h2 className="text-xl font-bold">{t('investor.section1')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card shadow-soft space-y-2">
            <h4 className="font-bold text-sm text-foreground">1. Fragmented Informal Market</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Messengers and classified boards lack verifiable performance history, legal contracts, or dispute protection. Most work slips into the cash shadow economy.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card shadow-soft space-y-2">
            <h4 className="font-bold text-sm text-foreground">2. Prepayment & Payment Fear</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Customers fear unreturned prepayments and unfinished work. Independent contractors fear non-payment and lack verifiable proof of income.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card shadow-soft space-y-2">
            <h4 className="font-bold text-sm text-foreground">3. Unconnected Digital IDs</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              State digital IDs (Diia, mObywatel, National eID) exist in many countries but are rarely integrated into everyday physical labor matching.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Section 2: Solution in Three Layers */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
            2
          </span>
          <h2 className="text-xl font-bold">{t('investor.section2')}</h2>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-soft space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 border-l-2 border-teal-500 pl-4">
              <span className="font-bold text-xs text-teal-600 uppercase tracking-wider block">
                Layer 1: Marketplace
              </span>
              <h4 className="font-bold text-sm text-foreground">Operational Engine</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Category templates, multi-parameter offers (price, ETA, availability), contact-masked chat, calendar, geo search, and repeat B2B corporate accounts.
              </p>
            </div>

            <div className="space-y-2 border-l-2 border-blue-500 pl-4">
              <span className="font-bold text-xs text-blue-600 uppercase tracking-wider block">
                Layer 2: Trust & Payments
              </span>
              <h4 className="font-bold text-sm text-foreground">Escrow & Verification</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                4 levels of identity verification, protected funds held by licensed banking partner, milestone releases, and transparent 0-100 Trust Score.
              </p>
            </div>

            <div className="space-y-2 border-l-2 border-emerald-500 pl-4">
              <span className="font-bold text-xs text-emerald-600 uppercase tracking-wider block">
                Layer 3: Compliance & Impact
              </span>
              <h4 className="font-bold text-sm text-foreground">Institutional Integration</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Auto-generated contracts and completion acts, tax hints, priority access for socially vulnerable groups, and verified ESG donor reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section 4: Unit Economics Model & Interactive Calculator */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
            4
          </span>
          <h2 className="text-xl font-bold">{t('investor.section4')}</h2>
        </div>

        {/* The Interactive Calculator */}
        <UnitEconomicsCalculator />
      </section>

      {/* 5. Section 5: Country Pack Expansion Playbook */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
            5
          </span>
          <h2 className="text-xl font-bold">{t('investor.section5')}</h2>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-soft space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            The core breakthrough: launching a new country requires zero code rewrites. All country-specific parameters live in a self-contained Country Pack configuration object.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
              <span className="font-bold text-xs text-foreground block">Ukraine (UA Pack)</span>
              <span className="text-[11px] text-muted-foreground block">
                UAH, uk/en, Diia text integration, bank cards/IBAN, veterans & IDP programs.
              </span>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
              <span className="font-bold text-xs text-foreground block">Poland (PL Pack)</span>
              <span className="text-[11px] text-muted-foreground block">
                PLN, pl/en/uk, mObywatel text ID, instant bank rails, newcomers 50+ programs.
              </span>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
              <span className="font-bold text-xs text-foreground block">Kenya (KE Pack)</span>
              <span className="text-[11px] text-muted-foreground block">
                KES, en/sw, National digital ID, mobile money first, low-bandwidth mode.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section 6: Partnership Models */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
            6
          </span>
          <h2 className="text-xl font-bold">{t('investor.section6')}</h2>
        </div>

        <div className="overflow-x-auto p-6 rounded-3xl border border-border bg-card shadow-soft">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-semibold">
                <th className="pb-3">Model</th>
                <th className="pb-3">WorkHub Core Delivers</th>
                <th className="pb-3">National Partner Delivers</th>
                <th className="pb-3">Economics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 font-bold text-foreground">A. Master License</td>
                <td className="py-3 text-muted-foreground">Platform tech, Country Pack, Playbook, UX kit</td>
                <td className="py-3 text-muted-foreground">Local legal entity, banking license, ops team</td>
                <td className="py-3 text-primary font-semibold">Upfront fee + % of country GMV</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-foreground">B. Joint Venture</td>
                <td className="py-3 text-muted-foreground">Product engineering, continuous roadmap</td>
                <td className="py-3 text-muted-foreground">Capital, enterprise customer anchors, local licenses</td>
                <td className="py-3 text-primary font-semibold">Equity split + dividend share</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-foreground">C. SaaS + Playbook</td>
                <td className="py-3 text-muted-foreground">White-label instance, cloud hosting, SLA</td>
                <td className="py-3 text-muted-foreground">Full independent operational management</td>
                <td className="py-3 text-primary font-semibold">Monthly platform fee + tier pricing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Section 7: 12-Week Go-To-Market Timeline */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
            7
          </span>
          <h2 className="text-xl font-bold">{t('investor.section7')}</h2>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-soft space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
              <span className="font-bold text-primary block">Weeks 1-3</span>
              <span className="font-semibold text-foreground block">Supply Bootstrapping</span>
              <p className="text-muted-foreground text-[11px]">
                Recruit first 100 contractors through vocational unions, veteran centers, and trade groups.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
              <span className="font-bold text-primary block">Weeks 4-6</span>
              <span className="font-semibold text-foreground block">B2B Anchor Demand</span>
              <p className="text-muted-foreground text-[11px]">
                Onboard facility managers, warehouses, and small property managers for steady baseline volume.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
              <span className="font-bold text-primary block">Weeks 7-9</span>
              <span className="font-semibold text-foreground block">Concierge Liquidity</span>
              <p className="text-muted-foreground text-[11px]">
                First 50 orders matched manually by ops team to ensure 100% completion and build review trust.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
              <span className="font-bold text-primary block">Weeks 10-12</span>
              <span className="font-semibold text-foreground block">Autonomous Scale</span>
              <p className="text-muted-foreground text-[11px]">
                Open self-service marketplace and expand to adjacent categories and neighboring cities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Section 9: Key Risks & Hardened Mitigations */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
            9
          </span>
          <h2 className="text-xl font-bold">{t('investor.section9')}</h2>
        </div>

        <div className="p-6 rounded-3xl border border-border bg-card shadow-soft overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-semibold">
                <th className="pb-3">Risk Factor</th>
                <th className="pb-3">WorkHub Architectural Mitigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 font-bold text-foreground">Payment regulation</td>
                <td className="py-3 text-muted-foreground">Funds held exclusively by licensed payment partner PSP; no unlicensed escrow</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-foreground">Worker misclassification</td>
                <td className="py-3 text-muted-foreground">Clear independent contractor tax statuses configured per local legal rules</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-foreground">Platform leakage</td>
                <td className="py-3 text-muted-foreground">Contact masking + tangible value of automatic completion acts, invoices, and insurance</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-foreground">Disputes & quality</td>
                <td className="py-3 text-muted-foreground">Structured 24h SLA arbitration based on photo evidence, chat logs, and signed milestones</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 9. Section 10: Four-Phase Roadmap */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
            10
          </span>
          <h2 className="text-xl font-bold">{t('investor.section10')}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-5 rounded-2xl border border-border bg-card shadow-soft space-y-2">
            <Badge variant="default">Phase 1: MVP</Badge>
            <p className="text-muted-foreground leading-relaxed">
              Task templates, multi-tier KYC, contact-masked chat, escrow protection, and first Country Pack.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card shadow-soft space-y-2">
            <Badge variant="secondary">Phase 2: V1</Badge>
            <p className="text-muted-foreground leading-relaxed">
              Corporate B2B team accounts, recurring tasks, instant payouts, priority ESG access programs.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card shadow-soft space-y-2">
            <Badge variant="secondary">Phase 3: V2</Badge>
            <p className="text-muted-foreground leading-relaxed">
              B2B ERP integration APIs, contractor tool financing, and AI assistant for task specification scoping.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card shadow-soft space-y-2">
            <Badge variant="secondary">Phase 4: Scale</Badge>
            <p className="text-muted-foreground leading-relaxed">
              Multi-country enterprise agreements and institutional micro-insurance underwriting.
            </p>
          </div>
        </div>
      </section>

      {/* 10. Section 11: Terms Placeholder */}
      <section className="p-8 rounded-3xl border border-dashed border-border bg-card/40 text-center space-y-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
          Round Terms & Valuation
        </span>
        <h3 className="text-lg font-bold text-foreground">
          Terms: to be provided upon confidential qualification
        </h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          No invented valuation or round numbers are placed in this prototype. Detailed financial model available under NDA.
        </p>
      </section>
    </div>
  );
};
