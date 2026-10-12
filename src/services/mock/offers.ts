import type { OfferService, NewOfferInput, EligibilityResult } from '../interfaces';
import type { Offer, ID } from '../types';
import { mockStore } from '@/mock/store';
import { ServiceError } from '../errors';
import { COUNTRY_PACKS } from '@/countries';

export class MockOfferService implements OfferService {
  async listForTask(taskId: ID): Promise<Offer[]> {
    await mockStore.simulateLatency();
    return mockStore.getData().offers.filter((o) => o.taskId === taskId).map((o) => ({ ...o }));
  }

  async listForWorker(workerId: ID): Promise<Offer[]> {
    await mockStore.simulateLatency();
    return mockStore.getData().offers.filter((o) => o.workerId === workerId).map((o) => ({ ...o }));
  }

  async checkEligibility(workerId: ID, taskId: ID): Promise<EligibilityResult> {
    await mockStore.simulateLatency();
    const { users, tasks, offers, jobs } = mockStore.getData();
    const worker = users.find((u) => u.id === workerId);
    const task = tasks.find((t) => t.id === taskId);

    if (!worker || !task) return { ok: false, reason: 'task_closed' };
    if (task.customerId === workerId) return { ok: false, reason: 'own_task' };
    if (task.status !== 'open') return { ok: false, reason: 'task_closed' };

    // L1+ to offer
    if (worker.verificationLevel < 1) return { ok: false, reason: 'level_too_low' };

    // Regulated trade requires L3 for that category
    const pack = COUNTRY_PACKS[task.countryCode];
    const isRegulated = pack?.regulatedTrades.some((r) => r.categoryId === task.categoryId);
    if (isRegulated && (worker.verificationLevel < 3 || !worker.verifiedTrades.includes(task.categoryId))) {
      return { ok: false, reason: 'permit_required' };
    }

    // New account cap check (anti-fraud)
    const activeJobs = jobs.filter((j) => j.workerId === workerId && ['funded', 'in_progress', 'delivered'].includes(j.status));
    if (worker.completedJobs < 3 && activeJobs.length >= (pack?.newAccountJobCap || 2)) {
      return { ok: false, reason: 'job_cap' };
    }

    // Already offered
    const already = offers.some((o) => o.taskId === taskId && o.workerId === workerId && o.status === 'pending');
    if (already) return { ok: false, reason: 'already_offered' };

    return { ok: true };
  }

  async create(input: NewOfferInput): Promise<Offer> {
    await mockStore.simulateLatency();
    const check = await this.checkEligibility(input.workerId, input.taskId);
    if (!check.ok) {
      throw new ServiceError(check.reason);
    }

    const newOffer: Offer = {
      id: `off-${input.taskId}-${Date.now().toString(36)}`,
      taskId: input.taskId,
      workerId: input.workerId,
      price: input.price,
      etaDays: input.etaDays,
      message: input.message,
      availableFrom: input.availableFrom,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    mockStore.commit((d) => {
      d.offers.unshift(newOffer);
    });

    return { ...newOffer };
  }

  async withdraw(offerId: ID): Promise<Offer> {
    await mockStore.simulateLatency();
    let updated: Offer | null = null;
    mockStore.commit((d) => {
      const o = d.offers.find((x) => x.id === offerId);
      if (!o) return;
      o.status = 'withdrawn';
      updated = { ...o };
    });
    if (!updated) throw new ServiceError('not_found', 'Offer not found');
    return updated;
  }

  async decline(offerId: ID): Promise<Offer> {
    await mockStore.simulateLatency();
    let updated: Offer | null = null;
    mockStore.commit((d) => {
      const o = d.offers.find((x) => x.id === offerId);
      if (!o) return;
      o.status = 'declined';
      updated = { ...o };
    });
    if (!updated) throw new ServiceError('not_found', 'Offer not found');
    return updated;
  }
}
