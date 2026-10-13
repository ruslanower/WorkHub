import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { getServices } from '@/services/registry';
import type { JobRoom, RenderedDocument } from '@/services/types';
import type { DocumentKind } from '@/countries/types';
import { formatCurrency, formatDate, formatRelativeTime, getLocalizedText } from '@/i18n/formatters';
import { StatusStepper } from '@/components/ui/StatusStepper';
import { ProtectedPaymentPanel } from '@/components/ui/ProtectedPaymentPanel';
import { MilestoneList } from '@/components/ui/MilestoneList';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  Send,
  Upload,
  AlertTriangle,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Share2,
  DollarSign,
  History,
  Lock,
  Star,
  UserCheck,
  Scale,
  CreditCard,
  User,
} from 'lucide-react';

export const JobRoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { pack, locale, role, setRole, currentUser } = useAppStore();
  const { t } = useTranslation();

  const [room, setRoom] = React.useState<JobRoom | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'chat' | 'documents' | 'audit'>('chat');

  // Chat message input
  const [chatInput, setChatInput] = React.useState('');
  const [sendingMsg, setSendingMsg] = React.useState(false);

  // Evidence upload
  const [evidenceLabel, setEvidenceLabel] = React.useState('');
  const [uploadModalOpen, setUploadModalOpen] = React.useState(false);

  // Dispute modal
  const [disputeModalOpen, setDisputeModalOpen] = React.useState(false);
  const [disputeReason, setDisputeReason] = React.useState<any>('quality');
  const [disputeOutcome, setDisputeOutcome] = React.useState<any>('rework');
  const [disputeDesc, setDisputeDesc] = React.useState('');

  // Propose price modal
  const [proposePriceModalOpen, setProposePriceModalOpen] = React.useState(false);
  const [newProposedPrice, setNewProposedPrice] = React.useState<number>(0);

  // Document preview modal
  const [previewDoc, setPreviewDoc] = React.useState<RenderedDocument | null>(null);
  const [docLoading, setDocLoading] = React.useState(false);

  // Review & Rating State
  const [ratingScore, setRatingScore] = React.useState(5);
  const [reviewComment, setReviewComment] = React.useState('');
  const [submittingReview, setSubmittingReview] = React.useState(false);
  const [reviewSubmitted, setReviewSubmitted] = React.useState(false);

  const loadRoom = React.useCallback(async () => {
    if (!id) return;
    try {
      const data = await getServices().jobs.getRoom(id);
      setRoom(data);
      setNewProposedPrice(data.job.amount);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    loadRoom();
  }, [loadRoom]);

  if (loading || !room) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6">
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  const { job, task, customer, worker, messages, evidence, documents, audit, dispute } = room;
  const isJobFunded = ['funded', 'in_progress', 'delivered', 'approved', 'paid_out'].includes(job.status);
  const isUk = locale === 'uk';

  // Actions
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !currentUser) return;
    setSendingMsg(true);
    try {
      await getServices().jobs.sendMessage(job.id, currentUser.id, chatInput);
      setChatInput('');
      await loadRoom();
    } catch {
      //
    } finally {
      setSendingMsg(false);
    }
  };

  const handleUploadEvidence = async () => {
    if (!evidenceLabel || !currentUser) return;
    try {
      await getServices().jobs.addEvidence(job.id, currentUser.id, evidenceLabel);
      setEvidenceLabel('');
      setUploadModalOpen(false);
      await loadRoom();
    } catch {
      //
    }
  };

  const handleDeliverMilestone = async (mId: string) => {
    if (!currentUser) return;
    await getServices().jobs.deliverMilestone(job.id, mId, currentUser.id);
    await loadRoom();
  };

  const handleReleaseMilestone = async (mId: string) => {
    if (!currentUser) return;
    await getServices().payments.releaseMilestone(job.id, mId, currentUser.id);
    await loadRoom();
  };

  const handleFundEscrow = async () => {
    if (!currentUser) return;
    try {
      await getServices().jobs.signAgreement(job.id, currentUser.id);
    } catch {
      // might already be signed
    }
    await getServices().payments.fund(job.id, currentUser.id);
    await loadRoom();
  };

  const handleApproveWork = async () => {
    if (!currentUser) return;
    await getServices().jobs.approve(job.id, currentUser.id);
    await getServices().payments.payout(job.id);
    await loadRoom();
  };

  const handleDeliverWork = async () => {
    if (!currentUser) return;
    await getServices().jobs.deliver(job.id, currentUser.id);
    await loadRoom();
  };

  const handleOpenDispute = async () => {
    if (!currentUser) return;
    await getServices().disputes.open({
      jobId: job.id,
      openedBy: currentUser.id,
      reason: disputeReason,
      description: disputeDesc,
      desiredOutcome: disputeOutcome,
      evidenceLabels: [isUk ? 'Фотофіксація недоліків' : 'Visual proof attached'],
    });
    setDisputeModalOpen(false);
    await loadRoom();
  };

  const handleResolveDispute = async (outcome: 'full_release' | 'refund' | 'partial_release') => {
    if (!currentUser || !dispute) return;
    const share = outcome === 'partial_release' ? 0.5 : outcome === 'full_release' ? 1.0 : 0.0;
    const note = isUk
      ? `Рішення арбітражу WorkHub: ${outcome === 'full_release' ? '100% виплата виконавцю' : outcome === 'refund' ? '100% повернення замовнику' : '50/50 розділено між сторонами'}.`
      : `WorkHub Arbitration Ruling: ${outcome === 'full_release' ? 'Full payout to contractor' : outcome === 'refund' ? 'Full refund to customer' : '50/50 split between parties'}.`;

    await getServices().disputes.decide(dispute.id, currentUser.id, outcome, share, note);
    await loadRoom();
  };

  const handleSubmitReview = async () => {
    if (!currentUser) return;
    setSubmittingReview(true);
    try {
      await getServices().reviews.create({
        jobId: job.id,
        fromId: currentUser.id,
        criteria: {
          quality: ratingScore,
          communication: ratingScore,
          punctuality: ratingScore,
        },
        text: reviewComment.trim() || (isUk ? 'Чудова співпраця, робота виконана вчасно та за договором.' : 'Excellent collaboration, work completed on schedule and under contract.'),
      });
      setReviewSubmitted(true);
      await loadRoom();
    } catch {
      //
    } finally {
      setSubmittingReview(false);
    }
  };

  const handlePreviewDocument = async (kind: DocumentKind) => {
    setDocLoading(true);
    try {
      const doc = await getServices().documents.preview(job.id, kind, locale);
      setPreviewDoc(doc);
    } catch {
      //
    } finally {
      setDocLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in py-2">
      {/* 0. Quick Role Switcher for Test Experience */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 px-4 rounded-2xl bg-muted/40 border border-border text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <UserCheck className="w-4 h-4 text-primary" />
          <span>{isUk ? 'Тестування від імені ролі:' : 'Testing persona role:'}</span>
          <Badge variant="secondary" className="font-bold text-foreground capitalize">
            {role}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              role === 'customer'
                ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            {isUk ? 'Замовник' : 'Customer'}
          </button>
          <button
            type="button"
            onClick={() => setRole('worker')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              role === 'worker'
                ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            {isUk ? 'Виконавець' : 'Contractor'}
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              role === 'admin'
                ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            {isUk ? 'Арбітр / Адмін' : 'Mediator / Admin'}
          </button>
        </div>
      </div>

      {/* 1. Stepper & Header */}
      <div className="p-4 sm:p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                {isUk ? 'Замовлення' : 'Job'} #{job.id}
              </span>
              <Badge variant="default">{job.status.replace('_', ' ')}</Badge>
              {job.isFlagship && (
                <Badge variant="verify" className="font-semibold">
                  {isUk ? 'Флагманське демо' : 'Flagship Demo'}
                </Badge>
              )}
            </div>
            <h1 className="text-xl font-bold text-foreground mt-1">
              {getLocalizedText(task.title, locale)}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {isUk ? 'Сума контракту:' : 'Contract Value:'}
            </span>
            <span className="text-lg font-bold text-foreground">
              {formatCurrency(job.amount, pack, locale)}
            </span>
          </div>
        </div>

        {/* Status Stepper */}
        <StatusStepper currentStatus={job.status} />
      </div>

      {/* 2. Escrow Payment Banner + Safety Hotline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ProtectedPaymentPanel amount={job.amount} paymentState={job.paymentState} />
        </div>

        {/* On-site Safety Card */}
        <div className="p-4 rounded-2xl border border-border bg-card flex flex-col justify-between text-xs space-y-2">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold">
            <PhoneCall className="w-4 h-4" />
            <span>{isUk ? 'Екстрені служби' : 'Emergency Services'}</span>
          </div>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            {isUk
              ? 'У разі небезпеки або нещасного випадку на об’єкті негайно телефонуйте за місцевим номером екстрених служб:'
              : 'In case of danger or accident on site, call the local emergency number immediately:'}
          </p>
          <div className="text-lg font-bold text-foreground font-mono">
            {pack.emergencyNumber}
          </div>
        </div>
      </div>

      {/* 2.5 Dispute Resolution Panel (Active when Disputed) */}
      {job.paymentState === 'disputed' && (
        <div className="p-5 rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
              <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>{isUk ? 'Арбітраж платформи: Спір на розгляді' : 'Platform Arbitration: Dispute Active'}</span>
            </div>
            <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-300">
              {dispute?.stage ? t(`disputes.stages.${dispute.stage}`) : 'In Review'}
            </Badge>
          </div>

          <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
            {dispute?.description || (isUk ? 'Зафіксовано претензію щодо якості або строків робіт. Кошти заблоковано на ескроу-рахунку.' : 'A dispute regarding deliverables or deadlines has been initiated. Escrow funds are secured.')}
          </p>

          <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-foreground mr-1">
              {isUk ? 'Дія арбітра (тест):' : 'Mediator action (test):'}
            </span>
            <Button size="sm" variant="primary" onClick={() => handleResolveDispute('full_release')}>
              {isUk ? '100% виплата майстру' : '100% Release to Worker'}
            </Button>
            <Button size="sm" variant="danger" onClick={() => handleResolveDispute('refund')}>
              {isUk ? '100% повернення замовнику' : '100% Refund to Customer'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleResolveDispute('partial_release')}>
              {isUk ? 'Розділити 50% / 50%' : 'Split 50% / 50%'}
            </Button>
          </div>
        </div>
      )}

      {/* 3. Core Action Bar */}
      <div className="p-4 rounded-2xl border border-border bg-card shadow-soft flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Customer: Fund Escrow if job is accepted */}
          {job.status === 'offer_accepted' && (
            <Button size="sm" variant="primary" onClick={handleFundEscrow}>
              <CreditCard className="w-4 h-4 mr-1.5" />
              {isUk ? 'Зарезервувати кошти в Ескроу' : 'Fund Escrow Now'}
            </Button>
          )}

          {/* Worker Actions */}
          {role === 'worker' && job.status === 'funded' && (
            <Button size="sm" variant="primary" onClick={() => getServices().jobs.start(job.id, worker.id).then(loadRoom)}>
              {isUk ? 'Розпочати роботу на об’єкті' : 'Begin On-Site Work'}
            </Button>
          )}

          {role === 'worker' && job.status === 'in_progress' && (
            <Button size="sm" variant="primary" onClick={handleDeliverWork}>
              {isUk ? 'Здати виконану роботу на перевірку' : 'Submit Complete Work for Approval'}
            </Button>
          )}

          {/* Customer Actions */}
          {role === 'customer' && job.status === 'delivered' && (
            <Button size="sm" variant="primary" onClick={handleApproveWork}>
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              {isUk ? 'Прийняти роботу та виплатити кошти' : 'Approve Work & Release Payment'}
            </Button>
          )}

          {/* Dispute Action */}
          {job.paymentState !== 'disputed' && ['in_progress', 'delivered'].includes(job.status) && (
            <Button size="sm" variant="danger" onClick={() => setDisputeModalOpen(true)}>
              <AlertTriangle className="w-4 h-4 mr-1" />
              {isUk ? 'Відкрити спір / арбітраж' : 'Open Dispute'}
            </Button>
          )}

          {/* Propose New Amount */}
          {['funded', 'in_progress'].includes(job.status) && (
            <Button size="sm" variant="outline" onClick={() => setProposePriceModalOpen(true)}>
              <DollarSign className="w-4 h-4 mr-1" />
              {isUk ? 'Змінити вартість робіт' : 'Propose Amount Change'}
            </Button>
          )}
        </div>

        {/* Safety Check-in trigger */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={async () => {
              const text = await getServices().jobs.shareStatus(job.id);
              alert(text);
            }}
          >
            <Share2 className="w-3.5 h-3.5 mr-1" />
            {isUk ? 'Поділитися статусом' : 'Share Status'}
          </Button>
        </div>
      </div>

      {/* 4. Milestones & Evidence Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-foreground">
              {isUk ? 'Етапи та виплати' : 'Milestones & Releases'}
            </h3>
          </div>
          <MilestoneList
            milestones={job.milestones}
            userRole={role}
            isJobFunded={isJobFunded}
            onDeliver={handleDeliverMilestone}
            onRelease={handleReleaseMilestone}
          />
        </div>

        {/* Evidence Photos Gallery */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-foreground">
              {isUk ? `Фотофіксація (${evidence.length})` : `Work Photos (${evidence.length})`}
            </h3>
            <Button size="sm" variant="outline" onClick={() => setUploadModalOpen(true)}>
              <Upload className="w-3.5 h-3.5 mr-1" />
              {isUk ? '+ Додати фото' : '+ Add Photo'}
            </Button>
          </div>

          <div className="space-y-2">
            {evidence.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
                {isUk ? 'Фотофіксації робіт ще не завантажено.' : 'No work photos uploaded yet.'}
              </div>
            ) : (
              evidence.map((evi) => (
                <div key={evi.id} className="p-3 rounded-xl border border-border bg-card flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-inner"
                    style={{ backgroundColor: `hsl(${evi.hue}, 60%, 45%)` }}
                  >
                    IMG
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-xs text-foreground block truncate">
                      {evi.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      {formatRelativeTime(evi.createdAt, locale)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 4.5 Bilateral Review & Rating Section (When job is approved or paid out) */}
      {['approved', 'paid_out'].includes(job.status) && (
        <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="font-bold text-base text-foreground">
                {isUk ? 'Двосторонній відгук та рейтинг замовлення' : 'Bilateral Review & Trust Rating'}
              </h3>
            </div>
            <Badge variant="success">
              {isUk ? 'Замовлення завершено' : 'Contract Finalized'}
            </Badge>
          </div>

          {reviewSubmitted || (role === 'customer' ? job.reviewedByCustomer : job.reviewedByWorker) ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                {isUk
                  ? 'Дякуємо! Ваш відгук успішно додано до профілю та враховано в розрахунку Trust Score.'
                  : 'Thank you! Your verified feedback has been published to the profile and factored into the Trust Score.'}
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                {isUk
                  ? 'Оцініть якість співпраці. Відгуки формують об’єктивну репутацію та підвищують Trust Score:'
                  : 'Rate your project collaboration. Bilateral ratings build verifiable market reputation:'}
              </p>

              {/* Star Rating Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground mr-2">
                  {isUk ? 'Оцінка:' : 'Rating:'}
                </span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingScore(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= ratingScore
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-muted-foreground/40'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-2">
                  {ratingScore} / 5.0
                </span>
              </div>

              {/* Review Comment */}
              <div>
                <textarea
                  rows={2}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={
                    isUk
                      ? 'Опишіть враження від роботи (пунктуальність, якість, дотримання домовленостей)...'
                      : 'Share your feedback (punctuality, craftsmanship, adherence to contract)...'
                  }
                  className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <Button
                variant="primary"
                size="sm"
                isLoading={submittingReview}
                onClick={handleSubmitReview}
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                {isUk ? 'Надіслати відгук' : 'Submit Review'}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 5. Tabs: Chat, Documents, Audit Trail */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'chat'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {isUk ? `Чат та зв'язок (${messages.length})` : `Communication (${messages.length})`}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'documents'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {isUk ? `Документи (${documents.length})` : `Documents (${documents.length})`}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'audit'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {isUk ? 'Журнал подій (Аудит)' : 'Audit Trail'}
          </button>
        </div>

        {/* Tab 1: Chat with Contact Masking */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            {/* Gemini AI Contact masking notice */}
            <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400 mt-0.5" />
              <div>
                <span className="font-bold block">
                  {isUk ? 'Захищений чат та фільтр контактів Gemini:' : 'Protected Chat & Gemini Safety Filter:'}
                </span>
                <span>
                  {isUk
                    ? 'Номери телефонів, e-mail та зовнішні посилання маскуються автоматично для захисту угоди ескроу, підписами Дія.Підпис та страхуванням робіт.'
                    : 'Phone numbers, emails, and external payment links are automatically masked to keep your payment protected by WorkHub Escrow, Diia.Signature contracts, and work insurance.'}
                </span>
              </div>
            </div>

            {/* Message Thread */}
            <div className="space-y-3 max-h-72 overflow-y-auto p-2">
              {messages.map((m) => {
                const isMe = m.authorId === currentUser?.id;
                const isSystem = m.kind === 'system';

                if (isSystem) {
                  return (
                    <div key={m.id} className="text-center my-2">
                      <span className="px-3 py-1 rounded-full bg-muted text-[11px] text-muted-foreground font-medium">
                        {m.systemKey ? t(`jobs.stepper.${m.systemKey}`) : isUk ? 'Оновлення системи' : 'System update'}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted text-foreground rounded-bl-none'
                      }`}
                    >
                      {m.text}
                      {m.masked && (
                        <span className="block text-[10px] opacity-75 mt-1 font-mono">
                          {isUk ? '[Контактні дані захищено WorkHub]' : '[Contact information protected by WorkHub]'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-0.5 px-1">
                      {formatRelativeTime(m.createdAt, locale)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={
                  isUk
                    ? 'Введіть повідомлення (контакти й посилання маскуються автоматично)...'
                    : 'Type a message (contact numbers & links are automatically masked)...'
                }
                className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <Button type="submit" variant="primary" size="md" isLoading={sendingMsg}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}

        {/* Tab 2: Legal Documents & Acts */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => handlePreviewDocument('agreement')}
                className="p-4 rounded-2xl border border-border bg-card hover:border-primary transition-all text-left space-y-2"
              >
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <FileText className="w-4 h-4" />
                  <span>{isUk ? 'Договір послуг / підряду' : 'Service Agreement'}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {isUk
                    ? `Двосторонній контракт, сформований за юридичним шаблоном ${pack.code}.`
                    : `Pre-job contract generated from ${pack.code} legal template.`}
                </p>
                <span className="text-xs font-semibold text-primary block">
                  {isUk ? 'Переглянути документ →' : 'Inspect Document →'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handlePreviewDocument('completion_act')}
                className="p-4 rounded-2xl border border-border bg-card hover:border-primary transition-all text-left space-y-2"
              >
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isUk ? 'Акт виконаних робіт' : 'Completion Act'}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {isUk
                    ? 'Офіційний двосторонній акт приймання-передачі для бухгалтерії.'
                    : 'Official bilateral acceptance act for accounting.'}
                </p>
                <span className="text-xs font-semibold text-primary block">
                  {isUk ? 'Переглянути документ →' : 'Inspect Document →'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handlePreviewDocument('invoice')}
                className="p-4 rounded-2xl border border-border bg-card hover:border-primary transition-all text-left space-y-2"
              >
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                  <DollarSign className="w-4 h-4" />
                  <span>{isUk ? 'Рахунок / Чек' : 'Invoice / Receipt'}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {isUk
                    ? 'Фіскальна квитанція та розрахунковий документ виплати.'
                    : 'Withholding receipt & contractor payout documentation.'}
                </p>
                <span className="text-xs font-semibold text-primary block">
                  {isUk ? 'Переглянути документ →' : 'Inspect Document →'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Audit Trail */}
        {activeTab === 'audit' && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              {isUk ? 'Незмінні системні події (Ledger):' : 'Immutable System Events:'}
            </span>
            {audit.length === 0 ? (
              <div className="text-xs text-muted-foreground p-4">
                {isUk ? 'Подій аудиту ще немає.' : 'No audit events logged yet.'}
              </div>
            ) : (
              audit.map((aud) => (
                <div key={aud.id} className="p-2.5 rounded-lg border border-border bg-muted/20 text-xs flex justify-between">
                  <span className="font-semibold text-foreground">{aud.action}</span>
                  <span className="text-muted-foreground">{formatDate(aud.createdAt, 'PP p', locale)}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal: Document Preview */}
      <Modal
        open={previewDoc != null}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc?.title || (isUk ? 'Перегляд документа' : 'Document Preview')}
        maxWidth="2xl"
      >
        {previewDoc && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-950/60 font-mono text-xs whitespace-pre-line leading-relaxed max-h-96 overflow-y-auto">
              {previewDoc.body}
            </div>

            {/* Diia.Signature Stamp */}
            <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-800 dark:text-teal-200">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="font-semibold">
                  {pack.code === 'UA' ? 'Дія.Підпис (Diia.Signature) Верифіковано' : `${pack.identity.providerName} Verified`}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">QES • Sovereign Ledger Timestamped</span>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  alert(isUk ? `Згенеровано перевірений PDF: ${previewDoc.number}.pdf` : `Simulated PDF generated: ${previewDoc.number}.pdf`);
                }}
              >
                {isUk ? 'Завантажити завірений PDF' : 'Download Verified PDF'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Open Dispute */}
      <Modal
        open={disputeModalOpen}
        onClose={() => setDisputeModalOpen(false)}
        title={isUk ? 'Відкрити арбітражний спір' : 'Open Formal Arbitration Dispute'}
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              {isUk ? 'Причина спору:' : 'Dispute Reason:'}
            </label>
            <select
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            >
              <option value="quality">{isUk ? 'Неякісно виконана робота / дефекти' : 'Quality issue / defects'}</option>
              <option value="late">{isUk ? 'Неприпустима затримка строків' : 'Unacceptable delay'}</option>
              <option value="not_completed">{isUk ? 'Роботу покинуто / не завершено' : 'Abandoned / uncompleted work'}</option>
              <option value="scope">{isUk ? 'Невідповідність погодженому обсягу' : 'Scope disagreement'}</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              {isUk ? 'Бажане рішення:' : 'Desired Outcome:'}
            </label>
            <select
              value={disputeOutcome}
              onChange={(e) => setDisputeOutcome(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            >
              <option value="rework">{isUk ? 'Доопрацювання виконавцем' : 'Contractor rework'}</option>
              <option value="partial_refund">{isUk ? 'Часткове повернення коштів' : 'Partial refund'}</option>
              <option value="full_refund">{isUk ? 'Повне повернення коштів' : 'Full refund'}</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              {isUk ? 'Детальний опис та аргументи:' : 'Detailed Description & Evidence:'}
            </label>
            <textarea
              rows={3}
              value={disputeDesc}
              onChange={(e) => setDisputeDesc(e.target.value)}
              placeholder={isUk ? 'Опишіть виявлені дефекти або обставини...' : 'Describe the defect or discrepancy...'}
              className="w-full bg-background border border-border rounded-xl p-3 text-xs"
            />
          </div>

          <Button variant="danger" className="w-full" onClick={handleOpenDispute}>
            {isUk ? 'Надіслати спір до арбітражу платформи' : 'Submit Dispute to Platform Arbitration'}
          </Button>
        </div>
      </Modal>

      {/* Modal: Add Evidence Photo */}
      <Modal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title={isUk ? 'Завантажити фотофіксацію виконаних робіт' : 'Upload Work Photo Evidence'}
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              {isUk ? 'Опис фото / позначка етапу:' : 'Photo Description / Deliverable Tag:'}
            </label>
            <input
              type="text"
              value={evidenceLabel}
              onChange={(e) => setEvidenceLabel(e.target.value)}
              placeholder={isUk ? 'Наприклад: Завершено ґрунтування та фарбування першим шаром' : 'E.g. Completed drywall joint or paint second coat'}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <Button variant="primary" className="w-full" onClick={handleUploadEvidence}>
            {isUk ? 'Завантажити тестове фото' : 'Upload Simulated Photo'}
          </Button>
        </div>
      </Modal>

      {/* Modal: Propose Price Change */}
      <Modal
        open={proposePriceModalOpen}
        onClose={() => setProposePriceModalOpen(false)}
        title={isUk ? 'Запропонувати зміну вартості контракту' : 'Propose Contract Amount Change'}
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              {isUk ? `Нова запропонована сума (${pack.currency.symbol}):` : `New Proposed Amount (${pack.currency.symbol}):`}
            </label>
            <input
              type="number"
              value={newProposedPrice}
              onChange={(e) => setNewProposedPrice(Number(e.target.value))}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm font-bold"
            />
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={async () => {
              if (!currentUser) return;
              await getServices().jobs.proposeAmount(job.id, currentUser.id, newProposedPrice);
              setProposePriceModalOpen(false);
              await loadRoom();
            }}
          >
            {isUk ? 'Надіслати пропозицію іншій стороні' : 'Submit Amount Change Proposal'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
