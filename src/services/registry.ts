import type { Services } from './interfaces';
import { MockUserService } from './mock/users';
import { MockTaskService } from './mock/tasks';
import { MockOfferService } from './mock/offers';
import { MockJobService } from './mock/jobs';
import { MockPaymentService } from './mock/payments';
import { MockIdentityService } from './mock/identity';
import { MockDocumentService } from './mock/documents';
import { MockDisputeService } from './mock/disputes';
import { MockReviewService } from './mock/reviews';
import { MockWalletService } from './mock/wallet';
import { MockCompanyService } from './mock/companies';
import { MockAdminService } from './mock/admin';
import { MockAnalyticsService } from './mock/analytics';
import { MockAIService } from './mock/ai';
import { MockMapsService } from './mock/maps';
import { MockImpactService } from './mock/impact';

/**
 * Service Registry.
 *
 * To connect a real backend, instantiate your HTTP service classes
 * and register them here via `setServices()`. The entire UI talks
 * only to `getServices()`.
 */
let currentServices: Services = {
  users: new MockUserService(),
  tasks: new MockTaskService(),
  offers: new MockOfferService(),
  jobs: new MockJobService(),
  payments: new MockPaymentService(),
  identity: new MockIdentityService(),
  documents: new MockDocumentService(),
  disputes: new MockDisputeService(),
  reviews: new MockReviewService(),
  wallet: new MockWalletService(),
  companies: new MockCompanyService(),
  admin: new MockAdminService(),
  analytics: new MockAnalyticsService(),
  ai: new MockAIService(),
  maps: new MockMapsService(),
  impact: new MockImpactService(),
};

export function getServices(): Services {
  return currentServices;
}

export function setServices(services: Services): void {
  currentServices = services;
}

export * from './interfaces';
export * from './types';
export * from './errors';
