import * as React from 'react';
import { useAppStore } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { BRAND_NAME } from '@/config/brand';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Presentation,
  ShieldCheck,
  TrendingUp,
  Globe2,
  Lock,
  Layers,
  Award,
} from 'lucide-react';

export const PresentationMode: React.FC = () => {
  const { presentationOpen, setPresentationOpen, pack, locale } = useAppStore();
  const { t } = useTranslation();
  const [slide, setSlide] = React.useState(0);
  const isUk = locale === 'uk';

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setPresentationOpen(!presentationOpen);
      } else if (presentationOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setPresentationOpen(false);
        } else if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
          e.preventDefault();
          setSlide((s) => Math.min(11, s + 1));
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          setSlide((s) => Math.max(0, s - 1));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentationOpen, setPresentationOpen]);

  const slides = [
    {
      title: 'WorkHub',
      subtitle: isUk ? 'Інституційний рівень довіри для фізичних робіт на об’єктах' : 'The Trust Layer for Physical On-Site Work',
      tag: isUk ? 'Огляд для інвестора' : 'Executive Overview',
      content: (
        <div className="space-y-4 max-w-2xl text-center mx-auto">
          <p className="text-xl sm:text-2xl text-slate-300 leading-relaxed font-medium">
            {isUk
              ? 'Надійний маркетплейс для разових та проектних фізичних робіт: будівництво, монтаж, логістика, клінінг та сервіс.'
              : 'A trusted marketplace for one-off and project-based physical labor: construction, logistics, cleaning, and maintenance.'}
          </p>
          <p className="text-sm text-slate-400">
            {isUk
              ? 'Верифікована ідентичність через держсервіси (Дія), захищені ескроу-платежі через ліцензованих партнерів, автоматичні договори та програми соціального впливу.'
              : 'Featuring verified identity, protected payments held by licensed partners, automated legal contracts, and social impact programs.'}
          </p>
        </div>
      ),
    },
    {
      title: isUk ? 'Головна проблема ринку' : 'The Core Problem',
      subtitle: isUk ? 'Чому ринок фізичних робіт на $100B+ досі залишається в «сірій» зоні' : 'Why the $100B+ physical job market remains broken',
      tag: isUk ? 'Потреба ринку' : 'Market Need',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <h4 className="font-bold text-base text-teal-400">{isUk ? 'Страх передплати' : 'Prepayment Fear'}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isUk
                ? 'Замовники бояться втратити кошти на авансах неперевіреним підрядникам без жодних гарантій чи страховки.'
                : 'Customers risk losing upfront cash to unvetted contractors with zero recourse or insurance.'}
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <h4 className="font-bold text-base text-teal-400">{isUk ? 'Готівкова тінь' : 'Informal Cash Shadow'}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isUk
                ? 'Майстри не мають підтвердженого доходу, кредитної репутації та юридично захищених контрактів.'
                : 'Contractors lack verifiable income records, credit reputation, and formal bilateral contracts.'}
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <h4 className="font-bold text-base text-teal-400">{isUk ? 'Невикористані цифрові ID' : 'Unconnected Digital IDs'}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isUk
                ? 'Державна інфраструктура (як Дія або mObywatel) рідко задіяна для захисту повсякденних трудових угод.'
                : 'State e-ID infrastructure is rarely harnessed to make everyday labor transactions safe.'}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: isUk ? 'Три шари архітектури' : 'Three Architectural Layers',
      subtitle: isUk ? 'Інституційна програмна основа платформи' : 'Institutional software foundation',
      tag: isUk ? 'Архітектура рішення' : 'Solution Architecture',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-teal-500/40 space-y-2">
            <span className="font-mono text-xs text-teal-400 block font-bold">{isUk ? 'Шар 1' : 'Layer 1'}</span>
            <h4 className="font-bold text-base text-white">{isUk ? 'Двигун маркетплейсу' : 'Marketplace Engine'}</h4>
            <p className="text-xs text-slate-300">
              {isUk
                ? 'Розумні шаблони, структуровані пропозиції, маскування контактів і повторювані замовлення для бізнесу.'
                : 'Smart task templates, structured offers, contact masking, and B2B recurring facility jobs.'}
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-blue-500/40 space-y-2">
            <span className="font-mono text-xs text-blue-400 block font-bold">{isUk ? 'Шар 2' : 'Layer 2'}</span>
            <h4 className="font-bold text-base text-white">{isUk ? 'Довіра та захищені платежі' : 'Trust & Protected Payments'}</h4>
            <p className="text-xs text-slate-300">
              {isUk
                ? 'L0-L3 верифікація, кошти під захистом ліцензованого PSP, поетапне погодження та динамічний Trust Score.'
                : 'L0-L3 identity verification, funds held in trust by licensed partner PSPs, milestone approval, and Trust Score.'}
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-emerald-500/40 space-y-2">
            <span className="font-mono text-xs text-emerald-400 block font-bold">{isUk ? 'Шар 3' : 'Layer 3'}</span>
            <h4 className="font-bold text-base text-white">{isUk ? 'Відповідність та імпакт' : 'Compliance & Impact'}</h4>
            <p className="text-xs text-slate-300">
              {isUk
                ? 'Автоматичні договори та акти, податкові підказки та програми підтримки ветеранів і переселенців.'
                : 'Automated contracts, bilateral completion acts, tax hints, and ESG priority access tracking.'}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: isUk ? 'Інновація Country Pack' : 'The Country Pack Innovation',
      subtitle: isUk ? 'Єдина кодова база, запуск нової країни без зміни коду' : 'Single code base, zero-code international rollout',
      tag: isUk ? 'Глобальне масштабування' : 'Global Scalability',
      content: (
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-base text-slate-300 leading-relaxed">
            {isUk
              ? 'Кожен специфічний для країни компонент — валюта, мови, цифрові ID, платіжні партнери, податкові шаблони та соціальні програми — ізольований в конфігураційному об’єкті Country Pack.'
              : 'Every country-specific element — currency, languages, identity providers, payment partners, tax templates, and social programs — is isolated in a Country Pack configuration object.'}
          </p>
          <div className="grid grid-cols-3 gap-4 text-xs font-semibold">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
              {isUk ? 'Україна (UA): Дія.Підпис, UAH, банкінг, ветерани та ВПО' : 'Ukraine (UA): Diia ID, UAH, bank rails, Veterans & IDPs'}
            </div>
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
              {isUk ? 'Польща (PL): mObywatel, PLN, миттєві перекази, резиденти 50+' : 'Poland (PL): mObywatel, PLN, instant transfers, Newcomers 50+'}
            </div>
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
              {isUk ? 'Кенія (KE): National eID, KES, мобільні гроші, молодь і жінки' : 'Kenya (KE): National eID, KES, mobile money rails, Youth & Women'}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: isUk ? 'Юніт-економіка: 1% проти 12%' : 'Unit Economics: 1% vs 12%',
      subtitle: isUk ? 'Чому прості дошки оголошень збиткові, а інституційні моделі перемагають' : 'Why classifieds models fail and institutional models win',
      tag: isUk ? 'Бізнес-модель' : 'Business Model',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
          <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-3">
            <Badge variant="danger">{isUk ? 'Сценарій краху при 1% комісії' : 'The 1% Fee Failure Scenario'}</Badge>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isUk
                ? 'При комісії 1% платформа втрачає гроші на кожній угоді: банківський еквайринг коштує 2.5%, а арбітраж і підтримка — 2%. Модель структурно нежиттєздатна.'
                : 'At 1% fee, the platform loses cash on every transaction: payment acquiring costs 2.5% and dispute/support costs 2%. It is structurally insolvent.'}
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
            <Badge variant="success">{isUk ? 'Стійка 12% модель WorkHub' : 'The 12% WorkHub Model'}</Badge>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isUk
                ? 'При 5% комісії замовника та 7% виконавця загальний take-rate платформи становить 12%. Після покриття 4.5% змінних витрат чистий внесок дорівнює ~7.5% з кожного замовлення.'
                : 'With 5% customer fee and 7% contractor fee, platform gross take is 12%. After 4.5% variable costs, net contribution is ~7.5% per order.'}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: isUk ? 'Джерела монетизації' : 'Monetization Streams',
      subtitle: isUk ? 'Диверсифіковані інституційні доходи' : 'Diversified institutional revenue',
      tag: isUk ? 'Модель доходів' : 'Revenue Model',
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left text-xs">
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
            <span className="font-bold text-teal-400 block">{isUk ? '1. Комісія з угод' : '1. Transaction Take'}</span>
            <p className="text-slate-300">{isUk ? '10-15% blended fee спліт між замовником і майстром.' : '10-15% blended fee split between customer & worker.'}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
            <span className="font-bold text-teal-400 block">{isUk ? '2. Pro & B2B SaaS' : '2. Pro & B2B SaaS'}</span>
            <p className="text-slate-300">{isUk ? 'Підписка для PRO майстрів та щомісячні робочі місця компаній.' : 'Pro contractor subscriptions & monthly company seats.'}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
            <span className="font-bold text-teal-400 block">{isUk ? '3. Страхування й виплати' : '3. Insurance & Fast Payout'}</span>
            <p className="text-slate-300">{isUk ? 'Комісія за комерційне страхування та миттєвий вивід коштів.' : 'Commercial liability commission & instant rail fees.'}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
            <span className="font-bold text-teal-400 block">{isUk ? '4. Франшиза / Ліцензії' : '4. National Licensing'}</span>
            <p className="text-slate-300">{isUk ? 'Паушальний внесок за територію + % від національного GMV.' : 'Upfront territory setup fee + % of national GMV.'}</p>
          </div>
        </div>
      ),
    },
    {
      title: isUk ? 'Моделі партнерства' : 'Partnership Models',
      subtitle: isUk ? 'Як національні оператори ліцензують та масштабують WorkHub' : 'How national operators license and scale WorkHub',
      tag: isUk ? 'Дистрибуція' : 'Distribution',
      content: (
        <div className="space-y-4 max-w-3xl mx-auto text-left text-xs">
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="font-bold text-white block">{isUk ? 'Майстер-ліцензія' : 'Master License'}</span>
            <p className="text-slate-300">{isUk ? 'Національний партнер веде операційну діяльність, банківські інтеграції та продажі; WorkHub надає ядро платформи та оновлення.' : 'National partner runs operations, banking, and sales; WorkHub provides core IP and continuous software.'}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="font-bold text-white block">{isUk ? 'Спільне підприємство (Joint Venture)' : 'Joint Venture'}</span>
            <p className="text-slate-300">{isUk ? 'Спільна локальна юридична особа, що поєднує місцевих корпоративних клієнтів і регуляторні зв’язки з нашою інженерією.' : 'Shared national entity combining local corporate anchors and regulatory relationships with our product engineering.'}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="font-bold text-white block">{isUk ? 'White-Label SaaS' : 'White-Label SaaS'}</span>
            <p className="text-slate-300">{isUk ? 'Виділений інстанс і кастомні інтеграції для великих мережевих операторів нерухомості та фасіліті-менеджменту.' : 'Dedicated instance and custom integrations for large multi-regional facility operators.'}</p>
          </div>
        </div>
      ),
    },
    {
      title: isUk ? 'План запуску міста (12 тижнів)' : 'City Launch Playbook (12 Weeks)',
      subtitle: isUk ? 'Відтворюваний план досягнення ринкової ліквідності' : 'Repeatable zero-to-liquidity blueprint',
      tag: isUk ? 'Вихід на ринок' : 'Go-To-Market',
      content: (
        <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto text-left text-xs">
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="text-teal-400 font-bold block mb-1">{isUk ? 'Тижні 1-3' : 'Weeks 1-3'}</span>
            <p className="text-slate-300">{isUk ? 'Формування пропозиції через профільні гільдії та ветеранські спільноти.' : 'Bootstrapping supply via vocational guilds and veteran groups.'}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="text-teal-400 font-bold block mb-1">{isUk ? 'Тижні 4-6' : 'Weeks 4-6'}</span>
            <p className="text-slate-300">{isUk ? 'Залучення регулярного B2B попиту від складів та управителів нерухомості.' : 'Securing B2B recurring demand from warehouse & property managers.'}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="text-teal-400 font-bold block mb-1">{isUk ? 'Тижні 7-9' : 'Weeks 7-9'}</span>
            <p className="text-slate-300">{isUk ? 'Консьєрж-виконання перших 50 замовлень для накопичення реальних відгуків.' : 'Concierge fulfillment of first 50 orders to establish reviews.'}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="text-teal-400 font-bold block mb-1">{isUk ? 'Тижні 10-12' : 'Weeks 10-12'}</span>
            <p className="text-slate-300">{isUk ? 'Органічне автономне масштабування на суміжні категорії та райони.' : 'Autonomous organic expansion across adjacent categories.'}</p>
          </div>
        </div>
      ),
    },
    {
      title: isUk ? 'Цільові операційні показники' : 'Target Operational KPIs',
      subtitle: isUk ? 'Орієнтири здорового маркетплейсу' : 'Healthy marketplace benchmarks',
      tag: isUk ? 'Метрики' : 'Metrics',
      content: (
        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
          <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
            <span className="text-2xl font-bold text-teal-400 block">&lt; 2 {isUk ? 'Годин' : 'Hours'}</span>
            <span className="text-xs text-slate-300">{isUk ? 'Час до першої верифікованої пропозиції' : 'Time to first verified offer'}</span>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
            <span className="text-2xl font-bold text-teal-400 block">&gt; 35%</span>
            <span className="text-xs text-slate-300">{isUk ? 'Частка повторних замовлень' : 'Repeat order rate'}</span>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
            <span className="text-2xl font-bold text-teal-400 block">&lt; 2%</span>
            <span className="text-xs text-slate-300">{isUk ? 'Рівень спорів та арбітражу' : 'Dispute rate'}</span>
          </div>
        </div>
      ),
    },
    {
      title: isUk ? 'Архітектура захисту від ризиків' : 'Risk Architecture',
      subtitle: isUk ? 'Нормативні та операційні захисні бар’єри' : 'Hardened regulatory and operational protections',
      tag: isUk ? 'Ризики та право' : 'Risk & Legal',
      content: (
        <div className="space-y-3 max-w-3xl mx-auto text-left text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 flex justify-between">
            <span className="font-bold text-white">{isUk ? 'Регулювання платежів:' : 'Payment Regulation:'}</span>
            <span className="text-slate-300">{isUk ? 'Кошти утримуються виключно ліцензованим платіжним партнером' : 'Funds held exclusively by licensed payment partner'}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 flex justify-between">
            <span className="font-bold text-white">{isUk ? 'Трудова класифікація:' : 'Labor Misclassification:'}</span>
            <span className="text-slate-300">{isUk ? 'Чіткі підрядні визначення згідно із законодавством країни' : 'Clear contractor tax definitions per local country law'}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 flex justify-between">
            <span className="font-bold text-white">{isUk ? 'Витік угод поза платформу:' : 'Off-Platform Leakage:'}</span>
            <span className="text-slate-300">{isUk ? 'Маскування контактів + юридичні договори та страхування робіт' : 'Contact masking + tangible legal and insurance protections'}</span>
          </div>
        </div>
      ),
    },
    {
      title: isUk ? 'Дорожня карта продукту' : 'Product Roadmap',
      subtitle: isUk ? 'Чотири фази від прототипу до глобальної ліквідності' : 'Four phases from prototype to global liquidity',
      tag: isUk ? 'Дорожня карта' : 'Roadmap',
      content: (
        <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto text-left text-xs">
          <div className="p-4 rounded-xl bg-slate-800 border border-teal-500/30">
            <span className="font-bold text-teal-400 block">{isUk ? 'MVP (Зараз)' : 'MVP (Today)'}</span>
            <p className="text-slate-300">{isUk ? 'Шаблони завдань, KYC, ескроу, Country Packs.' : 'Task templates, multi-tier KYC, escrow, Country Packs.'}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="font-bold text-white block">V1</span>
            <p className="text-slate-300">{isUk ? 'Корпоративні акаунти, миттєві виплати, ESG звіти.' : 'Corporate accounts, instant payouts, priority ESG reporting.'}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="font-bold text-white block">V2</span>
            <p className="text-slate-300">{isUk ? 'B2B API інтеграції, лізинг інструментів, AI скоупінг.' : 'B2B API integrations, equipment financing, AI task scoping.'}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="font-bold text-white block">{isUk ? 'Масштаб' : 'Scale'}</span>
            <p className="text-slate-300">{isUk ? 'Мікрострахування та міжнародний роумінг майстрів.' : 'Institutional micro-insurance and multi-country roaming.'}</p>
          </div>
        </div>
      ),
    },
    {
      title: isUk ? 'Інвестиційні умови та наступні кроки' : 'Investment Terms & Next Steps',
      subtitle: isUk ? 'Конфіденційна кваліфікація' : 'Confidential qualification',
      tag: isUk ? 'Умови' : 'Terms',
      content: (
        <div className="max-w-xl mx-auto text-center space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            {isUk
              ? 'Детальні моделі юніт-економіки, пілотні дані та матеріали для ліцензування доступні для кваліфікованих партнерів та інвесторів під NDA.'
              : 'Detailed unit economics models, pilot data, and national licensing playbooks are available for qualified partners and investors under confidential memorandum.'}
          </p>
          <Button size="lg" variant="primary" onClick={() => setPresentationOpen(false)}>
            {isUk ? 'Повернутися до демо платформи' : 'Back to Live Product Demo'}
          </Button>
        </div>
      ),
    },
  ];

  if (!presentationOpen) return null;

  const currentSlide = slides[slide];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col justify-between p-6 sm:p-12 select-none animate-fade-in overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-lg text-teal-400 tracking-tight">
            {BRAND_NAME}
          </span>
          <Badge variant="secondary" className="bg-slate-800 text-slate-300">
            {isUk ? `Слайд ${slide + 1} з ${slides.length}` : `Slide ${slide + 1} / ${slides.length}`}
          </Badge>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            {isUk ? 'Стрілки вліво/вправо для навігації • Esc для виходу' : 'Use Arrow keys to navigate • Esc to exit'}
          </span>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setPresentationOpen(false)}
          className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <X className="w-4 h-4 mr-1.5" />
          {isUk ? 'Повернутися до демо' : 'Back to Live Demo'}
        </Button>
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-5xl mx-auto py-8">
        <Badge variant="default" className="bg-teal-900/60 text-teal-300 mb-3 border-teal-700/50">
          {currentSlide.tag}
        </Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">
          {currentSlide.title}
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mb-8 max-w-xl">
          {currentSlide.subtitle}
        </p>

        <div className="w-full">{currentSlide.content}</div>
      </div>

      {/* Bottom Bar: Slide Navigation Controls */}
      <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
        <Button
          size="sm"
          variant="outline"
          disabled={slide === 0}
          onClick={() => setSlide((s) => Math.max(0, s - 1))}
          className="border-slate-700 text-slate-300 hover:text-white disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {isUk ? 'Попередній' : 'Previous'}
        </Button>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all ${
                slide === i ? 'w-6 bg-teal-400' : 'w-2 bg-slate-800 hover:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <Button
          size="sm"
          variant="primary"
          disabled={slide === slides.length - 1}
          onClick={() => setSlide((s) => Math.min(slides.length - 1, s + 1))}
          className="disabled:opacity-30"
        >
          {isUk ? 'Наступний' : 'Next'}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
