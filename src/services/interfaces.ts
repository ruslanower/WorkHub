/**
 * SERVICE INTERFACES - the boundary between UI and backend.
 *
 * The UI only talks to these interfaces through the registry
 * (src/services/registry.ts). The prototype ships mock implementations in
 * src/services/mock. To connect a real backend, implement these interfaces
 * with HTTP clients and swap them in the registry - no UI changes needed.
 *
 * Conventions:
 * - All methods are async and may reject with ServiceError (src/services/errors.ts).
 * - `countryCode` scopes every query to one Country Pack.
 * - Money is in major units of the pack currency.
 */
import type { FeeBreakdown } from '@/lib/fees';
import type { DocumentKind, Locale } from '@/countries/types';
import type {
  AdminQueues,
  AuditEvent,
  BudgetType,
  CitySupplyDemand,
  Cohort,
  Company,
  CompanyMemberRole,
  Dispute,
  DisputeDecisionOutcome,
  DisputeOutcomeWanted,
  DisputeReason,
  Evidence,
  FunnelStep,
  ID,
  ISODate,
  ImpactRow,
  Job,
  JobDocument,
  JobRoom,
  JobStatus,
  Kpis,
  MilestonePlanItem,
  Offer,
  RecurrenceFrequency,
  RenderedDocument,
  RevenueBreakdown,
  Review,
  SeriesPoint,
  Task,
  TaskStatus,
  TaskWithMeta,
  User,
  AccountType,
  VerificationLevel,
  WalletSummary,
  WalletTransaction,
  KycCase,
  LocalizedTextInput,
  AITaskParseResult,
  AIFraudResult,
  AIMatchScoreResult,
  GoogleCloudCreditAllocation,
  BeneficiaryImpactMetrics,
} from './types';

/* ------------------------------ Users ------------------------------ */

export interface UserService {
  get(id: ID): Promise<User>;
  getMany(ids: ID[]): Promise<User[]>;
  list(filter: { countryCode: string; accountType?: AccountType; query?: string }): Promise<User[]>;
  toggleSavedWorker(customerId: ID, workerId: ID): Promise<User>;
  updateProfile(id: ID, patch: Partial<Pick<User, 'taxStatusId' | 'availability' | 'skills' | 'hasPhoto'>>): Promise<User>;
  setPro(id: ID, pro: boolean): Promise<User>;
}

/* ------------------------------ Tasks ------------------------------ */

export type TaskSort = 'newest' | 'budget_desc' | 'budget_asc' | 'date' | 'distance';

export interface TaskFilter {
  countryCode: string;
  categoryIds?: string[];
  /** Origin for distance filtering/sorting (city id of the viewer). */
  originCityId?: string;
  maxDistanceKm?: number;
  budgetMin?: number;
  budgetMax?: number;
  dateFrom?: ISODate;
  dateTo?: ISODate;
  /** Show only tasks whose required level is <= this value. */
  maxRequiredLevel?: VerificationLevel;
  /** Only tasks from customers verified at least at this level. */
  minCustomerLevel?: VerificationLevel;
  openToPriorityPrograms?: boolean;
  statuses?: TaskStatus[];
  customerId?: ID;
  companyId?: ID;
  query?: string;
  sort?: TaskSort;
}

export interface NewTaskInput {
  countryCode: string;
  customerId: ID;
  companyId?: ID;
  categoryId: string;
  templateId?: string;
  title: LocalizedTextInput;
  description: LocalizedTextInput;
  cityId: string;
  district: string;
  budget: number;
  budgetType: BudgetType;
  milestonePlan: MilestonePlanItem[];
  date: ISODate;
  durationHours: number;
  minVerificationLevel: VerificationLevel;
  openToPriorityPrograms: boolean;
  preferPriority: boolean;
  photos: number;
  recurrence?: { frequency: RecurrenceFrequency; weekday: number };
  /** Save as draft instead of publishing. */
  draft?: boolean;
}

export interface TaskService {
  list(filter: TaskFilter): Promise<TaskWithMeta[]>;
  get(id: ID): Promise<TaskWithMeta>;
  /** Publishes (or saves as draft). Company tasks above the approval threshold become "pending_approval". */
  create(input: NewTaskInput): Promise<Task>;
  update(id: ID, patch: Partial<Pick<Task, 'status' | 'recurrence' | 'budget' | 'flagged'>>): Promise<Task>;
  /** Illustrative price guidance for a category from the pack + recent tasks. */
  priceGuidance(countryCode: string, categoryId: string): Promise<{ min: number; max: number; median: number }>;
}

/* ------------------------------ Offers ------------------------------ */

export type EligibilityResult = { ok: true } | { ok: false; reason: 'level_too_low' | 'permit_required' | 'job_cap' | 'already_offered' | 'own_task' | 'task_closed' };

export interface NewOfferInput {
  taskId: ID;
  workerId: ID;
  price: number;
  etaDays: number;
  message: string;
  availableFrom: ISODate;
}

export interface OfferService {
  listForTask(taskId: ID): Promise<Offer[]>;
  listForWorker(workerId: ID): Promise<Offer[]>;
  /** Rules: L1+ to offer; regulated categories need L3 for that trade; new accounts capped at pack.newAccountJobCap. */
  checkEligibility(workerId: ID, taskId: ID): Promise<EligibilityResult>;
  create(input: NewOfferInput): Promise<Offer>;
  withdraw(offerId: ID): Promise<Offer>;
  decline(offerId: ID): Promise<Offer>;
}

/* ------------------------------ Jobs ------------------------------ */

export interface JobFilter {
  countryCode: string;
  customerId?: ID;
  workerId?: ID;
  companyId?: ID;
  statuses?: JobStatus[];
  includeArchived?: boolean;
}

export interface JobService {
  list(filter: JobFilter): Promise<Job[]>;
  get(id: ID): Promise<Job>;
  /** Full job room payload (job, task, parties, chat, evidence, documents, audit, dispute). */
  getRoom(id: ID): Promise<JobRoom>;
  /** Customer accepts an offer -> job in "offer_accepted", other offers declined. */
  hire(offerId: ID, actorId: ID): Promise<Job>;
  /** E-sign the agreement (mock). Required before funding. */
  signAgreement(jobId: ID, actorId: ID): Promise<Job>;
  start(jobId: ID, actorId: ID): Promise<Job>;
  checkIn(jobId: ID, actorId: ID): Promise<Job>;
  checkOut(jobId: ID, actorId: ID): Promise<Job>;
  deliverMilestone(jobId: ID, milestoneId: ID, actorId: ID): Promise<Job>;
  /** Worker marks the whole job as delivered; starts the auto-release countdown. */
  deliver(jobId: ID, actorId: ID): Promise<Job>;
  requestChanges(jobId: ID, actorId: ID, note: string): Promise<Job>;
  /** Customer approves; remaining protected funds are released (payout follows via PaymentService.payout). */
  approve(jobId: ID, actorId: ID): Promise<Job>;
  proposeAmount(jobId: ID, actorId: ID, amount: number): Promise<Job>;
  respondToAmount(jobId: ID, actorId: ID, accept: boolean): Promise<Job>;
  sendMessage(jobId: ID, authorId: ID, text: string): Promise<{ masked: boolean }>;
  addEvidence(jobId: ID, actorId: ID, label: string, milestoneId?: ID): Promise<Evidence>;
  /** Returns a shareable (mock) status text for on-site safety. */
  shareStatus(jobId: ID): Promise<string>;
  /** Demo control: move the job to its next state using the proper actions. */
  advance(jobId: ID): Promise<Job>;
}

/* ------------------------------ Payments ------------------------------ */

export interface PaymentService {
  quote(countryCode: string, amount: number): FeeBreakdown;
  /** Customer funds the protected payment (test mode). Requires a signed agreement. */
  fund(jobId: ID, actorId: ID): Promise<Job>;
  /** Release one milestone to the worker (partially_released / released). */
  releaseMilestone(jobId: ID, milestoneId: ID, actorId: ID): Promise<Job>;
  /** Pays released funds out to the worker wallet; creates the invoice/receipt. */
  payout(jobId: ID): Promise<Job>;
  /** Releases jobs whose auto-release date has passed (not disputed). Returns affected job ids. */
  runAutoRelease(countryCode: string, now?: Date): Promise<ID[]>;
}

/* ------------------------------ Identity ------------------------------ */

export type KycSimulation = 'auto' | 'success' | 'failure';

export interface VerificationResult {
  ok: boolean;
  level: VerificationLevel;
  /** i18n key under "errors." when failed */
  reason?: 'document_unreadable' | 'selfie_mismatch' | 'provider_declined' | 'permit_invalid';
  /** L3 goes to manual review */
  pendingReview?: boolean;
}

export interface IdentityService {
  /** Runs the mock verification for a level. L3 requires a regulated trade category. */
  verify(userId: ID, level: VerificationLevel, opts?: { tradeCategoryId?: string }): Promise<VerificationResult>;
  requestProgram(userId: ID, programId: string, showBadge: boolean): Promise<User>;
  setProgramBadge(userId: ID, programId: string, showBadge: boolean): Promise<User>;
  leaveProgram(userId: ID, programId: string): Promise<User>;
  /** Demo control to force the next KYC outcomes. */
  setSimulation(mode: KycSimulation): void;
  getSimulation(): KycSimulation;
}

/* ------------------------------ Documents ------------------------------ */

export interface DocumentService {
  list(jobId: ID): Promise<JobDocument[]>;
  render(docId: ID, locale: Locale): Promise<RenderedDocument>;
  /** Preview a document that does not exist yet (e.g. agreement before signing). */
  preview(jobId: ID, kind: DocumentKind, locale: Locale): Promise<RenderedDocument>;
  /** Simulated PDF download - returns a file name; nothing is generated. */
  download(docId: ID): Promise<{ fileName: string }>;
}

/* ------------------------------ Disputes ------------------------------ */

export interface NewDisputeInput {
  jobId: ID;
  openedBy: ID;
  reason: DisputeReason;
  description: string;
  desiredOutcome: DisputeOutcomeWanted;
  evidenceLabels: string[];
}

export interface DisputeService {
  list(filter: { countryCode: string; userId?: ID; openOnly?: boolean }): Promise<Dispute[]>;
  get(id: ID): Promise<Dispute>;
  open(input: NewDisputeInput): Promise<Dispute>;
  addNote(disputeId: ID, authorId: ID, text: string): Promise<Dispute>;
  addEvidence(disputeId: ID, actorId: ID, label: string): Promise<Dispute>;
  advanceStage(disputeId: ID): Promise<Dispute>;
  /** Admin decision. workerShare 0..1 is used for partial_release. */
  decide(disputeId: ID, adminId: ID, outcome: DisputeDecisionOutcome, workerShare: number, note: string): Promise<Dispute>;
}

/* ------------------------------ Reviews ------------------------------ */

export interface NewReviewInput {
  jobId: ID;
  fromId: ID;
  criteria: Record<string, number>;
  text: string;
}

export interface ReviewService {
  listForUser(userId: ID): Promise<Review[]>;
  listForJob(jobId: ID): Promise<Review[]>;
  /** Two-way, only after payout. Updates rating and Trust Score inputs. */
  create(input: NewReviewInput): Promise<Review>;
  /** Paid-out jobs the user still has to review. */
  pendingFor(userId: ID): Promise<Job[]>;
}

/* ------------------------------ Wallet ------------------------------ */

export interface WalletService {
  getSummary(userId: ID): Promise<WalletSummary>;
  listTransactions(userId: ID): Promise<WalletTransaction[]>;
  /** Only the pack's payout methods are allowed. */
  withdraw(userId: ID, amount: number, methodId: string): Promise<WalletTransaction>;
  exportStatement(userId: ID, period: 'month' | 'quarter' | 'year'): Promise<{ fileName: string }>;
}

/* ------------------------------ Companies ------------------------------ */

export interface CompanyService {
  get(id: ID): Promise<Company>;
  list(countryCode: string): Promise<Company[]>;
  updateSettings(id: ID, patch: Partial<Pick<Company, 'monthlyBudget' | 'approvalThreshold'>>): Promise<Company>;
  inviteMember(id: ID, name: string, role: CompanyMemberRole): Promise<Company>;
  setMemberRole(id: ID, userId: ID, role: CompanyMemberRole): Promise<Company>;
  /** Approve a task in "pending_approval" (amount above threshold). */
  approveTask(companyId: ID, taskId: ID, actorId: ID): Promise<Task>;
  setRecurrence(taskId: ID, recurrence: { frequency: RecurrenceFrequency; weekday: number; active: boolean } | null): Promise<Task>;
  exportMonthlyStatement(id: ID): Promise<{ fileName: string }>;
}

/* ------------------------------ Admin ------------------------------ */

export interface AdminService {
  getQueues(countryCode: string): Promise<AdminQueues>;
  reviewKyc(caseId: ID, adminId: ID, approve: boolean): Promise<KycCase>;
  resolveFlag(flagId: ID, adminId: ID, action: 'resolve' | 'dismiss'): Promise<void>;
  resolvePayoutException(id: ID, adminId: ID, action: 'retry' | 'cancel'): Promise<void>;
  getAuditLog(countryCode: string, limit?: number): Promise<AuditEvent[]>;
  /** Records a Country Pack change made in the live editor. */
  logPackChange(countryCode: string, adminId: ID, field: string): Promise<void>;
}

/* ------------------------------ Analytics ------------------------------ */

export interface AnalyticsService {
  getKpis(countryCode: string): Promise<Kpis>;
  /** Weekly GMV for the last 12 weeks; the latest week includes live demo payouts. */
  getGmvSeries(countryCode: string): Promise<SeriesPoint[]>;
  getSupplyDemand(countryCode: string): Promise<CitySupplyDemand[]>;
  getFunnel(countryCode: string): Promise<FunnelStep[]>;
  getCohorts(countryCode: string): Promise<Cohort[]>;
  getRevenueBreakdown(countryCode: string): Promise<RevenueBreakdown>;
  getImpact(countryCode: string): Promise<ImpactRow[]>;
  getWorkerEarnings(workerId: ID, period: 'week' | 'month' | 'year'): Promise<SeriesPoint[]>;
  getCustomerSpend(customerId: ID): Promise<SeriesPoint[]>;
  /** Simulated CSV export. */
  exportImpactReport(countryCode: string): Promise<{ fileName: string }>;
}

/* ------------------------------ Google AI & Vertex AI ------------------------------ */

export interface AIService {
  parseTaskPrompt(prompt: string, countryCode?: string): Promise<AITaskParseResult>;
  detectChatFraud(message: string): Promise<AIFraudResult>;
  calculateMatchScore(taskId: ID, workerId: ID): Promise<AIMatchScoreResult>;
  getCloudCreditPlan(): GoogleCloudCreditAllocation[];
}

/* ------------------------------ Google Maps Platform ------------------------------ */

export interface MapsService {
  calculateRoute(
    originCityId: string,
    destDistrict: string,
  ): Promise<{
    distanceKm: number;
    etaMinutes: number;
    polyline: string;
    routeDescription: string;
  }>;
  getCoordinates(cityId: string, district?: string): { lat: number; lng: number };
}

/* ------------------------------ Impact & Social Resilience ------------------------------ */

export interface ImpactService {
  getBeneficiaryMetrics(countryCode: string): Promise<BeneficiaryImpactMetrics>;
}

/** All services the app depends on. */
export interface Services {
  users: UserService;
  tasks: TaskService;
  offers: OfferService;
  jobs: JobService;
  payments: PaymentService;
  identity: IdentityService;
  documents: DocumentService;
  disputes: DisputeService;
  reviews: ReviewService;
  wallet: WalletService;
  companies: CompanyService;
  admin: AdminService;
  analytics: AnalyticsService;
  ai: AIService;
  maps: MapsService;
  impact: ImpactService;
}
