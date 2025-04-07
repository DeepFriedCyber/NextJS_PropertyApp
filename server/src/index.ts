import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createLogger } from './utils/logger';
import { db } from './utils/db';
import { cache } from './utils/cache';
import propertyRoutes from './routes/property.routes';

dotenv.config();

const app = express();
const logger = createLogger();

// Initialize connections
const initializeConnections = async () => {
  try {
    // Test database connection
    await db.query('SELECT NOW()');
    logger.info('Database connection established');

    // Connect to Redis
    await cache.connect();
    logger.info('Cache connection established');
  } catch (error) {
    logger.error('Failed to initialize connections:', error);
    process.exit(1);
  }
};

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/properties', propertyRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;

// Start server
const startServer = async () => {
  try {
    await initializeConnections();
    app.listen(PORT, () => {
      logger.info(`MCP Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  await db.end();
  await cache.disconnect();
  process.exit(0);
});

startServer(); 