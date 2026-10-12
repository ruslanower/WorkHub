import * as React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { getServices } from '@/services/registry';
import type { TaskWithMeta, Offer, User, MilestonePlanItem } from '@/services/types';
import { formatCurrency, formatDate, getLocalizedText } from '@/i18n/formatters';
import { computeFees } from '@/lib/fees';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { OfferCard } from '@/components/ui/OfferCard';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  AlertCircle,
  FileCheck2,
  Lock,
  Sparkles,
} from 'lucide-react';

export const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pack, locale, role, currentUser } = useAppStore();
  const { t } = useTranslation();

  const [task, setTask] = React.useState<TaskWithMeta | null>(null);
  const [offers, setOffers] = React.useState<Offer[]>([]);
  const [workers, setWorkers] = React.useState<User[]>([]);
  const [customer, setCustomer] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Make Offer Modal State
  const [offerModalOpen, setOfferModalOpen] = React.useState(false);
  const [proposedPrice, setProposedPrice] = React.useState<number>(1000);
  const [etaDays, setEtaDays] = React.useState<number>(3);
  const [proposalMsg, setProposalMsg] = React.useState('');
  const [submittingOffer, setSubmittingOffer] = React.useState(false);
  const [offerError, setOfferError] = React.useState<string | null>(null);

  // Hire & Agreement Modal State
  const [selectedOfferToHire, setSelectedOfferToHire] = React.useState<Offer | null>(null);
  const [hireModalOpen, setHireModalOpen] = React.useState(false);
  const [signingAgreement, setSigningAgreement] = React.useState(false);
  const [agreementSigned, setAgreementSigned] = React.useState(false);
  const [fundingJob, setFundingJob] = React.useState(false);

  const loadData = React.useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const taskData = await getServices().tasks.get(id);
      setTask(taskData);
      setProposedPrice(taskData.budget);

      const [taskOffers, cust] = await Promise.all([
        getServices().offers.listForTask(id),
        getServices().users.get(taskData.customerId),
      ]);
      setOffers(taskOffers);
      setCustomer(cust);

      if (taskOffers.length > 0) {
        const workerUsers = await getServices().users.getMany(taskOffers.map((o) => o.workerId));
        setWorkers(workerUsers);
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading || !task) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-60 w-full rounded-2xl" />
      </div>
    );
  }

  const category = pack.categories.find((c) => c.id === task.categoryId);
  const city = pack.cities.find((c) => c.id === task.cityId);
  const feeQuote = computeFees(proposedPrice, pack);

  const handleMakeOffer = async () => {
    if (!currentUser) return;
    setSubmittingOffer(true);
    setOfferError(null);
    try {
      await getServices().offers.create({
        taskId: task.id,
        workerId: currentUser.id,
        price: proposedPrice,
        etaDays,
        message: proposalMsg || 'Ready to complete task professionally per specification.',
        availableFrom: new Date().toISOString(),
      });
      setOfferModalOpen(false);
      await loadData();
    } catch (err: any) {
      setOfferError(err.code ? t(`common.errors.${err.code}`) : err.message);
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleOpenHireModal = (offer: Offer) => {
    setSelectedOfferToHire(offer);
    setAgreementSigned(false);
    setHireModalOpen(true);
  };

  const handleConfirmHireAndFund = async () => {
    if (!selectedOfferToHire || !currentUser) return;
    setFundingJob(true);
    try {
      // 1. Hire contractor
      const newJob = await getServices().jobs.hire(selectedOfferToHire.id, currentUser.id);
      // 2. E-sign agreement
      await getServices().jobs.signAgreement(newJob.id, currentUser.id);
      // 3. Fund protected escrow payment
      await getServices().payments.fund(newJob.id, currentUser.id);

      setHireModalOpen(false);
      navigate(`/jobs/${newJob.id}`);
    } catch (err: any) {
      alert(err.message || 'Error completing hire');
    } finally {
      setFundingJob(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-2">
      {/* 1. Header & Navigation Back */}
      <div>
        <Link to="/tasks" className="text-xs font-semibold text-primary hover:underline mb-2 block">
          ← {t('nav.browse')}
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <CategoryIcon name={category?.icon || 'Package'} className="w-5 h-5" />
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {getLocalizedText(category?.label, locale)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">Level {task.minVerificationLevel} required</Badge>
            {task.isFlagship && <Badge variant="default">Flagship Demo</Badge>}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-2">
          {getLocalizedText(task.title, locale)}
        </h1>
      </div>

      {/* 2. Main Overview Card */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <span className="text-xs text-muted-foreground block font-medium">Customer Budget</span>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {formatCurrency(task.budget, pack, locale)}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              <span>
                {getLocalizedText(city?.name, locale)}, {task.district}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{formatDate(task.date, 'PPP', locale)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              <span>{task.durationHours} hours</span>
            </div>
          </div>
        </div>

        {/* Task Description */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-foreground">Task Scope & Description:</h3>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {getLocalizedText(task.description, locale)}
          </p>
        </div>

        {/* Milestone Plan */}
        {task.milestonePlan && task.milestonePlan.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
              Deliverable Milestones:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {task.milestonePlan.map((m: MilestonePlanItem, idx: number) => (
                <div key={idx} className="p-3 rounded-xl border border-border bg-muted/20 text-xs">
                  <span className="font-semibold text-foreground block">
                    {idx + 1}. {getLocalizedText(m.title, locale)}
                  </span>
                  <span className="text-muted-foreground">
                    Weight: {Math.round(m.share * 100)}% of total job
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Worker CTA: Submit Offer */}
        {role === 'worker' && task.status === 'open' && (
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Submit your price and schedule proposal. All payments are held in trust.
            </div>
            <Button size="lg" variant="primary" onClick={() => setOfferModalOpen(true)}>
              {t('common.actions.makeOffer')}
            </Button>
          </div>
        )}
      </div>

      {/* 3. Received Contractor Offers Section & ML Matchmaker */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">
              Candidate Proposals & ML Matchmaker ({offers.length})
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-teal-700 dark:text-teal-300 font-semibold bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ranked by Vertex AI (Proximity • Trust • Skills • Veteran Boost)</span>
          </div>
        </div>

        {offers.length === 0 ? (
          <div className="p-6 rounded-2xl border border-dashed border-border text-center text-sm text-muted-foreground">
            No proposals submitted yet. Contractors are currently reviewing the task.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offers.map((off, idx) => {
              const workerUser = workers.find((w) => w.id === off.workerId);
              return (
                <OfferCard
                  key={off.id}
                  offer={off}
                  worker={workerUser}
                  aiRank={idx + 1}
                  canHire={role === 'customer' || role === 'company' || role === 'admin'}
                  onHire={handleOpenHireModal}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Modal 1: Make an Offer Modal */}
      <Modal
        open={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        title={t('offers.makeOfferTitle')}
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              {t('offers.priceProposed')} ({pack.currency.symbol}):
            </label>
            <input
              type="number"
              value={proposedPrice}
              onChange={(e) => setProposedPrice(Number(e.target.value))}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground font-bold"
            />
          </div>

          {/* Live Fee Preview */}
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 space-y-1 text-xs">
            <div className="flex justify-between font-semibold text-foreground">
              <span>Gross Bid:</span>
              <span>{formatCurrency(feeQuote.amount, pack, locale)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Platform Contractor Fee ({pack.fees.workerPct * 100}%):</span>
              <span>- {formatCurrency(feeQuote.workerFee, pack, locale)}</span>
            </div>
            <div className="flex justify-between font-bold text-primary pt-1 border-t border-primary/20">
              <span>Net you will receive:</span>
              <span>{formatCurrency(feeQuote.workerReceives, pack, locale)}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Estimated Completion Days:
            </label>
            <input
              type="number"
              value={etaDays}
              onChange={(e) => setEtaDays(Number(e.target.value))}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Proposal Message & Qualifications:
            </label>
            <textarea
              rows={3}
              value={proposalMsg}
              onChange={(e) => setProposalMsg(e.target.value)}
              placeholder="Explain your approach, tools available, and availability..."
              className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>

          {offerError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{offerError}</span>
            </div>
          )}

          <Button
            className="w-full"
            variant="primary"
            size="lg"
            isLoading={submittingOffer}
            onClick={handleMakeOffer}
          >
            Submit Proposal
          </Button>
        </div>
      </Modal>

      {/* Modal 2: Hire Contractor & Fund Escrow Modal */}
      <Modal
        open={hireModalOpen}
        onClose={() => setHireModalOpen(false)}
        title="Electronic Agreement & Protected Payment"
        maxWidth="xl"
      >
        <div className="space-y-5 text-sm">
          {/* Agreement summary */}
          <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <FileCheck2 className="w-4 h-4 text-primary" />
              <span>Local Service Contract Preview ({pack.code})</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              By hiring this contractor, an electronic service contract is compiled per the local Country Pack template. Funds will be held in trust by {pack.payments.partnerName} and released only upon your explicit milestone approval.
            </p>
          </div>

          {/* Payment breakdown */}
          {selectedOfferToHire && (
            <div className="p-4 rounded-xl bg-card border border-border space-y-2 text-xs">
              <span className="font-semibold text-foreground block">Funding Summary:</span>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contractor bid:</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(selectedOfferToHire.price, pack, locale)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform client fee ({pack.fees.customerPct * 100}%):</span>
                <span className="font-semibold text-foreground">
                  +{formatCurrency(computeFees(selectedOfferToHire.price, pack).customerFee, pack, locale)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-primary pt-2 border-t border-border">
                <span>Total amount to fund:</span>
                <span>{formatCurrency(computeFees(selectedOfferToHire.price, pack).customerPays, pack, locale)}</span>
              </div>
            </div>
          )}

          {/* Electronic Signature Checkbox */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-card cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreementSigned}
              onChange={(e) => setAgreementSigned(e.target.checked)}
              className="mt-0.5 rounded text-primary focus:ring-primary"
            />
            <span className="text-xs text-muted-foreground">
              I agree to the terms of the service contract and authorize {pack.payments.partnerName} to hold the protected payment in trust.
            </span>
          </label>

          <Button
            className="w-full"
            variant="primary"
            size="lg"
            disabled={!agreementSigned}
            isLoading={fundingJob}
            onClick={handleConfirmHireAndFund}
          >
            <Lock className="w-4 h-4 mr-2" />
            Sign Agreement & Fund ({pack.payments.partnerName})
          </Button>
        </div>
      </Modal>
    </div>
  );
};
