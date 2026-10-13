import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { getServices } from '@/services/registry';
import { formatCurrency, getLocalizedText } from '@/i18n/formatters';
import { computeFees } from '@/lib/fees';
import { Button } from '@/components/ui/Button';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { Badge } from '@/components/ui/Badge';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  HeartHandshake,
  HardHat,
  Cpu,
  Layers,
  Zap,
} from 'lucide-react';
import type { AISafetyChecklistItem } from '@/services/types';

export const PostTaskWizard: React.FC = () => {
  const { pack, locale, countryCode, currentUser } = useAppStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);
  const [submitting, setSubmitting] = React.useState(false);

  // Gemini AI Assistant State
  const [aiPrompt, setAiPrompt] = React.useState('');
  const [isAiGenerating, setIsAiGenerating] = React.useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = React.useState<string | null>(null);
  const [safetyChecklist, setSafetyChecklist] = React.useState<AISafetyChecklistItem[]>([
    { id: 'gloves', label: { en: 'Protective Work Gloves', uk: 'Захисні рукавиці' }, required: true },
    { id: 'boots', label: { en: 'Reinforced Safety Boots', uk: 'Спецвзуття з посиленою підошвою' }, required: true },
  ]);
  const [aiRecommendedLevel, setAiRecommendedLevel] = React.useState<number>(1);
  const [aiReasoning, setAiReasoning] = React.useState<string | null>(null);

  // Form State
  const [selectedCatId, setSelectedCatId] = React.useState<string>(pack.categories[0].id);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string | undefined>();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [cityId, setCityId] = React.useState<string>(pack.cities[0].id);
  const [district, setDistrict] = React.useState<string>(pack.cities[0].districts[0] || 'Center');
  const [date, setDate] = React.useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
  );
  const [durationHours, setDurationHours] = React.useState<number>(8);
  const [budget, setBudget] = React.useState<number>(
    Math.round((pack.categories[0].priceGuide.min + pack.categories[0].priceGuide.max) / 2),
  );
  const [budgetType, setBudgetType] = React.useState<'fixed' | 'milestones'>('milestones');
  const [openToPriority, setOpenToPriority] = React.useState(true);
  const [preferPriority, setPreferPriority] = React.useState(true);

  // Check for pre-filled data passed from Google Showcase
  React.useEffect(() => {
    const prefill = (location.state as any)?.aiPreFill;
    if (prefill) {
      if (prefill.title) setTitle(prefill.title);
      if (prefill.description) setDescription(prefill.description);
      if (prefill.categoryId) setSelectedCatId(prefill.categoryId);
      if (prefill.budget) setBudget(prefill.budget);
      setAiSuccessMessage('Pre-populated directly from Google Gemini AI Showcase');
    }
  }, [location.state]);

  const selectedCategory =
    pack.categories.find((c) => c.id === selectedCatId) || pack.categories[0];
  const feeQuote = computeFees(budget, pack);

  // Trigger Gemini Parsing
  const handleGenerateWithGemini = async (textToUse?: string) => {
    const query = textToUse || aiPrompt;
    if (!query.trim()) return;

    setIsAiGenerating(true);
    setAiSuccessMessage(null);
    try {
      const res = await getServices().ai.parseTaskPrompt(query, countryCode);
      setSelectedCatId(res.categoryId);
      setTitle(getLocalizedText(res.title, locale));
      setDescription(getLocalizedText(res.description, locale));
      setBudget(res.priceGuidance.median);
      setDurationHours(res.durationHours);
      setSafetyChecklist(res.safetyChecklist);
      setAiRecommendedLevel(res.recommendedVerificationLevel);
      setAiReasoning(getLocalizedText(res.verificationReasoning, locale));
      setAiSuccessMessage(
        `Gemini 1.5 Flash auto-generated SOW, safety PPE, and estimated budget (${res.latencyMs}ms latency).`,
      );
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCatId(catId);
    const cat = pack.categories.find((c) => c.id === catId);
    if (cat) {
      setBudget(Math.round((cat.priceGuide.min + cat.priceGuide.max) / 2));
      if (cat.templates[0]) {
        setSelectedTemplateId(cat.templates[0].id);
        setTitle(getLocalizedText(cat.templates[0].title, locale));
        setDescription(getLocalizedText(cat.templates[0].description, locale));
        setDurationHours(cat.templates[0].durationHours);
      }
    }
  };

  const handleTemplateSelect = (tmplId: string) => {
    setSelectedTemplateId(tmplId);
    const tmpl = selectedCategory.templates.find((t) => t.id === tmplId);
    if (tmpl) {
      setTitle(getLocalizedText(tmpl.title, locale));
      setDescription(getLocalizedText(tmpl.description, locale));
      setDurationHours(tmpl.durationHours);
    }
  };

  const handlePublish = async () => {
    if (!currentUser) return;
    setSubmitting(true);
    try {
      const created = await getServices().tasks.create({
        countryCode,
        customerId: currentUser.id,
        categoryId: selectedCatId,
        templateId: selectedTemplateId,
        title: { en: title, uk: title },
        description: { en: description, uk: description },
        cityId,
        district,
        budget,
        budgetType,
        milestonePlan: [
          { title: { en: 'Phase 1: Mobilization & initial work', uk: 'Етап 1: Мобілізація та початкові роботи' }, share: 0.4 },
          { title: { en: 'Phase 2: Final delivery & inspection', uk: 'Етап 2: Завершення робіт та фінальний огляд' }, share: 0.6 },
        ],
        date: new Date(date).toISOString(),
        durationHours,
        minVerificationLevel: (aiRecommendedLevel as any) || (selectedCatId === 'electrical' ? 3 : 1),
        openToPriorityPrograms: openToPriority,
        preferPriority,
        photos: 2,
      });

      navigate(`/tasks/${created.id}`);
    } catch (err: any) {
      alert(err.message || 'Error creating task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in py-4 text-foreground">
      {/* Stepper Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
            Step {step} of 4
          </span>
          <h1 className="text-xl font-bold text-foreground">
            {step === 1 && t('tasks.step1')}
            {step === 2 && t('tasks.step2')}
            {step === 3 && t('tasks.step3')}
            {step === 4 && t('tasks.step4')}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="verify" className="px-3 py-1 text-xs">
            ✨ Gemini AI Powered
          </Badge>
          <Badge variant="success" className="px-3 py-1 text-xs">
            {t('common.fees.freePosting')}
          </Badge>
        </div>
      </div>

      {/* Step 1: Category, Gemini Generator & Scope of Work */}
      {step === 1 && (
        <div className="space-y-6">
          {/* 1. Google Gemini AI Quick Assist Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-500/10 via-primary/5 to-blue-500/10 border border-teal-500/30 space-y-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Google Gemini AI Task Generator
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    Describe your project naturally — Gemini will build the structured SOW, safety checklist, and pricing.
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleGenerateWithGemini();
                  }}
                  placeholder="E.g., Repaint 3 warehouse doors and fix floor in Kyiv..."
                  className="flex-1 bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:ring-2 focus:ring-teal-400 focus:outline-none"
                />
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isAiGenerating}
                  onClick={() => handleGenerateWithGemini()}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-bold gap-1 text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate</span>
                </Button>
              </div>

              {/* Preset Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] text-muted-foreground self-center mr-1">Try:</span>
                {[
                  { label: 'Warehouse Doors & Floor', text: 'Fix 3 warehouse doors and repaint 200 m² floor tomorrow in Podil, Kyiv' },
                  { label: 'Backup EcoFlow & DB', text: 'Встановити резервну зарядну станцію EcoFlow та перевірити електрощиток у Львові' },
                  { label: 'Demolition & Debris', text: 'Терміновий демонтаж перегородок та вивезення 4 т будівельного сміття, Оболонь' },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => {
                      setAiPrompt(chip.text);
                      handleGenerateWithGemini(chip.text);
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-card border border-border hover:border-teal-500/50 text-foreground transition-colors"
                  >
                    ⚡ {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {aiSuccessMessage && (
              <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400" />
                <span>{aiSuccessMessage}</span>
              </div>
            )}
          </div>

          {/* 2. Category Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
              Task Category:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {pack.categories.map((c) => {
                const isSel = selectedCatId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCategorySelect(c.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                      isSel
                        ? 'border-primary bg-primary/10 shadow-sm ring-2 ring-primary/20'
                        : 'border-border bg-card hover:bg-muted'
                    }`}
                  >
                    <span className="p-1.5 rounded-lg bg-background w-fit">
                      <CategoryIcon name={c.icon} className="w-4 h-4 text-primary" />
                    </span>
                    <span className="text-xs font-semibold text-foreground line-clamp-2">
                      {getLocalizedText(c.label, locale)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Title & Description Inputs */}
          <div className="space-y-4 pt-1">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Task Title:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Repaint 24 storage racks at a workshop"
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Detailed Scope of Work (SOW):
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Specify dimensions, materials on site, safety requirements..."
                className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* 4. Safety Equipment (PPE) Checklist */}
          <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
            <div className="flex items-center gap-2">
              <HardHat className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold text-foreground uppercase">
                Required Safety Equipment (PPE):
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {safetyChecklist.map((item, idx) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2 p-2 rounded-xl bg-muted/40 border border-border text-xs cursor-pointer hover:bg-muted"
                >
                  <input
                    type="checkbox"
                    checked={item.required}
                    onChange={(e) => {
                      const updated = [...safetyChecklist];
                      updated[idx].required = e.target.checked;
                      setSafetyChecklist(updated);
                    }}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className={item.required ? 'font-semibold text-foreground' : 'text-muted-foreground'}>
                    {getLocalizedText(item.label, locale)}
                  </span>
                </label>
              ))}
            </div>

            {aiReasoning && (
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2 mt-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <span className="font-bold block">Compliance Guidance:</span>
                  <p className="text-[11px] leading-relaxed">{aiReasoning}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Location & Timing */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                City:
              </label>
              <select
                value={cityId}
                onChange={(e) => {
                  setCityId(e.target.value);
                  const c = pack.cities.find((ct) => ct.id === e.target.value);
                  if (c) setDistrict(c.districts[0] || 'Center');
                }}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none"
              >
                {pack.cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {getLocalizedText(city.name, locale)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                District / Neighborhood:
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Planned Date of Work:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Estimated Duration (hours):
              </label>
              <input
                type="number"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Budget & Fees */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Your Budget ({pack.currency.symbol}):
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-base font-bold text-foreground"
            />
          </div>

          {/* Price Guidance Range */}
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
            <span className="font-semibold text-foreground block">
              Market Guidance for {getLocalizedText(selectedCategory.label, locale)}:
            </span>
            <span className="text-muted-foreground block">
              Typical jobs range between {formatCurrency(selectedCategory.priceGuide.min, pack, locale)} and{' '}
              {formatCurrency(selectedCategory.priceGuide.max, pack, locale)}.
            </span>
          </div>

          {/* Live Fee Breakdown */}
          <div className="p-4 rounded-2xl bg-card border border-border space-y-2 text-xs shadow-soft">
            <h4 className="font-bold text-foreground text-sm mb-2">
              {locale === 'uk' ? 'Розрахунок вартості та комісій:' : 'Live Fee Breakdown:'}
            </h4>
            <div className="flex justify-between text-muted-foreground">
              <span>{locale === 'uk' ? 'Сума завдання:' : 'Task Amount:'}</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(feeQuote.amount, pack, locale)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>
                {locale === 'uk'
                  ? `Комісія платформи замовника (${pack.fees.customerPct * 100}%):`
                  : `Customer Platform Service Fee (${pack.fees.customerPct * 100}%):`}
              </span>
              <span className="font-semibold text-foreground">
                +{formatCurrency(feeQuote.customerFee, pack, locale)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-sm text-foreground pt-2 border-t border-border">
              <span>{locale === 'uk' ? 'Разом до внесення в Ескроу:' : 'Total you pay into Escrow:'}</span>
              <span className="text-primary">
                {formatCurrency(feeQuote.customerPays, pack, locale)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground pt-1">
              <span>
                {locale === 'uk'
                  ? `Виконавець отримає (після комісії ${pack.fees.workerPct * 100}%):`
                  : `Worker will receive (after ${pack.fees.workerPct * 100}% deduction):`}
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(feeQuote.workerReceives, pack, locale)}
              </span>
            </div>
          </div>

          {/* Social Resilience Priority Boost */}
          <div className="p-4 rounded-2xl border border-teal-500/30 bg-teal-500/5 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={preferPriority}
                onChange={(e) => setPreferPriority(e.target.checked)}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
              />
              <div>
                <span className="text-xs font-bold text-foreground block flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>
                    {locale === 'uk'
                      ? 'Пріоритетне розміщення для ветеранів та ВПО'
                      : 'Support Ukrainian Veterans & IDPs Priority Matching'}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground leading-relaxed block mt-0.5">
                  {locale === 'uk'
                    ? 'Надає м’який буст ранжування (+14%) верифікованим ветеранам та переселенцям без виключення інших кваліфікованих майстрів.'
                    : 'Applies a soft ranking boost (+14%) to verified Ukrainian military veterans and internally displaced persons (IDPs) without excluding other qualified contractors.'}
                </span>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Step 4: Review & Publish */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-border bg-card space-y-4 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-foreground">{title || (locale === 'uk' ? 'Завдання без назви' : 'Untitled task')}</h3>
              <Badge variant="verify">L{aiRecommendedLevel} Required</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
              {description}
            </p>

            {/* Safety Gear Summary */}
            <div className="p-3 rounded-xl bg-muted/30 border border-border space-y-1.5">
              <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <HardHat className="w-3.5 h-3.5 text-amber-500" />
                <span>{locale === 'uk' ? 'Протокол безпеки та ЗІЗ:' : 'Safety Protocols (PPE):'}</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {safetyChecklist
                  .filter((i) => i.required)
                  .map((i) => (
                    <span
                      key={i.id}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-card border border-border font-medium text-foreground"
                    >
                      ✓ {getLocalizedText(i.label, locale)}
                    </span>
                  ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t border-border">
              <div>
                <span className="text-muted-foreground block">{locale === 'uk' ? 'Локація:' : 'Location:'}</span>
                <span className="font-semibold text-foreground">
                  {getLocalizedText(pack.cities.find((c) => c.id === cityId)?.name, locale)}, {district}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">{locale === 'uk' ? 'Сума в Ескроу:' : 'Protected Escrow Amount:'}</span>
                <span className="font-bold text-primary text-sm">
                  {formatCurrency(feeQuote.customerPays, pack, locale)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/20 border border-teal-500/30 text-xs text-muted-foreground space-y-1">
            <span className="font-bold text-foreground block">
              {locale === 'uk' ? 'Захищений робочий процес WorkHub:' : 'Google Protected Workflow:'}
            </span>
            <p>
              {locale === 'uk'
                ? 'Публікація безкоштовна. Після надходження пропозицій AI ранжує їх за дистанцією, Trust Score та фахом. Оплата захищена безвідкличним банківським ескроу та договором з Дія.Підписом.'
                : 'Publishing is free. Once verified contractors submit proposals, Vertex AI will rank them by distance (Google Maps Platform), Trust Score, and skills. All transactions are protected by Diia.ID e-signatures and escrow.'}
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        {step > 1 ? (
          <Button variant="outline" size="md" onClick={() => setStep((step - 1) as any)}>
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            {locale === 'uk' ? 'Назад' : 'Back'}
          </Button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <Button variant="primary" size="md" onClick={() => setStep((step + 1) as any)}>
            {locale === 'uk' ? 'Продовжити' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        ) : (
          <Button variant="primary" size="lg" isLoading={submitting} onClick={handlePublish} className="font-bold">
            {locale === 'uk' ? 'Опублікувати завдання' : 'Publish Task Now'}
          </Button>
        )}
      </div>
    </div>
  );
};
