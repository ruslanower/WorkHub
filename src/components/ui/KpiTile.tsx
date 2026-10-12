import * as React from 'react';
import { cn } from '@/lib/cn';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiTileProps {
  title: string;
  value: string | number;
  change?: string | number;
  changePositive?: boolean;
  subtext?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const KpiTile: React.FC<KpiTileProps> = ({
  title,
  value,
  change,
  changePositive,
  subtext,
  icon,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-4 rounded-xl border border-border bg-card shadow-soft flex flex-col justify-between transition-all hover:border-primary/30',
        className,
      )}
    >
      <div className="flex items-center justify-between text-muted-foreground mb-2">
        <span className="text-xs font-medium uppercase tracking-wider">
          {title}
        </span>
        {icon && <div className="p-1.5 rounded-lg bg-muted text-foreground">{icon}</div>}
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </div>
        {(change != null || subtext) && (
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            {change != null && (
              <span
                className={cn(
                  'inline-flex items-center font-medium',
                  changePositive === true
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : changePositive === false
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-muted-foreground',
                )}
              >
                {changePositive === true ? (
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                ) : changePositive === false ? (
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                ) : null}
                {change}
              </span>
            )}
            {subtext && <span className="text-muted-foreground">{subtext}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
