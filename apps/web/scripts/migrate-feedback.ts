import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Direct connection (port 5432) for DDL
const raw = process.env.DATABASE_URL!;
const directUrl = raw.replace(':6543/', ':5432/');

async function migrate() {
  console.log('Running feedback/SLM dataset migration...');
  const sql = postgres(directUrl, { prepare: false, max: 1 });

  try {
    // 1. Alter generations table to add feedback tracking
    console.log('Altering generations table...');
    await sql`
      ALTER TABLE "generations" 
      ADD COLUMN IF NOT EXISTS "feedback_submitted" boolean NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS "is_rewarded" boolean NOT NULL DEFAULT false;
    `;

    // 2. Create prompt_feedback table for Dataset
    console.log('Creating prompt_feedback table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "prompt_feedback" (
        "id"            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "generation_id" text NOT NULL REFERENCES "generations"("id") ON DELETE CASCADE,
        "user_id"       uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "prompt"        text NOT NULL,
        "is_positive"   boolean NOT NULL,
        "metadata"      jsonb,
        "created_at"    timestamp NOT NULL DEFAULT now()
      );
    `;

    console.log('✅ Feedback system LIVE.');
    await sql.end();
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Feedback migration failed:', err.message);
    await sql.end();
    process.exit(1);
  }
}

migrate();
