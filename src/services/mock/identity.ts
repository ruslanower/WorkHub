import type { IdentityService, KycSimulation, VerificationResult } from '../interfaces';
import type { User, ID, VerificationLevel } from '../types';
import { mockStore } from '@/mock/store';
import { ServiceError } from '../errors';

let globalSimulationMode: KycSimulation = 'auto';

export class MockIdentityService implements IdentityService {
  setSimulation(mode: KycSimulation): void {
    globalSimulationMode = mode;
  }

  getSimulation(): KycSimulation {
    return globalSimulationMode;
  }

  async verify(
    userId: ID,
    level: VerificationLevel,
    opts?: { tradeCategoryId?: string },
  ): Promise<VerificationResult> {
    await mockStore.simulateLatency(350);

    if (globalSimulationMode === 'failure') {
      return {
        ok: false,
        level,
        reason: level === 2 ? 'provider_declined' : level === 3 ? 'permit_invalid' : 'document_unreadable',
      };
    }

    if (level === 3) {
      if (!opts?.tradeCategoryId) {
        throw new ServiceError('validation', 'Trade category is required for level 3 verification');
      }

      // Add to admin KYC review queue
      mockStore.commit((d) => {
        const u = d.users.find((x) => x.id === userId);
        if (!u) return;
        d.kycCases.unshift({
          id: `kyc-${Date.now().toString(36)}`,
          countryCode: u.countryCode,
          userId,
          level: 3,
          tradeCategoryId: opts.tradeCategoryId,
          status: 'pending',
          riskFlags: [],
          submittedAt: new Date().toISOString(),
        });
      });

      return {
        ok: true,
        level: 3,
        pendingReview: true,
      };
    }

    // Level 0, 1, 2 success
    mockStore.commit((d) => {
      const u = d.users.find((x) => x.id === userId);
      if (!u) return;
      if (level > u.verificationLevel) {
        u.verificationLevel = level;
      }
    });

    return {
      ok: true,
      level,
    };
  }

  async requestProgram(userId: ID, programId: string, showBadge: boolean): Promise<User> {
    await mockStore.simulateLatency();
    let updated: User | null = null;
    mockStore.commit((d) => {
      const u = d.users.find((x) => x.id === userId);
      if (!u) return;
      const existing = u.programs.find((p) => p.programId === programId);
      if (existing) {
        existing.status = 'verified';
        existing.showBadge = showBadge;
      } else {
        u.programs.push({
          programId,
          status: 'verified',
          showBadge,
        });
      }
      updated = { ...u };
    });
    if (!updated) throw new ServiceError('not_found', 'User not found');
    return updated;
  }

  async setProgramBadge(userId: ID, programId: string, showBadge: boolean): Promise<User> {
    await mockStore.simulateLatency();
    let updated: User | null = null;
    mockStore.commit((d) => {
      const u = d.users.find((x) => x.id === userId);
      if (!u) return;
      const prog = u.programs.find((p) => p.programId === programId);
      if (prog) {
        prog.showBadge = showBadge;
      }
      updated = { ...u };
    });
    if (!updated) throw new ServiceError('not_found', 'User or program not found');
    return updated;
  }

  async leaveProgram(userId: ID, programId: string): Promise<User> {
    await mockStore.simulateLatency();
    let updated: User | null = null;
    mockStore.commit((d) => {
      const u = d.users.find((x) => x.id === userId);
      if (!u) return;
      u.programs = u.programs.filter((p) => p.programId !== programId);
      updated = { ...u };
    });
    if (!updated) throw new ServiceError('not_found', 'User not found');
    return updated;
  }
}
