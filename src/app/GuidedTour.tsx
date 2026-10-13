import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from './store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Globe2,
  Lock,
  ShieldCheck,
  FileText,
  HeartHandshake,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const GuidedTour: React.FC = () => {
  const { tourStep, nextTourStep, prevTourStep, endTour, setRole, setCountry, locale } = useAppStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isUk = locale === 'uk';

  if (tourStep === null) return null;

  const tourSteps = [
    {
      step: 0,
      title: isUk ? 'Ласкаво просимо до WorkHub' : 'Welcome to WorkHub',
      badge: isUk ? 'Візія та архітектура' : 'Vision & Architecture',
      icon: Sparkles,
      description: isUk
        ? 'WorkHub — це інституційний рівень довіри для фізичних робіт на об’єктах. Ми усуваємо страх втрати передплати та невиконання зобов’язань за допомогою ліцензованого ескроу, автоматичних договорів та багаторівневої верифікації.'
        : 'WorkHub is the institutional trust layer for physical on-site work. We solve prepayment anxiety and contractor non-performance through licensed escrow, automated legal contracts, and tiered identity.',
      actionLabel: isUk ? 'Дослідити стрічку завдань' : 'Explore Browse Feed',
      action: () => navigate('/tasks'),
    },
    {
      step: 1,
      title: isUk ? 'Динамічні Country Packs' : 'Dynamic Country Packs',
      badge: isUk ? 'Глобальне масштабування' : 'Global Scalability',
      icon: Globe2,
      description: isUk
        ? 'WorkHub використовує модульні пакети країн. Перемикання між Україною, Польщею та Кенією миттєво адаптує валюту, юридичні шаблони договорів, податкові статуси та національні цифрові ID без зміни коду додатку.'
        : 'WorkHub uses modular Country Packs. Switching between Ukraine, Poland, or Kenya instantly adapts currency, legal contract templates, tax statuses, and digital ID providers without touching core UI logic.',
      actionLabel: isUk ? 'Перемкнутися на Польщу (PL)' : 'Switch to Poland Pack',
      action: () => setCountry('PL'),
    },
    {
      step: 2,
      title: isUk ? 'Захищені двосторонні платежі' : 'Protected Dual-Sided Payments',
      badge: isUk ? 'Безпека Ескроу' : 'Escrow Security',
      icon: Lock,
      description: isUk
        ? 'Кошти замовника резервуються ліцензованим платіжним партнером до початку робіт. Виплата відбувається поетапно після двостороннього підписання цифрових актів приймання, запобігаючи шахрайству.'
        : 'Customer funds are reserved by a licensed payment partner before work begins. Payments are released in milestones upon bilateral digital sign-off of completion acts, preventing fraud and non-payment.',
      actionLabel: isUk ? 'Переглянути активні замовлення' : 'View Active Jobs',
      action: () => navigate('/jobs'),
    },
    {
      step: 3,
      title: isUk ? 'Багаторівнева верифікація та Trust Score' : 'Tiered Verification & Trust Score',
      badge: isUk ? 'Безпечна ідентифікація' : 'Privacy-First ID',
      icon: ShieldCheck,
      description: isUk
        ? 'Виконавці проходять шлях від L0 до L3 через державні цифрові ID та фахові ліцензії. Система працює за принципом zero-retention: ми зберігаємо лише криптографічні підтвердження, а не копії документів.'
        : 'Workers advance from L0 to L3 via government digital IDs and trade certificates. The system operates on zero-retention principles: we store only verification tokens, never raw ID documents.',
      actionLabel: isUk ? 'Переглянути профіль виконавця' : 'View Worker Profile',
      action: () => {
        setRole('worker');
        navigate('/profile');
      },
    },
    {
      step: 4,
      title: isUk ? 'Автоматизовані юридичні договори' : 'Automated Legal Contracts',
      badge: isUk ? 'Юридична відповідність' : 'Compliance by Design',
      icon: FileText,
      description: isUk
        ? 'Кожна прийнята угода автоматично синтезує специфічний для юрисдикції двосторонній договір і акт приймання-передачі з міткою часу та цифровим підписом, гарантуючи юридичну захищеність обох сторін.'
        : 'Every accepted job automatically synthesizes a jurisdiction-specific bilateral agreement and completion protocol with timestamped digital acceptance, providing legal certainty for both parties.',
      actionLabel: isUk ? 'Відкрити кімнату замовлення' : 'Open Flagship Job Room',
      action: () => navigate('/jobs'),
    },
    {
      step: 5,
      title: isUk ? 'Програми соціального пріоритету' : 'Priority Social Access Programs',
      badge: isUk ? 'Соціальний вплив (ESG)' : 'Social Impact',
      icon: HeartHandshake,
      description: isUk
        ? 'Ветерани, майстри 50+, внутрішні переселенці та молодь отримують знижені комісії, пріоритетне розміщення та відзнаки менторів. Акредитовані ГО аудитують результати у спеціальній партнерській панелі.'
        : 'Veterans, workers 50+, refugees, and youth access lower platform fees, priority dispatch, and mentor badges. Accredited NGO partners audit programmatic outcomes in a dedicated console.',
      actionLabel: isUk ? 'Відкрити панель партнера' : 'View Partner Console',
      action: () => {
        setRole('partner');
        navigate('/partner');
      },
    },
    {
      step: 6,
      title: isUk ? 'Простір для компаній та бригад' : 'Corporate & Crew Workspace',
      badge: isUk ? 'B2B закупівлі' : 'B2B Procurement',
      icon: Building2,
      description: isUk
        ? 'Будівельні компанії та управителі нерухомості координують багатоосібні бригади, керують субпідрядниками та завантажують корпоративні акти з ПДВ і централізованим лімітом витрат.'
        : 'Construction companies and property managers dispatch multi-person crews, manage sub-contractors, and download corporate VAT invoices with centralized spending controls.',
      actionLabel: isUk ? 'Відкрити робочий простір компанії' : 'Open Company Workspace',
      action: () => {
        setRole('company');
        navigate('/company');
      },
    },
    {
      step: 7,
      title: isUk ? 'Стійка юніт-економіка' : 'Sustainable Unit Economics',
      badge: isUk ? 'Захист для інвестора' : 'Investor Defense',
      icon: TrendingUp,
      description: isUk
        ? 'Порівняйте наївну модель із 1% комісії проти нашої стійкої 12% blended take-rate. Дізнайтеся, чому ескроу, банкінг, верифікація та арбітраж вимагають дисциплінованої маржі для досягнення позитивної EBITDA.'
        : 'Compare a naive 1% fee model against our sustainable 12% blended take-rate. See why escrow, banking, KYC, and arbitration require disciplined unit margins to achieve positive EBITDA.',
      actionLabel: isUk ? 'Відкрити калькулятор економіки' : 'Open Economics Calculator',
      action: () => {
        setRole('investor');
        navigate('/investor');
      },
    },
  ];

  const current = tourSteps[tourStep] || tourSteps[0];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="pointer-events-auto max-w-lg w-full bg-card text-card-foreground border border-border rounded-2xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Guided Tour Step"
      >
        {/* Progress Bar & Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="default">{current.badge}</Badge>
            <span className="text-xs text-muted-foreground font-medium">
              {isUk ? `Крок ${tourStep + 1} з ${tourSteps.length}` : `Step ${tourStep + 1} of ${tourSteps.length}`}
            </span>
          </div>
          <button
            type="button"
            onClick={endTour}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {tourSteps.map((s, idx) => (
            <div
              key={s.step}
              className={`h-1.5 rounded-full transition-all ${
                idx === tourStep ? 'w-8 bg-teal-600 dark:bg-teal-400' : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Title and Icon */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 border border-teal-200 dark:border-teal-800">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground tracking-tight">{current.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {current.description}
            </p>
          </div>
        </div>

        {/* Action Button inside tour */}
        {current.action && (
          <div className="pt-1">
            <button
              type="button"
              onClick={current.action}
              className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-muted/60 hover:bg-muted text-foreground border border-border flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>{current.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 text-primary" />
            </button>
          </div>
        )}

        {/* Footer controls */}
        <div className="pt-2 border-t border-border flex items-center justify-between">
          <button
            type="button"
            onClick={endTour}
            className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            {isUk ? 'Пропустити тур' : 'Skip Tour'}
          </button>
          <div className="flex items-center gap-2">
            {tourStep > 0 && (
              <Button variant="outline" size="sm" onClick={prevTourStep}>
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                {isUk ? 'Назад' : 'Back'}
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={tourStep === tourSteps.length - 1 ? endTour : nextTourStep}
            >
              <span>{tourStep === tourSteps.length - 1 ? (isUk ? 'Завершити тур' : 'Finish Tour') : (isUk ? 'Далі' : 'Next')}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
