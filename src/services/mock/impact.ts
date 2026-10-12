import type { ImpactService } from '../interfaces';
import type { BeneficiaryImpactMetrics } from '../types';

const simulateLatency = (ms: number = 200) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export class MockImpactService implements ImpactService {
  async getBeneficiaryMetrics(_countryCode: string): Promise<BeneficiaryImpactMetrics> {
    await simulateLatency(200);

    return {
      totalEarningsGenerated: 4850200, // ₴4.85M generated for Ukrainian Veterans & IDPs
      jobsCompletedBeneficiaries: 1248,
      activeGcpAiModels: 4, // Vertex AI Embedding, Gemini 1.5 SOW Parser, Safety Filter, Match Ranker
      verifiedVeteransCount: 540,
      verifiedIdpsCount: 708,
      averageHourlyRate: 420, // ₴420/hr average fair earnings
      escrowSuccessRatePct: 98.7,
      fraudPreventionRatePct: 99.4,
    };
  }
}
