import type { PaymentService } from '../interfaces';
import type { Job, ID } from '../types';
import { mockStore } from '@/mock/store';
import { ServiceError } from '../errors';
import { computeFees, type FeeBreakdown } from '@/lib/fees';
import { COUNTRY_PACKS } from '@/countries';

export class MockPaymentService implements PaymentService {
  quote(countryCode: string, amount: number): FeeBreakdown {
    const pack = COUNTRY_PACKS[countryCode] || COUNTRY_PACKS.UA;
    return computeFees(amount, pack);
  }

  async fund(jobId: ID, actorId: ID): Promise<Job> {
    await mockStore.simulateLatency();
    let updated: Job | null = null;
    mockStore.commit((d) => {
      const j = d.jobs.find((x) => x.id === jobId);
      if (!j) return;
      if (!j.agreementSignedAt) throw new ServiceError('agreement_required');

      j.status = 'funded';
      j.paymentState = 'funded';
      j.fundedAt = new Date().toISOString();

      // Record wallet transaction for customer
      const pack = COUNTRY_PACKS[j.countryCode];
      const breakdown = computeFees(j.amount, pack);
      d.walletTransactions.push({
        id: `tx-fund-${Date.now().toString(36)}`,
        userId: j.customerId,
        countryCode: j.countryCode,
        type: 'payment',
        direction: 'out',
        amount: breakdown.customerPays,
        fee: breakdown.customerFee,
        status: 'completed',
        jobId: j.id,
        createdAt: new Date().toISOString(),
      });

      updated = { ...j };
    });
    if (!updated) throw new ServiceError('not_found', 'Job not found');
    return updated;
  }

  async releaseMilestone(jobId: ID, milestoneId: ID, actorId: ID): Promise<Job> {
    await mockStore.simulateLatency();
    let updated: Job | null = null;
    mockStore.commit((d) => {
      const j = d.jobs.find((x) => x.id === jobId);
      if (!j) return;
      const ms = j.milestones.find((m) => m.id === milestoneId);
      if (!ms) return;

      ms.status = 'released';
      ms.releasedAt = new Date().toISOString();

      const allReleased = j.milestones.every((m) => m.status === 'released');
      j.paymentState = allReleased ? 'released' : 'partially_released';
      updated = { ...j };
    });
    if (!updated) throw new ServiceError('not_found', 'Job or milestone not found');
    return updated;
  }

  async payout(jobId: ID): Promise<Job> {
    await mockStore.simulateLatency();
    let updated: Job | null = null;
    mockStore.commit((d) => {
      const j = d.jobs.find((x) => x.id === jobId);
      if (!j) return;

      j.status = 'paid_out';
      j.paidOutAt = new Date().toISOString();

      const pack = COUNTRY_PACKS[j.countryCode];
      const breakdown = computeFees(j.amount, pack);

      // Add earning transaction to worker wallet
      d.walletTransactions.push({
        id: `tx-earn-${Date.now().toString(36)}`,
        userId: j.workerId,
        countryCode: j.countryCode,
        type: 'earning',
        direction: 'in',
        amount: breakdown.workerReceives,
        fee: breakdown.workerFee,
        status: 'completed',
        jobId: j.id,
        createdAt: new Date().toISOString(),
      });

      // Update worker stats
      const worker = d.users.find((u) => u.id === j.workerId);
      if (worker) {
        worker.completedJobs += 1;
      }

      // Add invoice/receipt document
      if (!d.documents.some((doc) => doc.jobId === jobId && (doc.kind === 'invoice' || doc.kind === 'receipt'))) {
        d.documents.push({
          id: `doc-${jobId}-inv`,
          jobId,
          kind: pack.tax.documentTemplates.some((t) => t.kind === 'receipt') ? 'receipt' : 'invoice',
          number: `INV-${j.countryCode}-${Date.now().toString().slice(-4)}`,
          createdAt: new Date().toISOString(),
        });
      }

      updated = { ...j };
    });
    if (!updated) throw new ServiceError('not_found', 'Job not found');
    return updated;
  }

  async runAutoRelease(countryCode: string, now: Date = new Date()): Promise<ID[]> {
    await mockStore.simulateLatency();
    const affected: ID[] = [];
    mockStore.commit((d) => {
      d.jobs.forEach((j) => {
        if (
          j.countryCode === countryCode &&
          j.status === 'delivered' &&
          j.autoReleaseAt &&
          new Date(j.autoReleaseAt).getTime() <= now.getTime() &&
          !j.disputeId
        ) {
          j.status = 'approved';
          j.paymentState = 'released';
          j.approvedAt = now.toISOString();
          affected.push(j.id);
        }
      });
    });
    return affected;
  }
}
