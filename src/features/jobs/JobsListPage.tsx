import * as React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { getServices } from '@/services/registry';
import type { Job, Task } from '@/services/types';
import { formatCurrency, formatDate, getLocalizedText } from '@/i18n/formatters';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Briefcase, ArrowRight, Lock, Clock, CheckCircle2 } from 'lucide-react';

export const JobsListPage: React.FC = () => {
  const { countryCode, pack, locale, currentUser, role } = useAppStore();
  const { t } = useTranslation();

  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [tasks, setTasks] = React.useState<Map<string, Task>>(new Map());
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const filter = {
          countryCode,
          customerId: role === 'customer' && currentUser ? currentUser.id : undefined,
          workerId: role === 'worker' && currentUser ? currentUser.id : undefined,
        };
        const jobList = await getServices().jobs.list(filter);
        setJobs(jobList);

        const allTasks = await getServices().tasks.list({ countryCode });
        const map = new Map(allTasks.map((t) => [t.id, t]));
        setTasks(map);
      } catch {
        //
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [countryCode, currentUser, role]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t('nav.myJobs')}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Active and archived deals with escrow payment protection
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No jobs found"
          description="You do not have any active jobs in this market yet."
          actionLabel="Browse Available Tasks"
          onAction={() => (window.location.href = '/tasks')}
        />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const task = tasks.get(job.taskId);
            return (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="block p-5 rounded-2xl border border-border bg-card shadow-soft hover:shadow-lifted hover:border-primary/40 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        #{job.id}
                      </span>
                      <Badge variant="default" className="capitalize">
                        {job.status.replace('_', ' ')}
                      </Badge>
                      {job.isFlagship && (
                        <Badge variant="verify" className="font-semibold">
                          Flagship Demo
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                      {task ? getLocalizedText(task.title, locale) : `Job #${job.id}`}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-primary" />
                        <span>State: {job.paymentState}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Created {formatDate(job.createdAt, 'PP', locale)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-border">
                    <div className="text-right">
                      <span className="text-[11px] text-muted-foreground block">Protected Value</span>
                      <span className="text-lg font-bold text-foreground">
                        {formatCurrency(job.amount, pack, locale)}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
