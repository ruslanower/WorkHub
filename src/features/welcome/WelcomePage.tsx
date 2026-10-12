import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/i18n/formatters';
import {
  ShieldCheck,
  FileCheck2,
  Lock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Users2,
  Award,
  CreditCard,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BRAND_NAME } from '@/config/brand';

export const WelcomePage: React.FC = () => {
  const { pack, locale, setRole } = useAppStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleHireClick = () => {
    setRole('customer');
    navigate('/tasks/new');
  };

  const handleEarnClick = () => {
    setRole('worker');
    navigate('/tasks');
  };

  return (
    <div className="space-y-16 py-4 animate-fade-in">
      {/* 1. Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>The Trust Layer for Physical On-Site Work</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          {t('welcome.headline')}
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t('welcome.subheadline')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button size="lg" variant="primary" onClick={handleHireClick} className="w-full sm:w-auto text-base px-8 shadow-md">
            {t('welcome.ctaHire')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <Button size="lg" variant="secondary" onClick={handleEarnClick} className="w-full sm:w-auto text-base px-8 border border-border">
            {t('welcome.ctaEarn')}
          </Button>
        </div>

        {/* Google for Startups Evaluator Showcase Banner */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-teal-500/10 via-primary/10 to-blue-500/10 border border-teal-500/30 text-left flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-foreground">Google for Startups Ukraine Support Fund</span>
                <Badge variant="verify" className="text-[10px] py-0 px-2">Evaluator View</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Explore our Vertex AI ML matching engine, live Gemini API prompt tester, and $350,000 Google Cloud Credits plan.
              </p>
            </div>
          </div>
          <Link to="/google-showcase" className="shrink-0 w-full sm:w-auto">
            <Button size="sm" variant="primary" className="w-full sm:w-auto bg-teal-600 hover:bg-teal-500 text-white font-bold gap-1 text-xs">
              <span>Open AI Showcase</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Investor Overview deep-link banner */}
        <div className="pt-1">
          <Link
            to="/investor"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline hover:text-primary/80 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t('welcome.openInvestor')} →</span>
          </Link>
        </div>
      </section>

      {/* 2. Three Layers of Built-In Value */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {t('welcome.layers.title')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Why WorkHub is an institutional infrastructure product, not just another classifieds board.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Layer 1: Marketplace */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-soft space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              {t('welcome.layers.layer1Title')}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('welcome.layers.layer1Desc')}
            </p>
          </div>

          {/* Layer 2: Trust & Payments */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-soft space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              {t('welcome.layers.layer2Title')}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('welcome.layers.layer2Desc')}
            </p>
          </div>

          {/* Layer 3: Compliance & Impact */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-soft space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              {t('welcome.layers.layer3Title')}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('welcome.layers.layer3Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 3. 3-Step "How It Works" */}
      <section className="p-8 rounded-3xl border border-border bg-card/60 shadow-soft space-y-8">
        <div className="text-center max-w-lg mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {t('welcome.howItWorks.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center">
              1
            </div>
            <h4 className="font-semibold text-sm text-foreground">
              {t('welcome.howItWorks.step1Title')}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('welcome.howItWorks.step1Desc')}
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center">
              2
            </div>
            <h4 className="font-semibold text-sm text-foreground">
              {t('welcome.howItWorks.step2Title')}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('welcome.howItWorks.step2Desc')}
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center">
              3
            </div>
            <h4 className="font-semibold text-sm text-foreground">
              {t('welcome.howItWorks.step3Title')}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('welcome.howItWorks.step3Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Country-Aware Trust Section */}
      <section className="p-6 rounded-2xl border border-teal-500/30 bg-teal-50/20 dark:bg-teal-950/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">
                {t('welcome.trustSection.title')}
              </h3>
              <Badge variant="default" className="font-mono">
                {pack.code} Active Pack
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('welcome.trustSection.desc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Identity Rail */}
          <div className="p-4 rounded-xl bg-card border border-border space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-verify" />
              <span>{t('welcome.trustSection.identityRail')}</span>
            </div>
            <div className="text-sm font-bold text-foreground">
              {pack.identity.providerName}
            </div>
            <span className="text-[10px] text-muted-foreground block">
              4 Trust Levels (L0 - L3)
            </span>
          </div>

          {/* Payment Partner Rail */}
          <div className="p-4 rounded-xl bg-card border border-border space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Lock className="w-4 h-4 text-primary" />
              <span>{t('welcome.trustSection.paymentRail')}</span>
            </div>
            <div className="text-sm font-bold text-foreground">
              {pack.payments.partnerName}
            </div>
            <span className="text-[10px] text-muted-foreground block">
              Auto-release: {pack.autoReleaseDays} days
            </span>
          </div>

          {/* Payout Rails */}
          <div className="p-4 rounded-xl bg-card border border-border space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>{t('welcome.trustSection.payoutMethods')}</span>
            </div>
            <div className="text-sm font-bold text-foreground truncate">
              {pack.payments.payoutMethods.map((m) => getLocalizedText(m.label, locale)).join(', ')}
            </div>
            <span className="text-[10px] text-muted-foreground block">
              Currency: {pack.currency.code} ({pack.currency.symbol})
            </span>
          </div>

          {/* Priority Social Programs */}
          <div className="p-4 rounded-xl bg-card border border-border space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Award className="w-4 h-4 text-amber-600" />
              <span>{t('welcome.trustSection.priorityAccess')}</span>
            </div>
            <div className="text-sm font-bold text-foreground truncate">
              {pack.priorityPrograms.map((p) => getLocalizedText(p.label, locale)).join(', ')}
            </div>
            <span className="text-[10px] text-muted-foreground block">
              ESG Impact Tracking Enabled
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
