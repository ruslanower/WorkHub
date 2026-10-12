import type { CompanyService } from '../interfaces';
import type { Company, Task, ID, CompanyMemberRole, RecurrenceFrequency } from '../types';
import { mockStore } from '@/mock/store';
import { ServiceError } from '../errors';

export class MockCompanyService implements CompanyService {
  async get(id: ID): Promise<Company> {
    await mockStore.simulateLatency();
    const c = mockStore.getData().companies.find((x) => x.id === id);
    if (!c) throw new ServiceError('not_found', `Company ${id} not found`);
    return { ...c };
  }

  async list(countryCode: string): Promise<Company[]> {
    await mockStore.simulateLatency();
    return mockStore.getData().companies.filter((c) => c.countryCode === countryCode).map((c) => ({ ...c }));
  }

  async updateSettings(id: ID, patch: Partial<Pick<Company, 'monthlyBudget' | 'approvalThreshold'>>): Promise<Company> {
    await mockStore.simulateLatency();
    let updated: Company | null = null;
    mockStore.commit((d) => {
      const c = d.companies.find((x) => x.id === id);
      if (!c) return;
      Object.assign(c, patch);
      updated = { ...c };
    });
    if (!updated) throw new ServiceError('not_found', 'Company not found');
    return updated;
  }

  async inviteMember(id: ID, name: string, role: CompanyMemberRole): Promise<Company> {
    await mockStore.simulateLatency();
    let updated: Company | null = null;
    mockStore.commit((d) => {
      const c = d.companies.find((x) => x.id === id);
      if (!c) return;
      const newUserId = `usr-${c.countryCode.toLowerCase()}-comp-${Date.now().toString(36)}`;
      d.users.push({
        id: newUserId,
        countryCode: c.countryCode,
        accountType: 'company_member',
        name: { en: name },
        initials: name.split(' ').map((p) => p[0]).join('').slice(0, 2),
        cityId: c.cityId,
        district: 'Center',
        verificationLevel: 2,
        verifiedTrades: [],
        programs: [],
        rating: 5,
        reviewsCount: 0,
        completedJobs: 0,
        completionRate: 1,
        responseMinutes: 10,
        disputesLost: 0,
        joinedAt: new Date().toISOString(),
        companyId: c.id,
      });

      c.members.push({ userId: newUserId, role });
      updated = { ...c };
    });
    if (!updated) throw new ServiceError('not_found', 'Company not found');
    return updated;
  }

  async setMemberRole(id: ID, userId: ID, role: CompanyMemberRole): Promise<Company> {
    await mockStore.simulateLatency();
    let updated: Company | null = null;
    mockStore.commit((d) => {
      const c = d.companies.find((x) => x.id === id);
      if (!c) return;
      const m = c.members.find((mem) => mem.userId === userId);
      if (m) m.role = role;
      updated = { ...c };
    });
    if (!updated) throw new ServiceError('not_found', 'Company or member not found');
    return updated;
  }

  async approveTask(companyId: ID, taskId: ID, actorId: ID): Promise<Task> {
    await mockStore.simulateLatency();
    let updated: Task | null = null;
    mockStore.commit((d) => {
      const t = d.tasks.find((x) => x.id === taskId);
      if (!t) return;
      t.status = 'open';
      updated = { ...t };
    });
    if (!updated) throw new ServiceError('not_found', 'Task not found');
    return updated;
  }

  async setRecurrence(
    taskId: ID,
    recurrence: { frequency: RecurrenceFrequency; weekday: number; active: boolean } | null,
  ): Promise<Task> {
    await mockStore.simulateLatency();
    let updated: Task | null = null;
    mockStore.commit((d) => {
      const t = d.tasks.find((x) => x.id === taskId);
      if (!t) return;
      t.recurrence = recurrence || undefined;
      updated = { ...t };
    });
    if (!updated) throw new ServiceError('not_found', 'Task not found');
    return updated;
  }

  async exportMonthlyStatement(id: ID): Promise<{ fileName: string }> {
    await mockStore.simulateLatency(150);
    return { fileName: `company_statement_${id}_current.csv` };
  }
}
