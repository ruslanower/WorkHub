import * as React from 'react';
import { useAppStore } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { getServices } from '@/services/registry';
import type { User, Review } from '@/services/types';
import { formatCurrency, formatDate, getLocalizedText } from '@/i18n/formatters';
import { TrustScoreRing } from '@/components/ui/TrustScoreRing';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  Star,
  ShieldCheck,
  Award,
  Clock,
  Calendar,
  CheckCircle2,
  HeartHandshake,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { pack, locale, currentUser, setRole } = useAppStore();
  const { t } = useTranslation();

  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!currentUser) return;
    const load = async () => {
      try {
        const revs = await getServices().reviews.listForUser(currentUser.id);
        setReviews(revs);
      } catch {
        //
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUser]);

  if (loading || !currentUser) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-6">
        <Skeleton className="h-40 rounded-3xl" />
        <Skeleton className="h-60 rounded-3xl" />
      </div>
    );
  }

  const publicProgram = currentUser.programs.find((p) => p.showBadge && p.status === 'verified');
  const programConfig = publicProgram ? pack.priorityPrograms.find((pr) => pr.id === publicProgram.programId) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-2">
      {/* 1. Profile Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary font-bold text-xl flex items-center justify-center shrink-0 border border-primary/20">
              {currentUser.initials}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                  {currentUser.name.en}
                </h1>
                <VerifiedBadge level={currentUser.verificationLevel} />
                {currentUser.pro && (
                  <Badge variant="default" className="bg-amber-500 text-white font-bold">
                    PRO
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Contractor in {getLocalizedText(pack.cities.find((c) => c.id === currentUser.cityId)?.name, locale)}, {currentUser.district}
              </p>

              {/* Priority Program Badge (with explicit consent) */}
              {programConfig && (
                <div className="pt-1">
                  <Badge variant="verify" className="flex items-center gap-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-verify" />
                    <span>Verified Participant: {getLocalizedText(programConfig.label, locale)}</span>
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 self-start sm:self-auto">
            <TrustScoreRing score={92} size="lg" />
          </div>
        </div>

        {/* Headline & Bio */}
        <div className="p-4 rounded-2xl bg-muted/30 border border-border/80 text-xs text-muted-foreground leading-relaxed">
          {locale === 'uk' && currentUser.headline?.uk
            ? currentUser.headline.uk
            : currentUser.headline?.en || (locale === 'uk' ? 'Ліцензований та сертифікований майстер з комплексного ремонту та обслуговування.' : 'Licensed and certified contractor specializing in residential and commercial maintenance.')}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-3 rounded-xl border border-border bg-card text-center">
            <span className="text-[11px] text-muted-foreground block font-medium">
              {locale === 'uk' ? 'Виконаних робіт' : 'Completed Jobs'}
            </span>
            <span className="text-lg font-bold text-foreground">{currentUser.completedJobs}</span>
          </div>

          <div className="p-3 rounded-xl border border-border bg-card text-center">
            <span className="text-[11px] text-muted-foreground block font-medium">
              {locale === 'uk' ? 'Рейтинг клієнтів' : 'Client Rating'}
            </span>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
              ★ {currentUser.rating || '5.0'}
            </span>
          </div>

          <div className="p-3 rounded-xl border border-border bg-card text-center">
            <span className="text-[11px] text-muted-foreground block font-medium">
              {locale === 'uk' ? 'Час відповіді' : 'Response Speed'}
            </span>
            <span className="text-lg font-bold text-foreground">~{currentUser.responseMinutes} {locale === 'uk' ? 'хв' : 'min'}</span>
          </div>

          <div className="p-3 rounded-xl border border-border bg-card text-center">
            <span className="text-[11px] text-muted-foreground block font-medium">
              {locale === 'uk' ? 'Програних спорів' : 'Disputes Lost'}
            </span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {currentUser.disputesLost}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Skills & Verified Trade Licenses */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
        <h3 className="font-bold text-base text-foreground">
          {locale === 'uk' ? 'Підтверджені фахові допуски та навички' : 'Verified Trade Licenses & Skills'}
        </h3>

        <div className="flex flex-wrap gap-2">
          {(locale === 'uk'
            ? ['Будівництво та ремонт', 'Сертифікований електрик', 'Гіпсокартон і оздоблення', 'Комерційне фарбування', 'Монтаж обладнання']
            : ['Construction and repair', 'Electrical certified', 'Drywall & finishing', 'Commercial painting', 'Equipment mounting']
          ).map((skill, i) => (
            <Badge key={i} variant="secondary" className="px-3 py-1 text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* 3. Verified Client Reviews */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-base text-foreground">
              {locale === 'uk'
                ? `Відгуки клієнтів та двостороння оцінка (${reviews.length})`
                : `Client Feedback & Bilateral Reviews (${reviews.length})`}
            </h3>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted-foreground">
            {locale === 'uk'
              ? 'Двосторонніх відгуків ще немає. Відгуки стають доступними автоматично після завершення захищеної виплати.'
              : 'No bilateral reviews yet. Reviews are unlocked automatically after protected payouts.'}
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl border border-border bg-muted/20 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{rev.overall} / 5.0</span>
                  </div>
                  <span className="text-muted-foreground text-[11px]">
                    {formatDate(rev.createdAt, 'PP', locale)}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  "{rev.text}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
