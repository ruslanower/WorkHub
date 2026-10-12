/**
 * Domain entities shared by services, mock data and UI.
 * These mirror docs/DATA_MODEL.md and are what a real backend must return.
 * Money is always in MAJOR units of the country's currency (e.g. 1500.50 UAH).
 * Dates are ISO-8601 strings.
 */
import type { DocumentKind, LocalizedText } from '@/countries/types';

export type ID = string;
export type ISODate = string;
export type LocalizedTextInput = string | LocalizedText;


/** Presenter-selectable demo role. "investor" has no account. */
export type Role = 'customer' | 'worker' | 'company' | 'admin' | 'partner' | 'investor';
export type AccountType = 'customer' | 'worker' | 'company_member' | 'admin' | 'partner';
export type VerificationLevel = 0 | 1 | 2 | 3;

export interface ProgramMembership {
  programId: string;
  status: 'pending' | 'verified' | 'rejected';
  /** Badge is shown publicly ONLY when the worker consents. */
  showBadge: boolean;
}

export interface Certificate {
  id: ID;
  title: LocalizedText;
  issuer: LocalizedText;
  year: number;
}

export interface User {
  id: ID;
  countryCode: string;
  accountType: AccountType;
  name: LocalizedText;
  initials: string;
  cityId: string;
  district: string;
  verificationLevel: VerificationLevel;
  /** Category ids of regulated trades confirmed at L3. */
  verifiedTrades: string[];
  programs: ProgramMembership[];
  /** Average rating 1-5, null when no reviews yet. */
  rating: number | null;
  reviewsCount: number;
  completedJobs: number;
  /** completed / accepted, 0..1 */
  completionRate: number;
  /** Median first-response time in minutes. */
  responseMinutes: number;
  disputesLost: number;
  joinedAt: ISODate;
  taxStatusId?: string;
  /** Worker-only profile fields */
  headline?: LocalizedText;
  bio?: LocalizedText;
  skills?: string[];
  certificates?: Certificate[];
  galleryCount?: number;
  /** Weekdays available (0 = Monday ... 6 = Sunday). */
  availability?: number[];
  pro?: boolean;
  /** Customer-only */
  savedWorkerIds?: ID[];
  companyId?: ID;
  /** Free-text profile completeness inputs */
  hasPhoto?: boolean;
}

export type CompanyMemberRole = 'owner' | 'manager' | 'member' | 'accountant';

export interface CompanyMember {
  userId: ID;
  role: CompanyMemberRole;
}

export interface Company {
  id: ID;
  countryCode: string;
  name: LocalizedText;
  cityId: string;
  members: CompanyMember[];
  /** Monthly budget limit, major units. */
  monthlyBudget: number;
  /** Tasks above this amount require approval by an owner/manager. */
  approvalThreshold: number;
  spentThisMonth: number;
}

export type TaskStatus = 'draft' | 'pending_approval' | 'open' | 'hired' | 'in_progress' | 'delivered' | 'completed' | 'cancelled';
export type BudgetType = 'fixed' | 'milestones';
export type RecurrenceFrequency = 'weekly' | 'biweekly' | 'monthly';

export interface MilestonePlanItem {
  title: LocalizedText;
  /** Relative share; amounts are computed with splitIntoMilestones(). */
  share: number;
}

export interface Task {
  id: ID;
  countryCode: string;
  customerId: ID;
  companyId?: ID;
  categoryId: string;
  templateId?: string;
  title: LocalizedText;
  description: LocalizedText;
  cityId: string;
  district: string;
  /** Position on the MapStub (0-100). Approximate - never the exact address. */
  x: number;
  y: number;
  budget: number;
  budgetType: BudgetType;
  milestonePlan: MilestonePlanItem[];
  /** Planned start date. */
  date: ISODate;
  durationHours: number;
  minVerificationLevel: VerificationLevel;
  openToPriorityPrograms: boolean;
  /** Soft ranking boost for priority-program workers. Never excludes anyone. */
  preferPriority: boolean;
  status: TaskStatus;
  createdAt: ISODate;
  photos: number;
  recurrence?: { frequency: RecurrenceFrequency; weekday: number; active: boolean };
  flagged?: boolean;
  isFlagship?: boolean;
}

export interface TaskWithMeta extends Task {
  distanceKm?: number;
  offersCount?: number;
  customerRating?: number;
}

export type OfferStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn';

export interface Offer {
  id: ID;
  taskId: ID;
  workerId: ID;
  price: number;
  etaDays: number;
  message: string;
  availableFrom: ISODate;
  status: OfferStatus;
  createdAt: ISODate;
}

/** Stepper order: Posted -> Offer accepted -> Funded -> In progress -> Delivered -> Approved -> Paid out */
export const JOB_STATUSES = ['offer_accepted', 'funded', 'in_progress', 'delivered', 'approved', 'paid_out', 'cancelled'] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];
export type PaymentState = 'unfunded' | 'funded' | 'partially_released' | 'released' | 'refunded' | 'disputed';
export type MilestoneStatus = 'pending' | 'in_progress' | 'delivered' | 'released' | 'refunded';

export interface Milestone {
  id: ID;
  title: LocalizedText;
  amount: number;
  status: MilestoneStatus;
  releasedAt?: ISODate;
}

export interface AmountChangeProposal {
  amount: number;
  proposedBy: ID;
  createdAt: ISODate;
}

export interface Job {
  id: ID;
  countryCode: string;
  taskId: ID;
  offerId: ID;
  customerId: ID;
  workerId: ID;
  companyId?: ID;
  /** Agreed job amount (what milestones sum to). */
  amount: number;
  status: JobStatus;
  paymentState: PaymentState;
  milestones: Milestone[];
  createdAt: ISODate;
  agreementSignedAt?: ISODate;
  fundedAt?: ISODate;
  startedAt?: ISODate;
  deliveredAt?: ISODate;
  approvedAt?: ISODate;
  paidOutAt?: ISODate;
  /** Set on delivery: now + pack.autoReleaseDays. */
  autoReleaseAt?: ISODate;
  checkInAt?: ISODate;
  checkOutAt?: ISODate;
  disputeId?: ID;
  pendingAmountChange?: AmountChangeProposal;
  changeRequests: number;
  reviewedByCustomer: boolean;
  reviewedByWorker: boolean;
  /** Archived historical jobs feed analytics and reviews but are hidden from active lists. */
  archived?: boolean;
  isFlagship?: boolean;
}

export interface Message {
  id: ID;
  jobId: ID;
  /** null for system messages */
  authorId: ID | null;
  kind: 'user' | 'system';
  /** User text (already masked). Empty for system messages. */
  text: string;
  /** i18n key in the "common" namespace under "sys." for system messages. */
  systemKey?: string;
  systemParams?: Record<string, string | number>;
  masked: boolean;
  createdAt: ISODate;
}

export interface Evidence {
  id: ID;
  jobId: ID;
  uploadedBy: ID;
  label: string;
  /** Placeholder colour hue for the mock image. */
  hue: number;
  milestoneId?: ID;
  createdAt: ISODate;
}

export interface AuditEvent {
  id: ID;
  countryCode: string;
  entityType: 'job' | 'task' | 'dispute' | 'user' | 'pack' | 'payout' | 'kyc' | 'flag';
  entityId: ID;
  actorId: ID | null;
  /** i18n key in the "common" namespace under "audit." */
  action: string;
  params?: Record<string, string | number>;
  createdAt: ISODate;
}

export interface JobDocument {
  id: ID;
  jobId: ID;
  kind: DocumentKind;
  number: string;
  createdAt: ISODate;
}

export interface RenderedDocument {
  id: ID | null;
  kind: DocumentKind;
  title: string;
  number: string;
  body: string;
  createdAt: ISODate;
}

export interface JobRoom {
  job: Job;
  task: Task;
  offer: Offer;
  customer: User;
  worker: User;
  messages: Message[];
  evidence: Evidence[];
  documents: JobDocument[];
  audit: AuditEvent[];
  dispute?: Dispute;
}

export type DisputeReason = 'quality' | 'not_completed' | 'late' | 'damage' | 'scope' | 'other';
export type DisputeOutcomeWanted = 'rework' | 'partial_refund' | 'full_refund' | 'release';
export type DisputeStage = 'opened' | 'evidence' | 'mediation' | 'decision';
export const DISPUTE_STAGES: DisputeStage[] = ['opened', 'evidence', 'mediation', 'decision'];
export type DisputeDecisionOutcome = 'full_release' | 'partial_release' | 'refund';

export interface DisputeNote {
  id: ID;
  authorId: ID | null;
  text: string;
  createdAt: ISODate;
}

export interface Dispute {
  id: ID;
  jobId: ID;
  countryCode: string;
  openedBy: ID;
  reason: DisputeReason;
  description: string;
  desiredOutcome: DisputeOutcomeWanted;
  evidence: Evidence[];
  notes: DisputeNote[];
  stage: DisputeStage;
  /** Deadline for the current stage (SLA). */
  slaDueAt: ISODate;
  createdAt: ISODate;
  decision?: {
    outcome: DisputeDecisionOutcome;
    workerAmount: number;
    customerAmount: number;
    note: string;
    decidedAt: ISODate;
    decidedBy: ID;
  };
}

export type ReviewDirection = 'customer_to_worker' | 'worker_to_customer';
export const WORKER_REVIEW_CRITERIA = ['quality', 'punctuality', 'communication', 'value'] as const;
export const CUSTOMER_REVIEW_CRITERIA = ['clarity', 'communication', 'fairness', 'site_access'] as const;

export interface Review {
  id: ID;
  jobId: ID;
  countryCode: string;
  fromId: ID;
  toId: ID;
  direction: ReviewDirection;
  criteria: Record<string, number>;
  overall: number;
  text: string;
  createdAt: ISODate;
}

export type WalletTxType = 'earning' | 'withdrawal' | 'payment' | 'refund' | 'fee' | 'subscription';
export type WalletTxStatus = 'pending' | 'completed' | 'failed' | 'held';

export interface WalletTransaction {
  id: ID;
  userId: ID;
  countryCode: string;
  type: WalletTxType;
  direction: 'in' | 'out';
  amount: number;
  fee: number;
  status: WalletTxStatus;
  methodId?: string;
  jobId?: ID;
  createdAt: ISODate;
}

export interface WalletSummary {
  /** Can be withdrawn now. */
  available: number;
  /** Held as protected payments on active jobs (worker: incoming; customer: outgoing). */
  held: number;
  /** Withdrawals not yet completed. */
  pendingPayouts: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
}

export interface KycCase {
  id: ID;
  countryCode: string;
  userId: ID;
  level: VerificationLevel;
  tradeCategoryId?: string;
  status: 'pending' | 'approved' | 'rejected';
  riskFlags: string[];
  submittedAt: ISODate;
}

export type FlagReason = 'velocity' | 'contact_sharing' | 'suspicious_price' | 'new_account_cap' | 'reported';

export interface Flag {
  id: ID;
  countryCode: string;
  entityType: 'task' | 'message' | 'user';
  entityId: ID;
  reason: FlagReason;
  snippet?: string;
  status: 'open' | 'resolved' | 'dismissed';
  createdAt: ISODate;
}

export interface PayoutException {
  id: ID;
  countryCode: string;
  userId: ID;
  txId: ID;
  amount: number;
  reason: 'name_mismatch' | 'limit_exceeded' | 'method_failed';
  status: 'open' | 'retried' | 'cancelled';
  createdAt: ISODate;
}

export interface AdminQueues {
  kyc: KycCase[];
  disputes: Dispute[];
  flags: Flag[];
  payoutExceptions: PayoutException[];
}

/* -------------------- Analytics -------------------- */

export interface Kpis {
  gmv: number;
  gmvPrevPeriod: number;
  takeRate: number;
  completedJobsPerWeek: number;
  hoursToFirstOffer: number;
  repeatRate: number;
  disputeRate: number;
  leakageEstimate: number;
  avgWorkerEarnings: number;
  nps: number;
  cac: number;
  paybackMonths: number;
  priorityShare: number;
  activeWorkers: number;
  activeCustomers: number;
}

export interface SeriesPoint {
  label: string;
  value: number;
  /** Optional second series value */
  value2?: number;
}

export interface CitySupplyDemand {
  cityId: string;
  workers: number;
  openTasks: number;
}

export interface FunnelStep {
  key: 'visits' | 'posted' | 'offers' | 'hired' | 'paid';
  value: number;
}

export interface Cohort {
  label: string;
  /** Retention by month index (0 = 100%). */
  retention: number[];
}

export interface RevenueBreakdown {
  customerFees: number;
  workerFees: number;
  subscriptions: number;
  paidFeatures: number;
  impactContracts: number;
}

export interface ImpactRow {
  programId: string;
  participants: number;
  jobs: number;
  earnings: number;
  retention: number;
}

/* -------------------- Google Cloud & AI Showcase Types -------------------- */

export interface AISafetyChecklistItem {
  id: string;
  label: LocalizedText;
  required: boolean;
}

export interface AITaskParseResult {
  categoryId: string;
  title: LocalizedText;
  description: LocalizedText;
  safetyChecklist: AISafetyChecklistItem[];
  recommendedVerificationLevel: VerificationLevel;
  verificationReasoning: LocalizedText;
  durationHours: number;
  priceGuidance: {
    min: number;
    max: number;
    median: number;
    confidencePct: number;
  };
  milestonePlan: MilestonePlanItem[];
  tokensUsed: number;
  latencyMs: number;
  model: string;
}

export interface AIFraudResult {
  safe: boolean;
  riskScore: number;
  detectedEntities: string[];
  recommendation: LocalizedText;
  maskedText: string;
  flaggedReason?: string;
}

export interface AIMatchScoreResult {
  workerId: ID;
  totalScore: number;
  breakdown: {
    spatial: number;
    trust: number;
    skills: number;
    socialBoost: number;
  };
  distanceKm: number;
  etaMinutes: number;
  explanation: LocalizedText;
  isPriorityBeneficiary: boolean;
  beneficiaryType?: 'veteran' | 'idp' | 'none';
}

export interface GoogleCloudCreditAllocation {
  id: string;
  pillar: string;
  googleService: string;
  allocatedAmount: number;
  percentage: number;
  description: LocalizedText;
  architectureRole: LocalizedText;
}

export interface BeneficiaryImpactMetrics {
  totalEarningsGenerated: number;
  jobsCompletedBeneficiaries: number;
  activeGcpAiModels: number;
  verifiedVeteransCount: number;
  verifiedIdpsCount: number;
  averageHourlyRate: number;
  escrowSuccessRatePct: number;
  fraudPreventionRatePct: number;
}
