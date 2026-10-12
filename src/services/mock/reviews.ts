import type { ReviewService, NewReviewInput } from '../interfaces';
import type { Review, Job, ID } from '../types';
import { mockStore } from '@/mock/store';
import { ServiceError } from '../errors';

export class MockReviewService implements ReviewService {
  async listForUser(userId: ID): Promise<Review[]> {
    await mockStore.simulateLatency();
    return mockStore.getData().reviews.filter((r) => r.toId === userId).map((r) => ({ ...r }));
  }

  async listForJob(jobId: ID): Promise<Review[]> {
    await mockStore.simulateLatency();
    return mockStore.getData().reviews.filter((r) => r.jobId === jobId).map((r) => ({ ...r }));
  }

  async create(input: NewReviewInput): Promise<Review> {
    await mockStore.simulateLatency();
    let created: Review | null = null;

    mockStore.commit((d) => {
      const job = d.jobs.find((j) => j.id === input.jobId);
      if (!job) throw new ServiceError('not_found', 'Job not found');

      const isCustomer = input.fromId === job.customerId;
      const toId = isCustomer ? job.workerId : job.customerId;
      const direction = isCustomer ? 'customer_to_worker' : 'worker_to_customer';

      const scores = Object.values(input.criteria);
      const overall = +(scores.reduce((a, b) => a + b, 0) / (scores.length || 1)).toFixed(1);

      const review: Review = {
        id: `rev-${Date.now().toString(36)}`,
        jobId: job.id,
        countryCode: job.countryCode,
        fromId: input.fromId,
        toId,
        direction,
        criteria: input.criteria,
        overall,
        text: input.text,
        createdAt: new Date().toISOString(),
      };

      d.reviews.unshift(review);

      if (isCustomer) {
        job.reviewedByCustomer = true;
      } else {
        job.reviewedByWorker = true;
      }

      // Update target user's rating & review count
      const targetUser = d.users.find((u) => u.id === toId);
      if (targetUser) {
        const userReviews = d.reviews.filter((r) => r.toId === toId);
        const totalOverall = userReviews.reduce((sum, r) => sum + r.overall, 0);
        targetUser.reviewsCount = userReviews.length;
        targetUser.rating = +(totalOverall / userReviews.length).toFixed(1);
      }

      created = review;
    });

    if (!created) throw new ServiceError('validation');
    return created;
  }

  async pendingFor(userId: ID): Promise<Job[]> {
    await mockStore.simulateLatency();
    return mockStore.getData().jobs
      .filter((j) => {
        if (j.status !== 'paid_out') return false;
        if (j.customerId === userId && !j.reviewedByCustomer) return true;
        if (j.workerId === userId && !j.reviewedByWorker) return true;
        return false;
      })
      .map((j) => ({ ...j }));
  }
}
