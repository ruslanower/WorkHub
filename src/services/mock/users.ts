import type { UserService } from '../interfaces';
import type { User, ID, AccountType } from '../types';
import { mockStore } from '@/mock/store';
import { ServiceError } from '../errors';

export class MockUserService implements UserService {
  async get(id: ID): Promise<User> {
    await mockStore.simulateLatency();
    const u = mockStore.getData().users.find((x) => x.id === id);
    if (!u) throw new ServiceError('not_found', `User ${id} not found`);
    return { ...u };
  }

  async getMany(ids: ID[]): Promise<User[]> {
    await mockStore.simulateLatency();
    const idSet = new Set(ids);
    return mockStore.getData().users.filter((x) => idSet.has(x.id)).map((u) => ({ ...u }));
  }

  async list(filter: { countryCode: string; accountType?: AccountType; query?: string }): Promise<User[]> {
    await mockStore.simulateLatency();
    return mockStore.getData().users
      .filter((u) => {
        if (u.countryCode !== filter.countryCode) return false;
        if (filter.accountType && u.accountType !== filter.accountType) return false;
        if (filter.query) {
          const q = filter.query.toLowerCase();
          const matchName = Object.values(u.name).some((v) => v.toLowerCase().includes(q));
          if (!matchName) return false;
        }
        return true;
      })
      .map((u) => ({ ...u }));
  }

  async toggleSavedWorker(customerId: ID, workerId: ID): Promise<User> {
    await mockStore.simulateLatency();
    let updated: User | null = null;
    mockStore.commit((d) => {
      const cust = d.users.find((x) => x.id === customerId);
      if (!cust) return;
      const list = cust.savedWorkerIds || [];
      cust.savedWorkerIds = list.includes(workerId) ? list.filter((id) => id !== workerId) : [...list, workerId];
      updated = { ...cust };
    });
    if (!updated) throw new ServiceError('not_found', 'Customer not found');
    return updated;
  }

  async updateProfile(id: ID, patch: Partial<Pick<User, 'taxStatusId' | 'availability' | 'skills' | 'hasPhoto'>>): Promise<User> {
    await mockStore.simulateLatency();
    let updated: User | null = null;
    mockStore.commit((d) => {
      const u = d.users.find((x) => x.id === id);
      if (!u) return;
      Object.assign(u, patch);
      updated = { ...u };
    });
    if (!updated) throw new ServiceError('not_found', 'User not found');
    return updated;
  }

  async setPro(id: ID, pro: boolean): Promise<User> {
    await mockStore.simulateLatency();
    let updated: User | null = null;
    mockStore.commit((d) => {
      const u = d.users.find((x) => x.id === id);
      if (!u) return;
      u.pro = pro;
      updated = { ...u };
    });
    if (!updated) throw new ServiceError('not_found', 'User not found');
    return updated;
  }
}
