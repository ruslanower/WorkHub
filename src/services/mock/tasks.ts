import type { TaskService, TaskFilter, NewTaskInput } from '../interfaces';
import type { Task, ID, TaskWithMeta } from '../types';
import { mockStore } from '@/mock/store';
import { ServiceError } from '../errors';
import { COUNTRY_PACKS } from '@/countries';

export class MockTaskService implements TaskService {
  async list(filter: TaskFilter): Promise<TaskWithMeta[]> {
    await mockStore.simulateLatency();
    const { tasks, offers, users } = mockStore.getData();

    const userMap = new Map(users.map((u) => [u.id, u]));

    const filtered = tasks.filter((t) => {
      if (t.countryCode !== filter.countryCode) return false;
      if (filter.categoryIds && filter.categoryIds.length > 0 && !filter.categoryIds.includes(t.categoryId)) return false;
      if (filter.budgetMin && t.budget < filter.budgetMin) return false;
      if (filter.budgetMax && t.budget > filter.budgetMax) return false;
      if (filter.statuses && !filter.statuses.includes(t.status)) return false;
      if (filter.customerId && t.customerId !== filter.customerId) return false;
      if (filter.companyId && t.companyId !== filter.companyId) return false;
      if (filter.openToPriorityPrograms && !t.openToPriorityPrograms) return false;

      if (filter.minCustomerLevel != null) {
        const cust = userMap.get(t.customerId);
        if (!cust || cust.verificationLevel < filter.minCustomerLevel) return false;
      }
      if (filter.query) {
        const q = filter.query.toLowerCase();
        const matchTitle = Object.values(t.title).some((v) => v.toLowerCase().includes(q));
        const matchDesc = Object.values(t.description).some((v) => v.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc) return false;
      }
      return true;
    });

    const enriched: TaskWithMeta[] = filtered.map((t) => {
      const taskOffers = offers.filter((o) => o.taskId === t.id);
      return {
        ...t,
        offersCount: taskOffers.length,
        distanceKm: Math.round(Math.hypot(t.x - 50, t.y - 50) * 0.8) + 2, // simulated km
      };
    });

    // Sorting
    if (filter.sort === 'budget_desc') enriched.sort((a, b) => b.budget - a.budget);
    else if (filter.sort === 'budget_asc') enriched.sort((a, b) => a.budget - b.budget);
    else if (filter.sort === 'distance') enriched.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    else enriched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return enriched;
  }

  async get(id: ID): Promise<TaskWithMeta> {
    await mockStore.simulateLatency();
    const { tasks, offers } = mockStore.getData();
    const t = tasks.find((x) => x.id === id);
    if (!t) throw new ServiceError('not_found', `Task ${id} not found`);
    const taskOffers = offers.filter((o) => o.taskId === t.id);
    return {
      ...t,
      offersCount: taskOffers.length,
      distanceKm: 4,
    };
  }

  async create(input: NewTaskInput): Promise<Task> {
    await mockStore.simulateLatency();
    const pack = COUNTRY_PACKS[input.countryCode];
    if (!pack) throw new ServiceError('validation', 'Invalid country code');

    const newTask: Task = {
      id: `tsk-${input.countryCode.toLowerCase()}-${Date.now().toString(36)}`,
      countryCode: input.countryCode,
      customerId: input.customerId,
      companyId: input.companyId,
      categoryId: input.categoryId,
      templateId: input.templateId,
      title: typeof input.title === 'string' ? { en: input.title } : input.title,
      description: typeof input.description === 'string' ? { en: input.description } : input.description,
      cityId: input.cityId,
      district: input.district,
      x: 50,
      y: 50,
      budget: input.budget,
      budgetType: input.budgetType,
      milestonePlan: input.milestonePlan,
      date: input.date,
      durationHours: input.durationHours,
      minVerificationLevel: input.minVerificationLevel,
      openToPriorityPrograms: input.openToPriorityPrograms,
      preferPriority: input.preferPriority,
      status: input.draft ? 'draft' : input.companyId && input.budget > pack.companyApprovalThreshold ? 'pending_approval' : 'open',
      createdAt: new Date().toISOString(),
      photos: input.photos || 1,
    };

    mockStore.commit((d) => {
      d.tasks.unshift(newTask);
    });

    return { ...newTask };
  }

  async update(id: ID, patch: Partial<Pick<Task, 'status' | 'recurrence' | 'budget' | 'flagged'>>): Promise<Task> {
    await mockStore.simulateLatency();
    let updated: Task | null = null;
    mockStore.commit((d) => {
      const t = d.tasks.find((x) => x.id === id);
      if (!t) return;
      Object.assign(t, patch);
      updated = { ...t };
    });
    if (!updated) throw new ServiceError('not_found', 'Task not found');
    return updated;
  }

  async priceGuidance(countryCode: string, categoryId: string): Promise<{ min: number; max: number; median: number }> {
    await mockStore.simulateLatency();
    const pack = COUNTRY_PACKS[countryCode];
    const cat = pack?.categories.find((c) => c.id === categoryId);
    if (!cat) return { min: 1000, max: 10000, median: 5500 };
    return {
      min: cat.priceGuide.min,
      max: cat.priceGuide.max,
      median: Math.round((cat.priceGuide.min + cat.priceGuide.max) / 2),
    };
  }
}
