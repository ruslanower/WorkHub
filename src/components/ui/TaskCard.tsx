import * as React from 'react';
import { cn } from '@/lib/cn';
import type { TaskWithMeta } from '@/services/types';
import { useAppStore } from '@/app/store';
import { formatCurrency, formatDate, getLocalizedText } from '@/i18n/formatters';
import { CategoryIcon } from './CategoryIcon';
import { VerifiedBadge } from './VerifiedBadge';
import { Badge } from './Badge';
import { MapPin, Calendar, Clock, Star, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface TaskCardProps {
  task: TaskWithMeta;
  className?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, className }) => {
  const { pack, locale } = useAppStore();
  const { t } = useTranslation();
  const category = pack.categories.find((c) => c.id === task.categoryId);
  const city = pack.cities.find((c) => c.id === task.cityId);

  return (
    <div
      className={cn(
        'group p-5 rounded-2xl border border-border bg-card shadow-soft hover:shadow-lifted transition-all duration-200 flex flex-col justify-between hover:border-primary/40',
        task.isFlagship && 'ring-2 ring-primary/30',
        className,
      )}
    >
      <div>
        {/* Header: Category Badge + Flagship / Verification info */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <CategoryIcon name={category?.icon || 'Package'} className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {getLocalizedText(category?.label, locale)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {task.isFlagship && (
              <Badge variant="default" className="bg-primary text-primary-foreground font-semibold">
                {locale === 'uk' ? 'Флагманське демо' : 'Flagship Demo'}
              </Badge>
            )}
            <VerifiedBadge level={task.minVerificationLevel} showLabel={false} />
          </div>
        </div>

        {/* Title */}
        <Link to={`/tasks/${task.id}`} className="block focus:outline-none">
          <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {getLocalizedText(task.title, locale)}
          </h3>
        </Link>

        {/* Description Snippet */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {getLocalizedText(task.description, locale)}
        </p>

        {/* Meta badges: Location, Date, Duration */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>
              {getLocalizedText(city?.name, locale)}, {task.district}
              {task.distanceKm != null && ` (${task.distanceKm} km)`}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{formatDate(task.date, 'MMM d', locale)}</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>~{task.durationHours}h</span>
          </div>
        </div>
      </div>

      {/* Footer: Budget + Offers count + Action link */}
      <div className="pt-3 border-t border-border flex items-center justify-between">
        <div>
          <span className="text-[11px] text-muted-foreground block font-medium">
            {locale === 'uk' ? 'Бюджет' : 'Budget'}
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            {formatCurrency(task.budget, pack, locale)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground" title={locale === 'uk' ? 'Подано пропозицій' : 'Submitted proposals'}>
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{task.offersCount}</span>
          </div>

          <Link
            to={`/tasks/${task.id}`}
            className="inline-flex items-center justify-center h-8 px-3 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {locale === 'uk' ? 'Деталі' : 'Details'}
          </Link>
        </div>
      </div>
    </div>
  );
};
