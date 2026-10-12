import * as React from 'react';
import { useAppStore } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { getServices } from '@/services/registry';
import type { WalletSummary, WalletTransaction } from '@/services/types';
import { formatCurrency, formatDate, getLocalizedText } from '@/i18n/formatters';
import { computePayoutFee } from '@/lib/fees';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  Wallet as WalletIcon,
  ArrowDownLeft,
  ArrowUpRight,
  Lock,
  Download,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';

export const WalletPage: React.FC = () => {
  const { pack, locale, currentUser } = useAppStore();
  const { t } = useTranslation();

  const [summary, setSummary] = React.useState<WalletSummary | null>(null);
  const [transactions, setTransactions] = React.useState<WalletTransaction[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Withdraw Modal State
  const [withdrawModalOpen, setWithdrawModalOpen] = React.useState(false);
  const [withdrawAmount, setWithdrawAmount] = React.useState<number>(1000);
  const [selectedMethodId, setSelectedMethodId] = React.useState<string>(
    pack.payments.payoutMethods[0]?.id || '',
  );
  const [submittingWithdrawal, setSubmittingWithdrawal] = React.useState(false);
  const [withdrawError, setWithdrawError] = React.useState<string | null>(null);

  const loadWallet = React.useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [sum, txs] = await Promise.all([
        getServices().wallet.getSummary(currentUser.id),
        getServices().wallet.listTransactions(currentUser.id),
      ]);
      setSummary(sum);
      setTransactions(txs);
      if (sum.available > 0) {
        setWithdrawAmount(Math.min(sum.available, 2000));
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  React.useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  const handleWithdraw = async () => {
    if (!currentUser) return;
    setSubmittingWithdrawal(true);
    setWithdrawError(null);
    try {
      await getServices().wallet.withdraw(currentUser.id, withdrawAmount, selectedMethodId);
      setWithdrawModalOpen(false);
      await loadWallet();
    } catch (err: any) {
      setWithdrawError(err.code ? t(`common.errors.${err.code}`) : err.message);
    } finally {
      setSubmittingWithdrawal(false);
    }
  };

  const handleExportStatement = async () => {
    if (!currentUser) return;
    const res = await getServices().wallet.exportStatement(currentUser.id, 'month');
    alert(`Statement generated: ${res.fileName}`);
  };

  const currentPayoutFee = computePayoutFee(pack, selectedMethodId);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-2">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t('wallet.title')}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Institutional payments via licensed partner: {pack.payments.partnerName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportStatement}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            {t('wallet.exportStatement')}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setWithdrawModalOpen(true)}
            disabled={!summary || summary.available <= 0}
          >
            <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
            {t('wallet.withdrawCTA')}
          </Button>
        </div>
      </div>

      {/* 2. Balance Metric Tiles */}
      {loading || !summary ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Available for withdrawal */}
          <div className="p-5 rounded-2xl border border-border bg-card shadow-soft space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('wallet.available')}</span>
              <WalletIcon className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight">
              {formatCurrency(summary.available, pack, locale)}
            </div>
            <span className="text-[11px] text-muted-foreground block">
              Instant payout ready
            </span>
          </div>

          {/* Held in Protected Escrow */}
          <div className="p-5 rounded-2xl border border-border bg-card shadow-soft space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('wallet.heldInJobs')}</span>
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight">
              {formatCurrency(summary.held, pack, locale)}
            </div>
            <span className="text-[11px] text-muted-foreground block">
              Auto-releases after acceptance
            </span>
          </div>

          {/* Pending Bank Processing */}
          <div className="p-5 rounded-2xl border border-border bg-card shadow-soft space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('wallet.pendingPayout')}</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight">
              {formatCurrency(summary.pendingPayouts, pack, locale)}
            </div>
            <span className="text-[11px] text-muted-foreground block">
              Settling through local rails
            </span>
          </div>
        </div>
      )}

      {/* 3. Country Pack Tax Notice Card */}
      <div className="p-5 rounded-2xl border border-border bg-muted/30 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <FileSpreadsheet className="w-4 h-4 text-primary" />
          <span>{t('wallet.taxCardTitle')} ({pack.code})</span>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {getLocalizedText(pack.tax.note, locale)}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {pack.tax.workerStatuses.map((st) => (
            <Badge key={st.id} variant="secondary">
              {getLocalizedText(st.label, locale)}: {getLocalizedText(st.hint, locale)}
            </Badge>
          ))}
        </div>
      </div>

      {/* 4. Transaction History */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
        <h3 className="font-bold text-base text-foreground">
          {t('wallet.historyTitle')} ({transactions.length})
        </h3>

        {transactions.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground">
            No transactions recorded for this profile yet.
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => {
              const isIncome = tx.direction === 'in';
              return (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 ${
                        isIncome
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground capitalize block">
                        {tx.type} {tx.jobId ? `(#${tx.jobId})` : ''}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatDate(tx.createdAt, 'PP p', locale)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-bold block ${
                        isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.amount, pack, locale)}
                    </span>
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      <Modal
        open={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        title={t('wallet.withdrawCTA')}
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Withdrawal Amount ({pack.currency.symbol}):
            </label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(Number(e.target.value))}
              max={summary?.available || 0}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground font-bold"
            />
            <span className="text-[11px] text-muted-foreground block mt-1">
              Available: {formatCurrency(summary?.available || 0, pack, locale)}
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              {t('wallet.methodSelect')}:
            </label>
            <div className="space-y-2">
              {pack.payments.payoutMethods.map((m) => {
                const isSel = selectedMethodId === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethodId(m.id)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-colors flex items-center justify-between ${
                      isSel ? 'border-primary bg-primary/10 font-semibold' : 'border-border bg-card'
                    }`}
                  >
                    <div>
                      <span className="block text-foreground">{getLocalizedText(m.label, locale)}</span>
                      <span className="text-[10px] text-muted-foreground">
                        ETA: {getLocalizedText(m.eta, locale)}
                      </span>
                    </div>
                    {m.extraFee > 0 && (
                      <span className="text-[11px] text-muted-foreground">
                        +{formatCurrency(m.extraFee, pack, locale)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs flex justify-between">
            <span className="text-muted-foreground">Payout processing fee:</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(currentPayoutFee, pack, locale)}
            </span>
          </div>

          {withdrawError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{withdrawError}</span>
            </div>
          )}

          <Button
            className="w-full"
            variant="primary"
            size="lg"
            isLoading={submittingWithdrawal}
            onClick={handleWithdraw}
          >
            Confirm Withdrawal ({pack.payments.partnerName})
          </Button>
        </div>
      </Modal>
    </div>
  );
};
