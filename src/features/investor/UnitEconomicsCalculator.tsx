import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/app/store';
import { formatCurrency, formatPercent } from '@/i18n/formatters';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, TrendingUp, DollarSign, Calculator, RotateCcw } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export const UnitEconomicsCalculator: React.FC = () => {
  const { pack, locale } = useAppStore();
  const { t } = useTranslation();

  // Inputs
  const [avgTicket, setAvgTicket] = React.useState<number>(100);
  const [customerFeePct, setCustomerFeePct] = React.useState<number>(5);
  const [workerFeePct, setWorkerFeePct] = React.useState<number>(7);
  const [paymentCostPct, setPaymentCostPct] = React.useState<number>(2.5);
  const [supportCostPct, setSupportCostPct] = React.useState<number>(2.0);
  const [subRevenuePerWorker, setSubRevenuePerWorker] = React.useState<number>(0);
  const [monthlyJobs, setMonthlyJobs] = React.useState<number>(1000);
  const [fixedMonthlyCost, setFixedMonthlyCost] = React.useState<number>(4000);

  // Calculations
  const totalTakeRatePct = customerFeePct + workerFeePct;
  const platformRevenuePerJob = (avgTicket * totalTakeRatePct) / 100;
  const variableCostPerJob = (avgTicket * (paymentCostPct + supportCostPct)) / 100;
  const contributionPerJob = platformRevenuePerJob - variableCostPerJob;

  const monthlyJobContribution = contributionPerJob * monthlyJobs;
  const totalMonthlyContribution = monthlyJobContribution + subRevenuePerWorker * (monthlyJobs * 0.1);
  const netMonthlyProfit = totalMonthlyContribution - fixedMonthlyCost;

  const breakEvenJobs =
    contributionPerJob > 0
      ? Math.ceil(fixedMonthlyCost / contributionPerJob)
      : null;

  const isNegative = contributionPerJob <= 0;

  // Preset 1%: Failure scenario
  const setFailureScenario = () => {
    setCustomerFeePct(0);
    setWorkerFeePct(1);
    setPaymentCostPct(2.5);
    setSupportCostPct(2.0);
    setSubRevenuePerWorker(0);
  };

  // Preset 12%: Sustainable model
  const setSustainableScenario = () => {
    setCustomerFeePct(5);
    setWorkerFeePct(7);
    setPaymentCostPct(2.5);
    setSupportCostPct(2.0);
    setSubRevenuePerWorker(0);
  };

  const chartData = [
    { name: 'Revenue / Job', value: platformRevenuePerJob, color: '#0f766e' },
    { name: 'Payment Processing', value: (avgTicket * paymentCostPct) / 100, color: '#f59e0b' },
    { name: 'Support & Mediation', value: (avgTicket * supportCostPct) / 100, color: '#ef4444' },
    {
      name: 'Net Contribution',
      value: Math.max(0, contributionPerJob),
      color: contributionPerJob >= 0 ? '#10b981' : '#dc2626',
    },
  ];

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-soft space-y-8">
      {/* Header & Scenario Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-foreground">
              {t('investor.calculator.title')}
            </h3>
            <Badge variant="secondary">Interactive Simulator</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl">
            {t('investor.calculator.description')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="danger" onClick={setFailureScenario}>
            {t('investor.calculator.demo1pctBtn')}
          </Button>

          <Button size="sm" variant="primary" onClick={setSustainableScenario}>
            {t('investor.calculator.restoreDefaultBtn')}
          </Button>
        </div>
      </div>

      {/* Negative Margin Alert Banner */}
      {isNegative && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-500/40 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200 flex items-start gap-3 text-xs leading-relaxed animate-fade-in">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <span className="font-bold block text-sm">
              Unit Economics Warning: Negative Contribution Margin!
            </span>
            <span>{t('investor.calculator.negativeWarning')}</span>
          </div>
        </div>
      )}

      {/* Controls Grid & Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input sliders and fields */}
        <div className="space-y-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Model Parameters (Illustrative - replace with validated data):
          </span>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                {t('investor.calculator.avgTicket')} ({pack.currency.symbol}):
              </label>
              <input
                type="number"
                value={avgTicket}
                onChange={(e) => setAvgTicket(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                {t('investor.calculator.completedJobs')}:
              </label>
              <input
                type="number"
                value={monthlyJobs}
                onChange={(e) => setMonthlyJobs(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                {t('investor.calculator.customerFee')}:
              </label>
              <input
                type="number"
                step="0.5"
                value={customerFeePct}
                onChange={(e) => setCustomerFeePct(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                {t('investor.calculator.workerFee')}:
              </label>
              <input
                type="number"
                step="0.5"
                value={workerFeePct}
                onChange={(e) => setWorkerFeePct(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                {t('investor.calculator.paymentCost')}:
              </label>
              <input
                type="number"
                step="0.1"
                value={paymentCostPct}
                onChange={(e) => setPaymentCostPct(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                {t('investor.calculator.supportCost')}:
              </label>
              <input
                type="number"
                step="0.1"
                value={supportCostPct}
                onChange={(e) => setSupportCostPct(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              {t('investor.calculator.fixedCost')} ({pack.currency.symbol}):
            </label>
            <input
              type="number"
              value={fixedMonthlyCost}
              onChange={(e) => setFixedMonthlyCost(Number(e.target.value))}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground"
            />
          </div>
        </div>

        {/* Right: Key Outputs & Visual Chart */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-border bg-muted/20 space-y-1">
              <span className="text-[11px] text-muted-foreground block font-medium">
                {t('investor.calculator.revPerJob')}
              </span>
              <span className="text-xl font-bold text-foreground">
                {formatCurrency(platformRevenuePerJob, pack, locale)}
              </span>
              <span className="text-[10px] text-muted-foreground block">
                Take Rate: {totalTakeRatePct.toFixed(1)}%
              </span>
            </div>

            <div
              className={`p-4 rounded-2xl border space-y-1 ${
                contributionPerJob >= 0
                  ? 'border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20'
                  : 'border-rose-500/40 bg-rose-50/30 dark:bg-rose-950/30'
              }`}
            >
              <span className="text-[11px] text-muted-foreground block font-medium">
                {t('investor.calculator.contribPerJob')}
              </span>
              <span
                className={`text-xl font-bold ${
                  contributionPerJob >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {formatCurrency(contributionPerJob, pack, locale)}
              </span>
              <span className="text-[10px] text-muted-foreground block">
                Margin: {((contributionPerJob / (avgTicket || 1)) * 100).toFixed(1)}%
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-border bg-muted/20 space-y-1">
              <span className="text-[11px] text-muted-foreground block font-medium">
                {t('investor.calculator.monthlyContrib')}
              </span>
              <span className="text-xl font-bold text-foreground">
                {formatCurrency(totalMonthlyContribution, pack, locale)}
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-border bg-muted/20 space-y-1">
              <span className="text-[11px] text-muted-foreground block font-medium">
                {t('investor.calculator.breakeven')}
              </span>
              <span className="text-xl font-bold text-foreground">
                {breakEvenJobs ? `${breakEvenJobs.toLocaleString()} jobs` : 'Impossible'}
              </span>
            </div>
          </div>

          {/* Visual Breakdown Bar Chart */}
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" fontSize={10} stroke="#888888" tickLine={false} />
                <YAxis dataKey="name" type="category" fontSize={10} stroke="#888888" tickLine={false} width={120} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
