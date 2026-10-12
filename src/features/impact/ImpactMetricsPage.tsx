import * as React from 'react';
import { useAppStore } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { getServices } from '@/services/registry';
import { formatCurrency, formatPercent, getLocalizedText } from '@/i18n/formatters';
import type { BeneficiaryImpactMetrics } from '@/services/types';
import { UnitEconomicsCalculator } from '@/features/investor/UnitEconomicsCalculator';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  TrendingUp,
  HeartHandshake,
  ShieldCheck,
  Cpu,
  DollarSign,
  Award,
  Users,
  CheckCircle2,
  Building2,
  BarChart3,
  Calendar,
  Sparkles,
  MapPin,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';

export const ImpactMetricsPage: React.FC = () => {
  const { pack, locale } = useAppStore();
  const { t } = useTranslation();

  const [metrics, setMetrics] = React.useState<BeneficiaryImpactMetrics | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        const data = await getServices().impact.getBeneficiaryMetrics(pack.code);
        setMetrics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [pack.code]);

  const monthlyImpactTrend = [
    { month: 'May', earnings: 320000, jobs: 92, veterans: 38 },
    { month: 'Jun', earnings: 510000, jobs: 145, veterans: 64 },
    { month: 'Jul', earnings: 740000, jobs: 210, veterans: 95 },
    { month: 'Aug', earnings: 980000, jobs: 275, veterans: 128 },
    { month: 'Sep', earnings: 1120000, jobs: 310, veterans: 142 },
    { month: 'Oct', earnings: 1180200, jobs: 316, veterans: 153 },
  ];

  const cityDistribution = [
    { city: 'Kyiv', jobs: 480, share: 38.5 },
    { city: 'Lviv', jobs: 310, share: 24.8 },
    { city: 'Dnipro', jobs: 195, share: 15.6 },
    { city: 'Odesa', jobs: 125, share: 10.0 },
    { city: 'Vinnytsia', jobs: 88, share: 7.1 },
    { city: 'Kharkiv', jobs: 50, share: 4.0 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4 animate-fade-in text-foreground">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 border border-teal-500/30 p-8 sm:p-10 text-white shadow-lifted">
        <div className="space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30 text-xs font-semibold flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5" />
              Social Resilience & Economic Inclusion
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-400/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
              Ukrainian Veterans & IDPs Empowerment
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Impact & Unit Economics Dashboard
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Measuring real economic empowerment for vulnerable demographics alongside rigorous platform unit economics. WorkHub bridges the gap between state digital ID verification (Diia.ID) and transparent market-rate earnings.
          </p>
        </div>
      </section>

      {/* 2. Live Counters Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-xl font-bold">Key Resilience & Platform Metrics</h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono">Live GCP Data Feed</span>
        </div>

        {loading || !metrics ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl border border-border bg-card shadow-soft space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">Total Beneficiary Earnings</span>
                <HeartHandshake className="w-4 h-4 text-teal-500" />
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground block">
                ₴{(metrics.totalEarningsGenerated / 1000000).toFixed(2)}M
              </span>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold block">
                ↑ Direct income to Veterans & IDPs
              </span>
            </div>

            <div className="p-5 rounded-3xl border border-border bg-card shadow-soft space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">Jobs Completed by Beneficiaries</span>
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground block">
                {metrics.jobsCompletedBeneficiaries.toLocaleString()}
              </span>
              <span className="text-[11px] text-muted-foreground block">
                540 Veterans • 708 IDPs
              </span>
            </div>

            <div className="p-5 rounded-3xl border border-border bg-card shadow-soft space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">Active AI Models on GCP</span>
                <Cpu className="w-4 h-4 text-purple-500" />
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground block">
                {metrics.activeGcpAiModels} Models
              </span>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold block">
                Vertex AI + Gemini 1.5 Pipeline
              </span>
            </div>

            <div className="p-5 rounded-3xl border border-border bg-card shadow-soft space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">Escrow Success Rate</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground block">
                {metrics.escrowSuccessRatePct}%
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                Zero unpaid physical labor disputes
              </span>
            </div>
          </div>
        )}
      </section>

      {/* 3. Monthly Beneficiary Growth & Regional Distribution */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-base font-bold text-foreground">Monthly Earnings Generated for Beneficiaries</h3>
              <p className="text-xs text-muted-foreground">Cumulative monthly payouts released via protected Escrow (UAH)</p>
            </div>
            <Badge variant="verify">6-Month Trajectory</Badge>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyImpactTrend}>
                <defs>
                  <linearGradient id="impactEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickFormatter={(val) => `₴${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: number) => [`₴${val.toLocaleString()}`, 'Earnings Released']}
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#0f766e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#impactEarnings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-soft space-y-4">
          <div className="border-b border-border pb-3">
            <h3 className="text-base font-bold text-foreground">Geographic Distribution</h3>
            <p className="text-xs text-muted-foreground">Jobs across Ukrainian urban recovery hubs</p>
          </div>

          <div className="space-y-3">
            {cityDistribution.map((item) => (
              <div key={item.city} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-500" />
                    {item.city}
                  </span>
                  <span className="text-muted-foreground font-mono">
                    {item.jobs} jobs ({item.share}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-600 h-2 rounded-full"
                    style={{ width: `${item.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Strategic Programs Breakdown */}
      <section className="space-y-4">
        <div className="border-b border-border pb-3">
          <h2 className="text-xl font-bold">Priority Inclusion Programs Architecture</h2>
          <p className="text-xs text-muted-foreground">
            Built-in socio-economic safety nets integrated with Ukrainian state registries via Diia.ID
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-teal-500/30 bg-teal-500/5 space-y-3">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-bold text-sm">
              <Award className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Veterans Support Program</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Verified veteran status unlocks 0% platform fee for 6 months, a free Pro contractor subscription, and a +14% priority boost in the Vertex AI matching engine.
            </p>
            <div className="text-[11px] font-mono text-teal-600 dark:text-teal-400 pt-1">
              ✓ 540 active verified veterans
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-blue-500/30 bg-blue-500/5 space-y-3">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-sm">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>IDP Relocation & Integration</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Internally displaced persons receive tailored local matching in host cities (Lviv, Kyiv, Dnipro), equipment grant access, and automated Diia.ID tax onboarding.
            </p>
            <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 pt-1">
              ✓ 708 active verified IDPs
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-purple-500/30 bg-purple-500/5 space-y-3">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>Zero-Knowledge Privacy</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              WorkHub never stores or leaks sensitive military service records or home address data. Only the verified cryptographic Boolean badge is displayed with user consent.
            </p>
            <div className="text-[11px] font-mono text-purple-600 dark:text-purple-400 pt-1">
              ✓ Fully GDPR & Diia.ID compliant
            </div>
          </div>
        </div>
      </section>

      {/* 5. Embedded B2B & Platform Unit Economics Simulator */}
      <section className="space-y-4">
        <div className="border-b border-border pb-3">
          <h2 className="text-xl font-bold">Platform Sustainability & Unit Economics Simulator</h2>
          <p className="text-xs text-muted-foreground">
            Demonstrating why a balanced 10-12% take-rate with built-in escrow, Diia.ID verification, and dispute resolution creates a profitable, sustainable business model.
          </p>
        </div>

        <UnitEconomicsCalculator />
      </section>
    </div>
  );
};
