import { generateSeedData, type MockDataset } from './seed';
import { getStorage } from '@/lib/storage';

const STORAGE_KEY = 'workhub_mock_store_v1';

class MockDataStore {
  private data: MockDataset;
  private listeners = new Set<() => void>();

  constructor() {
    this.data = this.loadOrInit();
  }

  private loadOrInit(): MockDataset {
    const saved = getStorage().get<MockDataset>(STORAGE_KEY);
    if (saved && saved.tasks && saved.tasks.length > 0) {
      return saved;
    }
    const fresh = generateSeedData();
    getStorage().set(STORAGE_KEY, fresh);
    return fresh;
  }

  public getData(): MockDataset {
    return this.data;
  }

  public commit(mutator: (draft: MockDataset) => void): void {
    mutator(this.data);
    getStorage().set(STORAGE_KEY, this.data);
    this.notify();
  }

  public reset(): void {
    this.data = generateSeedData();
    getStorage().set(STORAGE_KEY, this.data);
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  /** Realistic simulated latency (200-400 ms) */
  public async simulateLatency(ms: number = 250): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockStore = new MockDataStore();
