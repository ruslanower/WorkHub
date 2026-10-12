import * as React from 'react';
import { useAppStore } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { getServices } from '@/services/registry';
import type { AdminQueues, AuditEvent } from '@/services/types';
import { validateCountryPack } from '@/countries/types';
import { formatCurrency, formatDate } from '@/i18n/formatters';
import { KpiTile } from '@/components/ui/KpiTile';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  FileCode2,
  Settings,
  History,
  Users,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const AdminConsolePage: React.FC = () => {
  const { pack, countryCode, updatePackFees, currentUser } = useAppStore();
  const { t } = useTranslation();

  const [queues, setQueues] = React.useState<AdminQueues | null>(null);
  const [auditLog, setAuditLog] = React.useState<AuditEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'queues' | 'editor' | 'inspector' | 'audit'>('queues');

  // Live Country Pack Editor state
  const [customerFeePct, setCustomerFeePct] = React.useState(pack.fees.customerPct * 100);
  const [workerFeePct, setWorkerFeePct] = React.useState(pack.fees.workerPct * 100);
  const [autoReleaseDays, setAutoReleaseDays] = React.useState(pack.autoReleaseDays);

  const validationResult = validateCountryPack(pack);

  const loadAdminData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [q, logs] = await Promise.all([
        getServices().admin.getQueues(countryCode),
        getServices().admin.getAuditLog(countryCode),
      ]);
      setQueues(q);
      setAuditLog(logs);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, [countryCode]);

  React.useEffect(() => {
    loadAdminData();
    setCustomerFeePct(pack.fees.customerPct * 100);
    setWorkerFeePct(pack.fees.workerPct * 100);
    setAutoReleaseDays(pack.autoReleaseDays);
  }, [loadAdminData, pack]);

  const handleApplyFees = async () => {
    updatePackFees({
      customerPct: customerFeePct / 100,
      workerPct: workerFeePct / 100,
    });
    if (currentUser) {
      await getServices().admin.logPackChange(countryCode, currentUser.id, 'fees');
    }
    alert('Country Pack parameters updated live! All fee calculations updated across the demo.');
  };

  const handleApproveKyc = async (caseId: string) => {
    if (!currentUser) return;
    await getServices().admin.reviewKyc(caseId, currentUser.id, true);
    await loadAdminData();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in py-2">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-border bg-card shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">
              {t('admin.title')}
            </h1>
            <Badge variant="verify" className="font-mono">
              Market: {countryCode}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Operations, KYC permit review queue, anti-fraud flags, and Country Pack schema validator
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('queues')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'queues' ? 'bg-card text-foreground shadow-sm font-semibold' : 'text-muted-foreground'
            }`}
          >
            Queues ({queues ? queues.kyc.length + queues.disputes.length + queues.flags.length : 0})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'editor' ? 'bg-card text-foreground shadow-sm font-semibold' : 'text-muted-foreground'
            }`}
          >
            Live Pack Editor
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inspector')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'inspector' ? 'bg-card text-foreground shadow-sm font-semibold' : 'text-muted-foreground'
            }`}
          >
            Zod Inspector
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'audit' ? 'bg-card text-foreground shadow-sm font-semibold' : 'text-muted-foreground'
            }`}
          >
            Audit Log
          </button>
        </div>
      </div>

      {/* 2. KPI Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KpiTile
          title="KYC Pending"
          value={queues?.kyc.length || 0}
          subtext="Trade permits & L2/L3"
          icon={<Users className="w-4 h-4 text-primary" />}
        />
        <KpiTile
          title="Active Disputes"
          value={queues?.disputes.length || 0}
          subtext="Under 24h SLA"
          icon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
        />
        <KpiTile
          title="Security Flags"
          value={queues?.flags.length || 0}
          subtext="Contact leakage / velocity"
          icon={<ShieldAlert className="w-4 h-4 text-amber-600" />}
        />
        <KpiTile
          title="Payout Exceptions"
          value={queues?.payoutExceptions.length || 0}
          subtext="Reconciliation exceptions"
          icon={<AlertCircle className="w-4 h-4 text-blue-600" />}
        />
      </div>

      {/* Tab 1: Moderation Queues */}
      {activeTab === 'queues' && (
        <div className="space-y-6">
          {/* KYC Review Queue */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
            <h3 className="font-bold text-base text-foreground">
              Identity & Regulated Trade Permit Queue ({queues?.kyc.length || 0})
            </h3>

            {queues?.kyc.length === 0 ? (
              <div className="text-xs text-muted-foreground py-4">No pending KYC submissions.</div>
            ) : (
              <div className="space-y-3">
                {queues?.kyc.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="p-4 rounded-2xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">Case #{caseItem.id}</span>
                        <Badge variant="verify">Level {caseItem.level}</Badge>
                        {caseItem.tradeCategoryId && (
                          <Badge variant="warning">{caseItem.tradeCategoryId}</Badge>
                        )}
                      </div>
                      <span className="text-muted-foreground block mt-1">
                        User ID: {caseItem.userId} • Submitted {formatDate(caseItem.submittedAt, 'PP')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleApproveKyc(caseItem.id)}
                      >
                        Approve Permit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Masking & Security Flags Queue */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
            <h3 className="font-bold text-base text-foreground">
              Anti-Fraud & Leakage Protection Flags ({queues?.flags.length || 0})
            </h3>

            {queues?.flags.length === 0 ? (
              <div className="text-xs text-muted-foreground py-4">No security flags triggered.</div>
            ) : (
              <div className="space-y-3">
                {queues?.flags.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 rounded-2xl border border-border bg-muted/20 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground capitalize">{f.reason.replace('_', ' ')}</span>
                        <Badge variant="danger">{f.status}</Badge>
                      </div>
                      <span className="text-muted-foreground block mt-1">
                        Snippet: "{f.snippet || 'Off-platform contact attempt'}"
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        if (!currentUser) return;
                        await getServices().admin.resolveFlag(f.id, currentUser.id, 'resolve');
                        await loadAdminData();
                      }}
                    >
                      Resolve Flag
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Live Country Pack Editor */}
      {activeTab === 'editor' && (
        <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-6">
          <div>
            <h3 className="font-bold text-base text-foreground">
              Live Country Pack Editor ({pack.code})
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Modify operational parameters in memory. Changes instantly propagate to quote generators and calculators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Customer Platform Fee (%):
              </label>
              <input
                type="number"
                step="0.5"
                value={customerFeePct}
                onChange={(e) => setCustomerFeePct(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Worker Platform Fee (%):
              </label>
              <input
                type="number"
                step="0.5"
                value={workerFeePct}
                onChange={(e) => setWorkerFeePct(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Auto-Release Escrow Timer (days):
              </label>
              <input
                type="number"
                value={autoReleaseDays}
                onChange={(e) => setAutoReleaseDays(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground font-bold"
              />
            </div>
          </div>

          <Button variant="primary" onClick={handleApplyFees}>
            Apply Live Parameters
          </Button>
        </div>
      )}

      {/* Tab 3: Zod Schema Inspector */}
      {activeTab === 'inspector' && (
        <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-foreground">
                Active Country Pack Inspector & Zod Validation
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Evaluates {pack.code} against the strict Zod schema specification.
              </p>
            </div>

            <Badge variant={validationResult.ok ? 'success' : 'danger'}>
              {validationResult.ok ? '✓ Validated Zod Schema' : 'Schema Errors Detected'}
            </Badge>
          </div>

          {!validationResult.ok && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 text-xs">
              {validationResult.issues.map((iss, i) => (
                <div key={i}>
                  • {iss.path}: {iss.message}
                </div>
              ))}
            </div>
          )}

          <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto max-h-96">
            <pre>{JSON.stringify(pack, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Log */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
          <h3 className="font-bold text-base text-foreground">
            System Audit Trail ({auditLog.length})
          </h3>

          <div className="space-y-2">
            {auditLog.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-border bg-muted/20 text-xs flex justify-between items-center"
              >
                <div>
                  <span className="font-bold text-foreground capitalize block">
                    {log.action.replace('_', ' ')}
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    Entity: {log.entityType} ({log.entityId})
                  </span>
                </div>
                <span className="text-muted-foreground text-[11px]">
                  {formatDate(log.createdAt, 'PP p')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
