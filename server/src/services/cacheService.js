/**
 * Cache Service (Redis)
 * SRP: Handle caching logic with graceful fallback
 */

const { createClient } = require('redis');
const logger = require('../utils/logger');

class CacheService {
  constructor(options = {}) {
    const url = options.url || process.env.REDIS_URL;
    const host = options.host || process.env.REDIS_HOST;
    const port = options.port || process.env.REDIS_PORT || 6379;
    const password = options.password || process.env.REDIS_PASSWORD;

    this.enabled = Boolean(url || host);
    this.ready = false;
    this.client = null;
    this.connectPromise = null;

    if (!this.enabled) {
      logger.warn('Redis cache disabled: missing REDIS_URL/REDIS_HOST');
      return;
    }

    const clientOptions = url
      ? { url }
      : { url: `redis://${host}:${port}`, password };

    this.client = createClient(clientOptions);

    this.client.on('ready', () => {
      this.ready = true;
      logger.info('Redis cache connected');
    });

    this.client.on('error', (error) => {
      this.ready = false;
      logger.error('Redis cache error:', error);
    });

    this.connectPromise = this.client.connect().catch((error) => {
      this.ready = false;
      logger.error('Redis cache connect failed:', error);
      this.enabled = false;
    });
  }

  async _ensureReady() {
    if (!this.enabled) return false;
    if (this.ready) return true;

    if (this.connectPromise) {
      try {
        await this.connectPromise;
      } catch (error) {
        return false;
      }
    }

    return this.ready;
  }

  async getJson(key) {
    if (!(await this._ensureReady())) return null;

    try {
      const value = await this.client.get(key);
      if (!value) return null;
      return JSON.parse(value);
    } catch (error) {
      logger.error('Redis getJson error:', error);
      return null;
    }
  }

  async setJson(key, value, ttlSeconds = 300) {
    if (!(await this._ensureReady())) return false;

    try {
      const payload = JSON.stringify(value);
      await this.client.set(key, payload, { EX: ttlSeconds });
      return true;
    } catch (error) {
      logger.error('Redis setJson error:', error);
      return false;
    }
  }

  async del(key) {
    if (!(await this._ensureReady())) return 0;

    try {
      return await this.client.del(key);
    } catch (error) {
      logger.error('Redis del error:', error);
      return 0;
    }
  }

  async delByPattern(pattern) {
    if (!(await this._ensureReady())) return 0;

    let cursor = 0;
    let deleted = 0;

    try {
      do {
        const result = await this.client.scan(cursor, {
          MATCH: pattern,
          COUNT: 100,
        });

        cursor = Number(result.cursor);
        const keys = result.keys || [];
        if (keys.length > 0) {
          deleted += await this.client.del(keys);
        }
      } while (cursor !== 0);
    } catch (error) {
      logger.error('Redis delByPattern error:', error);
    }

    return deleted;
  }

  async disconnect() {
    if (!this.client) return;
    try {
      await this.client.quit();
    } catch (error) {
      logger.error('Redis disconnect error:', error);
    }
  }
}

module.exports = CacheService;
