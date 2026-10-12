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
      subtitle: 'The Trust Layer for Physical On-Site Work',
      tag: 'Executive Overview',
      content: (
        <div className="space-y-4 max-w-2xl text-center mx-auto">
          <p className="text-xl sm:text-2xl text-slate-300 leading-relaxed font-medium">
            A trusted marketplace for one-off and project-based physical labor: construction, logistics, cleaning, and maintenance.
          </p>
          <p className="text-sm text-slate-400">
            Featuring verified identity, protected payments held by licensed partners, automated legal contracts, and social impact programs.
          </p>
        </div>
      ),
    },
    {
      title: 'The Core Problem',
      subtitle: 'Why the \$100B+ physical job market remains broken',
      tag: 'Market Need',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <h4 className="font-bold text-base text-teal-400">Prepayment Fear</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Customers risk losing upfront cash to unvetted contractors with zero recourse or insurance.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <h4 className="font-bold text-base text-teal-400">Informal Cash Shadow</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Contractors lack verifiable income records, credit reputation, and formal bilateral contracts.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <h4 className="font-bold text-base text-teal-400">Unconnected Digital IDs</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              State e-ID infrastructure is rarely harnessed to make everyday labor transactions safe.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Three Architectural Layers',
      subtitle: 'Institutional software foundation',
      tag: 'Solution Architecture',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-teal-500/40 space-y-2">
            <span className="font-mono text-xs text-teal-400 block font-bold">Layer 1</span>
            <h4 className="font-bold text-base text-white">Marketplace Engine</h4>
            <p className="text-xs text-slate-300">
              Smart task templates, structured offers, contact masking, and B2B recurring facility jobs.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-blue-500/40 space-y-2">
            <span className="font-mono text-xs text-blue-400 block font-bold">Layer 2</span>
            <h4 className="font-bold text-base text-white">Trust & Protected Payments</h4>
            <p className="text-xs text-slate-300">
              L0-L3 identity verification, funds held in trust by licensed partner PSPs, milestone approval, and Trust Score.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-emerald-500/40 space-y-2">
            <span className="font-mono text-xs text-emerald-400 block font-bold">Layer 3</span>
            <h4 className="font-bold text-base text-white">Compliance & Impact</h4>
            <p className="text-xs text-slate-300">
              Automated contracts, bilateral completion acts, tax hints, and ESG priority access tracking.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'The Country Pack Innovation',
      subtitle: 'Single code base, zero-code international rollout',
      tag: 'Global Scalability',
      content: (
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-base text-slate-300 leading-relaxed">
            Every country-specific element — currency, languages, identity providers, payment partners, tax templates, and social programs — is isolated in a Country Pack configuration object.
          </p>
          <div className="grid grid-cols-3 gap-4 text-xs font-semibold">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
              Ukraine (UA): Diia ID, UAH, bank rails, Veterans & IDPs
            </div>
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
              Poland (PL): mObywatel, PLN, instant transfers, Newcomers 50+
            </div>
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
              Kenya (KE): National eID, KES, mobile money rails, Youth & Women
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Unit Economics: 1% vs 12%',
      subtitle: 'Why classifieds models fail and institutional models win',
      tag: 'Business Model',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
          <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-3">
            <Badge variant="danger">The 1% Fee Failure Scenario</Badge>
            <p className="text-xs text-slate-300 leading-relaxed">
              At 1% fee, the platform loses cash on every transaction: payment acquiring costs 2.5% and dispute/support costs 2%. It is structurally insolvent.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
            <Badge variant="success">The 12% WorkHub Model</Badge>
            <p className="text-xs text-slate-300 leading-relaxed">
              With 5% customer fee and 7% contractor fee, platform gross take is 12%. After 4.5% variable costs, net contribution is ~7.5% per order.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Monetization Streams',
      subtitle: 'Diversified institutional revenue',
      tag: 'Revenue Model',
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left text-xs">
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
            <span className="font-bold text-teal-400 block">1. Transaction Take</span>
            <p className="text-slate-300">10-15% blended fee split between customer & worker.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
            <span className="font-bold text-teal-400 block">2. Pro & B2B SaaS</span>
            <p className="text-slate-300">Pro contractor subscriptions & monthly company seats.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
            <span className="font-bold text-teal-400 block">3. Insurance & Fast Payout</span>
            <p className="text-slate-300">Commercial liability commission & instant rail fees.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
            <span className="font-bold text-teal-400 block">4. National Licensing</span>
            <p className="text-slate-300">Upfront territory setup fee + % of national GMV.</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Partnership Models',
      subtitle: 'How national operators license and scale WorkHub',
      tag: 'Distribution',
      content: (
        <div className="space-y-4 max-w-3xl mx-auto text-left text-xs">
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="font-bold text-white block">Master License</span>
            <p className="text-slate-300">National partner runs operations, banking, and sales; WorkHub provides core IP and continuous software.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="font-bold text-white block">Joint Venture</span>
            <p className="text-slate-300">Shared national entity combining local corporate anchors and regulatory relationships with our product engineering.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="font-bold text-white block">White-Label SaaS</span>
            <p className="text-slate-300">Dedicated instance and custom integrations for large multi-regional facility operators.</p>
          </div>
        </div>
      ),
    },
    {
      title: 'City Launch Playbook (12 Weeks)',
      subtitle: 'Repeatable zero-to-liquidity blueprint',
      tag: 'Go-To-Market',
      content: (
        <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto text-left text-xs">
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="text-teal-400 font-bold block mb-1">Weeks 1-3</span>
            <p className="text-slate-300">Bootstrapping supply via vocational guilds and veteran groups.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="text-teal-400 font-bold block mb-1">Weeks 4-6</span>
            <p className="text-slate-300">Securing B2B recurring demand from warehouse & property managers.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="text-teal-400 font-bold block mb-1">Weeks 7-9</span>
            <p className="text-slate-300">Concierge fulfillment of first 50 orders to establish reviews.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="text-teal-400 font-bold block mb-1">Weeks 10-12</span>
            <p className="text-slate-300">Autonomous organic expansion across adjacent categories.</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Target Operational KPIs',
      subtitle: 'Healthy marketplace benchmarks',
      tag: 'Metrics',
      content: (
        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
          <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
            <span className="text-2xl font-bold text-teal-400 block">&lt; 2 Hours</span>
            <span className="text-xs text-slate-300">Time to first verified offer</span>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
            <span className="text-2xl font-bold text-teal-400 block">&gt; 35%</span>
            <span className="text-xs text-slate-300">Repeat order rate</span>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
            <span className="text-2xl font-bold text-teal-400 block">&lt; 2%</span>
            <span className="text-xs text-slate-300">Dispute rate</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Risk Architecture',
      subtitle: 'Hardened regulatory and operational protections',
      tag: 'Risk & Legal',
      content: (
        <div className="space-y-3 max-w-3xl mx-auto text-left text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 flex justify-between">
            <span className="font-bold text-white">Payment Regulation:</span>
            <span className="text-slate-300">Funds held exclusively by licensed payment partner</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 flex justify-between">
            <span className="font-bold text-white">Labor Misclassification:</span>
            <span className="text-slate-300">Clear contractor tax definitions per local country law</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 flex justify-between">
            <span className="font-bold text-white">Off-Platform Leakage:</span>
            <span className="text-slate-300">Contact masking + tangible legal and insurance protections</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Product Roadmap',
      subtitle: 'Four phases from prototype to global liquidity',
      tag: 'Roadmap',
      content: (
        <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto text-left text-xs">
          <div className="p-4 rounded-xl bg-slate-800 border border-teal-500/30">
            <span className="font-bold text-teal-400 block">MVP (Today)</span>
            <p className="text-slate-300">Task templates, multi-tier KYC, escrow, Country Packs.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="font-bold text-white block">V1</span>
            <p className="text-slate-300">Corporate accounts, instant payouts, priority ESG reporting.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="font-bold text-white block">V2</span>
            <p className="text-slate-300">B2B API integrations, equipment financing, AI task scoping.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="font-bold text-white block">Scale</span>
            <p className="text-slate-300">Institutional micro-insurance and multi-country roaming.</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Investment Terms & Next Steps',
      subtitle: 'Confidential qualification',
      tag: 'Terms',
      content: (
        <div className="max-w-xl mx-auto text-center space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Detailed unit economics models, pilot data, and national licensing playbooks are available for qualified partners and investors under confidential memorandum.
          </p>
          <Button size="lg" variant="primary" onClick={() => setPresentationOpen(false)}>
            Back to Live Product Demo
          </Button>
        </div>
      ),
    },
  ];

  // Key navigation (P opens, ESC closes, left/right navigates)
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        if (!presentationOpen) setPresentationOpen(true);
      }
      if (!presentationOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setSlide((s) => Math.min(slides.length - 1, s + 1));
      } else if (e.key === 'ArrowLeft') {
        setSlide((s) => Math.max(0, s - 1));
      } else if (e.key === 'Escape') {
        setPresentationOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [presentationOpen, setPresentationOpen, slides.length]);

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
            Slide {slide + 1} / {slides.length}
          </Badge>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Use Arrow keys to navigate • Esc to exit
          </span>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setPresentationOpen(false)}
          className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <X className="w-4 h-4 mr-1.5" />
          Back to Live Demo
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
          Previous
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
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
