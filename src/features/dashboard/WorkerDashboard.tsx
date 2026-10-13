import * as React from 'react';
import { useAppStore } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { getServices } from '@/services/registry';
import type { SeriesPoint, TaskWithMeta, Job } from '@/services/types';
import { formatCurrency, getLocalizedText } from '@/i18n/formatters';
import { KpiTile } from '@/components/ui/KpiTile';
import { TaskCard } from '@/components/ui/TaskCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TrustScoreRing } from '@/components/ui/TrustScoreRing';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Sparkles,
  Award,
  ChevronRight,
  Clock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Link } from 'react-router-dom';

export const WorkerDashboard: React.FC = () => {
  const { pack, locale, currentUser, refreshCurrentUser } = useAppStore();
  const { t } = useTranslation();
  const isUk = locale === 'uk';

  const [earningsSeries, setEarningsSeries] = React.useState<SeriesPoint[]>([]);
  const [nearbyTasks, setNearbyTasks] = React.useState<TaskWithMeta[]>([]);
  const [activeJobs, setActiveJobs] = React.useState<Job[]>([]);
  const [chartPeriod, setChartPeriod] = React.useState<'week' | 'month'>('week');

  React.useEffect(() => {
    if (!currentUser) return;
    const load = async () => {
      const [series, tasks, jobs] = await Promise.all([
        getServices().analytics.getWorkerEarnings(currentUser.id, chartPeriod),
        getServices().tasks.list({ countryCode: pack.code }),
        getServices().jobs.list({ countryCode: pack.code, workerId: currentUser.id }),
      ]);
      setEarningsSeries(series);
      setNearbyTasks(tasks.slice(0, 3));
      setActiveJobs(jobs.filter((j) => ['funded', 'in_progress', 'delivered'].includes(j.status)));
    };
    load();
  }, [currentUser, chartPeriod, pack.code]);

  const handleTogglePro = async () => {
    if (!currentUser) return;
    await getServices().users.setPro(currentUser.id, !currentUser.pro);
    await refreshCurrentUser();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in py-2">
      {/* 1. Header with Trust Score summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-border bg-card shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary font-bold text-lg flex items-center justify-center shrink-0">
            {currentUser?.initials || 'WK'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">
                {isUk && currentUser?.name.uk ? currentUser.name.uk : currentUser?.name.en || (isUk ? 'Кабінет виконавця' : 'Contractor Dashboard')}
              </h1>
              {currentUser?.pro && (
                <Badge variant="default" className="bg-amber-500 text-white font-bold">
                  PRO Plan
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isUk
                ? `Верифікований профіль майстра в ${getLocalizedText(pack.name, locale)} • Рівень L${currentUser?.verificationLevel || 2}`
                : `Verified contractor profile in ${pack.name.en} • Level ${currentUser?.verificationLevel || 2}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TrustScoreRing score={currentUser?.completedJobs ? 92 : 80} size="lg" />
        </div>
      </div>

      {/* 2. Key Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KpiTile
          title={isUk ? 'Місячний дохід' : 'Monthly Income'}
          value={formatCurrency(pack.currency.code === 'KE' ? 42000 : pack.currency.code === 'PL' ? 3800 : 26000, pack, locale)}
          change="+18%"
          changePositive={true}
          subtext={isUk ? 'проти мин. місяця' : 'vs last month'}
          icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
        />

        <KpiTile
          title={isUk ? 'Активні замовлення' : 'Active Jobs'}
          value={activeJobs.length}
          subtext={isUk ? 'Оплата захищена' : 'Payment protected'}
          icon={<Briefcase className="w-4 h-4 text-primary" />}
        />

        <KpiTile
          title={isUk ? 'Виконаних замовлень' : 'Completed Jobs'}
          value={currentUser?.completedJobs || 18}
          subtext={isUk ? '100% успішність' : '100% completion rate'}
          icon={<Award className="w-4 h-4 text-amber-600" />}
        />

        <KpiTile
          title={isUk ? 'Час відповіді' : 'Avg Response Time'}
          value={`${currentUser?.responseMinutes || 12} ${isUk ? 'хв' : 'min'}`}
          subtext={isUk ? 'Топ-10% у місті' : 'Top 10% in city'}
          icon={<Clock className="w-4 h-4 text-blue-600" />}
        />
      </div>

      {/* 3. Earnings Chart & Pro Plan Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-foreground">
              {isUk ? 'Динаміка заробітку' : 'Earnings Performance'}
            </h3>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-muted text-xs">
              <button
                type="button"
                onClick={() => setChartPeriod('week')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  chartPeriod === 'week' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                {isUk ? 'Тиждень' : 'Week'}
              </button>
              <button
                type="button"
                onClick={() => setChartPeriod('month')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  chartPeriod === 'month' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                {isUk ? 'Місяць' : 'Month'}
              </button>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsSeries}>
                <defs>
                  <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0f766e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#earnGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pro Plan Card */}
        <div className="p-6 rounded-3xl border border-border bg-card shadow-soft flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">
              WorkHub Pro Plan
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isUk
                ? 'Отримайте втричі вищу видимість пропозицій, доступ до регулярних B2B замовлень компаній та пріоритетний захист арбітражу.'
                : 'Get 3x bid visibility, access to commercial B2B recurring jobs, and priority dispute protection.'}
            </p>
            <ul className="text-xs text-muted-foreground space-y-2 pt-2">
              <li className="flex items-center gap-2">✓ {isUk ? 'Пріоритетне розміщення пропозицій' : 'Priority proposal placement'}</li>
              <li className="flex items-center gap-2">✓ {isUk ? 'Безкоштовний експорт виписок CSV' : 'Free monthly CSV tax export'}</li>
              <li className="flex items-center gap-2">✓ {isUk ? 'Знижка на комерційне страхування' : 'Commercial insurance discount'}</li>
            </ul>
          </div>

          <Button
            variant={currentUser?.pro ? 'outline' : 'primary'}
            className="w-full"
            onClick={handleTogglePro}
          >
            {currentUser?.pro
              ? (isUk ? 'Керувати підпискою Pro' : 'Manage Pro Subscription')
              : (isUk ? 'Активувати Pro (30 днів тест)' : 'Activate Pro (30 Days Free)')}
          </Button>
        </div>
      </div>

      {/* 4. Recommended Nearby Tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-foreground">
            {isUk ? 'Рекомендовані завдання у вашому місті' : 'Recommended Jobs in Your City'}
          </h3>
          <Link to="/tasks" className="text-xs font-semibold text-primary hover:underline">
            {isUk ? 'Дивитися всі →' : 'View all →'}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {nearbyTasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      </div>
    </div>
  );
};
