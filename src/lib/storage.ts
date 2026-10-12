/**
 * StorageAdapter - the ONLY way the app persists anything.
 * Components and services must never touch localStorage/sessionStorage directly.
 * The default is in-memory (state resets on reload). A persistent adapter
 * (IndexedDB, localStorage, remote) can be plugged in via setStorageAdapter().
 */
export interface StorageAdapter {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
}

export class InMemoryStorageAdapter implements StorageAdapter {
  private map = new Map<string, unknown>();
  get<T>(key: string): T | undefined {
    return this.map.get(key) as T | undefined;
  }
  set<T>(key: string, value: T): void {
    this.map.set(key, value);
  }
  remove(key: string): void {
    this.map.delete(key);
  }
  clear(): void {
    this.map.clear();
  }
}

let adapter: StorageAdapter = new InMemoryStorageAdapter();

export function getStorage(): StorageAdapter {
  return adapter;
}

export function setStorageAdapter(next: StorageAdapter): void {
  adapter = next;
}
