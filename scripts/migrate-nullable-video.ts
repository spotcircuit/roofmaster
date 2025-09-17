import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function runMigration() {
  try {
    console.log('Running migration to make video_id nullable...');

    // Execute the migration directly
    await sql`
      ALTER TABLE video_quizzes
      ALTER COLUMN video_id DROP NOT NULL
    `;

    console.log('✅ Migration completed successfully!');
    console.log('video_id column in video_quizzes table is now nullable.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();