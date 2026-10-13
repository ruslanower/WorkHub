import * as React from 'react';
import { useAppStore } from './store';
import { COUNTRY_PACKS } from '@/countries';
import type { Role, JobStatus } from '@/services/types';
import type { Locale } from '@/countries/types';
import { mockStore } from '@/mock/store';
import { getServices } from '@/services/registry';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  Zap,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Briefcase,
  Percent,
  Play,
  Globe,
  Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const DemoControlsDrawer: React.FC = () => {
  const {
    demoDrawerOpen,
    setDemoDrawerOpen,
    countryCode,
    pack,
    locale,
    role,
    setCountry,
    setLocale,
    setRole,
    currentUser,
    refreshCurrentUser,
    updatePackFees,
  } = useAppStore();

  const { t } = useTranslation();
  const [notification, setNotification] = React.useState<string | null>(null);
  const isUk = locale === 'uk';

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  if (!demoDrawerOpen) return null;

  // Handler to cycle or set verification level of current user
  const handleSetVerificationLevel = async (level: 0 | 1 | 2 | 3) => {
    if (!currentUser) return;
    mockStore.commit((draft) => {
      const u = draft.users.find((user) => user.id === currentUser.id);
      if (u) {
        u.verificationLevel = level;
      }
    });
    await refreshCurrentUser();
    showNotification(
      isUk
        ? `Рівень верифікації змінено на L${level} для ${currentUser.name.uk || currentUser.name.en}`
        : `Verification level updated to L${level} for ${currentUser.name.en}`,
    );
  };

  // Handler to advance flagship job or first available job
  const handleAdvanceJobState = async (targetStatus?: JobStatus) => {
    const jobs = await getServices().jobs.list({ countryCode });
    if (jobs.length === 0) {
      showNotification(isUk ? 'У цій країні немає активних замовлень' : 'No active jobs found in this country');
      return;
    }
    const job = jobs[0]; // flagship or primary job
    const sequence: JobStatus[] = [
      'offer_accepted',
      'funded',
      'in_progress',
      'delivered',
      'approved',
      'paid_out',
    ];
    const currentIndex = sequence.indexOf(job.status);
    const nextStatus = targetStatus || sequence[(currentIndex + 1) % sequence.length];

    mockStore.commit((draft) => {
      const j = draft.jobs.find((item) => item.id === job.id);
      if (j) {
        j.status = nextStatus;
        if (nextStatus === 'approved' || nextStatus === 'paid_out') {
          j.approvedAt = new Date().toISOString();
          j.paymentState = 'released';
          j.milestones.forEach((m) => {
            m.status = 'released';
          });
        }
      }
    });
    showNotification(
      isUk
        ? `Замовлення #${job.id} переведено у статус: "${nextStatus}"`
        : `Job #${job.id} advanced to status: "${nextStatus}"`,
    );
  };

  // Handler to trigger simulated dispute
  const handleTriggerDispute = async () => {
    const jobs = await getServices().jobs.list({ countryCode });
    if (jobs.length === 0) return;
    const job = jobs[0];
    const dispId = `disp-sim-${Date.now()}`;

    mockStore.commit((draft) => {
      const j = draft.jobs.find((item) => item.id === job.id);
      if (j) {
        j.paymentState = 'disputed';
        j.disputeId = dispId;
      }
      draft.disputes.push({
        id: dispId,
        jobId: job.id,
        countryCode,
        openedBy: job.customerId,
        reason: 'quality',
        description: isUk
          ? 'Невідповідність якості виконаних робіт технічному завданню та договору.'
          : 'Work incomplete according to agreed technical specification.',
        desiredOutcome: 'partial_refund',
        evidence: [],
        notes: [],
        stage: 'opened',
        slaDueAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      });
    });
    showNotification(
      isUk ? `Змодельовано спір по замовленню #${job.id}` : `Simulated dispute opened on Job #${job.id}`,
    );
  };

  // Reset entire mock dataset
  const handleResetData = async () => {
    mockStore.reset();
    await refreshCurrentUser();
    showNotification(
      isUk ? 'Базу даних демо скинуто до початкових значень' : 'Demo database reset to clean seed data',
    );
  };

  const roleLabels: Record<Role, { uk: string; en: string }> = {
    customer: { uk: 'Замовник', en: 'Customer' },
    worker: { uk: 'Виконавець', en: 'Contractor' },
    company: { uk: 'Компанія', en: 'Company' },
    admin: { uk: 'Адмін', en: 'Admin' },
    partner: { uk: 'Партнер', en: 'Partner' },
    investor: { uk: 'Інвестор', en: 'Investor' },
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-card text-card-foreground border-l border-border h-full flex flex-col shadow-2xl overflow-y-auto"
        role="dialog"
        aria-label="Demo Simulator Drawer"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <div>
              <h3 className="font-bold text-base leading-tight">
                {isUk ? 'Керування демо та симуляції' : 'Demo Simulator & Controls'}
              </h3>
              <p className="text-[11px] text-muted-foreground font-mono">
                {t('common.brandWorkingTitle')} (illustrative)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDemoDrawerOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Temporary Toast inside drawer */}
        {notification && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs font-medium flex items-center gap-2 shadow-xs">
            <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        <div className="p-4 sm:p-5 space-y-6 flex-1 text-xs">
          {/* Section 1: Country Pack & Locale */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 font-semibold text-foreground uppercase tracking-wider text-[11px]">
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>{isUk ? 'Перемикач Country Pack' : 'Country Pack Switcher'}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(COUNTRY_PACKS).map((cc) => {
                const isSelected = countryCode === cc;
                return (
                  <button
                    key={cc}
                    type="button"
                    onClick={() => setCountry(cc)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                        : 'border-border bg-muted/40 hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <div className="text-sm font-bold">{cc}</div>
                    <div className="text-[10px] truncate">{COUNTRY_PACKS[cc].currency.code}</div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {isUk
                ? `Миттєво перемикає валюту, національний ID (${pack.identity.providerName}), податки та комісії без перезавантаження сторінки.`
                : `Switches currency, identity provider (${pack.identity.providerName}), tax laws, and fees instantly with zero reload.`}
            </p>
          </div>

          {/* Section 2: Role Switcher */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 font-semibold text-foreground uppercase tracking-wider text-[11px]">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>{isUk ? 'Роль / Персона користувача' : 'Persona / Role'}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(['customer', 'worker', 'company', 'admin', 'partner', 'investor'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 px-1 rounded-lg border text-center font-medium capitalize transition-all ${
                    role === r
                      ? 'border-primary bg-primary text-primary-foreground font-bold shadow-xs'
                      : 'border-border bg-card hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {isUk ? roleLabels[r].uk : roleLabels[r].en}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Identity Verification Simulator */}
          <div className="space-y-2.5 p-3.5 rounded-xl bg-muted/40 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isUk ? 'Симуляція рівня верифікації' : 'Simulate Identity Level'}</span>
              </div>
              <Badge variant="verify">L{currentUser?.verificationLevel ?? 0}</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {isUk
                ? `Зміна рівня довіри для поточного акаунту (${currentUser?.name.uk || currentUser?.name.en || 'Гість'}):`
                : `Fast-forward current account (${currentUser?.name.en || 'Guest'}) through government identity verification tiers:`}
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleSetVerificationLevel(lvl as 0 | 1 | 2 | 3)}
                  className={`py-1.5 rounded-lg border text-center font-bold text-xs ${
                    currentUser?.verificationLevel === lvl
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                      : 'border-border bg-card hover:bg-muted text-muted-foreground'
                  }`}
                >
                  L{lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Flagship Job State Advancer */}
          <div className="space-y-2.5 p-3.5 rounded-xl bg-muted/40 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                <Briefcase className="w-4 h-4 text-teal-600" />
                <span>{isUk ? 'Керування життєвим циклом угоди' : 'Job Lifecycle Advancer'}</span>
              </div>
              <Badge variant="outline">{isUk ? 'Флагманська угода' : 'Flagship Job'}</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {isUk
                ? 'Миттєвий перехід між етапами захищеної оплати без необхідності створювати тестові завдання вручну:'
                : 'Step through the protected payment milestones or trigger dispute resolution without creating manual tasks:'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAdvanceJobState('funded')}
                className="text-xs justify-start"
              >
                <Play className="w-3.5 h-3.5 mr-1 text-teal-600" /> {isUk ? '1. Ескроу внесено' : '1. Escrow Funded'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAdvanceJobState('in_progress')}
                className="text-xs justify-start"
              >
                <Play className="w-3.5 h-3.5 mr-1 text-teal-600" /> {isUk ? '2. У роботі' : '2. In Progress'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAdvanceJobState('approved')}
                className="text-xs justify-start"
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" /> {isUk ? '3. Прийнято й виплачено' : '3. Approved & Paid'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTriggerDispute}
                className="text-xs justify-start text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800"
              >
                <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" /> {isUk ? 'Відкрити спір' : 'Trigger Dispute'}
              </Button>
            </div>
          </div>

          {/* Section 5: Real-time Unit Economics Tuning */}
          <div className="space-y-2.5 p-3.5 rounded-xl bg-muted/40 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                <Percent className="w-4 h-4 text-indigo-600" />
                <span>{isUk ? 'Налаштування комісії платформи' : 'Real-time Platform Take-rate'}</span>
              </div>
              <Badge variant="secondary">
                {Math.round((pack.fees.customerPct + pack.fees.workerPct) * 100)}% blended
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {isUk
                ? 'Зміна структури комісій динамічно перераховує всі розрахунки в чеках та калькуляторах:'
                : 'Test how altering take-rates in the pack dynamically recalculates all checkout totals across the app:'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  updatePackFees({ customerPct: 0.01, workerPct: 0.0 });
                  showNotification(isUk ? 'Застосовано 1% модель (збиткова база)' : 'Applied 1% Fee Model (Unsustainable baseline)');
                }}
                className="p-2 rounded-lg border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-semibold text-left"
              >
                <div className="text-[11px]">{isUk ? '1% Наївна модель' : '1% Naive Model'}</div>
                <div className="text-[10px] font-normal text-muted-foreground">{isUk ? 'Нижче собівартості' : 'Sub-cost, loss-making'}</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  updatePackFees({ customerPct: 0.05, workerPct: 0.07 });
                  showNotification(isUk ? 'Застосовано 12% стійку модель' : 'Applied 12% Sustainable Model');
                }}
                className="p-2 rounded-lg border border-teal-300 dark:border-teal-900 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 font-semibold text-left"
              >
                <div className="text-[11px]">{isUk ? '12% Цільова модель' : '12% Target Model'}</div>
                <div className="text-[10px] font-normal text-muted-foreground">{isUk ? 'Покриває ескроу та KYC' : 'Covers escrow & KYC'}</div>
              </button>
            </div>
          </div>

          {/* Section 6: State Reset */}
          <div className="pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={handleResetData}
              className="w-full text-xs text-red-600 dark:text-red-400 border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/50"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              {isUk ? 'Скинути всі дані демо до початкових' : 'Reset All Demo State to Seed'}
            </Button>
            <p className="text-[10px] text-muted-foreground text-center mt-1.5">
              {isUk
                ? 'Очищає зміни в оперативній пам’яті та відновлює 24 завдання, 8 угод, 12 майстрів та 3 спори.'
                : 'Clears in-memory mutations and restores 24 tasks, 8 jobs, 12 workers, and 3 disputes.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-muted/60 border-t border-border text-center text-[10px] text-muted-foreground">
          {isUk
            ? 'Інвесторський демо-комплекс • Усі транзакції модельовані'
            : 'Investor Demo Suite • All transactions illustrative'}
        </div>
      </div>
    </div>
  );
};
