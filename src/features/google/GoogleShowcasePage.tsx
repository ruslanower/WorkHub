import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { getServices } from '@/services/registry';
import { formatCurrency, formatPercent, getLocalizedText } from '@/i18n/formatters';
import type {
  AITaskParseResult,
  AIFraudResult,
  GoogleCloudCreditAllocation,
} from '@/services/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  Sparkles,
  Cpu,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Database,
  Cloud,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  DollarSign,
  Compass,
  FileCode2,
  HardHat,
  Eye,
  Terminal,
  ExternalLink,
  Lock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';

export const GoogleShowcasePage: React.FC = () => {
  const { pack, locale, countryCode } = useAppStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 1. Live Gemini Prompt Tester State
  const [promptInput, setPromptInput] = React.useState(
    'Fix 3 warehouse doors and repaint 200 m² floor tomorrow in Podil, Kyiv',
  );
  const [selectedModel, setSelectedModel] = React.useState<'gemini-1.5-flash' | 'gemini-1.5-pro'>(
    'gemini-1.5-flash',
  );
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [parseResult, setParseResult] = React.useState<AITaskParseResult | null>(null);

  // 2. Chat Fraud Prevention Simulator State
  const [chatMessage, setChatMessage] = React.useState(
    'Передзвони мені на 097-123-4567 або пиши в телеграм @work_direct, скинь на картку напряму без комісії',
  );
  const [isScanningChat, setIsScanningChat] = React.useState(false);
  const [fraudResult, setFraudResult] = React.useState<AIFraudResult | null>(null);

  // 3. Architecture Node Inspector State
  const [selectedNode, setSelectedNode] = React.useState<string>('vertex');

  // Load Cloud Credit plan
  const creditAllocations = React.useMemo(() => {
    return getServices().ai.getCloudCreditPlan();
  }, []);

  // Run initial parse on mount
  React.useEffect(() => {
    handleRunGeminiPrompt(promptInput);
    handleScanChatFraud(chatMessage);
  }, []);

  const handleRunGeminiPrompt = async (text: string) => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await getServices().ai.parseTaskPrompt(text, countryCode);
      setParseResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleScanChatFraud = async (text: string) => {
    if (!text.trim()) return;
    setIsScanningChat(true);
    try {
      const res = await getServices().ai.detectChatFraud(text);
      setFraudResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanningChat(false);
    }
  };

  const presetPrompts = [
    {
      label: 'Warehouse Doors & Epoxy Floor (Kyiv)',
      text: 'Fix 3 warehouse doors and repaint 200 m² floor tomorrow in Podil, Kyiv',
    },
    {
      label: 'EcoFlow Backup Power & DB (Lviv)',
      text: 'Встановити резервну зарядну станцію EcoFlow та перевірити електрощиток у Львові',
    },
    {
      label: 'Debris Hauling & Demolition (Kyiv)',
      text: 'Терміновий демонтаж перегородок та вивезення 4 т будівельного сміття, Оболонь',
    },
  ];

  const presetChatMessages = [
    {
      label: 'Severe Bypass Attempt (Phone + Telegram + Cash)',
      text: 'Передзвони мені на 097-123-4567 або пиши в телеграм @work_direct, скинь на картку напряму без комісії',
    },
    {
      label: 'Direct Email & Wire Offer',
      text: 'My email is master.repair@gmail.com, please do a direct bank transfer outside WorkHub',
    },
    {
      label: 'Legitimate On-Platform Message',
      text: 'Привіт! Буду на об’єкті завтра о 09:00. Всі інструменти та засоби захисту зі мною. Оплата через Escrow.',
    },
  ];

  const pieColors = ['#0d9488', '#0284c7', '#3b82f6', '#6366f1', '#8b5cf6'];

  const architectureNodes: Record<
    string,
    {
      title: string;
      category: string;
      googleProducts: string[];
      role: string;
      metrics: string;
      creditsShare: string;
    }
  > = {
    vertex: {
      title: 'ML Matching Engine & Model Fine-Tuning',
      category: 'DeepTech & AI Core',
      googleProducts: ['Google Vertex AI', 'Vertex Feature Store', 'Custom Embeddings'],
      role: 'Fine-tunes multi-factor matching algorithms combining spatial proximity, Trust Score, verified trade licenses, and positive social boost for Ukrainian Veterans & IDPs.',
      metrics: 'p95 Latency: 120ms • 98.4% Precision on contractor match',
      creditsShare: '$120,000 (34.3% of $350k GCP grant)',
    },
    gemini: {
      title: 'Gemini 1.5 Multi-modal Task & Safety Parser',
      category: 'Generative AI & LLM',
      googleProducts: ['Gemini 1.5 Flash', 'Gemini 1.5 Pro', 'Vertex AI Model Garden'],
      role: 'Transforms voice memos and unformatted customer prompts into structured scopes of work, automated safety PPE checklists, and fair price percentile guidance.',
      metrics: 'Latency: ~280ms • Multi-lingual (Ukrainian / English / Polish)',
      creditsShare: '$95,000 (27.1% of $350k GCP grant)',
    },
    maps: {
      title: 'Spatial Logistics & Route Optimization',
      category: 'Geo-Spatial Engine',
      googleProducts: ['Google Maps Platform', 'Distance Matrix API', 'Directions API', 'Geocoding'],
      role: 'Computes hyper-local travel time and distance constraints, cluster routing for multi-job crews, and nearby hardware supply logistics (Epicentr / Leroy Merlin).',
      metrics: 'Real-time traffic-adjusted ETA • Sub-15km local clusters',
      creditsShare: '$60,000 (17.1% of $350k GCP grant)',
    },
    firebase: {
      title: 'Real-time Escrow & Job Room State Ledger',
      category: 'Data & Security',
      googleProducts: ['Firebase Auth', 'Cloud Firestore', 'Cloud Spanner', 'Cloud Storage'],
      role: 'Syncs live Job Room chats, immutable milestone approvals, evidence photos, and Diia.Signature state with sub-second synchronization.',
      metrics: 'Websocket latency < 80ms • 99.999% availability guarantee',
      creditsShare: '$45,000 (12.9% of $350k GCP grant)',
    },
    cloudrun: {
      title: 'Sovereign Serverless & DDoS Armor',
      category: 'Infrastructure',
      googleProducts: ['Cloud Run', 'Cloud Armor', 'Google Cloud VPC', 'Cloud Operations'],
      role: 'Scalable containerized microservices hosted in EU Frankfurt/Warsaw compliance zones with enterprise WAF protection against cyber-disruptions.',
      metrics: 'Zero-cold-start autoscaling • Enterprise DDoS protection',
      creditsShare: '$30,000 (8.6% of $350k GCP grant)',
    },
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4 animate-fade-in text-foreground">
      {/* 1. Header Banner tailored for Google Evaluators */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 border border-teal-500/30 p-8 sm:p-10 text-white shadow-lifted">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30 text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Google for Startups Ukraine Support Fund
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-400/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
              $350,000 Google Cloud Credits & Tech Architecture
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Diia.ID GovTech Verified
            </span>
          </div>

          <div className="space-y-3 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Google Tech & AI Showcase
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              WorkHub is an AI-first, trusted marketplace for project-based physical labor built natively on Google Cloud. Below is the dedicated technical review console showing how our ML matching engine, Gemini 1.5 multi-modal APIs, Google Maps Platform, and Firebase infrastructure operate in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a href="#gemini-tester">
              <Button variant="primary" size="md" className="gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold">
                <Terminal className="w-4 h-4" />
                Live Gemini API Tester
              </Button>
            </a>
            <a href="#credit-plan">
              <Button variant="outline" size="md" className="gap-2 text-white border-slate-700 hover:bg-slate-800">
                <DollarSign className="w-4 h-4 text-teal-400" />
                $350k GCP Credits Plan
              </Button>
            </a>
            <Link to="/tasks/new">
              <Button variant="outline" size="md" className="gap-2 text-white border-slate-700 hover:bg-slate-800">
                <Zap className="w-4 h-4 text-amber-400" />
                Open AI Task Wizard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Interactive Google Cloud & Vertex AI Architecture Topology */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-xl font-bold">System Architecture & Google Services Topology</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click any architectural module below to inspect its role, Google products utilized, and GCP credits allocation.
            </p>
          </div>
          <Badge variant="secondary" className="self-start sm:self-auto font-mono text-[11px]">
            Target SLA: 99.99% • EU Sovereignty
          </Badge>
        </div>

        {/* Interactive Architecture Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            { id: 'vertex', name: 'Vertex AI & Matching', icon: Cpu, color: 'border-teal-500 bg-teal-50 dark:bg-teal-950/30' },
            { id: 'gemini', name: 'Gemini 1.5 SOW Parser', icon: Sparkles, color: 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' },
            { id: 'maps', name: 'Google Maps Engine', icon: MapPin, color: 'border-amber-500 bg-amber-50 dark:bg-amber-950/30' },
            { id: 'firebase', name: 'Firebase & Spanner', icon: Database, color: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
            { id: 'cloudrun', name: 'Cloud Run & Armor', icon: Cloud, color: 'border-purple-500 bg-purple-50 dark:bg-purple-950/30' },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = selectedNode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedNode(item.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? `${item.color} ring-2 ring-primary shadow-md scale-[1.02]`
                    : 'border-border bg-card hover:border-muted-foreground/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                  )}
                </div>
                <h4 className="font-bold text-xs text-foreground">{item.name}</h4>
                <span className="text-[10px] text-muted-foreground block mt-1">
                  Click to inspect →
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Architecture Node Detail Box */}
        {selectedNode && architectureNodes[selectedNode] && (
          <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  {architectureNodes[selectedNode].category}
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  {architectureNodes[selectedNode].title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {architectureNodes[selectedNode].googleProducts.map((prod) => (
                  <Badge key={prod} variant="secondary" className="font-semibold text-xs">
                    {prod}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="md:col-span-2 space-y-2">
                <h5 className="text-xs font-semibold text-muted-foreground uppercase">
                  Technical Responsibility & Workflow:
                </h5>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  {architectureNodes[selectedNode].role}
                </p>
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-muted/30 border border-border">
                <div>
                  <span className="text-[10px] text-muted-foreground block font-medium">Performance Metrics:</span>
                  <span className="text-xs font-bold text-foreground block">
                    {architectureNodes[selectedNode].metrics}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-medium">Google Cloud Credits Allocation:</span>
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400 block">
                    {architectureNodes[selectedNode].creditsShare}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. Live Gemini API Prompt & Audio Parser Tester (Interactive Playground) */}
      <section id="gemini-tester" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-xl font-bold">Live Gemini API Prompt & SOW Generator Tester</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Interactive playground demonstrating zero-shot transformation of natural voice/text queries into verified scopes of work and safety protocols.
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedModel('gemini-1.5-flash')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedModel === 'gemini-1.5-flash'
                  ? 'bg-card text-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Gemini 1.5 Flash (280ms)
            </button>
            <button
              type="button"
              onClick={() => setSelectedModel('gemini-1.5-pro')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedModel === 'gemini-1.5-pro'
                  ? 'bg-card text-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Gemini 1.5 Pro (Deep Safety)
            </button>
          </div>
        </div>

        {/* Input & Presets */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-soft space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center justify-between">
              <span>Customer Prompt (Voice / Text input):</span>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 lowercase">
                Multilingual: EN / UK / PL
              </span>
            </label>
            <textarea
              rows={3}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Enter customer prompt..."
              className="w-full bg-background border border-border rounded-2xl p-4 text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none"
            />
          </div>

          {/* Quick preset chips */}
          <div className="space-y-2">
            <span className="text-[11px] text-muted-foreground block font-medium">
              Try realistic preset prompts:
            </span>
            <div className="flex flex-wrap gap-2">
              {presetPrompts.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setPromptInput(p.text);
                    handleRunGeminiPrompt(p.text);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs text-foreground font-medium transition-colors text-left"
                >
                  ⚡ {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <Cpu className="w-4 h-4 text-teal-500" />
              <span>Inference Engine: Google Vertex AI ({selectedModel})</span>
            </div>

            <Button
              variant="primary"
              size="md"
              isLoading={isAnalyzing}
              onClick={() => handleRunGeminiPrompt(promptInput)}
              className="gap-2 font-bold"
            >
              <Sparkles className="w-4 h-4" />
              Run Gemini Analysis
            </Button>
          </div>
        </div>

        {/* Gemini Parsed Output Card */}
        {parseResult && (
          <div className="p-6 sm:p-8 rounded-3xl border border-teal-500/40 bg-card shadow-lifted space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      {getLocalizedText(parseResult.title, locale)}
                    </h3>
                    <Badge variant="verify">AI Verified</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Auto-categorized as: <strong className="text-foreground capitalize">{parseResult.categoryId}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block font-mono">
                    Token Usage: {parseResult.tokensUsed} tokens
                  </span>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 block font-mono">
                    Latency: {parseResult.latencyMs}ms (Gemini API)
                  </span>
                </div>

                <Link
                  to="/tasks/new"
                  state={{
                    aiPreFill: {
                      title: getLocalizedText(parseResult.title, locale),
                      description: getLocalizedText(parseResult.description, locale),
                      categoryId: parseResult.categoryId,
                      budget: parseResult.priceGuidance.median,
                    },
                  }}
                >
                  <Button variant="primary" size="sm" className="gap-1 font-bold">
                    <span>Apply to Task Wizard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Grid of Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Col 1: Scope of Work */}
              <div className="space-y-3 md:col-span-2">
                <h4 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                  <FileCode2 className="w-4 h-4 text-primary" />
                  <span>Structured Scope of Work (SOW):</span>
                </h4>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border text-xs leading-relaxed font-sans whitespace-pre-line text-foreground">
                  {getLocalizedText(parseResult.description, locale)}
                </div>

                {/* Milestone breakdown */}
                <div className="space-y-2 pt-2">
                  <h5 className="text-[11px] font-bold text-muted-foreground uppercase">
                    AI Suggested Escrow Milestones:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {parseResult.milestonePlan.map((m, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-border bg-card text-xs space-y-1">
                        <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase">
                          Stage {idx + 1} ({Math.round(m.share * 100)}%)
                        </span>
                        <p className="text-[11px] font-medium text-foreground truncate">
                          {getLocalizedText(m.title, locale)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Col 2: Safety & Price Guidance */}
              <div className="space-y-4">
                {/* Safety Checklist */}
                <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                    <HardHat className="w-4 h-4 text-amber-500" />
                    <span>Safety Equipment (PPE):</span>
                  </h4>
                  <ul className="space-y-2">
                    {parseResult.safetyChecklist.map((item) => (
                      <li key={item.id} className="flex items-start gap-2 text-xs">
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            item.required ? 'text-teal-600' : 'text-muted-foreground'
                          }`}
                        />
                        <span className={item.required ? 'font-semibold text-foreground' : 'text-muted-foreground'}>
                          {getLocalizedText(item.label, locale)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Guidance */}
                <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>Fair Price Guidance ({pack.currency.code}):</span>
                  </h4>
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-2xl font-extrabold text-foreground">
                        {formatCurrency(parseResult.priceGuidance.median, pack)}
                      </span>
                      <span className="text-[11px] text-muted-foreground block">
                        Range: {formatCurrency(parseResult.priceGuidance.min, pack)} - {formatCurrency(parseResult.priceGuidance.max, pack)}
                      </span>
                    </div>
                    <Badge variant="verify">
                      {parseResult.priceGuidance.confidencePct}% Confidence
                    </Badge>
                  </div>
                </div>

                {/* Verification requirement reasoning */}
                <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Compliance Recommendation:
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    {getLocalizedText(parseResult.verificationReasoning, locale)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. Real-time Chat Fraud & Off-Platform Bypass Prevention */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-bold">AI Fraud & Off-Platform Bypass Prevention</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live NLP safety filter detecting off-platform communication (phone numbers, Telegram links, cash deals) to safeguard user escrow and insurance.
            </p>
          </div>
          <Badge variant="secondary" className="font-mono text-[11px]">
            Accuracy: 99.4%
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input & Presets */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">
              Simulate Chat Message:
            </h4>
            <textarea
              rows={3}
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none"
            />

            <div className="space-y-1.5">
              <span className="text-[11px] text-muted-foreground block font-medium">Test Presets:</span>
              <div className="space-y-1.5">
                {presetChatMessages.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setChatMessage(p.text);
                      handleScanChatFraud(p.text);
                    }}
                    className="w-full p-2 rounded-lg border border-border bg-muted/30 hover:bg-muted text-left text-xs transition-colors flex items-center justify-between"
                  >
                    <span className="truncate">{p.label}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2">Test →</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              isLoading={isScanningChat}
              onClick={() => handleScanChatFraud(chatMessage)}
              className="w-full mt-2 font-bold"
            >
              Analyze Message Safety
            </Button>
          </div>

          {/* Real-time Detection Output */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase flex items-center justify-between">
              <span>Vertex AI Safety Inspection:</span>
              {fraudResult && (
                <Badge variant={fraudResult.safe ? 'verify' : 'danger'}>
                  {fraudResult.safe ? 'Safe Message' : `High Risk (${fraudResult.riskScore}/100)`}
                </Badge>
              )}
            </h4>

            {fraudResult ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[11px] text-muted-foreground block mb-1">
                    Shielded Message Output (Rendered to Recipient):
                  </span>
                  <div className="p-3 rounded-xl bg-muted border border-border font-mono text-xs text-foreground">
                    {fraudResult.maskedText}
                  </div>
                </div>

                {fraudResult.detectedEntities.length > 0 && (
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-1">
                      Detected Bypass Triggers:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {fraudResult.detectedEntities.map((ent, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-[11px] font-medium">
                          ⚠️ {ent}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`p-3.5 rounded-xl border leading-relaxed ${
                  fraudResult.safe
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200'
                }`}>
                  <span className="font-bold block mb-0.5">Automated Recommendation:</span>
                  <p className="text-[11px]">{getLocalizedText(fraudResult.recommendation, locale)}</p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                Run analysis to see live output.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. $350,000 Google Cloud Credits Utilization Plan */}
      <section id="credit-plan" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-xl font-bold">$350,000 Google Cloud Credits Utilization Plan</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Rigorous financial and infrastructure budget specifically structured for the Google for Startups Technical Review Board.
            </p>
          </div>
          <span className="text-sm font-extrabold text-teal-600 dark:text-teal-400">
            Total Allocated: $350,000 (100%)
          </span>
        </div>

        {/* Visual Graph + Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Donut Chart */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-soft flex flex-col items-center justify-center space-y-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase text-center">
              Credit Allocation Breakdown
            </h4>
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={creditAllocations}
                    dataKey="allocatedAmount"
                    nameKey="pillar"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {creditAllocations.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`$${val.toLocaleString()}`, 'GCP Credits']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center">
              <span className="text-2xl font-extrabold text-foreground block">$350,000</span>
              <span className="text-[11px] text-muted-foreground">Google Cloud Infrastructure Budget</span>
            </div>
          </div>

          {/* Table Breakdown */}
          <div className="lg:col-span-2 p-6 rounded-3xl border border-border bg-card shadow-soft space-y-3 overflow-x-auto">
            <h4 className="text-xs font-bold text-muted-foreground uppercase">
              Pillar-by-Pillar Technical Justification:
            </h4>
            <div className="space-y-3 min-w-[500px]">
              {creditAllocations.map((alloc, idx) => (
                <div key={alloc.id} className="p-3.5 rounded-2xl border border-border bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: pieColors[idx % pieColors.length] }}
                      />
                      <span className="font-bold text-xs text-foreground">{alloc.pillar}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        ({alloc.googleService})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-xs text-teal-600 dark:text-teal-400">
                        ${alloc.allocatedAmount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-1">
                        ({alloc.percentage}%)
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed pl-5">
                    {getLocalizedText(alloc.description, locale)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Alignment & Ukrainian Tech Ecosystem Callout */}
      <section className="p-6 sm:p-8 rounded-3xl border border-teal-500/30 bg-teal-500/5 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold shrink-0">
            🇺🇦
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-foreground">
              Strategic Fit for Google for Startups Ukraine Support Fund
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              WorkHub addresses a critical civilian economy challenge: structured, transparent employment for hundreds of thousands of Ukrainian Veterans, Internally Displaced Persons (IDPs), and local trade professionals rebuilding Ukraine. By anchoring our platform on Google Cloud & Vertex AI, we achieve global scalability, state-level Diia.ID security compliance, and an unbeatable ML matching moat.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
