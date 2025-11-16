
/**
 * Enhanced storage utilities with caching and performance optimizations
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { errorLogger } from './errorLogger';

/**
 * Storage operation result
 */
interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
}

/**
 * Storage cache entry
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * In-memory cache for frequently accessed data
 */
class StorageCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private maxSize: number = 100;

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Enforce max size
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

const cache = new StorageCache();

/**
 * Enhanced storage class
 */
export const storage = {
  /**
   * Get item from storage with caching
   */
  async getItem<T>(key: string, useCache: boolean = true): Promise<StorageResult<T>> {
    try {
      // Check cache first
      if (useCache) {
        const cached = cache.get<T>(key);
        if (cached !== null) {
          return { success: true, data: cached };
        }
      }

      const value = await AsyncStorage.getItem(key);
      
      if (value === null) {
        return { success: true, data: undefined };
      }

      const data = JSON.parse(value) as T;
      
      // Update cache
      if (useCache) {
        cache.set(key, data);
      }

      return { success: true, data };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      errorLogger.log(err, `Storage getItem: ${key}`, 'medium');
      return { success: false, error: err };
    }
  },

  /**
   * Set item in storage and update cache
   */
  async setItem<T>(key: string, value: T): Promise<StorageResult<T>> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      
      // Update cache
      cache.set(key, value);

      return { success: true, data: value };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      errorLogger.log(err, `Storage setItem: ${key}`, 'medium');
      return { success: false, error: err };
    }
  },

  /**
   * Remove item from storage and cache
   */
  async removeItem(key: string): Promise<StorageResult<void>> {
    try {
      await AsyncStorage.removeItem(key);
      cache.invalidate(key);
      return { success: true };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      errorLogger.log(err, `Storage removeItem: ${key}`, 'medium');
      return { success: false, error: err };
    }
  },

  /**
   * Get multiple items at once
   */
  async multiGet<T>(keys: string[]): Promise<StorageResult<Record<string, T>>> {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      const result: Record<string, T> = {};

      for (const [key, value] of pairs) {
        if (value !== null) {
          result[key] = JSON.parse(value) as T;
        }
      }

      return { success: true, data: result };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      errorLogger.log(err, 'Storage multiGet', 'medium');
      return { success: false, error: err };
    }
  },

  /**
   * Set multiple items at once
   */
  async multiSet(keyValuePairs: [string, unknown][]): Promise<StorageResult<void>> {
    try {
      const pairs: [string, string][] = keyValuePairs.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);

      await AsyncStorage.multiSet(pairs);

      // Update cache
      for (const [key, value] of keyValuePairs) {
        cache.set(key, value);
      }

      return { success: true };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      errorLogger.log(err, 'Storage multiSet', 'medium');
      return { success: false, error: err };
    }
  },

  /**
   * Clear all storage
   */
  async clear(): Promise<StorageResult<void>> {
    try {
      await AsyncStorage.clear();
      cache.clear();
      return { success: true };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      errorLogger.log(err, 'Storage clear', 'high');
      return { success: false, error: err };
    }
  },

  /**
   * Get all keys
   */
  async getAllKeys(): Promise<StorageResult<string[]>> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return { success: true, data: keys };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      errorLogger.log(err, 'Storage getAllKeys', 'medium');
      return { success: false, error: err };
    }
  },

  /**
   * Invalidate cache for a key
   */
  invalidateCache(key: string): void {
    cache.invalidate(key);
  },

  /**
   * Clear all cache
   */
  clearCache(): void {
    cache.clear();
  },
};
