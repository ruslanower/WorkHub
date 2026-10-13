import * as React from 'react';
import { cn } from '@/lib/cn';
import { ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import type { PaymentState } from '@/services/types';
import { useAppStore } from '@/app/store';
import { formatCurrency, getLocalizedText } from '@/i18n/formatters';
import { Badge } from './Badge';
import { useTranslation } from 'react-i18next';

interface ProtectedPaymentPanelProps {
  amount: number;
  paymentState: PaymentState;
  className?: string;
}

export const ProtectedPaymentPanel: React.FC<ProtectedPaymentPanelProps> = ({
  amount,
  paymentState,
  className,
}) => {
  const { pack, locale } = useAppStore();
  const { t } = useTranslation();

  const stateBadges: Record<
    PaymentState,
    { variant: 'default' | 'success' | 'warning' | 'danger' | 'secondary'; labelKey: string }
  > = {
    unfunded: { variant: 'secondary', labelKey: 'common.status.unfunded' },
    funded: { variant: 'success', labelKey: 'common.status.funded' },
    partially_released: { variant: 'warning', labelKey: 'common.status.partially_released' },
    released: { variant: 'success', labelKey: 'common.status.released' },
    refunded: { variant: 'danger', labelKey: 'common.status.refunded' },
    disputed: { variant: 'danger', labelKey: 'common.status.disputed' },
  };

  const currentBadge = stateBadges[paymentState] || stateBadges.unfunded;

  return (
    <div
      className={cn(
        'p-5 rounded-2xl border bg-card shadow-soft relative overflow-hidden transition-all',
        paymentState === 'funded'
          ? 'border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10'
          : paymentState === 'disputed'
          ? 'border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/10'
          : 'border-border',
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'p-2.5 rounded-xl shrink-0',
              paymentState === 'funded'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : paymentState === 'disputed'
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {paymentState === 'disputed' ? (
              <AlertTriangle className="w-5 h-5" />
            ) : paymentState === 'funded' ? (
              <Lock className="w-5 h-5" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-foreground text-sm">
                {getLocalizedText(pack.payments.protectedPaymentLabel, locale)}
              </h4>
              <Badge variant={currentBadge.variant}>
                {t(currentBadge.labelKey)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('jobs.paymentPanel.heldBy', { partner: pack.payments.partnerName })}
            </p>
          </div>
        </div>

        <div className="text-right sm:border-l sm:border-border sm:pl-4">
          <span className="text-xs text-muted-foreground block">
            {t('jobs.paymentPanel.amountHeld')}
          </span>
          <span className="text-xl font-bold tracking-tight text-foreground">
            {formatCurrency(amount, pack, locale)}
          </span>
        </div>
      </div>
    </div>
  );
};
