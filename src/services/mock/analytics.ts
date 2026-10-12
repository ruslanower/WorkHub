import type { AnalyticsService } from '../interfaces';
import type {
  Kpis,
  SeriesPoint,
  CitySupplyDemand,
  FunnelStep,
  Cohort,
  RevenueBreakdown,
  ImpactRow,
  ID,
} from '../types';
import { mockStore } from '@/mock/store';
import { COUNTRY_PACKS } from '@/countries';

export class MockAnalyticsService implements AnalyticsService {
  async getKpis(countryCode: string): Promise<Kpis> {
    await mockStore.simulateLatency();
    const { jobs, users } = mockStore.getData();

    const countryJobs = jobs.filter((j) => j.countryCode === countryCode);
    const paidJobs = countryJobs.filter((j) => j.status === 'paid_out');
    const gmv = paidJobs.reduce((sum, j) => sum + j.amount, 0) + (countryCode === 'KE' ? 1200000 : countryCode === 'PL' ? 84000 : 540000);

    const countryUsers = users.filter((u) => u.countryCode === countryCode);
    const workers = countryUsers.filter((u) => u.accountType === 'worker');
    const customers = countryUsers.filter((u) => u.accountType === 'customer');

    return {
      gmv,
      gmvPrevPeriod: Math.round(gmv * 0.82),
      takeRate: 0.12,
      completedJobsPerWeek: 42,
      hoursToFirstOffer: 1.4,
      repeatRate: 0.38,
      disputeRate: 0.018,
      leakageEstimate: 0.04,
      avgWorkerEarnings: countryCode === 'KE' ? 38000 : countryCode === 'PL' ? 3600 : 24000,
      nps: 68,
      cac: countryCode === 'KE' ? 950 : countryCode === 'PL' ? 90 : 620,
      paybackMonths: 2.8,
      priorityShare: 0.29,
      activeWorkers: workers.length * 15,
      activeCustomers: customers.length * 25,
    };
  }

  async getGmvSeries(countryCode: string): Promise<SeriesPoint[]> {
    await mockStore.simulateLatency();
    const base = countryCode === 'KE' ? 60000 : countryCode === 'PL' ? 4500 : 28000;
    const weeks = ['W-11', 'W-10', 'W-9', 'W-8', 'W-7', 'W-6', 'W-5', 'W-4', 'W-3', 'W-2', 'W-1', 'This Wk'];
    return weeks.map((w, idx) => ({
      label: w,
      value: Math.round(base * (1 + idx * 0.12 + Math.sin(idx) * 0.08)),
    }));
  }

  async getSupplyDemand(countryCode: string): Promise<CitySupplyDemand[]> {
    await mockStore.simulateLatency();
    const pack = COUNTRY_PACKS[countryCode] || COUNTRY_PACKS.UA;
    const { users, tasks } = mockStore.getData();

    return pack.cities.map((city, idx) => {
      const cityWorkers = users.filter((u) => u.countryCode === countryCode && u.accountType === 'worker' && u.cityId === city.id).length;
      const cityTasks = tasks.filter((t) => t.countryCode === countryCode && t.cityId === city.id && t.status === 'open').length;
      return {
        cityId: city.id,
        workers: (cityWorkers || 1) * 8 + (idx * 5),
        openTasks: (cityTasks || 1) * 6 + (idx * 3),
      };
    });
  }

  async getFunnel(countryCode: string): Promise<FunnelStep[]> {
    await mockStore.simulateLatency();
    return [
      { key: 'visits', value: 12400 },
      { key: 'posted', value: 1860 },
      { key: 'offers', value: 1420 },
      { key: 'hired', value: 980 },
      { key: 'paid', value: 924 },
    ];
  }

  async getCohorts(countryCode: string): Promise<Cohort[]> {
    await mockStore.simulateLatency();
    return [
      { label: 'Month 1', retention: [100, 78, 65, 58, 54, 52] },
      { label: 'Month 2', retention: [100, 81, 68, 61, 57] },
      { label: 'Month 3', retention: [100, 83, 71, 64] },
      { label: 'Month 4', retention: [100, 85, 73] },
      { label: 'Month 5', retention: [100, 86] },
      { label: 'Month 6', retention: [100] },
    ];
  }

  async getRevenueBreakdown(countryCode: string): Promise<RevenueBreakdown> {
    await mockStore.simulateLatency();
    const base = countryCode === 'KE' ? 120000 : countryCode === 'PL' ? 8500 : 55000;
    return {
      customerFees: Math.round(base * 0.45),
      workerFees: Math.round(base * 0.35),
      subscriptions: Math.round(base * 0.1),
      paidFeatures: Math.round(base * 0.06),
      impactContracts: Math.round(base * 0.04),
    };
  }

  async getImpact(countryCode: string): Promise<ImpactRow[]> {
    await mockStore.simulateLatency();
    const pack = COUNTRY_PACKS[countryCode] || COUNTRY_PACKS.UA;
    const baseEarnings = countryCode === 'KE' ? 180000 : countryCode === 'PL' ? 14000 : 85000;

    return pack.priorityPrograms.map((prog, idx) => ({
      programId: prog.id,
      participants: 45 + idx * 25,
      jobs: 140 + idx * 80,
      earnings: Math.round(baseEarnings * (1 + idx * 0.4)),
      retention: 0.82 - idx * 0.04,
    }));
  }

  async getWorkerEarnings(workerId: ID, period: 'week' | 'month' | 'year'): Promise<SeriesPoint[]> {
    await mockStore.simulateLatency();
    const labels = period === 'week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['W1', 'W2', 'W3', 'W4'];
    return labels.map((lbl, idx) => ({
      label: lbl,
      value: (idx + 1) * 650 + Math.floor(Math.random() * 300),
    }));
  }

  async getCustomerSpend(customerId: ID): Promise<SeriesPoint[]> {
    await mockStore.simulateLatency();
    return [
      { label: 'Month -2', value: 3400 },
      { label: 'Month -1', value: 5200 },
      { label: 'This Month', value: 4100 },
    ];
  }

  async exportImpactReport(countryCode: string): Promise<{ fileName: string }> {
    await mockStore.simulateLatency(150);
    return { fileName: `impact_report_${countryCode}_esg.csv` };
  }
}
