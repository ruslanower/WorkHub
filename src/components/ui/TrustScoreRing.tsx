import * as React from 'react';
import { cn } from '@/lib/cn';
import { Shield, Info } from 'lucide-react';
import { Modal } from './Modal';
import { computeTrustScore, type TrustInputs } from '@/lib/trustScore';
import { useTranslation } from 'react-i18next';

interface TrustScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  userInputs?: TrustInputs;
}

export const TrustScoreRing: React.FC<TrustScoreRingProps> = ({
  score,
  size = 'md',
  showLabel = true,
  className,
  userInputs,
}) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = React.useState(false);

  const radius = size === 'sm' ? 14 : size === 'lg' ? 26 : 18;
  const stroke = size === 'sm' ? 3 : size === 'lg' ? 4.5 : 3.5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const colorClass =
    score >= 80
      ? 'text-emerald-600 dark:text-emerald-400'
      : score >= 60
      ? 'text-teal-600 dark:text-teal-400'
      : score >= 40
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-rose-600 dark:text-rose-400';

  const defaultInputs: TrustInputs = {
    verificationLevel: 2,
    completionRate: 0.95,
    rating: 4.8,
    responseMinutes: 20,
    disputesLost: 0,
  };

  const breakdown = computeTrustScore(userInputs || defaultInputs);

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={cn(
          'inline-flex items-center gap-1.5 p-1 rounded-full hover:bg-muted/60 transition-colors group cursor-pointer focus-visible:ring-2 focus-visible:ring-ring',
          className,
        )}
        title="Trust Score: Click for formula explanation"
      >
        <div className="relative inline-flex items-center justify-center">
          <svg
            className="transform -rotate-90"
            width={radius * 2 + stroke * 2}
            height={radius * 2 + stroke * 2}
          >
            <circle
              className="text-border"
              strokeWidth={stroke}
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx={radius + stroke}
              cy={radius + stroke}
            />
            <circle
              className={cn('transition-all duration-500 ease-out', colorClass)}
              strokeWidth={stroke}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx={radius + stroke}
              cy={radius + stroke}
            />
          </svg>
          <span className={cn('absolute font-bold text-xs', colorClass)}>
            {score}
          </span>
        </div>
        {showLabel && (
          <div className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground group-hover:text-foreground">
            <span>Trust Score</span>
            <Info className="w-3 h-3 ml-0.5 opacity-60" />
          </div>
        )}
      </button>

      {/* Explanatory Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('common.trustScore.howCalculated')}
      >
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary">
            <Shield className="w-6 h-6 shrink-0" />
            <div>
              <p className="font-semibold text-foreground">
                Score: {score} / 100
              </p>
              <p className="text-xs text-muted-foreground">
                {t('common.trustScore.tooltip')}
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider">
              {t('common.trustScore.title')} Components Breakdown:
            </h4>
            {Object.entries(breakdown.components).map(([key, comp]) => (
              <div key={key} className="p-2.5 rounded-lg border bg-card">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-medium text-foreground">
                    {t(`common.trustScore.components.${key}`)}
                  </span>
                  <span className="font-semibold text-primary">
                    +{comp.points} pts
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${Math.round(comp.normalized * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Note: New accounts begin with a neutral baseline so early participants are never penalized.
          </p>
        </div>
      </Modal>
    </>
  );
};
