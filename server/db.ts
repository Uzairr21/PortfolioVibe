import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../shared/schema';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a new pool using the database URL with SSL configuration
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 3,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000
});

// Add error handler to prevent connection drops
pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
});

export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });

// Initialize database tables
async function initializeDatabase(): Promise<void> {
  let retries = 3;
  while (retries > 0) {
    try {
      // Test the connection first
      await pool.query('SELECT NOW()');
      
      // Create tables if they don't exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          subject VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);
      console.log('Database tables initialized successfully');
      return;
    } catch (error: unknown) {
      console.error(`Database connection attempt failed (${retries} retries left):`, error);
      retries--;
      if (retries === 0) {
        console.error('Failed to connect to database after multiple attempts. Continuing without database...');
        return;
      }
      // Wait 2 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// Run initialization with better error handling
initializeDatabase().catch((error: unknown) => {
  console.error("Database initialization failed:", error);
  // Don't exit in development to allow for HMR
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing database connections...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Closing database connections...');
  await pool.end();
  process.exit(0);
});
