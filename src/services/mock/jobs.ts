import type { JobService, JobFilter } from '../interfaces';
import type { Job, JobRoom, ID, Evidence, Message, AuditEvent } from '../types';
import { mockStore } from '@/mock/store';
import { ServiceError } from '../errors';
import { maskContacts } from '@/lib/mask';
import { splitIntoMilestones } from '@/lib/fees';
import { COUNTRY_PACKS } from '@/countries';

export class MockJobService implements JobService {
  async list(filter: JobFilter): Promise<Job[]> {
    await mockStore.simulateLatency();
    return mockStore.getData().jobs
      .filter((j) => {
        if (j.countryCode !== filter.countryCode) return false;
        if (filter.customerId && j.customerId !== filter.customerId) return false;
        if (filter.workerId && j.workerId !== filter.workerId) return false;
        if (filter.companyId && j.companyId !== filter.companyId) return false;
        if (filter.statuses && !filter.statuses.includes(j.status)) return false;
        if (!filter.includeArchived && j.archived) return false;
        return true;
      })
      .map((j) => ({ ...j }));
  }

  async get(id: ID): Promise<Job> {
    await mockStore.simulateLatency();
    const j = mockStore.getData().jobs.find((x) => x.id === id);
    if (!j) throw new ServiceError('not_found', `Job ${id} not found`);
    return { ...j };
  }

  async getRoom(id: ID): Promise<JobRoom> {
    await mockStore.simulateLatency();
    const { jobs, tasks, offers, users, messages, evidence, documents, auditEvents, disputes } = mockStore.getData();

    const job = jobs.find((j) => j.id === id);
    if (!job) throw new ServiceError('not_found', `Job ${id} not found`);

    const task = tasks.find((t) => t.id === job.taskId);
    if (!task) throw new ServiceError('not_found', `Task for job ${id} not found`);

    const offer = offers.find((o) => o.id === job.offerId) || {
      id: job.offerId,
      taskId: task.id,
      workerId: job.workerId,
      price: job.amount,
      etaDays: 3,
      message: 'Accepted offer',
      availableFrom: job.createdAt,
      status: 'accepted' as const,
      createdAt: job.createdAt,
    };

    const customer = users.find((u) => u.id === job.customerId) || users[0];
    const worker = users.find((u) => u.id === job.workerId) || users[1];

    const jobMessages = messages.filter((m) => m.jobId === id);
    const jobEvidence = evidence.filter((e) => e.jobId === id);
    const jobDocs = documents.filter((d) => d.jobId === id);
    const jobAudit = auditEvents.filter((a) => a.entityId === id);
    const jobDispute = disputes.find((d) => d.jobId === id);

    return {
      job: { ...job },
      task: { ...task },
      offer: { ...offer },
      customer: { ...customer },
      worker: { ...worker },
      messages: jobMessages.map((m) => ({ ...m })),
      evidence: jobEvidence.map((e) => ({ ...e })),
      documents: jobDocs.map((d) => ({ ...d })),
      audit: jobAudit.map((a) => ({ ...a })),
      dispute: jobDispute ? { ...jobDispute } : undefined,
    };
  }

  async hire(offerId: ID, actorId: ID): Promise<Job> {
    await mockStore.simulateLatency();
    let newJob: Job | null = null;

    mockStore.commit((d) => {
      const offer = d.offers.find((o) => o.id === offerId);
      if (!offer) return;
      const task = d.tasks.find((t) => t.id === offer.taskId);
      if (!task) return;

      const pack = COUNTRY_PACKS[task.countryCode];
      offer.status = 'accepted';
      task.status = 'hired';

      // Decline other pending offers
      d.offers.forEach((o) => {
        if (o.taskId === task.id && o.id !== offer.id && o.status === 'pending') {
          o.status = 'declined';
        }
      });

      const milestoneShares = task.milestonePlan.length ? task.milestonePlan.map((m) => m.share) : [1];
      const amounts = splitIntoMilestones(offer.price, milestoneShares, pack?.currency.decimals || 2);

      const jobId = `job-${task.countryCode.toLowerCase()}-${Date.now().toString(36)}`;
      const job: Job = {
        id: jobId,
        countryCode: task.countryCode,
        taskId: task.id,
        offerId: offer.id,
        customerId: task.customerId,
        workerId: offer.workerId,
        companyId: task.companyId,
        amount: offer.price,
        status: 'offer_accepted',
        paymentState: 'unfunded',
        milestones: task.milestonePlan.length
          ? task.milestonePlan.map((m, idx) => ({
              id: `ms-${jobId}-${idx + 1}`,
              title: m.title,
              amount: amounts[idx],
              status: 'pending',
            }))
          : [
              {
                id: `ms-${jobId}-1`,
                title: { en: 'Full task completion' },
                amount: offer.price,
                status: 'pending',
              },
            ],
        createdAt: new Date().toISOString(),
        changeRequests: 0,
        reviewedByCustomer: false,
        reviewedByWorker: false,
      };

      d.jobs.unshift(job);

      // System notification
      d.messages.push({
        id: `msg-${jobId}-1`,
        jobId,
        authorId: null,
        kind: 'system',
        text: '',
        systemKey: 'offer_accepted',
        masked: false,
        createdAt: new Date().toISOString(),
      });

      newJob = job;
    });

    if (!newJob) throw new ServiceError('not_found', 'Offer or Task not found');
    return newJob;
  }

  async signAgreement(jobId: ID, actorId: ID): Promise<Job> {
    await mockStore.simulateLatency();
    let updated: Job | null = null;
    mockStore.commit((d) => {
      const j = d.jobs.find((x) => x.id === jobId);
      if (!j) return;
      j.agreementSignedAt = new Date().toISOString();

      // Ensure agreement document exists
      if (!d.documents.some((doc) => doc.jobId === jobId && doc.kind === 'agreement')) {
        d.documents.push({
          id: `doc-${jobId}-agr`,
          jobId,
          kind: 'agreement',
          number: `AGR-${j.countryCode}-${Date.now().toString().slice(-4)}`,
          createdAt: new Date().toISOString(),
        });
      }

      updated = { ...j };
    });
    if (!updated) throw new ServiceError('not_found', 'Job not found');
    return updated;
  }

  async start(jobId: ID, actorId: ID): Promise<Job> {
    await mockStore.simulateLatency();
    let updated: Job | null = null;
    mockStore.commit((d) => {
      const j = d.jobs.find((x) => x.id === jobId);
      if (!j) return;
      j.status = 'in_progress';
      j.startedAt = new Date().toISOString();
      if (j.milestones[0]) j.milestones[0].status = 'in_progress';
      updated = { ...j };
    });
    if (!updated) throw new ServiceError('not_found', 'Job not found');
    return updated;
  }

  async checkIn(jobId: ID, actorId: ID): Promise<Job> {
    await mockStore.simulateLatency();
    let updated: Job | null = null;
    mockStore.commit((d) => {
      const j = d.jobs.find((x) => x.id === jobId);
      if (!j) return;
      j.checkInAt = new Date().toISOString();
      updated = { ...j };
    });
    if (!updated) throw new ServiceError('not_found', 'Job not found');
    return updated;
  }

  async checkOut(jobId: ID, actorId: ID): Promise<Job> {
    await mockStore.simulateLatency();
    let updated: Job | null = null;
    mockStore.commit((d) => {
      const j = d.jobs.find((x) => x.id === jobId);
      if (!j) return;
      j.checkOutAt = new Date().toISOString();
      updated = { ...j };
    });
    if (!updated) throw new ServiceError('not_found', 'Job not found');
    return updated;
  }

  async deliverMilestone(jobId: ID, milestoneId: ID, actorId: ID): Promise<Job> {
    await mockStore.simulateLatency();
    let updated: Job | null = null;
    mockStore.commit((d) => {
      const j = d.jobs.find((x) => x.id === jobId);
      if (!j) return;
      const ms = j.milestones.find((m) => m.id === milestoneId);
      if (ms) ms.status = 'delivered';
      updated = { ...j };
    });
    if (!updated) throw new ServiceError('not_found', 'Job not found');
    return updated;
  }

  async deliver(jobId: ID, actorId: ID): Promise<Job> {
    await mockStore.simulateLatency();
    let updated: Job | null = null;
    mockStore.commit((d) => {
      const j = d.jobs.find((x) => x.id === jobId);
      if (!j) return;
      const pack = COUNTRY_PACKS[j.countryCode];
      j.status = 'delivered';
      j.deliveredAt = new Date().toISOString();
      const autoDays = pack?.autoReleaseDays || 3;
      j.autoReleaseAt = new Date(Date.now() + autoDays * 86400000).toISOString();
      j.milestones.forEach((m) => {
        if (m.status !== 'released') m.status = 'delivered';
      });
      updated = { ...j };
    });
    if (!updated) throw new ServiceError('not_found', 'Job not found');
    return updated;
  }

  async requestChanges(jobId: ID, actorId: ID, note: string): Promise<Job> {
    await mockStore.simulateLatency();
    let updated: Job | null = null;
    mockStore.commit((d) => {
      const j = d.jobs.find((x) => x.id === jobId);
      if (!j) return;
      j.status = 'in_progress';
      j.changeRequests += 1;
      d.messages.push({
        id: `msg-${jobId}-${Date.now().toString(36)}`,
        jobId,
        authorId: actorId,
        kind: 'user',
        text: `Requested adjustments: ${note}`,
        masked: false,
        createdAt: new Date().toISOString(),
      });
      updated = { ...j };
    });
    if (!updated) throw new ServiceError('not_found', 'Job not found');
    return updated;
  }

  async approve(jobId: ID, actorId: ID): Promise<Job> {
    await mockStore.simulateLatency();
    let updated: Job | null = null;
    mockStore.commit((d) => {
      const j = d.jobs.find((x) => x.id === jobId);
      if (!j) return;
      j.status = 'approved';
      j.paymentState = 'released';
      j.approvedAt = new Date().toISOString();
      j.milestones.forEach((m) => {
        m.status = 'released';
        m.releasedAt = new Date().toISOString();
      });

      // Generate completion act
      if (!d.documents.some((doc) => doc.jobId === jobId && doc.kind === 'completion_act')) {
        d.documents.push({
          id: `doc-${jobId}-act`,
          jobId,
          kind: 'completion_act',
          number: `ACT-${j.countryCode}-${Date.now().toString().slice(-4)}`,
          createdAt: new Date().toISOString(),
        });
      }

      updated = { ...j };
    });
    if (!updated) throw new ServiceError('not_found', 'Job not found');
    return updated;
  }

  async proposeAmount(jobId: ID, actorId: ID, amount: number): Promise<Job> {
    await mockStore.simulateLatency();
    let updated: Job | null = null;
    mockStore.commit((d) => {
      const j = d.jobs.find((x) => x.id === jobId);
      if (!j) return;
      j.pendingAmountChange = {
        amount,
        proposedBy: actorId,
        createdAt: new Date().toISOString(),
      };
      updated = { ...j };
    });
    if (!updated) throw new ServiceError('not_found', 'Job not found');
    return updated;
  }

  async respondToAmount(jobId: ID, actorId: ID, accept: boolean): Promise<Job> {
    await mockStore.simulateLatency();
    let updated: Job | null = null;
    mockStore.commit((d) => {
      const j = d.jobs.find((x) => x.id === jobId);
      if (!j || !j.pendingAmountChange) return;
      if (accept) {
        j.amount = j.pendingAmountChange.amount;
      }
      j.pendingAmountChange = undefined;
      updated = { ...j };
    });
    if (!updated) throw new ServiceError('not_found', 'Job not found');
    return updated;
  }

  async sendMessage(jobId: ID, authorId: ID, text: string): Promise<{ masked: boolean }> {
    await mockStore.simulateLatency();
    const { text: maskedText, masked } = maskContacts(text);

    mockStore.commit((d) => {
      d.messages.push({
        id: `msg-${jobId}-${Date.now().toString(36)}`,
        jobId,
        authorId,
        kind: 'user',
        text: maskedText,
        masked,
        createdAt: new Date().toISOString(),
      });

      if (masked) {
        d.flags.push({
          id: `flg-${Date.now().toString(36)}`,
          countryCode: 'UA',
          entityType: 'message',
          entityId: `msg-${jobId}`,
          reason: 'contact_sharing',
          snippet: text,
          status: 'open',
          createdAt: new Date().toISOString(),
        });
      }
    });

    return { masked };
  }

  async addEvidence(jobId: ID, actorId: ID, label: string, milestoneId?: ID): Promise<Evidence> {
    await mockStore.simulateLatency();
    const newEvidence: Evidence = {
      id: `evi-${jobId}-${Date.now().toString(36)}`,
      jobId,
      uploadedBy: actorId,
      label,
      hue: Math.floor(Math.random() * 360),
      milestoneId,
      createdAt: new Date().toISOString(),
    };

    mockStore.commit((d) => {
      d.evidence.push(newEvidence);
    });

    return newEvidence;
  }

  async shareStatus(jobId: ID): Promise<string> {
    await mockStore.simulateLatency();
    const j = await this.get(jobId);
    return `WorkHub Safety Check: On-site job ${j.id} status is "${j.status}". Protection is active.`;
  }

  async advance(jobId: ID): Promise<Job> {
    await mockStore.simulateLatency();
    const current = await this.get(jobId);
    if (current.status === 'offer_accepted') {
      await this.signAgreement(jobId, current.customerId);
      current.status = 'funded';
      current.paymentState = 'funded';
    } else if (current.status === 'funded') {
      await this.start(jobId, current.workerId);
    } else if (current.status === 'in_progress') {
      await this.deliver(jobId, current.workerId);
    } else if (current.status === 'delivered') {
      await this.approve(jobId, current.customerId);
    } else if (current.status === 'approved') {
      current.status = 'paid_out';
      current.paidOutAt = new Date().toISOString();
      mockStore.commit((d) => {
        const j = d.jobs.find((x) => x.id === jobId);
        if (j) {
          j.status = 'paid_out';
          j.paidOutAt = new Date().toISOString();
          d.documents.push({
            id: `doc-${jobId}-inv`,
            jobId,
            kind: 'invoice',
            number: `INV-${j.countryCode}-${Date.now().toString().slice(-4)}`,
            createdAt: new Date().toISOString(),
          });
        }
      });
    }
    return this.get(jobId);
  }
}
