import * as React from 'react';
import { useAppStore } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { getServices } from '@/services/registry';
import type { TaskWithMeta } from '@/services/types';
import { getLocalizedText } from '@/i18n/formatters';
import { TaskCard } from '@/components/ui/TaskCard';
import { MapStub } from '@/components/ui/MapStub';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import {
  Search,
  SlidersHorizontal,
  Map,
  List,
  HeartHandshake,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const BrowseTasksPage: React.FC = () => {
  const { pack, locale, countryCode } = useAppStore();
  const { t } = useTranslation();

  const [tasks, setTasks] = React.useState<TaskWithMeta[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<'list' | 'map'>('list');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [onlyPriority, setOnlyPriority] = React.useState(false);
  const [minLevel, setMinLevel] = React.useState<number>(0);
  const [sortBy, setSortBy] = React.useState<'newest' | 'budget_desc' | 'budget_asc'>('newest');
  const [selectedMapTaskId, setSelectedMapTaskId] = React.useState<string | undefined>();

  const fetchTasks = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getServices().tasks.list({
        countryCode,
        categoryIds: selectedCategory ? [selectedCategory] : undefined,
        query: searchQuery || undefined,
        openToPriorityPrograms: onlyPriority || undefined,
        sort: sortBy,
      });
      setTasks(data);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, [countryCode, selectedCategory, searchQuery, onlyPriority, sortBy]);

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks.filter((t) => (minLevel > 0 ? t.minVerificationLevel <= minLevel : true));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header with search and view toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t('tasks.browseTitle')}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified physical jobs in {pack.name.en} • {filteredTasks.length} available
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* List / Map view toggle */}
          <div className="flex items-center p-1 rounded-xl bg-card border border-border shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>{t('tasks.listView')}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'map'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>{t('tasks.mapView')}</span>
            </button>
          </div>

          <Link to="/tasks/new">
            <Button size="sm" variant="primary">
              + Post Task
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Category Chips Bar - Never truncates, wraps cleanly */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
            selectedCategory === null
              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
              : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground'
          }`}
        >
          <span>{t('common.allCategories')}</span>
        </button>

        {pack.categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground'
              }`}
            >
              <CategoryIcon name={cat.icon} className="w-3.5 h-3.5 shrink-0" />
              <span>{getLocalizedText(cat.label, locale)}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Search Bar & Auxiliary Filters Strip */}
      <div className="p-4 rounded-2xl border border-border bg-card shadow-soft space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('tasks.searchPlaceholder')}
              className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium text-foreground focus:outline-none"
            >
              <option value="newest">Sort: Newest first</option>
              <option value="budget_desc">Sort: Highest budget</option>
              <option value="budget_asc">Sort: Lowest budget</option>
            </select>

            {/* Social Priority filter toggle */}
            <button
              type="button"
              onClick={() => setOnlyPriority(!onlyPriority)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                onlyPriority
                  ? 'bg-verify-soft text-verify border-verify/30 font-semibold'
                  : 'bg-background text-muted-foreground border-border hover:bg-muted'
              }`}
              title="Show jobs welcoming priority social programs"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Priority Programs</span>
            </button>

            {/* Reset */}
            {(selectedCategory || searchQuery || onlyPriority) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                  setOnlyPriority(false);
                }}
                className="p-2 rounded-xl border border-border text-muted-foreground hover:bg-muted"
                title="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Content Area: Map or Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-5 rounded-2xl border border-border bg-card space-y-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      ) : viewMode === 'map' ? (
        <div className="space-y-4">
          <MapStub
            tasks={filteredTasks}
            selectedTaskId={selectedMapTaskId}
            onSelectTask={(id) => setSelectedMapTaskId(id)}
          />
          {selectedMapTaskId && (
            <div className="max-w-md mx-auto">
              {filteredTasks
                .filter((t) => t.id === selectedMapTaskId)
                .map((t) => (
                  <TaskCard key={t.id} task={t} />
                ))}
            </div>
          )}
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks match your criteria"
          description="Try broadening your category filter or search query."
          actionLabel="Clear all filters"
          onAction={() => {
            setSelectedCategory(null);
            setSearchQuery('');
            setOnlyPriority(false);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      )}
    </div>
  );
};
