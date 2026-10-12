import type { AdminService } from '../interfaces';
import type { AdminQueues, AuditEvent, KycCase, ID } from '../types';
import { mockStore } from '@/mock/store';
import { ServiceError } from '../errors';

export class MockAdminService implements AdminService {
  async getQueues(countryCode: string): Promise<AdminQueues> {
    await mockStore.simulateLatency();
    const { kycCases, disputes, flags, payoutExceptions } = mockStore.getData();
    return {
      kyc: kycCases.filter((k) => k.countryCode === countryCode && k.status === 'pending').map((k) => ({ ...k })),
      disputes: disputes.filter((d) => d.countryCode === countryCode && d.stage !== 'decision').map((d) => ({ ...d })),
      flags: flags.filter((f) => f.countryCode === countryCode && f.status === 'open').map((f) => ({ ...f })),
      payoutExceptions: payoutExceptions.filter((p) => p.countryCode === countryCode && p.status === 'open').map((p) => ({ ...p })),
    };
  }

  async reviewKyc(caseId: ID, adminId: ID, approve: boolean): Promise<KycCase> {
    await mockStore.simulateLatency();
    let updated: KycCase | null = null;
    mockStore.commit((d) => {
      const k = d.kycCases.find((x) => x.id === caseId);
      if (!k) return;
      k.status = approve ? 'approved' : 'rejected';

      const user = d.users.find((u) => u.id === k.userId);
      if (user && approve) {
        user.verificationLevel = k.level;
        if (k.tradeCategoryId && !user.verifiedTrades.includes(k.tradeCategoryId)) {
          user.verifiedTrades.push(k.tradeCategoryId);
        }
      }

      d.auditEvents.unshift({
        id: `aud-${Date.now().toString(36)}`,
        countryCode: k.countryCode,
        entityType: 'kyc',
        entityId: k.id,
        actorId: adminId,
        action: approve ? 'kyc_approved' : 'kyc_rejected',
        createdAt: new Date().toISOString(),
      });

      updated = { ...k };
    });
    if (!updated) throw new ServiceError('not_found', 'KYC case not found');
    return updated;
  }

  async resolveFlag(flagId: ID, adminId: ID, action: 'resolve' | 'dismiss'): Promise<void> {
    await mockStore.simulateLatency();
    mockStore.commit((d) => {
      const f = d.flags.find((x) => x.id === flagId);
      if (!f) return;
      f.status = action === 'resolve' ? 'resolved' : 'dismissed';
      d.auditEvents.unshift({
        id: `aud-${Date.now().toString(36)}`,
        countryCode: f.countryCode,
        entityType: 'flag',
        entityId: f.id,
        actorId: adminId,
        action: `flag_${action}`,
        createdAt: new Date().toISOString(),
      });
    });
  }

  async resolvePayoutException(id: ID, adminId: ID, action: 'retry' | 'cancel'): Promise<void> {
    await mockStore.simulateLatency();
    mockStore.commit((d) => {
      const p = d.payoutExceptions.find((x) => x.id === id);
      if (!p) return;
      p.status = action === 'retry' ? 'retried' : 'cancelled';
      d.auditEvents.unshift({
        id: `aud-${Date.now().toString(36)}`,
        countryCode: p.countryCode,
        entityType: 'payout',
        entityId: p.id,
        actorId: adminId,
        action: `payout_exception_${action}`,
        createdAt: new Date().toISOString(),
      });
    });
  }

  async getAuditLog(countryCode: string, limit: number = 50): Promise<AuditEvent[]> {
    await mockStore.simulateLatency();
    return mockStore.getData().auditEvents
      .filter((a) => a.countryCode === countryCode)
      .slice(0, limit)
      .map((a) => ({ ...a }));
  }

  async logPackChange(countryCode: string, adminId: ID, field: string): Promise<void> {
    await mockStore.simulateLatency(100);
    mockStore.commit((d) => {
      d.auditEvents.unshift({
        id: `aud-${Date.now().toString(36)}`,
        countryCode,
        entityType: 'pack',
        entityId: countryCode,
        actorId: adminId,
        action: 'pack_modified',
        params: { field },
        createdAt: new Date().toISOString(),
      });
    });
  }
}
