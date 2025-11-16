
/**
 * Performance optimization utilities
 */

/**
 * Measure performance of a function
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const end = performance.now();
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
  } catch (error) {
    const end = performance.now();
    console.error(`[Performance] ${name} failed after ${(end - start).toFixed(2)}ms:`, error);
    throw error;
  }
}

/**
 * Debounce function calls
 */
export function debounce<T extends unknown[]>(
  func: (...args: T) => void,
  wait: number
): (...args: T) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: T) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Throttle function calls
 */
export function throttle<T extends unknown[]>(
  func: (...args: T) => void,
  limit: number
): (...args: T) => void {
  let inThrottle: boolean = false;
  
  return (...args: T) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Batch operations for better performance
 */
export async function batchOperations<T, R>(
  items: T[],
  operation: (item: T) => Promise<R>,
  batchSize = 10
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(operation));
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Memoize function results
 */
export function memoize<T extends unknown[], R>(
  fn: (...args: T) => R,
  keyGenerator?: (...args: T) => string
): (...args: T) => R {
  const cache = new Map<string, R>();
  
  return (...args: T): R => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Lazy load data with caching
 */
export function createLazyLoader<T>(
  loader: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes default
): () => Promise<T> {
  let cache: { data: T; timestamp: number } | null = null;
  let loading: Promise<T> | null = null;
  
  return async (): Promise<T> => {
    // Return cached data if still valid
    if (cache && Date.now() - cache.timestamp < ttl) {
      return cache.data;
    }
    
    // Return existing loading promise if already loading
    if (loading) {
      return loading;
    }
    
    // Start loading
    loading = loader();
    
    try {
      const data = await loading;
      cache = { data, timestamp: Date.now() };
      return data;
    } finally {
      loading = null;
    }
  };
}

/**
 * Rate limiter
 */
export class RateLimiter {
  private queue: (() => void)[] = [];
  private running: number = 0;
  
  constructor(private maxConcurrent: number = 5) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    while (this.running >= this.maxConcurrent) {
      await new Promise<void>(resolve => this.queue.push(resolve));
    }
    
    this.running++;
    
    try {
      return await fn();
    } finally {
      this.running--;
      const next = this.queue.shift();
      if (next) {
        next();
      }
    }
  }
}
