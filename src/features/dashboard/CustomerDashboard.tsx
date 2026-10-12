import * as React from 'react';
import { useAppStore } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { getServices } from '@/services/registry';
import type { Job, Task, User } from '@/services/types';
import { formatCurrency, formatDate, getLocalizedText } from '@/i18n/formatters';
import { KpiTile } from '@/components/ui/KpiTile';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TrustScoreRing } from '@/components/ui/TrustScoreRing';
import {
  Briefcase,
  DollarSign,
  Repeat,
  Bookmark,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerDashboard: React.FC = () => {
  const { pack, locale, currentUser } = useAppStore();
  const { t } = useTranslation();

  const [activeJobs, setActiveJobs] = React.useState<Job[]>([]);
  const [completedJobs, setCompletedJobs] = React.useState<Job[]>([]);
  const [tasks, setTasks] = React.useState<Map<string, Task>>(new Map());
  const [savedWorkers, setSavedWorkers] = React.useState<User[]>([]);

  React.useEffect(() => {
    if (!currentUser) return;
    const load = async () => {
      const [jobs, allTasks, workers] = await Promise.all([
        getServices().jobs.list({ countryCode: pack.code, customerId: currentUser.id }),
        getServices().tasks.list({ countryCode: pack.code }),
        getServices().users.list({ countryCode: pack.code, accountType: 'worker' }),
      ]);
      setActiveJobs(jobs.filter((j) => ['funded', 'in_progress', 'delivered'].includes(j.status)));
      setCompletedJobs(jobs.filter((j) => j.status === 'paid_out' || j.status === 'approved'));
      setTasks(new Map(allTasks.map((t) => [t.id, t])));
      setSavedWorkers(workers.slice(0, 3));
    };
    load();
  }, [currentUser, pack.code]);

  const totalSpent = completedJobs.reduce((sum, j) => sum + j.amount, 0) + 14500;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in py-2">
      {/* 1. Header with quick post action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-border bg-card shadow-soft">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {currentUser?.name.en || 'Customer Dashboard'}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your physical projects, contractor milestones, and billing
          </p>
        </div>

        <Link to="/tasks/new">
          <Button size="md" variant="primary">
            <PlusCircle className="w-4 h-4 mr-2" />
            Post New Task
          </Button>
        </Link>
      </div>

      {/* 2. Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiTile
          title="Active Projects"
          value={activeJobs.length}
          subtext="Protected escrow"
          icon={<Briefcase className="w-4 h-4 text-primary" />}
        />

        <KpiTile
          title="Total Lifetime Spend"
          value={formatCurrency(totalSpent, pack, locale)}
          subtext="Verified compliance"
          icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
        />

        <KpiTile
          title="Completed Orders"
          value={completedJobs.length + 8}
          subtext="With completion acts"
          icon={<Repeat className="w-4 h-4 text-blue-600" />}
        />
      </div>

      {/* 3. Active Jobs in Progress */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-foreground">
          Current Ongoing Work
        </h3>

        {activeJobs.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground bg-card">
            No active jobs in progress. Post a task to receive bids from verified contractors.
          </div>
        ) : (
          <div className="space-y-3">
            {activeJobs.map((j) => {
              const task = tasks.get(j.taskId);
              return (
                <div
                  key={j.id}
                  className="p-5 rounded-2xl border border-border bg-card shadow-soft flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{j.status.replace('_', ' ')}</Badge>
                      <span className="text-xs text-muted-foreground font-mono">#{j.id}</span>
                    </div>
                    <h4 className="font-bold text-sm text-foreground">
                      {task ? getLocalizedText(task.title, locale) : `Job #${j.id}`}
                    </h4>
                    <span className="text-xs font-semibold text-primary block">
                      Protected: {formatCurrency(j.amount, pack, locale)}
                    </span>
                  </div>

                  <Link to={`/jobs/${j.id}`}>
                    <Button size="sm" variant="outline">
                      Open Job Room →
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Saved Contractors & Book Again */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-base text-foreground">
              Saved Contractors & "Book Again"
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {savedWorkers.map((w) => (
            <div
              key={w.id}
              className="p-5 rounded-2xl border border-border bg-card shadow-soft flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                    {w.initials}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-foreground">{w.name.en}</h4>
                    <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{w.rating}</span>
                    </div>
                  </div>
                </div>

                <TrustScoreRing score={88} size="sm" showLabel={false} />
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  {w.completedJobs} completed jobs
                </span>
                <Link to="/tasks/new">
                  <Button size="sm" variant="outline">
                    Book Again
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
