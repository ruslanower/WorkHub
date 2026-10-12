import * as React from 'react';
import { useAppStore } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { getServices } from '@/services/registry';
import type { Company, Task, Job } from '@/services/types';
import { formatCurrency, formatDate, getLocalizedText } from '@/i18n/formatters';
import { KpiTile } from '@/components/ui/KpiTile';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  Building2,
  Users,
  Kanban,
  Repeat,
  Download,
  PlusCircle,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const KANBAN_COLUMNS = [
  { id: 'draft', title: 'Draft' },
  { id: 'open', title: 'Open for Bids' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Pending Approval' },
  { id: 'done', title: 'Done & Invoiced' },
] as const;

export const CompanyWorkspacePage: React.FC = () => {
  const { pack, locale, countryCode } = useAppStore();
  const { t } = useTranslation();

  const [company, setCompany] = React.useState<Company | null>(null);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [inviteModalOpen, setInviteModalOpen] = React.useState(false);
  const [inviteName, setInviteName] = React.useState('');
  const [inviteRole, setInviteRole] = React.useState<any>('member');

  const loadCompanyData = React.useCallback(async () => {
    setLoading(true);
    try {
      const companies = await getServices().companies.list(countryCode);
      const c = companies[0];
      setCompany(c);

      const allTasks = await getServices().tasks.list({ countryCode });
      setTasks(allTasks);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, [countryCode]);

  React.useEffect(() => {
    loadCompanyData();
  }, [loadCompanyData]);

  const handleExportStatement = async () => {
    if (!company) return;
    const res = await getServices().companies.exportMonthlyStatement(company.id);
    alert(`Corporate statement downloaded: ${res.fileName}`);
  };

  const handleInviteMember = async () => {
    if (!company || !inviteName) return;
    await getServices().companies.inviteMember(company.id, inviteName, inviteRole);
    setInviteName('');
    setInviteModalOpen(false);
    await loadCompanyData();
  };

  if (loading || !company) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  // Filter tasks into columns for the Kanban board
  const getTasksForCol = (colId: string) => {
    if (colId === 'draft') return tasks.filter((t) => t.status === 'draft');
    if (colId === 'open') return tasks.filter((t) => t.status === 'open');
    if (colId === 'in_progress') return tasks.filter((t) => t.status === 'hired' || t.status === 'in_progress');
    if (colId === 'review') return tasks.filter((t) => t.status === 'pending_approval' || t.status === 'delivered');
    return tasks.filter((t) => t.status === 'completed');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in py-2">
      {/* 1. Header with corporate export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-border bg-card shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">
                {company.name.en}
              </h1>
              <Badge variant="default">B2B Corporate</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Consolidated billing, team approvals, and scheduled facility maintenance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportStatement}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Monthly Statement
          </Button>

          <Button size="sm" variant="primary" onClick={() => setInviteModalOpen(true)}>
            <Users className="w-3.5 h-3.5 mr-1.5" />
            Invite Colleague
          </Button>
        </div>
      </div>

      {/* 2. Budget Limits & Manager Approval Threshold */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiTile
          title="Monthly Allocated Budget"
          value={formatCurrency(company.monthlyBudget, pack, locale)}
          subtext="Cap set by Finance"
          icon={<Building2 className="w-4 h-4 text-primary" />}
        />

        <KpiTile
          title="Spent This Month"
          value={formatCurrency(company.spentThisMonth, pack, locale)}
          subtext={`${Math.round((company.spentThisMonth / company.monthlyBudget) * 100)}% of limit`}
          icon={<Building2 className="w-4 h-4 text-emerald-600" />}
        />

        <KpiTile
          title="Approval Threshold"
          value={formatCurrency(company.approvalThreshold, pack, locale)}
          subtext="Requires Owner/Manager sign-off"
          icon={<ShieldAlert className="w-4 h-4 text-amber-600" />}
        />
      </div>

      {/* 3. Corporate Kanban Board */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Kanban className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-base text-foreground">
              Corporate Job Execution Pipeline
            </h3>
          </div>

          <Link to="/tasks/new">
            <Button size="sm" variant="outline">
              <PlusCircle className="w-3.5 h-3.5 mr-1" />
              Add Pipeline Task
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 overflow-x-auto pb-2">
          {KANBAN_COLUMNS.map((col) => {
            const colTasks = getTasksForCol(col.id);
            return (
              <div
                key={col.id}
                className="rounded-2xl border border-border bg-muted/30 p-3 flex flex-col min-w-[200px] h-[480px]"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border text-xs font-semibold">
                  <span className="text-foreground">{col.title}</span>
                  <Badge variant="secondary">{colTasks.length}</Badge>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-8 text-[11px] text-muted-foreground/60">
                      Empty
                    </div>
                  ) : (
                    colTasks.map((t) => (
                      <Link
                        key={t.id}
                        to={`/tasks/${t.id}`}
                        className="p-3 rounded-xl border border-border bg-card hover:border-primary/50 transition-all block space-y-1.5 shadow-sm group"
                      >
                        <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors block line-clamp-2">
                          {getLocalizedText(t.title, locale)}
                        </span>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                          <span className="font-bold text-foreground">
                            {formatCurrency(t.budget, pack, locale)}
                          </span>
                          <span>{t.durationHours}h</span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Team Members & Roles Strip */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
        <h3 className="font-bold text-base text-foreground">
          Team Members & Spending Permissions ({company.members.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {company.members.map((m, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-border bg-muted/20 flex items-center justify-between">
              <div>
                <span className="font-semibold text-xs text-foreground block">
                  Member #{m.userId}
                </span>
                <span className="text-[11px] text-muted-foreground capitalize">
                  Role: {m.role}
                </span>
              </div>
              <Badge variant="default" className="capitalize">
                {m.role}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      <Modal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite Team Member"
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Colleague Full Name:
            </label>
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="E.g. Elena Rostova"
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Permission Role:
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as any)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            >
              <option value="member">Member (Can post within budget)</option>
              <option value="manager">Manager (Can approve orders &gt; threshold)</option>
              <option value="accountant">Accountant (Reports & tax downloads)</option>
            </select>
          </div>

          <Button variant="primary" className="w-full" onClick={handleInviteMember}>
            Send Invitation
          </Button>
        </div>
      </Modal>
    </div>
  );
};
