interface CacheEntry<T> {
  value: T;
  expiry: number;
}

const MAX_SIZE = 500;
const TTL_MS = 60_000;

const cache = new Map<string, CacheEntry<any>>();

export function getCached<T>(key: string): T | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;

  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return undefined;
  }

  // Move to end for LRU ordering
  cache.delete(key);
  cache.set(key, entry);
  return entry.value;
}

export function setCached<T>(key: string, value: T): void {
  if (cache.size >= MAX_SIZE) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, { value, expiry: Date.now() + TTL_MS });
}
