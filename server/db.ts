import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });


// Initialize database tables
async function initializeDatabase() {
  let retries = 5;
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
    } catch (error) {
      console.error(`Database connection attempt failed (${retries} retries left):`, error);
      retries--;
      if (retries === 0) {
        throw new Error('Failed to connect to database after multiple attempts');
      }
      // Wait 2 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// Run initialization with better error handling
initializeDatabase().catch(error => {
  console.error("Database initialization failed:", error);
  // Don't exit immediately in development to allow for HMR
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});