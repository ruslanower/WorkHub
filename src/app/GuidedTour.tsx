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
  const { tourStep, nextTourStep, prevTourStep, endTour, setRole, setCountry } = useAppStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (tourStep === null) return null;

  const tourSteps = [
    {
      step: 0,
      title: 'Welcome to WorkHub',
      badge: 'Vision & Architecture',
      icon: Sparkles,
      description:
        'WorkHub is the institutional trust layer for physical on-site work. We solve prepayment anxiety and contractor non-performance through licensed escrow, automated legal contracts, and tiered identity.',
      actionLabel: 'Explore Browse Feed',
      action: () => navigate('/tasks'),
    },
    {
      step: 1,
      title: 'Dynamic Country Packs',
      badge: 'Global Scalability',
      icon: Globe2,
      description:
        'WorkHub uses modular Country Packs. Switching between Ukraine, Poland, or Kenya instantly adapts currency, legal contract templates, tax statuses, and digital ID providers without touching core UI logic.',
      actionLabel: 'Switch to Poland Pack',
      action: () => setCountry('PL'),
    },
    {
      step: 2,
      title: 'Protected Dual-Sided Payments',
      badge: 'Escrow Security',
      icon: Lock,
      description:
        'Customer funds are reserved by a licensed payment partner before work begins. Payments are released in milestones upon bilateral digital sign-off of completion acts, preventing fraud and non-payment.',
      actionLabel: 'View Active Jobs',
      action: () => navigate('/jobs'),
    },
    {
      step: 3,
      title: 'Tiered Verification & Trust Score',
      badge: 'Privacy-First ID',
      icon: ShieldCheck,
      description:
        'Workers advance from L0 to L3 via government digital IDs and trade certificates. The system operates on zero-retention principles: we store only verification tokens, never raw ID documents.',
      actionLabel: 'View Worker Profile',
      action: () => {
        setRole('worker');
        navigate('/profile');
      },
    },
    {
      step: 4,
      title: 'Automated Legal Contracts',
      badge: 'Compliance by Design',
      icon: FileText,
      description:
        'Every accepted job automatically synthesizes a jurisdiction-specific bilateral agreement and completion protocol with timestamped digital acceptance, providing legal certainty for both parties.',
      actionLabel: 'Open Flagship Job Room',
      action: () => navigate('/jobs'),
    },
    {
      step: 5,
      title: 'Priority Social Access Programs',
      badge: 'Social Impact',
      icon: HeartHandshake,
      description:
        'Veterans, workers 50+, refugees, and youth access lower platform fees, priority dispatch, and mentor badges. Accredited NGO partners audit programmatic outcomes in a dedicated console.',
      actionLabel: 'View Partner Console',
      action: () => {
        setRole('partner');
        navigate('/partner');
      },
    },
    {
      step: 6,
      title: 'Corporate & Crew Workspace',
      badge: 'B2B Procurement',
      icon: Building2,
      description:
        'Construction companies and property managers dispatch multi-person crews, manage sub-contractors, and download corporate VAT invoices with centralized spending controls.',
      actionLabel: 'Open Company Workspace',
      action: () => {
        setRole('company');
        navigate('/company');
      },
    },
    {
      step: 7,
      title: 'Sustainable Unit Economics',
      badge: 'Investor Defense',
      icon: TrendingUp,
      description:
        'Compare a naive 1% fee model against our sustainable 12% blended take-rate. See why escrow, banking, KYC, and arbitration require disciplined unit margins to achieve positive EBITDA.',
      actionLabel: 'Open Economics Calculator',
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
              Step {tourStep + 1} of {tourSteps.length}
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
            Skip Tour
          </button>
          <div className="flex items-center gap-2">
            {tourStep > 0 && (
              <Button variant="outline" size="sm" onClick={prevTourStep}>
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Back
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={tourStep === tourSteps.length - 1 ? endTour : nextTourStep}
            >
              <span>{tourStep === tourSteps.length - 1 ? 'Finish Tour' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
