import * as React from 'react';
import { cn } from '@/lib/cn';
import { Check } from 'lucide-react';
import type { JobStatus } from '@/services/types';
import { useTranslation } from 'react-i18next';

const STEPS: { key: JobStatus; labelKey: string }[] = [
  { key: 'offer_accepted', labelKey: 'jobs.stepper.offer_accepted' },
  { key: 'funded', labelKey: 'jobs.stepper.funded' },
  { key: 'in_progress', labelKey: 'jobs.stepper.in_progress' },
  { key: 'delivered', labelKey: 'jobs.stepper.delivered' },
  { key: 'approved', labelKey: 'jobs.stepper.approved' },
  { key: 'paid_out', labelKey: 'jobs.stepper.paid_out' },
];

interface StatusStepperProps {
  currentStatus: JobStatus;
  className?: string;
}

export const StatusStepper: React.FC<StatusStepperProps> = ({ currentStatus, className }) => {
  const { t } = useTranslation();
  const currentIndex = STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className={cn('w-full py-4 overflow-x-auto', className)}>
      <div className="flex items-center min-w-[580px] justify-between">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <React.Fragment key={step.key}>
              {/* Step indicator */}
              <div className="flex flex-col items-center gap-1.5 relative group">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
                    isDone
                      ? 'bg-primary text-primary-foreground'
                      : isCurrent
                      ? 'bg-primary ring-4 ring-primary/20 text-primary-foreground font-bold'
                      : 'bg-muted text-muted-foreground border border-border',
                  )}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                </div>
                <span
                  className={cn(
                    'text-[11px] font-medium text-center whitespace-nowrap',
                    isCurrent
                      ? 'text-primary font-bold'
                      : isDone
                      ? 'text-foreground'
                      : 'text-muted-foreground',
                  )}
                >
                  {t(step.labelKey)}
                </span>
              </div>

              {/* Connecting line */}
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 rounded transition-colors',
                    idx < currentIndex ? 'bg-primary' : 'bg-border',
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
