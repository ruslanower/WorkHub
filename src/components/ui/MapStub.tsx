import * as React from 'react';
import { cn } from '@/lib/cn';
import type { TaskWithMeta } from '@/services/types';
import { MapPin } from 'lucide-react';
import { formatCurrency, getLocalizedText } from '@/i18n/formatters';
import { useAppStore } from '@/app/store';

interface MapStubProps {
  tasks: TaskWithMeta[];
  selectedTaskId?: string;
  onSelectTask?: (taskId: string) => void;
  className?: string;
}

export const MapStub: React.FC<MapStubProps> = ({
  tasks,
  selectedTaskId,
  onSelectTask,
  className,
}) => {
  const { pack, locale } = useAppStore();

  return (
    <div
      className={cn(
        'relative w-full h-[460px] rounded-2xl overflow-hidden border border-border bg-slate-900/5 dark:bg-slate-950/40 select-none shadow-inner',
        className,
      )}
    >
      {/* Stylized Vector Grid Background */}
      <svg
        className="absolute inset-0 w-full h-full stroke-slate-300/40 dark:stroke-slate-800/60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Stylized Country Outline representation */}
      <div className="absolute inset-4 rounded-xl border border-dashed border-primary/20 pointer-events-none flex items-end justify-between p-4 text-xs text-muted-foreground/60 font-mono">
        <span>Region: {pack.intlRegion} (Stylized Vector Map)</span>
        <span>Pins: {tasks.length} active jobs</span>
      </div>

      {/* City Center Markers */}
      {pack.cities.map((city) => (
        <div
          key={city.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none"
          style={{ left: `${city.x}%`, top: `${city.y}%` }}
        >
          <div className="w-2 h-2 rounded-full bg-primary/40" />
          <span className="text-[11px] font-semibold text-muted-foreground tracking-wide">
            {getLocalizedText(city.name, locale)}
          </span>
        </div>
      ))}

      {/* Interactive Task Pins */}
      {tasks.map((task) => {
        const isSelected = selectedTaskId === task.id;
        return (
          <button
            key={task.id}
            type="button"
            onClick={() => onSelectTask?.(task.id)}
            className={cn(
              'absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200 z-10 group focus:outline-none',
              isSelected ? 'scale-125 z-30' : 'hover:scale-110',
            )}
            style={{ left: `${task.x}%`, top: `${task.y}%` }}
            title={getLocalizedText(task.title, locale)}
          >
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shadow-lifted border transition-colors',
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-foreground border-border hover:border-primary',
              )}
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{formatCurrency(task.budget, pack, locale)}</span>
            </div>
            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block z-40">
              <div className="bg-slate-900 text-white text-[11px] py-1 px-2 rounded-md shadow whitespace-nowrap">
                {getLocalizedText(task.title, locale)}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
