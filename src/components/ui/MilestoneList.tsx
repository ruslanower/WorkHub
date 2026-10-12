import * as React from 'react';
import { cn } from '@/lib/cn';
import type { Milestone, Role } from '@/services/types';
import { formatCurrency, getLocalizedText } from '@/i18n/formatters';
import { useAppStore } from '@/app/store';
import { Button } from './Button';
import { Badge } from './Badge';
import { CheckCircle2, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MilestoneListProps {
  milestones: Milestone[];
  userRole: Role;
  onDeliver?: (milestoneId: string) => void;
  onRelease?: (milestoneId: string) => void;
  isJobFunded?: boolean;
  className?: string;
}

export const MilestoneList: React.FC<MilestoneListProps> = ({
  milestones,
  userRole,
  onDeliver,
  onRelease,
  isJobFunded = false,
  className,
}) => {
  const { pack, locale } = useAppStore();
  const { t } = useTranslation();

  return (
    <div className={cn('space-y-3', className)}>
      {milestones.map((ms, idx) => {
        const isReleased = ms.status === 'released';
        const isDelivered = ms.status === 'delivered';
        const isPending = ms.status === 'pending' || ms.status === 'in_progress';

        return (
          <div
            key={ms.id}
            className={cn(
              'p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3',
              isReleased
                ? 'bg-muted/40 border-border opacity-85'
                : isDelivered
                ? 'bg-amber-50/30 dark:bg-amber-950/20 border-amber-300/40'
                : 'bg-card border-border',
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5',
                  isReleased
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : isDelivered
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {isReleased ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              <div>
                <h5 className="font-semibold text-sm text-foreground">
                  {getLocalizedText(ms.title, locale)}
                </h5>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-primary">
                    {formatCurrency(ms.amount, pack, locale)}
                  </span>
                  <Badge
                    variant={isReleased ? 'success' : isDelivered ? 'warning' : 'secondary'}
                  >
                    {isReleased ? 'Released' : isDelivered ? 'Delivered' : 'Pending'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {userRole === 'worker' && isPending && isJobFunded && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDeliver?.(ms.id)}
                >
                  {t('jobs.milestones.deliverButton')}
                </Button>
              )}

              {userRole === 'customer' && isDelivered && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onRelease?.(ms.id)}
                >
                  {t('jobs.milestones.releaseButton')}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
