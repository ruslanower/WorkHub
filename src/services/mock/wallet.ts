import type { WalletService } from '../interfaces';
import type { WalletSummary, WalletTransaction, ID } from '../types';
import { mockStore } from '@/mock/store';
import { ServiceError } from '../errors';
import { computePayoutFee } from '@/lib/fees';
import { COUNTRY_PACKS } from '@/countries';

export class MockWalletService implements WalletService {
  async getSummary(userId: ID): Promise<WalletSummary> {
    await mockStore.simulateLatency();
    const { walletTransactions, jobs } = mockStore.getData();

    const userTxs = walletTransactions.filter((tx) => tx.userId === userId && tx.status === 'completed');

    let available = 0;
    let lifetimeEarned = 0;
    let lifetimeSpent = 0;

    userTxs.forEach((tx) => {
      if (tx.direction === 'in') {
        available += tx.amount;
        if (tx.type === 'earning') lifetimeEarned += tx.amount;
      } else {
        available -= tx.amount;
        if (tx.type === 'payment') lifetimeSpent += tx.amount;
      }
    });

    // Ensure non-negative available in demo
    available = Math.max(0, available);

    // Protected funds in active jobs
    const userJobs = jobs.filter((j) => (j.customerId === userId || j.workerId === userId) && ['funded', 'in_progress', 'delivered'].includes(j.status));
    const held = userJobs.reduce((sum, j) => sum + j.amount, 0);

    const pendingPayouts = walletTransactions
      .filter((tx) => tx.userId === userId && tx.status === 'pending' && tx.type === 'withdrawal')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      available,
      held,
      pendingPayouts,
      lifetimeEarned,
      lifetimeSpent,
    };
  }

  async listTransactions(userId: ID): Promise<WalletTransaction[]> {
    await mockStore.simulateLatency();
    return mockStore.getData().walletTransactions.filter((tx) => tx.userId === userId).map((tx) => ({ ...tx }));
  }

  async withdraw(userId: ID, amount: number, methodId: string): Promise<WalletTransaction> {
    await mockStore.simulateLatency();
    const user = mockStore.getData().users.find((u) => u.id === userId);
    if (!user) throw new ServiceError('not_found', 'User not found');

    const pack = COUNTRY_PACKS[user.countryCode];
    const method = pack?.payments.payoutMethods.find((m) => m.id === methodId);
    if (!method) throw new ServiceError('method_unavailable');

    const summary = await this.getSummary(userId);
    const fee = computePayoutFee(pack, methodId);
    const totalRequired = amount + fee;

    if (summary.available < totalRequired) {
      throw new ServiceError('insufficient_funds');
    }

    const tx: WalletTransaction = {
      id: `tx-wth-${Date.now().toString(36)}`,
      userId,
      countryCode: user.countryCode,
      type: 'withdrawal',
      direction: 'out',
      amount,
      fee,
      status: 'completed',
      methodId,
      createdAt: new Date().toISOString(),
    };

    mockStore.commit((d) => {
      d.walletTransactions.unshift(tx);
    });

    return tx;
  }

  async exportStatement(userId: ID, period: 'month' | 'quarter' | 'year'): Promise<{ fileName: string }> {
    await mockStore.simulateLatency(150);
    return { fileName: `statement_${userId}_${period}.csv` };
  }
}
