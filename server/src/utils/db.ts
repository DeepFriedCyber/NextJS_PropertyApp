import { Pool } from 'pg';
import { createLogger } from './logger';

const logger = createLogger();

class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
      connectionTimeoutMillis: 2000, // How long to wait for a connection to be established
    });

    this.pool.on('error', (err) => {
      logger.error('Unexpected error on idle client', err);
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async query(text: string, params?: any[]) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      logger.debug('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      logger.error('Error executing query', { text, error });
      throw error;
    }
  }

  public async getClient() {
    const client = await this.pool.connect();
    const query = client.query;
    const release = client.release;

    // Set a timeout of 5 seconds
    const timeout = setTimeout(() => {
      logger.error('A client has been checked out for more than 5 seconds!');
    }, 5000);

    // Monkey patch the query method to keep track of the last query executed
    client.query = (...args: any[]) => {
      client.lastQuery = args;
      return query.apply(client, args);
    };

    client.release = () => {
      // Clear the timeout
      clearTimeout(timeout);
      // Set the methods back to their original un-monkey-patched version
      client.query = query;
      client.release = release;
      return release.apply(client);
    };

    return client;
  }

  public async end() {
    await this.pool.end();
  }
}

export const db = Database.getInstance(); 