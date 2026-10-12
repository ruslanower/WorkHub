import * as React from 'react';
import { useAppStore } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { getServices } from '@/services/registry';
import type {
  Kpis,
  SeriesPoint,
  CitySupplyDemand,
  FunnelStep,
  Cohort,
  RevenueBreakdown,
  ImpactRow,
} from '@/services/types';
import { formatCurrency, formatPercent, getLocalizedText } from '@/i18n/formatters';
import { KpiTile } from '@/components/ui/KpiTile';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  BarChart3,
  TrendingUp,
  Download,
  Building,
  Users,
  Award,
  Layers,
  CheckSquare,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export const PartnerConsolePage: React.FC = () => {
  const { pack, locale, countryCode } = useAppStore();
  const { t } = useTranslation();

  const [kpis, setKpis] = React.useState<Kpis | null>(null);
  const [supplyDemand, setSupplyDemand] = React.useState<CitySupplyDemand[]>([]);
  const [funnel, setFunnel] = React.useState<FunnelStep[]>([]);
  const [cohorts, setCohorts] = React.useState<Cohort[]>([]);
  const [revenue, setRevenue] = React.useState<RevenueBreakdown | null>(null);
  const [impactRows, setImpactRows] = React.useState<ImpactRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Localization checklist items
  const [checklist, setChecklist] = React.useState([
    { id: 'tax', label: 'Local worker tax classification rules reviewed', done: true },
    { id: 'psp', label: 'Licensed Payment Partner integration terms finalized', done: true },
    { id: 'id', label: 'State Digital ID / Bank eID legal access conditions approved', done: true },
    { id: 'gdpr', label: 'Local privacy & data protection residency verified', done: true },
    { id: 'permits', label: 'Regulated professional trades catalog defined', done: true },
    { id: 'impact', label: 'Government/donor ESG priority programs connected', done: false },
    { id: 'insurance', label: 'Local commercial on-site insurance underwriter aligned', done: false },
  ]);

  React.useEffect(() => {
    const loadPartnerData = async () => {
      setLoading(true);
      try {
        const [kpiRes, sdRes, fnlRes, cohRes, revRes, impRes] = await Promise.all([
          getServices().analytics.getKpis(countryCode),
          getServices().analytics.getSupplyDemand(countryCode),
          getServices().analytics.getFunnel(countryCode),
          getServices().analytics.getCohorts(countryCode),
          getServices().analytics.getRevenueBreakdown(countryCode),
          getServices().analytics.getImpact(countryCode),
        ]);
        setKpis(kpiRes);
        setSupplyDemand(sdRes);
        setFunnel(fnlRes);
        setCohorts(cohRes);
        setRevenue(revRes);
        setImpactRows(impRes);
      } catch {
        //
      } finally {
        setLoading(false);
      }
    };
    loadPartnerData();
  }, [countryCode]);

  const handleExportImpact = async () => {
    const res = await getServices().analytics.exportImpactReport(countryCode);
    alert(`Impact report exported: ${res.fileName}`);
  };

  const completedChecklistCount = checklist.filter((c) => c.done).length;

  if (loading || !kpis) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in py-2">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-border bg-card shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">
              {t('partnerConsole.title')}
            </h1>
            <Badge variant="default" className="font-mono">
              National Licensee: {pack.name.en}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Operational dashboard for national partners: GMV, liquidity balance, and ESG impact tracking
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleExportImpact}>
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Export Impact Report (CSV)
        </Button>
      </div>

      {/* 2. Top KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KpiTile
          title="National GMV"
          value={formatCurrency(kpis.gmv, pack, locale)}
          change="+22%"
          changePositive={true}
          subtext="Quarter to date"
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
        />

        <KpiTile
          title="Platform Take Rate"
          value={formatPercent(kpis.takeRate, 1)}
          subtext="Net gross commission"
          icon={<BarChart3 className="w-4 h-4 text-primary" />}
        />

        <KpiTile
          title="Completed Jobs / Week"
          value={kpis.completedJobsPerWeek}
          change="+14%"
          changePositive={true}
          subtext="Liquidity velocity"
          icon={<Award className="w-4 h-4 text-amber-600" />}
        />

        <KpiTile
          title="Priority Program Share"
          value={formatPercent(kpis.priorityShare, 0)}
          subtext="Veterans, youth, refugees"
          icon={<Users className="w-4 h-4 text-blue-600" />}
        />
      </div>

      {/* 3. Supply & Demand by City & Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supply & Demand by City */}
        <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-foreground">
              Supply & Demand Balance by City
            </h3>
            <span className="text-xs text-muted-foreground">Active contractors vs Open jobs</span>
          </div>

          <div className="space-y-3 pt-2">
            {supplyDemand.map((sd) => {
              const city = pack.cities.find((c) => c.id === sd.cityId);
              return (
                <div key={sd.cityId} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold text-foreground">
                    <span>{city ? getLocalizedText(city.name, locale) : sd.cityId}</span>
                    <span className="text-muted-foreground">
                      {sd.workers} workers • {sd.openTasks} tasks
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted flex overflow-hidden">
                    <div
                      className="bg-primary h-full"
                      style={{ width: `${Math.min(100, (sd.workers / (sd.workers + sd.openTasks)) * 100)}%` }}
                      title="Contractor Supply"
                    />
                    <div
                      className="bg-amber-500 h-full"
                      style={{ width: `${Math.min(100, (sd.openTasks / (sd.workers + sd.openTasks)) * 100)}%` }}
                      title="Client Demand"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Marketplace Conversion Funnel */}
        <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
          <h3 className="font-bold text-base text-foreground">
            Transaction Conversion Funnel
          </h3>

          <div className="space-y-3 pt-2">
            {funnel.map((step, idx) => (
              <div key={step.key} className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground capitalize">
                    {idx + 1}. {step.key}
                  </span>
                  <span className="font-bold text-primary">{step.value.toLocaleString()}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full"
                    style={{ width: `${Math.round((step.value / funnel[0].value) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Priority ESG Programs Impact Dashboard */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-foreground">
              ESG & Priority Social Programs Impact (Government & Donors)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verified income generation for socially vulnerable groups (veterans, refugees, youth, seniors)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-semibold">
                <th className="pb-3">Program</th>
                <th className="pb-3">Verified Workers</th>
                <th className="pb-3">Jobs Completed</th>
                <th className="pb-3">Total Earned</th>
                <th className="pb-3">6-Month Retention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {impactRows.map((row) => {
                const prog = pack.priorityPrograms.find((p) => p.id === row.programId);
                return (
                  <tr key={row.programId} className="hover:bg-muted/30">
                    <td className="py-3 font-semibold text-foreground">
                      {prog ? getLocalizedText(prog.label, locale) : row.programId}
                    </td>
                    <td className="py-3 text-foreground">{row.participants}</td>
                    <td className="py-3 text-foreground">{row.jobs}</td>
                    <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(row.earnings, pack, locale)}
                    </td>
                    <td className="py-3 font-semibold text-primary">
                      {formatPercent(row.retention, 0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. National Localization Playbook Checklist */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-foreground">
              National Market Localization Playbook ({completedChecklistCount}/{checklist.length} Complete)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Legal, banking, tax and regulatory gates verified for {pack.code} territory
            </p>
          </div>
          <Badge variant={completedChecklistCount === checklist.length ? 'success' : 'warning'}>
            {Math.round((completedChecklistCount / checklist.length) * 100)}% Ready
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setChecklist((prev) =>
                  prev.map((c) => (c.id === item.id ? { ...c, done: !c.done } : c)),
                );
              }}
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-3 cursor-pointer select-none transition-colors ${
                item.done
                  ? 'bg-emerald-50/20 dark:bg-emerald-950/20 border-emerald-500/30 text-foreground'
                  : 'bg-card border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                  item.done
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'border-border bg-background'
                }`}
              >
                {item.done && <CheckSquare className="w-3.5 h-3.5" />}
              </div>
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
