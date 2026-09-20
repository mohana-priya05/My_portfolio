import "server-only";

interface RateEntry {
  count: number;
  firstAt: number;
  blockedUntil: number;
}

const MAX_ENTRIES = 10_000;

function now(): number {
  return Date.now();
}

/**
 * In-memory sliding-window rate limiter keyed by an identifier (IP + action).
 * Suitable for a single-instance deployment. For multi-instance deployments
 * this should be swapped for a shared store.
 */
export function createRateLimiter(windowMs: number, max: number) {
  const store = new Map<string, RateEntry>();

  function prune(nowMs: number) {
    if (store.size <= MAX_ENTRIES) return;
    for (const [key, entry] of store) {
      if (nowMs - entry.firstAt > windowMs * 2) store.delete(key);
    }
  }

  return {
    /**
     * Returns { allowed, retryAfterMs } — allowed is false when the key is
     * over the limit or currently blocked.
     */
    check(key: string) {
      const nowMs = now();
      const entry = store.get(key);

      if (entry) {
        if (entry.blockedUntil > nowMs) {
          return { allowed: false, retryAfterMs: entry.blockedUntil - nowMs };
        }
        if (nowMs - entry.firstAt > windowMs) {
          store.set(key, { count: 1, firstAt: nowMs, blockedUntil: 0 });
          return { allowed: true, retryAfterMs: 0 };
        }
        entry.count += 1;
        if (entry.count > max) {
          entry.blockedUntil = nowMs + windowMs;
          return { allowed: false, retryAfterMs: windowMs };
        }
        return { allowed: true, retryAfterMs: 0 };
      }

      store.set(key, { count: 1, firstAt: nowMs, blockedUntil: 0 });
      prune(nowMs);
      return { allowed: true, retryAfterMs: 0 };
    },
    reset(key: string) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

export const loginRateLimiter = createRateLimiter(15 * 60 * 1000, 8);