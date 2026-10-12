/**
 * TRUST SCORE (0-100) - transparent weighted formula.
 *
 * Component                 Weight  How it is normalised (0..1)
 * ------------------------  ------  ------------------------------------------
 * Verification level        30%     level / 3  (L0 = 0, L3 = 1)
 * Completion rate           25%     completed / accepted jobs
 * Average rating            25%     (rating - 1) / 4  (1 star = 0, 5 stars = 1)
 * Response time             10%     1 at <= 15 min, linearly down to 0 at >= 24 h
 * Disputes lost             10%     1 - min(1, disputesLost / 3)
 *
 * New accounts with no ratings get a neutral rating component of 0.6 so they
 * are not punished for being new. The result is rounded to an integer.
 */
export interface TrustInputs {
  verificationLevel: 0 | 1 | 2 | 3;
  completionRate: number;
  rating: number | null;
  responseMinutes: number;
  disputesLost: number;
}

export const TRUST_WEIGHTS = {
  verification: 0.3,
  completion: 0.25,
  rating: 0.25,
  response: 0.1,
  disputes: 0.1,
} as const;

export type TrustComponent = keyof typeof TRUST_WEIGHTS;

export interface TrustBreakdown {
  score: number;
  components: Record<TrustComponent, { normalized: number; weight: number; points: number }>;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function computeTrustScore(i: TrustInputs): TrustBreakdown {
  const normalized: Record<TrustComponent, number> = {
    verification: clamp01(i.verificationLevel / 3),
    completion: clamp01(i.completionRate),
    rating: i.rating == null ? 0.6 : clamp01((i.rating - 1) / 4),
    response: clamp01(1 - (i.responseMinutes - 15) / (24 * 60 - 15)),
    disputes: 1 - Math.min(1, i.disputesLost / 3),
  };
  const components = Object.fromEntries(
    (Object.keys(TRUST_WEIGHTS) as TrustComponent[]).map((k) => {
      const weight = TRUST_WEIGHTS[k];
      return [k, { normalized: normalized[k], weight, points: Math.round(normalized[k] * weight * 1000) / 10 }];
    }),
  ) as TrustBreakdown['components'];
  const score = Math.round((Object.keys(TRUST_WEIGHTS) as TrustComponent[]).reduce((s, k) => s + normalized[k] * TRUST_WEIGHTS[k], 0) * 100);
  return { score, components };
}
