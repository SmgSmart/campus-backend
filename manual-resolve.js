const { Pool } = require('pg');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function resolveMigration() {
  const migrationName = '0_init';
  // Read the migration file to calculate checksum
  const migrationPath = path.join(__dirname, 'prisma/migrations/0_init/migration.sql');
  const migrationContent = fs.readFileSync(migrationPath, 'utf-8');
  
  // Create checksum compatible with Prisma (sha256)
  const checksum = crypto.createHash('sha256').update(migrationContent).digest('hex');

  console.log(`Resolving migration ${migrationName} with checksum ${checksum}`);

  const client = await pool.connect();
  try {
    // 1. Ensure the _prisma_migrations table exists (it should, but safety first)
    await client.query(`
      CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
        "id"                    VARCHAR(36) PRIMARY KEY,
        "checksum"              VARCHAR(64) NOT NULL,
        "finished_at"           TIMESTAMP WITH TIME ZONE,
        "migration_name"        VARCHAR(255) NOT NULL,
        "logs"                  TEXT,
        "rolled_back_at"        TIMESTAMP WITH TIME ZONE,
        "started_at"            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "applied_steps_count"   INTEGER NOT NULL DEFAULT 0
      );
    `);

    // 2. Insert the migration record as if it was applied
    const id = crypto.randomUUID();
    const query = `
      INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "started_at", "applied_steps_count")
      VALUES ($1, $2, NOW(), $3, NULL, NOW(), 1)
      ON CONFLICT DO NOTHING;
    `;
    
    await client.query(query, [id, checksum, migrationName]);
    
    console.log('Successfully marked 0_init as applied in the remote DB!');
  } catch (err) {
    console.error('Error resolving migration:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

resolveMigration();
