const DAY_MS = 24 * 60 * 60 * 1000;

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export function getDailyCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);

    if (Date.now() >= entry.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.value;
  } catch {
    return null;
  }
}

export function setDailyCache<T>(key: string, value: T): void {
  try {
    const entry: CacheEntry<T> = {
      value,
      expiresAt: Date.now() + DAY_MS,
    };

    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Cache je pouze optimalizace; aplikace musí fungovat i bez ní.
  }
}
