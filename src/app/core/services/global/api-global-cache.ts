import { Injectable } from "@angular/core";

type CacheEntry<T> = {
  expiresAt: number;
  value: T;
  tags: string[];
};

export type CacheGetOptions = {
  /** Ignore le cache et force un hit réseau */
  force?: boolean;
  /** TTL en ms (par défaut celui du service) */
  ttlMs?: number;
  /** Clé de cache custom (sinon tu passes toi-même une key) */
  key?: string;
  /** Tag(s) pour invalidation groupée */
  tags?: string[]; // ex: ["licence"]
};

@Injectable({ providedIn: "root" })
export class ApiCacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private inflight = new Map<string, Promise<any>>();

  /** TTL par défaut */
  private readonly DEFAULT_TTL_MS = 60_000;

  getCached<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value as T;
  }

  setCached<T>(key: string, value: T, ttlMs?: number, tags?: string[]) {
    const ttl = ttlMs ?? this.DEFAULT_TTL_MS;
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
      tags: tags ?? [],
    });
  }

  /** Invalide un cache précis */
  invalidateKey(key: string) {
    this.cache.delete(key);
  }

  /** Invalide tout ce qui commence par un prefix (pratique) */
  invalidatePrefix(prefix: string) {
    for (const k of this.cache.keys()) {
      if (k.startsWith(prefix)) this.cache.delete(k);
    }
  }

  /** Invalide par tag(s) */
  invalidateTags(tags: string | string[]) {
    const wanted = new Set(Array.isArray(tags) ? tags : [tags]);
    for (const [k, entry] of this.cache.entries()) {
      if (entry.tags?.some((t) => wanted.has(t))) {
        this.cache.delete(k);
      }
    }
  }

  /** Nettoyage général (optionnel) */
  clearAll() {
    this.cache.clear();
  }

  /**
   * Wrapper générique pour cacher une promesse (Axios GET typiquement)
   * - dédupe des requêtes simultanées
   * - TTL + tags
   */
  async wrap<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: CacheGetOptions
  ): Promise<T> {
    const finalKey = options?.key ?? key;

    if (!options?.force) {
      const cached = this.getCached<T>(finalKey);
      if (cached !== null) return cached;
    }

    const inflight = this.inflight.get(finalKey) as Promise<T> | undefined;
    if (inflight) return inflight;

    const p = fetcher()
      .then((data) => {
        this.setCached(finalKey, data, options?.ttlMs, options?.tags);
        return data;
      })
      .finally(() => {
        this.inflight.delete(finalKey);
      });

    this.inflight.set(finalKey, p as Promise<any>);
    return p;
  }
}