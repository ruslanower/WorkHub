import type { DisputeService, NewDisputeInput } from '../interfaces';
import type { Dispute, ID, DisputeDecisionOutcome, DisputeStage } from '../types';
import { mockStore } from '@/mock/store';
import { ServiceError } from '../errors';

const STAGE_ORDER: DisputeStage[] = ['opened', 'evidence', 'mediation', 'decision'];

export class MockDisputeService implements DisputeService {
  async list(filter: { countryCode: string; userId?: ID; openOnly?: boolean }): Promise<Dispute[]> {
    await mockStore.simulateLatency();
    return mockStore.getData().disputes
      .filter((d) => {
        if (d.countryCode !== filter.countryCode) return false;
        if (filter.userId && d.openedBy !== filter.userId) return false;
        if (filter.openOnly && d.decision) return false;
        return true;
      })
      .map((d) => ({ ...d }));
  }

  async get(id: ID): Promise<Dispute> {
    await mockStore.simulateLatency();
    const d = mockStore.getData().disputes.find((x) => x.id === id);
    if (!d) throw new ServiceError('not_found', `Dispute ${id} not found`);
    return { ...d };
  }

  async open(input: NewDisputeInput): Promise<Dispute> {
    await mockStore.simulateLatency();
    let created: Dispute | null = null;

    mockStore.commit((d) => {
      const job = d.jobs.find((j) => j.id === input.jobId);
      if (!job) throw new ServiceError('not_found', 'Job not found');

      const disputeId = `dsp-${job.countryCode.toLowerCase()}-${Date.now().toString(36)}`;
      const newDispute: Dispute = {
        id: disputeId,
        jobId: job.id,
        countryCode: job.countryCode,
        openedBy: input.openedBy,
        reason: input.reason,
        description: input.description,
        desiredOutcome: input.desiredOutcome,
        evidence: input.evidenceLabels.map((lbl, idx) => ({
          id: `evi-dsp-${disputeId}-${idx}`,
          jobId: job.id,
          uploadedBy: input.openedBy,
          label: lbl,
          hue: 15,
          createdAt: new Date().toISOString(),
        })),
        notes: [
          {
            id: `note-${Date.now().toString(36)}`,
            authorId: null,
            text: 'Dispute opened. SLA timer started: resolution review within 24 hours.',
            createdAt: new Date().toISOString(),
          },
        ],
        stage: 'opened',
        slaDueAt: new Date(Date.now() + 24 * 3600000).toISOString(),
        createdAt: new Date().toISOString(),
      };

      job.paymentState = 'disputed';
      job.disputeId = disputeId;
      d.disputes.unshift(newDispute);
      created = newDispute;
    });

    if (!created) throw new ServiceError('validation');
    return created;
  }

  async addNote(disputeId: ID, authorId: ID, text: string): Promise<Dispute> {
    await mockStore.simulateLatency();
    let updated: Dispute | null = null;
    mockStore.commit((d) => {
      const disp = d.disputes.find((x) => x.id === disputeId);
      if (!disp) return;
      disp.notes.push({
        id: `note-${Date.now().toString(36)}`,
        authorId,
        text,
        createdAt: new Date().toISOString(),
      });
      updated = { ...disp };
    });
    if (!updated) throw new ServiceError('not_found', 'Dispute not found');
    return updated;
  }

  async addEvidence(disputeId: ID, actorId: ID, label: string): Promise<Dispute> {
    await mockStore.simulateLatency();
    let updated: Dispute | null = null;
    mockStore.commit((d) => {
      const disp = d.disputes.find((x) => x.id === disputeId);
      if (!disp) return;
      disp.evidence.push({
        id: `evi-${Date.now().toString(36)}`,
        jobId: disp.jobId,
        uploadedBy: actorId,
        label,
        hue: 200,
        createdAt: new Date().toISOString(),
      });
      updated = { ...disp };
    });
    if (!updated) throw new ServiceError('not_found', 'Dispute not found');
    return updated;
  }

  async advanceStage(disputeId: ID): Promise<Dispute> {
    await mockStore.simulateLatency();
    let updated: Dispute | null = null;
    mockStore.commit((d) => {
      const disp = d.disputes.find((x) => x.id === disputeId);
      if (!disp) return;
      const curIdx = STAGE_ORDER.indexOf(disp.stage);
      if (curIdx < STAGE_ORDER.length - 1) {
        disp.stage = STAGE_ORDER[curIdx + 1];
      }
      updated = { ...disp };
    });
    if (!updated) throw new ServiceError('not_found', 'Dispute not found');
    return updated;
  }

  async decide(
    disputeId: ID,
    adminId: ID,
    outcome: DisputeDecisionOutcome,
    workerShare: number,
    note: string,
  ): Promise<Dispute> {
    await mockStore.simulateLatency();
    let updated: Dispute | null = null;
    mockStore.commit((d) => {
      const disp = d.disputes.find((x) => x.id === disputeId);
      if (!disp) return;
      const job = d.jobs.find((j) => j.id === disp.jobId);
      if (!job) return;

      const workerAmount = Math.round(job.amount * (outcome === 'full_release' ? 1 : outcome === 'refund' ? 0 : workerShare));
      const customerAmount = job.amount - workerAmount;

      disp.stage = 'decision';
      disp.decision = {
        outcome,
        workerAmount,
        customerAmount,
        note,
        decidedAt: new Date().toISOString(),
        decidedBy: adminId,
      };

      job.paymentState = outcome === 'full_release' ? 'released' : outcome === 'refund' ? 'refunded' : 'partially_released';
      job.status = outcome === 'refund' ? 'cancelled' : 'approved';

      // Update worker disputes lost stat if refund occurred
      if (outcome === 'refund') {
        const worker = d.users.find((u) => u.id === job.workerId);
        if (worker) worker.disputesLost += 1;
      }

      updated = { ...disp };
    });
    if (!updated) throw new ServiceError('not_found', 'Dispute not found');
    return updated;
  }
}
