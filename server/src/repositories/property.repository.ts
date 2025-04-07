import { Pool } from 'pg';
import { createLogger } from '../utils/logger';

const logger = createLogger();

interface FindOptions {
  where?: Record<string, any>;
  skip?: number;
  take?: number;
}

export class PropertyRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }

  async find(options: FindOptions = {}) {
    try {
      const { where = {}, skip = 0, take = 10 } = options;
      const whereClause = Object.keys(where).length
        ? `WHERE ${Object.keys(where)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(' AND ')}`
        : '';

      const query = `
        SELECT * FROM properties
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${Object.keys(where).length + 1}
        OFFSET $${Object.keys(where).length + 2}
      `;

      const values = [...Object.values(where), take, skip];
      const result = await this.pool.query(query, values);
      return result.rows;
    } catch (error) {
      logger.error('Error in find:', error);
      throw error;
    }
  }

  async findOne(options: FindOptions) {
    try {
      const { where = {} } = options;
      const whereClause = Object.keys(where)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(' AND ');

      const query = `
        SELECT * FROM properties
        WHERE ${whereClause}
        LIMIT 1
      `;

      const result = await this.pool.query(query, Object.values(where));
      return result.rows[0];
    } catch (error) {
      logger.error('Error in findOne:', error);
      throw error;
    }
  }

  async count(options: FindOptions = {}) {
    try {
      const { where = {} } = options;
      const whereClause = Object.keys(where).length
        ? `WHERE ${Object.keys(where)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(' AND ')}`
        : '';

      const query = `
        SELECT COUNT(*) FROM properties
        ${whereClause}
      `;

      const result = await this.pool.query(query, Object.values(where));
      return parseInt(result.rows[0].count);
    } catch (error) {
      logger.error('Error in count:', error);
      throw error;
    }
  }

  async search(query: string, filters: Record<string, any>) {
    try {
      const searchConditions = [
        `address ILIKE $1`,
        `city ILIKE $1`,
        `state ILIKE $1`,
        `zip_code ILIKE $1`
      ];

      const filterConditions = Object.keys(filters).map(
        (key, index) => `${key} = $${index + 2}`
      );

      const whereClause = [
        `(${searchConditions.join(' OR ')})`,
        ...filterConditions
      ].join(' AND ');

      const searchQuery = `
        SELECT * FROM properties
        WHERE ${whereClause}
        ORDER BY created_at DESC
      `;

      const values = [`%${query}%`, ...Object.values(filters)];
      const result = await this.pool.query(searchQuery, values);
      return result.rows;
    } catch (error) {
      logger.error('Error in search:', error);
      throw error;
    }
  }
} 