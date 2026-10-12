import type { CountryPack } from '@/countries/types';

/**
 * Fee rules (single source of truth - used everywhere money is shown).
 *
 *   customerFee    = max(minFee, round(amount * customerPct))
 *   workerFee      = round(amount * workerPct)
 *   customerPays   = amount + customerFee
 *   workerReceives = amount - workerFee
 *
 * All values are rounded to the pack's currency decimals.
 */
export interface FeeBreakdown {
  amount: number;
  customerFee: number;
  workerFee: number;
  customerPays: number;
  workerReceives: number;
  /** customerFee + workerFee - the platform's gross take on this job. */
  platformRevenue: number;
}

export function roundTo(value: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * f) / f;
}

export function computeFees(amount: number, pack: Pick<CountryPack, 'fees' | 'currency'>): FeeBreakdown {
  const d = pack.currency.decimals;
  const safe = Math.max(0, roundTo(amount || 0, d));
  const customerFee = safe === 0 ? 0 : Math.max(pack.fees.minFee, roundTo(safe * pack.fees.customerPct, d));
  const workerFee = roundTo(safe * pack.fees.workerPct, d);
  return {
    amount: safe,
    customerFee,
    workerFee,
    customerPays: roundTo(safe + customerFee, d),
    workerReceives: roundTo(safe - workerFee, d),
    platformRevenue: roundTo(customerFee + workerFee, d),
  };
}

/** Fee for withdrawing to an external payout method. */
export function computePayoutFee(pack: Pick<CountryPack, 'fees' | 'payments' | 'currency'>, methodId: string): number {
  const m = pack.payments.payoutMethods.find((x) => x.id === methodId);
  return roundTo(pack.fees.payoutFee + (m?.extraFee ?? 0), pack.currency.decimals);
}

/**
 * Split a total into milestone amounts that always sum exactly to the total
 * (the remainder from rounding goes to the last milestone).
 */
export function splitIntoMilestones(total: number, shares: number[], decimals: number): number[] {
  const sum = shares.reduce((a, b) => a + b, 0) || 1;
  const parts = shares.map((s) => roundTo((total * s) / sum, decimals));
  const diff = roundTo(total - parts.reduce((a, b) => a + b, 0), decimals);
  parts[parts.length - 1] = roundTo(parts[parts.length - 1] + diff, decimals);
  return parts;
}
