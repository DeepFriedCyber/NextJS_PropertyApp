import { createClient } from 'redis';
import { createLogger } from './logger';

const logger = createLogger();

class Cache {
  private static instance: Cache;
  private client: ReturnType<typeof createClient>;

  private constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });

    this.client.on('error', (err) => {
      logger.error('Redis Client Error', err);
    });

    this.client.on('connect', () => {
      logger.info('Redis Client Connected');
    });
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  public async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  public async set(key: string, value: any, ttl?: number) {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.client.setEx(key, ttl, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch (error) {
      logger.error('Error setting cache', { key, error });
      throw error;
    }
  }

  public async get(key: string) {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Error getting cache', { key, error });
      throw error;
    }
  }

  public async del(key: string) {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error('Error deleting cache', { key, error });
      throw error;
    }
  }

  public async clear() {
    try {
      await this.client.flushAll();
    } catch (error) {
      logger.error('Error clearing cache', error);
      throw error;
    }
  }

  public async disconnect() {
    await this.client.quit();
  }
}

export const cache = Cache.getInstance(); 